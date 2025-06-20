import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id?: number; 
  first_name: string;
  last_name: string;
  email: string;
  contact_number?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8000/api/customers';
  constructor(private http: HttpClient) {}

  getAll(search = ''): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}?search=${search}`);
  }

  get(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  create(data: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, data);
  }

  update(id: number, data: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`, {
    headers: { 'Content-Type': 'text/plain' } // workaround
  });
}
}
