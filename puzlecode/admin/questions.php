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

$payload = json_decode(file_get_contents('php://input'), true) ?: [];
$method = $_SERVER['REQUEST_METHOD'];

function questionInput(array $payload): array
{
  $question = trim((string) ($payload['question'] ?? ''));
  $code = trim((string) ($payload['code'] ?? ''));
  $options = array_map(static fn ($option): string => trim((string) $option), $payload['options'] ?? []);
  $answer = trim((string) ($payload['answer'] ?? ''));
  $hint = trim((string) ($payload['hint'] ?? ''));

  if ($question === '' || $code === '' || count($options) !== 4 || in_array('', $options, true) || $answer === '' || $hint === '') {
    throw new InvalidArgumentException('Complete the question, code, four options, answer, and hint.');
  }
  if (!in_array($answer, $options, true)) {
    throw new InvalidArgumentException('The correct answer must exactly match one of the options.');
  }

  return [$question, $code, json_encode(array_values($options), JSON_THROW_ON_ERROR), $answer, $hint];
}

try {
  $pdo = database();
  $pdo->exec(
    'CREATE TABLE IF NOT EXISTS questions (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      question TEXT NOT NULL,
      code TEXT NOT NULL,
      options JSON NOT NULL,
      answer VARCHAR(255) NOT NULL,
      hint TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB'
  );

  if ($method === 'POST') {
    [$question, $code, $options, $answer, $hint] = questionInput($payload);
    $statement = $pdo->prepare(
      'INSERT INTO questions (question, code, options, answer, hint)
       VALUES (:question, :code, :options, :answer, :hint)'
    );
    $statement->execute(compact('question', 'code', 'options', 'answer', 'hint'));
    echo json_encode(['success' => true, 'id' => (int) $pdo->lastInsertId()]);
    exit;
  }

  $questionId = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT);
  if ($questionId === false || $questionId === null || $questionId < 1) {
    throw new InvalidArgumentException('A valid question ID is required.');
  }

  if ($method === 'PUT') {
    [$question, $code, $options, $answer, $hint] = questionInput($payload);
    $statement = $pdo->prepare(
      'UPDATE questions
       SET question = :question, code = :code, options = :options, answer = :answer, hint = :hint
       WHERE id = :id'
    );
    $statement->execute([
      'question' => $question,
      'code' => $code,
      'options' => $options,
      'answer' => $answer,
      'hint' => $hint,
      'id' => $questionId,
    ]);
    if ($statement->rowCount() === 0) {
      $exists = $pdo->prepare('SELECT id FROM questions WHERE id = :id');
      $exists->execute(['id' => $questionId]);
      if (!$exists->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Question not found.']);
        exit;
      }
    }
    echo json_encode(['success' => true]);
    exit;
  }

  if ($method === 'DELETE') {
    $statement = $pdo->prepare('DELETE FROM questions WHERE id = :id');
    $statement->execute(['id' => $questionId]);
    if ($statement->rowCount() !== 1) {
      http_response_code(404);
      echo json_encode(['success' => false, 'message' => 'Question not found.']);
      exit;
    }
    echo json_encode(['success' => true]);
    exit;
  }

  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
} catch (InvalidArgumentException $exception) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => $exception->getMessage()]);
} catch (JsonException $exception) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Question options are invalid.']);
} catch (PDOException $exception) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'The question could not be saved.']);
}
