<?php
require_once 'Database.php';

class User
{
    public static function register($username, $password)
    {
        $hash = password_hash($password, PASSWORD_BCRYPT);

        try {
            Database::query(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                [$username, $hash]
            );

            return Database::connect()->lastInsertId();
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                throw new Exception("Username taken");
            }
            throw $e;
        }
    }

    public static function login($username, $password)
    {
        $stmt = Database::query("SELECT * FROM users WHERE username = ?", [$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            return $user;
        }
        return null;
    }
}
