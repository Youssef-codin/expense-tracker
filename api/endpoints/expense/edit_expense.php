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

try {
    $data['category'] = $data['category'] ?? 'General';

    $updated = Expense::update($data['id'], $_SESSION['user_id'], $data);

    if ($updated) {
        ApiResponse::send(200, true, "Expense updated successfully");
    } else {
        ApiResponse::send(404, false, "Expense not found");
    }
} catch (Exception $e) {
    ApiResponse::send(500, false, "Server Error: " . $e->getMessage());
}
