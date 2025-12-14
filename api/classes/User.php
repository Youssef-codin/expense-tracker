<?php
require_once __DIR__ . '/Database.php';

class User
{
    public static function register($username, $email, $password)
    {
        $hash = password_hash($password, PASSWORD_BCRYPT);

        try {
            Database::query(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                [$username, $email, $hash]
            );

            return Database::connect()->lastInsertId();
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                throw new Exception("Username or Email already exists");
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

    public static function delete($id)
    {
        $stmt = Database::query("DELETE FROM users WHERE id = ?", [$id]);
        return $stmt->rowCount() > 0;
    }
}
