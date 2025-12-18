<?php

class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;

    private static $instance = null;
    private $conn;

    private function __construct()
    {
        $this->host = getenv('DB_HOST') ?: '127.0.0.1';
        $this->db_name = getenv('DB_NAME') ?: 'expense_tracker';
        $this->username = getenv('DB_USER') ?: 'expense_app';
        $this->password = getenv('DB_PASSWORD') ?: 'password123';

        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4";

            $this->conn = new PDO($dsn, $this->username, $this->password);

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "DB Connection Error: " . $e->getMessage()]);
            exit;
        }
    }

    public static function connect()
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }

        return self::$instance->conn;
    }

    public static function query($sql, $params = [])
    {
        $stmt = self::connect()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
}
