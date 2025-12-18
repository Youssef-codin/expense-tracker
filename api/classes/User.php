<?php
require_once __DIR__ . '/Database.php';

class User
{
    public static function register($username, $email, $password)
    {
        $checkStmt = Database::query("SELECT id FROM users WHERE username = ? OR email = ?", [$username, $email]);
        if ($checkStmt->rowCount() > 0) {
            return false;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);

        Database::query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [$username, $email, $hash]
        );

        return true;
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

    public static function delete($id)
    {
        $stmt = Database::query("DELETE FROM users WHERE id = ?", [$id]);
        return $stmt->rowCount() > 0;
    }
}
