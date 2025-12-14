<?php
require_once '../../classes/ApiResponse.php';
require_once '../../classes/Expense.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    ApiResponse::send(401, false, "Please login");
}

try {
    $userId = $_SESSION['user_id'];
    Expense::deleteAll($userId);
    ApiResponse::send(200, true, "All expenses deleted");
} catch (Exception $e) {
    ApiResponse::send(500, false, "Server Error: " . $e->getMessage());
}
