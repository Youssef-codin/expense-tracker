<?php
header('Content-Type: application/json');
require_once '../classes/ApiResponse.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    ApiResponse::send(401, false, "Please login");
    exit;
}

ApiResponse::send(200, true, "", "works");
