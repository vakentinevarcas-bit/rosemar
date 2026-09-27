<?php
declare(strict_types=1);

session_start();
require_once __DIR__ . '/../php/config.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin']) || ($_SESSION['admin']['role'] ?? '') !== 'admin') {
  http_response_code(403);
  echo json_encode(['success' => false, 'message' => 'Administrator access is required.']);
  exit;
}

$payload = json_decode(file_get_contents('php://input'), true);
$userId = filter_var($payload['user_id'] ?? null, FILTER_VALIDATE_INT);

if ($userId === false || $userId === null || $userId < 1) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'A valid user ID is required.']);
  exit;
}

if ($userId === (int) $_SESSION['admin']['id']) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'You cannot delete the current administrator account.']);
  exit;
}

try {
  $statement = database()->prepare('DELETE FROM users WHERE id = :id');
  $statement->execute(['id' => $userId]);

  if ($statement->rowCount() !== 1) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'User not found.']);
    exit;
  }

  echo json_encode(['success' => true]);
} catch (PDOException $exception) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'The user could not be deleted.']);
}
