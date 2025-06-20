
This project is a full-stack customer management application built for a code challenge. It includes customer CRUD operations with Dockerized services and Elasticsearch sync.


Tech Stack

- Backend: lumen and laravel
- Frontend: Angular v7 or latest (bootstrap)
- Search: Elasticsearch**
- Database: MySQL
- Container Orchestration: Docker + Docker Compose
- Load Balancer: Nginx
- HTTP Communication: Laravel HTTP Client (no Scout used)

Services Overview 

- `api`: Lumen backend
- `frontend`: Angular app
- `nginx`: Load balancer/controller
- `db`: MySQL database
- `searcher`: Elasticsearch instance

Running the Application

1. Clone the repository
   
 ``bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

2.Set up backend environment variables
cd api
cp .env.example .env

-Update the .env file if necessary:

DB_HOST=db
DB_PORT=3306

DB_DATABASE=customer_db
DB_USERNAME=root
DB_PASSWORD=secret

3.Go back to root directory
-Start all services using Docker Compose
-after containers are running migrate the database

docker exec -it customer-api php artisan migrate

docker-compose up --build

4.If the frontend is not containerized, start it manually:

cd frontend
npm install
ng serve
- App runs at: http://localhost:4200
images of ui
<img width="1430" alt="Screenshot 2025-06-21 at 3 08 16 AM" src="https://github.com/user-attachments/assets/18ed581a-cbf6-4da4-9fbd-e2ebeacb8d84" />

<img width="1430" alt="Screenshot 2025-06-21 at 3 08 22 AM" src="https://github.com/user-attachments/assets/fd5a1ac9-822a-4d1e-8652-83b1759de598" />

