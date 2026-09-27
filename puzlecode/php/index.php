<?php
declare(strict_types=1);

session_start();
require_once __DIR__ . '/config.php';

$message = '';
$messageType = '';
$loginEmail = '';
$registerName = '';
$registerEmail = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $action = $_POST['action'] ?? '';

  try {
    $pdo = database();

    if ($action === 'login') {
      $loginEmail = strtolower(trim((string) ($_POST['email'] ?? '')));
      $password = (string) ($_POST['password'] ?? '');
      $statement = $pdo->prepare('SELECT id, full_name, email, password_hash, role, status FROM users WHERE email = :email LIMIT 1');
      $statement->execute(['email' => $loginEmail]);
      $user = $statement->fetch();

      if (!$user || !password_verify($password, $user['password_hash'])) {
        throw new RuntimeException('Invalid email or password.');
      }
      if ($user['status'] !== 'active') {
        throw new RuntimeException('This account is not active.');
      }

      session_regenerate_id(true);
      $_SESSION['user'] = [
        'id' => (int) $user['id'],
        'name' => $user['full_name'],
        'email' => $user['email'],
        'role' => $user['role'],
      ];
      $pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = :id')->execute(['id' => $user['id']]);
      header('Location: buttons.php');
      exit;
    }

    if ($action === 'register') {
      $registerName = trim((string) ($_POST['name'] ?? ''));
      $registerEmail = strtolower(trim((string) ($_POST['email'] ?? '')));
      $password = (string) ($_POST['password'] ?? '');
      $confirmPassword = (string) ($_POST['confirm_password'] ?? '');

      if ($registerName === '' || !filter_var($registerEmail, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('Enter a valid name and email address.');
      }
      if (strlen($password) < 6) {
        throw new RuntimeException('Password must be at least 6 characters.');
      }
      if ($password !== $confirmPassword) {
        throw new RuntimeException('Passwords do not match.');
      }

      $statement = $pdo->prepare('INSERT INTO users (full_name, email, password_hash) VALUES (:name, :email, :password_hash)');
      $statement->execute([
        'name' => $registerName,
        'email' => $registerEmail,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
      ]);
      $message = 'Account created. You can now log in.';
      $messageType = 'success';
      $loginEmail = $registerEmail;
    }
  } catch (PDOException $exception) {
    $message = $exception->getCode() === '23000'
      ? 'That email address is already registered.'
      : 'The database could not complete that request.';
    $messageType = 'error';
  } catch (RuntimeException $exception) {
    $message = $exception->getMessage();
    $messageType = 'error';
  }
}

function escape(string $value): string
{
  return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login / Register · Glass</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="../css/user_login.css?v=20260921-2">
</head>
<body>
  <div class="glass-panel">
    <div class="brand">
      <span>Login Form</span>
    </div>

    <div class="form-container">
      <?php if ($message !== ''): ?>
        <div class="toast-message <?= escape($messageType) ?>" role="alert"><?= escape($message) ?></div>
      <?php endif; ?>

      <form class="form active" id="loginForm" action="index.php" method="post">
        <input type="hidden" name="action" value="login">
        <div class="input-group">
          <label for="loginEmail"><i class="fas fa-envelope"></i> Email</label>
          <div class="input-field">
            <i class="fas fa-envelope"></i>
            <input type="email" id="loginEmail" name="email" placeholder="email" value="<?= escape($loginEmail) ?>" required>
          </div>
        </div>

        <div class="input-group">
          <label for="loginPassword"><i class="fas fa-lock"></i> Password</label>
          <div class="input-field password-field">
            <i class="fas fa-lock"></i>
            <div class="password-wrapper">
              <input type="password" id="loginPassword" name="password" placeholder="••••••••" required>
              <button type="button" class="toggle-pw" data-input="loginPassword" aria-label="Show password">
                <i class="far fa-eye"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="forgot-link">
          <a href="#" id="forgotPassword">Forgot password?</a>
        </div>

        <div class="actions">
          <button type="submit" class="btn-primary">
            <i class="fas fa-arrow-right-to-bracket"></i> Log in
          </button>
          <div class="secondary-link">
            New here? <a class="switch-tab" data-form="registerForm">Create account</a>
          </div>
        </div>
      </form>

      <form class="form" id="registerForm" action="index.php" method="post">
        <input type="hidden" name="action" value="register">
        <div class="input-group">
          <label for="regName"><i class="fas fa-user"></i> Full name</label>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" id="regName" name="name" placeholder="Alex Rivera" value="<?= escape($registerName) ?>" required>
          </div>
        </div>

        <div class="input-group">
          <label for="regEmail"><i class="fas fa-envelope"></i> Email</label>
          <div class="input-field">
            <i class="fas fa-envelope"></i>
            <input type="email" id="regEmail" name="email" placeholder="email" value="<?= escape($registerEmail) ?>" required>
          </div>
        </div>

        <div class="input-group">
          <label for="regPassword"><i class="fas fa-lock"></i> Password</label>
          <div class="input-field password-field">
            <i class="fas fa-lock"></i>
            <div class="password-wrapper">
              <input type="password" id="regPassword" name="password" placeholder="Create a strong password" required>
              <button type="button" class="toggle-pw" data-input="regPassword" aria-label="Show password">
                <i class="far fa-eye"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label for="regConfirm"><i class="fas fa-check-circle"></i> Confirm password</label>
          <div class="input-field password-field">
            <i class="fas fa-check-circle"></i>
            <div class="password-wrapper">
              <input type="password" id="regConfirm" name="confirm_password" placeholder="Confirm your password" required>
              <button type="button" class="toggle-pw" data-input="regConfirm" aria-label="Show password">
                <i class="far fa-eye"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn-primary">
            <i class="fas fa-user-plus"></i> Create account
          </button>
          <div class="secondary-link">
            Already have an account? <a class="switch-tab" data-form="loginForm">Log in</a>
          </div>
        </div>
      </form>
    </div>
  </div>

  <script src="../js/user_login.js"></script>
</body>
</html>
