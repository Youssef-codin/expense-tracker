<?php
require_once '../../classes/ApiResponse.php';
require_once '../../classes/User.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    ApiResponse::send(401, false, "Not logged in");
}

try {
    $success = User::delete($_SESSION['user_id']);
    
    if ($success) {
        // Log out the user after deletion
        session_destroy();
        ApiResponse::send(200, true, "Account deleted successfully");
    } else {
        ApiResponse::send(500, false, "Failed to delete account");
    }
} catch (Exception $e) {
    ApiResponse::send(500, false, "Server Error: " . $e->getMessage());
}
