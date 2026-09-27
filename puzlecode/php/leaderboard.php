<?php
declare(strict_types=1);

session_start();
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user'])) {
  http_response_code(401);
  echo json_encode(['error' => 'You must be logged in.']);
  exit;
}

try {
  $statement = database()->query(
    'SELECT u.id, u.full_name, u.email,
            COALESCE(total_score.score, 0) AS score,
            best_time.best_time
     FROM users u
     LEFT JOIN (
       SELECT user_id, SUM(attempt_score) AS score
       FROM (
         SELECT user_id, attempt_id, MAX(puzzle_score) AS attempt_score
         FROM game_scores
         GROUP BY user_id, attempt_id
       ) attempt_scores
       GROUP BY user_id
     ) total_score ON total_score.user_id = u.id
     LEFT JOIN (
       SELECT user_id, MIN(time_seconds) AS best_time
       FROM game_scores
       GROUP BY user_id
     ) best_time ON best_time.user_id = u.id
     WHERE u.status = \'active\''
  );

  $players = array_map(static function (array $player): array {
    $seconds = $player['best_time'] === null ? null : (int) $player['best_time'];

    return [
      'id' => (int) $player['id'],
      'name' => $player['full_name'],
      'email' => $player['email'],
      'score' => (int) $player['score'],
      'time' => $seconds === null
        ? '--'
        : sprintf('%02d:%02d', intdiv($seconds, 60), $seconds % 60),
    ];
  }, $statement->fetchAll());

  echo json_encode($players);
} catch (Throwable $exception) {
  http_response_code(500);
  echo json_encode(['error' => 'The leaderboard could not be loaded.']);
}
