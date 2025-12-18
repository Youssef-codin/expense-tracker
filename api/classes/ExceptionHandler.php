<?php
require_once __DIR__ . '/ApiResponse.php';

class ExceptionHandler
{
    public static function handle(Throwable $e)
    {
        error_log("Uncaught exception: " . $e->getMessage());
        ApiResponse::send(500, false, "Server Error: " . $e->getMessage());
    }
}

set_exception_handler(['ExceptionHandler', 'handle']);
