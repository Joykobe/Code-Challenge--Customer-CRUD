<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;


class CustomerController extends Controller
{
    protected Client $elasticsearchClient;

    public function __construct()
    {
        $host = env('ELASTICSEARCH_HOST', 'localhost');
        $port = env('ELASTICSEARCH_PORT', 9200);
        $this->elasticsearchClient = new Client([
            'base_uri' => "http://{$host}:{$port}/",
            'headers' => ['Content-Type' => 'application/json'],
            'timeout' => 5.0,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $search = $request->input('search');

        if ($search) {
            try {
                $response = $this->elasticsearchClient->get('customers/_search', [
                    'json' => [
                        'query' => [
                            'multi_match' => [
                                'query' => $search,
                                'fields' => ['first_name', 'last_name', 'email'],
                            ],
                        ],
                    ],
                ]);

                $body = json_decode($response->getBody()->getContents(), true);
                $ids = collect($body['hits']['hits'] ?? [])
                    ->pluck('_id')
                    ->all();

                if (empty($ids)) {
                    return response()->json([]);
                }

                $customers = Customer::whereIn('id', $ids)->get();
                return response()->json($customers);
            } catch (RequestException $e) {
                error_log("Elasticsearch error: " . $e->getMessage());

                // Fallback: search in the DB directly
                return response()->json(
                    Customer::where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->get()
                );
            }
        }

        return response()->json(Customer::all());
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:customers',
        ]);

        $customer = Customer::create($request->all());

        // 🔁 Sync to ElasticSearch
        Http::put('http://customer-elasticsearch:9200/customers/_doc/' . $customer->id, [
            'first_name' => $customer->first_name,
            'last_name' => $customer->last_name,
            'email' => $customer->email,
            'contact_number' => $customer->contact_number,
        ]);

        return response()->json($customer, 201);
    }


    public function show(int $id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        return response()->json($customer);
    }

    public function update($id, Request $request)
    {
        $customer = Customer::findOrFail($id);

        $this->validate($request, [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => "required|email|unique:customers,email,{$id}",
        ]);

        $customer->update($request->all());

        // 🔁 Update ElasticSearch
        Http::put('http://customer-elasticsearch:9200/customers/_doc/' . $customer->id, [
            'first_name' => $customer->first_name,
            'last_name' => $customer->last_name,
            'email' => $customer->email,
            'contact_number' => $customer->contact_number,
        ]);

        return response()->json($customer);
    }


    public function destroy(int $id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        $customer->delete();
        $this->deleteCustomerFromElasticsearch($id);

        return response()->json(['message' => 'Customer deleted successfully'], 204);
    }

    protected function syncCustomerToElasticsearch(Customer $customer): void
    {
        try {
            $this->elasticsearchClient->put("customers/_doc/{$customer->id}", [
                'json' => [
                    'first_name' => $customer->first_name,
                    'last_name'  => $customer->last_name,
                    'email'      => $customer->email,
                    'contact_number' => $customer->contact_number,
                ]
            ]);
        } catch (RequestException $e) {
            error_log("Elasticsearch sync error: " . $e->getMessage());
        }
    }

    protected function deleteCustomerFromElasticsearch(int $id): void
    {
        try {
            $this->elasticsearchClient->delete("customers/_doc/{$id}");
        } catch (RequestException $e) {
            error_log("Elasticsearch delete error: " . $e->getMessage());
        }
    }
}
