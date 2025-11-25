<?php
require_once '../classes/ApiResponse.php';
require_once '../classes/Expense.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    ApiResponse::send(401, false, "Please login");
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['title']) || empty($data['amount']) || empty($data['date'])) {
    ApiResponse::send(400, false, "Title, Amount, and Date are required.");
}

try {
    $userId = $_SESSION['user_id'];

    $data['category'] = $data['category'] ?? 'General';

    $success = Expense::add($userId, $data);

    if ($success) {
        ApiResponse::send(200, true, "Expense added successfully", null);
    } else {
        ApiResponse::send(500, false, "Failed to add expense");
    }
} catch (Exception $e) {
    ApiResponse::send(500, false, "Server Error: " . $e->getMessage());
}
