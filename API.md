# Expense Tracker API Documentation

**Base URL:** `http://localhost:8000/api/endpoints`

---

## Authentication

This API uses **Session Cookies**.

1. Call `/login.php` first.  
2. The browser automatically saves the `PHPSESSID` cookie.  
3. All subsequent requests will automatically include this cookie.

---

## 1. User Management

### Register

Create a new user account.

- **URL:** `/register.php`
- **Method:** `POST`
- **Body (JSON):**

      {
        "username": "cooluser",
        "password": "password123"
      }

---

### Login

Authenticates the user and starts a session.

- **URL:** `/login.php`
- **Method:** `POST`
- **Body (JSON):**

      {
        "username": "cooluser",
        "password": "password123"
      }

---

### Logout

Destroys the session and cookie.

- **URL:** `/logout.php`
- **Method:** `GET`

---

## 2. Expenses

### Get All Expenses

Fetches expenses for the currently logged-in user.

- **URL:** `/get_expenses.php`
- **Method:** `GET`
- **Response (JSON):**

      {
        "success": true,
        "data": [
          {
            "id": 15,
            "title": "Pizza",
            "amount": 25.50,
            "date": "2023-11-25",
            "category": "Food"
          }
        ]
      }

---

### Add Expense

Adds a new expense.

- **URL:** `/add_expense.php`
- **Method:** `POST`
- **Body (JSON):**

      {
        "title": "Uber Ride",
        "amount": 15.00,
        "date": "2023-11-25",
        "category": "Transport"
      }

---

### Update Expense

Updates an existing expense.  
The `id` field is required to identify the expense.

- **URL:** `/update_expense.php`
- **Method:** `POST`
- **Body (JSON):**

      {
        "id": 15,
        "title": "Uber Ride (Adjusted)",
        "amount": 18.00,
        "date": "2023-11-25",
        "category": "Transport"
      }

---

### Delete Expense

Deletes an expense by ID.

- **URL:** `/delete_expense.php`
- **Method:** `POST`
- **Body (JSON):**

      {
        "id": 15
      }
