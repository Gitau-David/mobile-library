# Mobile Library — Backend API

Node.js + Express + MySQL REST API for the NGO Mobile Library Asset Tracking System.

## Prerequisites

- Node.js v18+
- MySQL 8.0+
- A MySQL client (MySQL Workbench, TablePlus, or the CLI)

---

## Setup

### 1. Import the database

```bash
mysql -u root -p < models/schema.sql
```

Or paste the contents of `models/schema.sql` into MySQL Workbench and run it.
This creates the `mobile_library_db` database, all tables, and seed data.

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your MySQL root password and a strong `JWT_SECRET`.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

Server starts at **http://localhost:5000**

---

## Default login credentials (from seed data)

| Field    | Value         |
|----------|---------------|
| Username | `librarian`   |
| Password | `password123` |

---

## API Endpoints

| Method | Path                              | Auth | Description                        |
|--------|-----------------------------------|------|------------------------------------|
| POST   | /api/auth/login                   | ✗    | Login, returns JWT                 |
| GET    | /api/auth/session                 | ✓    | Verify token, returns user         |
| GET    | /api/schools                      | ✓    | List all school nodes              |
| POST   | /api/schools                      | ✓    | Add new school node                |
| PUT    | /api/schools/:id                  | ✓    | Update school                      |
| DELETE | /api/schools/:id                  | ✓    | Delete school (if no FK links)     |
| GET    | /api/students?search=             | ✓    | List students (with search)        |
| POST   | /api/students                     | ✓    | Register student                   |
| PUT    | /api/students/:id                 | ✓    | Update student                     |
| DELETE | /api/students/:id                 | ✓    | Delete student                     |
| GET    | /api/books?search=                | ✓    | List books (with search)           |
| POST   | /api/books                        | ✓    | Add book to inventory              |
| PUT    | /api/books/:id                    | ✓    | Update book                        |
| DELETE | /api/books/:id                    | ✓    | Delete book                        |
| POST   | /api/transactions/checkout        | ✓    | Issue book to student              |
| POST   | /api/transactions/return          | ✓    | Distributed cross-node return      |
| GET    | /api/reports/metrics              | ✓    | Dashboard stat cards               |
| GET    | /api/reports/data?type=           | ✓    | outstanding or historical report   |

All protected routes require: `Authorization: Bearer <token>`
