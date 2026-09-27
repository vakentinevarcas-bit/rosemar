<?php
declare(strict_types=1);

session_start();
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user']['id'])) {
  http_response_code(401);
  echo json_encode(['error' => 'You must be logged in.']);
  exit;
}

$payload = json_decode((string) file_get_contents('php://input'), true);

if (!is_array($payload)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid score data.']);
  exit;
}

$levelId = filter_var($payload['level_id'] ?? null, FILTER_VALIDATE_INT);
$attemptId = trim((string) ($payload['attempt_id'] ?? ''));
$puzzleScore = filter_var($payload['puzzle_score'] ?? null, FILTER_VALIDATE_INT);
$codeScore = filter_var($payload['code_score'] ?? null, FILTER_VALIDATE_INT);
$timeSeconds = filter_var($payload['time_seconds'] ?? null, FILTER_VALIDATE_INT);

if ($levelId === false || $levelId < 1 || $levelId > 9
  || !preg_match('/^[a-f0-9-]{16,64}$/i', $attemptId)
  || $puzzleScore === false
  || $codeScore === false
  || $timeSeconds === false || $timeSeconds < 0
) {
  http_response_code(422);
  echo json_encode(['error' => 'Invalid score data.']);
  exit;
}

try {
  $statement = database()->prepare(
    'INSERT INTO game_scores (user_id, attempt_id, level_id, puzzle_score, code_score, total_score, time_seconds)
     VALUES (:user_id, :attempt_id, :level_id, :puzzle_score, :code_score, :total_score, :time_seconds)'
  );
  $statement->execute([
    'user_id' => (int) $_SESSION['user']['id'],
    'attempt_id' => $attemptId,
    'level_id' => $levelId,
    'puzzle_score' => $puzzleScore,
    'code_score' => $codeScore,
    'total_score' => $puzzleScore,
    'time_seconds' => $timeSeconds,
  ]);

  echo json_encode(['success' => true]);
} catch (Throwable $exception) {
  http_response_code(500);
  echo json_encode(['error' => 'The score could not be saved.']);
}