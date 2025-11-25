<?php

class ApiResponse
{
    public static function send($code, $success, $message, $data = null)
    {
        http_response_code($code);
        $response = [
            'code' => $code,
            'success' => $success,
            'message' => $message,
            'data' => $data //null if not successful
        ];

        echo json_encode($response);
    }
}
