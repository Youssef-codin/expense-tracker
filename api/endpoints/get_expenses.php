<?php
require_once 'classes/ApiResponse.php';
require_once 'classes/Expense.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    ApiResponse::send(401, false, "Please login");
    exit;
}

try {
    $userId = $_SESSION['user_id'];

    $expenses = Expense::getAll($userId);

    ApiResponse::send(200, true, "successfully got expenses", $expenses);
} catch (Exception $e) {
    ApiResponse::send(500, false, "Server Error: " . $e->getMessage());
}
