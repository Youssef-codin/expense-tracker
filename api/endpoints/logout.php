<?php
require_once 'classes/ApiResponse.php';

session_start();

$_SESSION = [];

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// 4. Destroy the file on the server
session_destroy();

// 5. Tell frontend it's done
ApiResponse::send(200, true, "Logged out successfully");
