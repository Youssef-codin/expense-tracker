<?php
header('Content-Type: application/json');
require_once 'classes/ApiResponse.php';

ApiResponse::send(200, true, "", "works");
