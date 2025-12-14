<?php
require_once __DIR__ . '/Database.php';

class Expense
{
    public static function getAll($userId)
    {
        $db = Database::connect();
        $sql = "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public static function add($userId, $data)
    {
        $db = Database::connect();
        $sql = "INSERT INTO expenses (user_id, title, amount, category, date) VALUES (?, ?, ?, ?, ?)";
        $stmt = $db->prepare($sql);

        return $stmt->execute([
            $userId,
            $data['title'],
            $data['amount'],
            $data['category'],
            $data['date']
        ]);
    }

    public static function delete($expenseId, $userId)
    {
        $db = Database::connect();
        $sql = "DELETE FROM expenses WHERE id = ? AND user_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$expenseId, $userId]);

        return $stmt->rowCount() > 0;
    }

    public static function update($expenseId, $userId, $data)
    {
        $db = Database::connect();

        $checkStmt = $db->prepare("SELECT id FROM expenses WHERE id = ? AND user_id = ?");
        $checkStmt->execute([$expenseId, $userId]);

        if ($checkStmt->rowCount() === 0) {
            return false;
        }

        $sql = "UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ? AND user_id = ?";
        $stmt = $db->prepare($sql);

        $stmt->execute([
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
        $db = Database::connect();
        $sql = "DELETE FROM expenses WHERE user_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId]);
        return true;
    }
}
