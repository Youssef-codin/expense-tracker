<?php
require_once '../../classes/ApiResponse.php';
require_once '../../classes/User.php';

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['username']) || empty($input['password']) || empty($input['email'])) {
    ApiResponse::send(404, false, "Please provide username, email, and password");
}

$userId = User::register($input['username'], $input['email'], $input['password']);

if ($userId === false) {
    ApiResponse::send(400, false, "Username or Email already exists");
} else {
    ApiResponse::send(200, true, "User registered successfully");
}

