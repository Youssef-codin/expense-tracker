<?php

require_once 'classes/ApiResponse.php';
require_once 'classes/User.php';

$input = json_decode(file_get_contents('php://input'), true);

User::register($input['username'], $input['password']);
