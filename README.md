## Expense Tracker Project
A simple expense tracking application built with PHP, MySQL, and Vanilla JS.

## Prerequisites
- PHP 8.0+
- MySQL (or MariaDB / XAMPP)

## Database Setup
1. Create a database named expense_tracker.
2. Import `assets/sql/schema.sql` into it and run the script.
3. Update `api/classes/Database.php` with your database credentials.

## How to Run
Open your terminal in the root directory of the project (`/expensetracker`).
Run the built-in PHP server:
```bash
php -S localhost:8000
