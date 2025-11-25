<?php
require_once 'classes/ApiResponse.php';
require_once 'classes/User.php';

$input = json_decode(file_get_contents('php://input'), true);

$user = User::login($input['username'], $input['password']);

if ($user) {
    session_start();
    $_SESSION['user_id'] = $user['id'];
    ApiResponse::send(200, true, "Successfully logged in");
} else {
    ApiResponse::send(401, false, "Failed to login");
}
