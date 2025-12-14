<?php

class ApiResponse
{
    public static function send(int $code, bool $success, string $message, $data = null)
    {
        header('Content-Type: application/json');
        http_response_code($code);
        $response = [
            'code' => $code,
            'success' => $success,
            'message' => $message,
            'data' => $data //null if not successful
        ];

        echo json_encode($response);
        exit;
    }
}
