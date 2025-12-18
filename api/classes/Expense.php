<?php
require_once __DIR__ . '/Database.php';

class Expense
{
    public static function getAll($userId)
    {
        $sql = "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC";
        $stmt = Database::query($sql, [$userId]);
        $data = $stmt->fetchAll();

        return $data;
    }

    public static function add($userId, $data)
    {
        $sql = "INSERT INTO expenses (user_id, title, amount, category, date) VALUES (?, ?, ?, ?, ?)";
        Database::query($sql, [
            $userId,
            $data['title'],
            $data['amount'],
            $data['category'],
            $data['date']
        ]);

        return true;
    }

    public static function delete($expenseId, $userId)
    {
        $sql = "DELETE FROM expenses WHERE id = ? AND user_id = ?";
        $stmt = Database::query($sql, [$expenseId, $userId]);

        return $stmt->rowCount() > 0;
    }

    public static function update($expenseId, $userId, $data)
    {
        $stmt = Database::query("SELECT id FROM expenses WHERE id = ? AND user_id = ?", [$expenseId, $userId]);

        if ($stmt->rowCount() === 0) {
            return false;
        }

        $sql = "UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ? AND user_id = ?";
        Database::query($sql, [
            $data['title'],
            $data['amount'],
            $data['category'],
            $data['date'],
            $expenseId,
            $userId
        ]);

        return true;
    }

    public static function deleteAll($userId)
    {
        $sql = "DELETE FROM expenses WHERE user_id = ?";
        Database::query($sql, [$userId]);
        return true;
    }
}
