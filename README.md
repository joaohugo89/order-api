# Order API

A simple REST API for creating and managing orders.  
This API receives order data, maps it internally, and stores it in a database (MongoDB, PostgreSQL, or SQL).  

---

## Table of Contents
- [Features](#features)  
- [Technologies](#technologies)  
- [Getting Started](#getting-started)  
- [API Endpoints](#api-endpoints)  
- [Request/Response Examples](#requestresponse-examples)  
- [Project Structure](#project-structure)  

---

## Features
- Create orders with items and total value.  
- Automatic mapping of incoming JSON to internal database schema.  
- Stores orders in a database.  
- Swagger documentation for API reference.  

---

## Technologies
- **Node.js** – backend runtime  
- **Express.js** – REST API framework  
- **MongoDB / PostgreSQL / SQL** – database options  
- **Swagger** – API documentation  

---

## Getting Started

### 1. Clone the repository
```bash
npm install
```

### 2. Install dependencies
```bash
git clone https://github.com/yourusername/order-api.git
cd order-api
```

### 3. Configure your database
```javascript
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "orders_db",
  password: "admin",
  port: 5432
});

module.exports = pool;
```

Make sure PostgreSQL is running and the database orders_db exists, or create it with:

```SQL
CREATE DATABASE orders_db;
```


### 4. Run the API
```bash
npm start
```

### 5. Swagger Documentation

Once the API is running, you can access the Swagger UI at:

```bash
http://localhost:3000/api-docs
```

---

## API Endpoints

POST /order

**Create a new order.**

- **Request Body Schema:**

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

- **Response Schema:**

```json
{
  "orderId": "v10089015vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

- **Example cURL Request:**

```bash
curl -X 'POST' \
  'http://localhost:3000/order' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}'
```

Get All Orders

**Retrieve all orders.**

- **Response Schema:**

```json
[
  {
    "orderId": "v10089015vdb",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "productId": 2434,
        "quantity": 1,
        "price": 1000
      }
    ]
  },
  {
    "orderId": "v10089016vdb",
    "value": 5000,
    "creationDate": "2023-07-20T15:12:05.123Z",
    "items": [
      {
        "productId": 4321,
        "quantity": 2,
        "price": 2500
      }
    ]
  }
]
```

- **Example cURL Request:**

```bash
curl -X 'GET' \
  'http://localhost:3000/order/list' \
  -H 'accept: */*'
```

Get Order by ID

**Retrieve a single order by orderId**

- **Response Schema:**

```json
{
  "orderId": "v10089015vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

- **Error Response**

```json
{
  "message": "Order not found",
  "code": 404
}
```

- **Example cURL Request:**

```bash
curl -X 'GET' \
  'http://localhost:3000/order/v10089015vdb-01' \
  -H 'accept: */*'
```

Update Order

**Update an existing order.**

- **Request Body Schema:**

```json
{
  "valorTotal": 12000,
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 6000
    }
  ]
}
```

- **Response Schema:**

```json
{
  "orderId": "v10089015vdb",
  "value": 12000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 2,
      "price": 6000
    }
  ]
}
```

- **Example cURL Request:**

```bash
curl -X 'PUT' \
  'http://localhost:3000/order/v10089015vdb-01' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
```

Delete Order

**Delete an order by orderId.**

- **Request Body Schema:**

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

- **Response Schema:**

```json
{
  "message": "Order deleted successfully",
}
```

- **Error Response**

```json
{
  "message": "Order not found",
}
```


- **Example cURL Request:**

```bash
curl -X 'DELETE' \
  'http://localhost:3000/order/v10089015vdb-01' \
  -H 'accept: */*'
```

---

## Project Structure

```bash
order-api/
│
├─ src/
|  ├─ config/
│  │  └─ swagger.js
│  ├─ controllers/
│  │  └─ orderController.js
│  ├─ database/
│  │  └─ db.js
│  │  └─ init.sql
│  ├─ repositories/
│  │  └─ orderRepositories.js
│  ├─ routes/
│  │  └─ orderRoutes.js
│  ├─ services/
│  │  └─ orderServices.js
│  ├─ app.js
│
├─ package-lock.json
├─ package.json
└─ README.md
```
