<?php
require_once '../../classes/ApiResponse.php';
require_once '../../classes/Expense.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    ApiResponse::send(401, false, "Please login");
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id'])) {
    ApiResponse::send(400, false, "Expense ID is required.");
}

try {
    $deleted = Expense::delete($data['id'], $_SESSION['user_id']);

    if ($deleted) {
        ApiResponse::send(200, true, "Expense deleted");
    } else {
        ApiResponse::send(400, false, "Expense not found or unauthorized");
    }
} catch (Exception $e) {
    ApiResponse::send(500, false, "Server Error: " . $e->getMessage());
}
