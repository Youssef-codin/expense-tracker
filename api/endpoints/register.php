<?php
require_once '../classes/ApiResponse.php';
require_once '../classes/User.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
    ApiResponse::send(400, false, "Please provide both username and password");
}

try {
    User::register($input['username'], $input['password']);
    ApiResponse::send(200, true, "Successfully logged in");
} catch (Exception $e) {
    ApiResponse::send(400, false, $e->getMessage());
}
