<?php
require_once '../../classes/ApiResponse.php';
require_once '../../classes/Expense.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    ApiResponse::send(401, false, "Please login");
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id']) || empty($data['title']) || empty($data['amount']) || empty($data['date'])) {
    ApiResponse::send(400, false, "ID, Title, Amount, and Date are required.");
}

$data['category'] = $data['category'] ?? 'General';

if ($data['category'] !== 'Income' && $data['category'] !== 'Expense') {
    ApiResponse::send(400, false, "Category must be either 'Income' or 'Expense'");
}

$updated = Expense::update($data['id'], $_SESSION['user_id'], $data);

if ($updated) {
    ApiResponse::send(200, true, "Expense updated successfully");
} else {
    ApiResponse::send(404, false, "Expense not found");
}
