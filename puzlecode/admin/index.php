<?php
declare(strict_types=1);

session_start();
require_once __DIR__ . '/../php/config.php';

$error = '';
$username = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = trim((string) ($_POST['username'] ?? ''));
  $password = (string) ($_POST['password'] ?? '');

  try {
    $statement = database()->prepare(
      'SELECT id, full_name, email, password_hash, role, status
       FROM admin
       WHERE email = :email OR full_name = :full_name
       LIMIT 1'
    );
     $statement->execute(['email' => $username, 'full_name' => $username]);
    $user = $statement->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
      throw new RuntimeException('Invalid admin username or password.');
    }
    if ($user['status'] !== 'active') {
      throw new RuntimeException('This admin account is not active.');
    }

    session_regenerate_id(true);
    $_SESSION['admin'] = [
      'id' => (int) $user['id'],
      'name' => $user['full_name'],
      'email' => $user['email'],
      'role' => $user['role'],
    ];
    header('Location: admin.php');
    exit;
  } catch (PDOException $exception) {
    $error = 'The database could not complete that request.';
  } catch (RuntimeException $exception) {
    $error = $exception->getMessage();
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
  <title>Admin Panel · Login</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="../css/admin_login.css?v=20260921-2">
</head>
<body>
  <div class="login-container">
    <div class="admin-header">
      <div class="admin-icon">
        <i class="fas fa-shield-alt"></i>
      </div>
      <h1>Admin Panel</h1>
      <div class="subtitle">Sign in to your dashboard</div>
    </div>

    <form class="login-form" action="index.php" method="post">
      <?php if ($error !== ''): ?>
        <div class="login-error" role="alert"><?= escape($error) ?></div>
      <?php endif; ?>
      <div class="input-group">
        <label for="username">
          <i class="fas fa-user"></i> Username or Email
        </label>
        <div class="input-field">
          <i class="fas fa-envelope"></i>
          <input type="text" id="username" name="username" placeholder="admin" value="<?= escape($username) ?>" autocomplete="username" required>
        </div>
      </div>

      <div class="input-group">
        <label for="password">
          <i class="fas fa-lock"></i> Password
        </label>
        <div class="input-field">
          <i class="fas fa-key"></i>
          <input type="password" id="password" name="password" placeholder="••••••••" autocomplete="current-password" required>
          <span class="toggle-password" id="togglePassword" title="Show password">
            <i class="far fa-eye"></i>
          </span>
        </div>
      </div>

      <div class="form-options">
        <label class="remember">
          <input type="checkbox" name="remember" id="remember">
          <span>Remember me</span>
        </label>
        <a href="#" class="forgot-link">Forgot password?</a>
      </div>

      <button type="submit" class="login-btn">
        <i class="fas fa-arrow-right-to-bracket"></i> Log in
      </button>

      <div class="demo-hint">
        <i class="fas fa-circle-info"></i>
        Demo credentials: <span>admin / admin123</span>
      </div>
    </form>
  </div>

  <script src="../js/admin_login.js"></script>
</body>
</html>