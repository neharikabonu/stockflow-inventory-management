
# StockFlow – SaaS Inventory Management System

StockFlow is a full-stack inventory management application designed to help businesses manage products, monitor stock levels, and track inventory through a centralized dashboard.

## Features

- Organization creation
- Organization-specific product management
- Add, view, update and delete products
- Product details including SKU, description, quantity, cost price and selling price
- Customizable low-stock thresholds
- Dashboard with inventory statistics
- Automatic low-stock detection
- Search products by name or SKU
- Responsive user interface

## Tech Stack

### Backend
- Java 25
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- MySQL
- Maven

### Frontend
- React
- Vite
- JavaScript
- Axios
- Lucide React
- CSS

## Architecture

The application follows a layered backend architecture:

React Frontend → REST APIs → Controller → Service → Repository → MySQL Database

### Backend Layers

- Entity: Represents database tables.
- Repository: Handles database operations using Spring Data JPA.
- Service: Contains business logic.
- Controller: Exposes REST API endpoints.
- DTO: Transfers and validates request data.
- Exception: Handles application errors globally.

## Main Modules

### 1. Organization Management
Create an organization to manage its inventory independently.

### 2. Product Management
Manage products with SKU, quantity, pricing and stock threshold information.

### 3. Inventory Dashboard
View:
- Total products
- Total inventory quantity
- Number of low-stock products

### 4. Low-Stock Monitoring
Products are automatically identified as low stock when their quantity is less than or equal to their configured threshold.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/organizations | Create organization |
| GET | /api/organizations/{id}/products | Get all products |
| GET | /api/organizations/{id}/products/{productId} | Get product |
| POST | /api/organizations/{id}/products | Create product |
| PUT | /api/organizations/{id}/products/{productId} | Update product |
| DELETE | /api/organizations/{id}/products/{productId} | Delete product |
| GET | /api/organizations/{id}/dashboard/summary | Get dashboard summary |

## Project Structure

```text
stockflow/
├── src/
│   └── main/
│       ├── java/com/stockflow/stockflow/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── exception/
│       │   ├── repository/
│       │   └── service/
│       └── resources/
│           └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Java JDK
- Node.js and npm
- MySQL
- IntelliJ IDEA or another Java IDE

### 1. Clone the repository

```bash
git clone https://github.com/neharikabonu/stockflow-inventory-management.git
cd stockflow-inventory-management
```

### 2. Create the database

```sql
CREATE DATABASE stockflow_db;
```

### 3. Configure the backend

Update your local database configuration with your MySQL credentials.

Set the environment variable:

```text
DB_PASSWORD=your_mysql_password
```

Never commit database passwords or other secrets.

### 4. Run the backend

Run `StockflowApplication.java` from your IDE.

Backend URL:

```text
http://localhost:8080
```

### 5. Run the frontend

Open a terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Future Improvements

- Spring Security and JWT authentication
- Role-based access control
- Secure organization-level data isolation
- Product pagination and sorting
- Product image uploads
- Automated testing
- Docker deployment
- Cloud hosting

## Current Limitations

This MVP uses a browser-stored organization ID and does not yet implement user authentication. Organization-level access must be secured through authenticated user membership before production deployment.

## Author

Neharika Bonu

GitHub: https://github.com/neharikabonu
