<?php
require_once '../../classes/ApiResponse.php';
require_once '../../classes/User.php';

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['username']) || empty($input['password']) || empty($input['email'])) {
    ApiResponse::send(400, false, "Please provide username, email, and password");
}

try {
    User::register($input['username'], $input['email'], $input['password']);
    ApiResponse::send(200, true, "User registered successfully");
} catch (Exception $e) {
    ApiResponse::send(400, false, $e->getMessage());
}
