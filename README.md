# Expense Tracker Project

A simple expense tracking application built with PHP, MySQL, and Vanilla JS.

---

## Features

- Add, edit, delete expenses dynamically
- Display totals using JavaScript
- Chart summary for visualization
- User authentication (login/register/logout)
- Session-based authentication

---

## Getting Started

You can run this project using **Docker** (Recommended) or **Manually**.

### Option 1: Run with Docker (Recommended)

**Prerequisites:**
- Docker
- Docker Compose

**Steps:**

1.  Navigate to the project root directory.
2.  Build and start the services:
    ```bash
    docker compose up -d --build
    ```
3.  Access the application at `http://localhost:8000`.
4.  To stop the application:
    ```bash
    docker compose down
    ```

*Note: The database is automatically initialized with the required schema.*

---

### Option 2: Run Manually

**Prerequisites:**
- PHP 8.0+
- MySQL (or MariaDB / XAMPP)

**Steps:**

1.  **Database Setup:**
    - Create a database named `expense_tracker`.
    - Import `assets/sql/schema.sql` into your database.
    - If your database credentials differ from the defaults (User: `expense_app`, Pass: `password123`, Host: `127.0.0.1`), update them in `api/classes/Database.php` or set the environment variables (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

2.  **Start the Server:**
    - Open your terminal in the root directory.
    - Run the built-in PHP server:
      ```bash
      php -S localhost:8000
      ```

3.  Access the application at `http://localhost:8000`.

---

## API Documentation

The API endpoints are documented using the OpenAPI 3.0 specification.

To view the documentation:
1. Open the `API_OPENAPI.yaml` file located in the root directory.
2. Copy its content.
3. Paste it into the [Swagger Editor](https://editor.swagger.io/).