<?php
declare(strict_types=1);

session_start();
require_once __DIR__ . '/../php/config.php';

if (!isset($_SESSION['admin']) || ($_SESSION['admin']['role'] ?? '') !== 'admin') {
  header('Location: index.php');
  exit;
}

$users = database()->query(
  'SELECT u.id, u.full_name, u.role, u.status, u.created_at,
          COALESCE(total_score.score, 0) AS score
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
  ORDER BY u.created_at DESC'
)->fetchAll();

$userRows = array_map(static function (array $user): array {
  return [
    'id' => (int) $user['id'],
    'name' => $user['full_name'],
    'role' => ucfirst($user['role']),
    'status' => $user['status'],
    'score' => (int) $user['score'],
    'joined' => date('M d, Y', strtotime($user['created_at'])),
    'avatar' => 'https://ui-avatars.com/api/?name=' . rawurlencode($user['full_name']) . '&background=random&size=40',
  ];
}, $users);

$userRowsJson = json_encode($userRows, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
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
$questionCount = (int) $pdo->query('SELECT COUNT(*) FROM questions')->fetchColumn();
if ($questionCount === 0) {
  $defaultQuestions = [
    [
      'In PHP, which symbol is used at the beginning of all variable names?',
      '$score = 100;',
      ['$', '@', '#', '&'],
      '$',
      'All variables in PHP must begin with a dollar sign ($).',
    ],
    [
      'Which keyword/construct is most commonly used to output strings in PHP?',
      "___ 'Welcome to the game!';",
      ['echo', 'print_line', 'console.log', 'System.out'],
      'echo',
      "'echo' is the standard statement used to print text.",
    ],
    [
      'Which operator is used to concatenate two strings in PHP?',
      '$msg = \'Hello\' ___ \' World\';',
      ['.', '+', '&', '++'],
      '.',
      'PHP uses the dot (.) operator for string concatenation.',
    ],
    [
      'What is the standard opening tag used to begin PHP code?',
      "___ echo 'Starting...'; ?>",
      ['<?php', '<script php>', '<?xml>', '<%php%>'],
      '<?php',
      'Standard PHP code blocks start with <?php.',
    ],
    [
      'What character must be placed at the end of most PHP statements?',
      '$active = true___',
      [';', '.', ':', '$'],
      ';',
      'Statements in PHP end with a semicolon (;).',
    ],
    [
      'Which built-in function checks if a variable is declared and not null?',
      'if (___($crate)) { }',
      ['isset()', 'is_null()', 'empty()', 'exists()'],
      'isset()',
      'isset() returns true if the variable is declared and is not null.',
    ],
    [
      'Which comparison operator checks if two values are equal AND of the same type?',
      'if ($x ___ 10) { }',
      ['===', '==', '=', '<=>'],
      '===',
      'The identity operator === checks both value and data type.',
    ],
    [
      "Which superglobal array holds form data sent with method='POST'?",
      '$name = ___[ \'user\' ];',
      ['$_POST', '$_GET', '$_REQUEST_POST', '$_SERVER'],
      '$_POST',
      'POST requests store form variables in $_POST.',
    ],
    [
      'Which syntax is used to define an indexed array in modern PHP?',
      '$items = ___ \'crate\', \'key\' ___;',
      ['[ ... ]', '( ... )', '{ ... }', '< ... >'],
      '[ ... ]',
      'Modern PHP uses bracket syntax [ ] for arrays.',
    ],
    [
      'Which keyword is used to declare a function in PHP?',
      '___ pushBox($dir) { }',
      ['function', 'def', 'func', 'method'],
      'function',
      "Functions in PHP are declared using the 'function' keyword.",
    ],
    [
      'Which of the following creates a single-line comment in PHP?',
      '___ This is a comment',
      ['//', '--', '>>', '#'],
      '//',
      'Single-line PHP comments start with // or #.',
    ],
    [
      'Which superglobal is used to collect URL query parameters in PHP?',
      '$id = ___[ \'id\' ];',
      ['$_GET', '$_POST', '$_URL', '$_PARAM'],
      '$_GET',
      'Query parameters in the URL are accessible via $_GET.',
    ],
  ];
  $insertQuestion = $pdo->prepare(
    'INSERT INTO questions (question, code, options, answer, hint)
     VALUES (:question, :code, :options, :answer, :hint)'
  );
  foreach ($defaultQuestions as [$question, $code, $options, $answer, $hint]) {
    $insertQuestion->execute([
      'question' => $question,
      'code' => $code,
      'options' => json_encode($options, JSON_THROW_ON_ERROR),
      'answer' => $answer,
      'hint' => $hint,
    ]);
  }
}
$questions = database()->query(
  'SELECT id, question, code, options, answer, hint
   FROM questions
   ORDER BY id DESC'
)->fetchAll();

$adminName = (string) ($_SESSION['admin']['name'] ?? 'Administrator');
$adminInitial = strtoupper(mb_substr($adminName, 0, 1, 'UTF-8') ?: 'A');

$questionRows = array_map(static function (array $question): array {
  return [
    'id' => (int) $question['id'],
    'question' => $question['question'],
    'code' => $question['code'],
    'options' => json_decode($question['options'], true) ?: [],
    'answer' => $question['answer'],
    'hint' => $question['hint'],
  ];
}, $questions);

$questionRowsJson = json_encode($questionRows, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Panel · Dashboard</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="../css/admin.css?v=20260921-2">
</head>
<body data-admin-name="<?= htmlspecialchars($adminName, ENT_QUOTES, 'UTF-8') ?>"
      data-users="<?= htmlspecialchars($userRowsJson ?: '[]', ENT_QUOTES, 'UTF-8') ?>"
      data-questions="<?= htmlspecialchars($questionRowsJson ?: '[]', ENT_QUOTES, 'UTF-8') ?>">
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <i class="fas fa-cube"></i>
      <h2>Admin<span>Panel</span></h2>
    </div>

    <nav class="sidebar-menu" id="sidebarMenu">
      <div class="menu-label">Main</div>

      <button class="sidebar-btn active" data-page="dashboard" data-page-title="Dashboard">
        <i class="fas fa-chart-pie"></i>
        <span>Dashboard</span>
      </button>

      <button class="sidebar-btn" data-page="users" data-page-title="Users">
        <i class="fas fa-users"></i>
        <span>Users</span>
      </button>

      <button class="sidebar-btn" data-page="questioners" data-page-title="Questioners">
        <i class="fas fa-box"></i>
        <span>Questioners</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <button class="sidebar-btn" id="logoutBtn">
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>
  </aside>

  <main class="main-panel">
    <header class="top-bar">
      <div class="top-bar-left">
        <button class="menu-toggle" id="menuToggle" title="Toggle sidebar">
          <i class="fas fa-bars"></i>
        </button>
        <div class="search-wrapper">
          <i class="fas fa-search"></i>
          <input type="text" id="searchInput" placeholder="Search users, orders...">
        </div>
      </div>
      <div class="top-bar-right">
        <div class="notification-icon" id="notificationBtn">
          <i class="far fa-bell"></i>
          <span class="badge" id="notificationBadge">3</span>
          <div class="dropdown notification-dropdown" id="notificationDropdown">
            <div class="notification-header">
              <h4>Notifications</h4>
              <button id="markAllRead">Mark all read</button>
            </div>
            <div class="notification-item" data-notif-id="1">
              <div class="icon"><i class="fas fa-user-plus"></i></div>
              <div class="text">
                <p>New user registered</p>
                <small>2 minutes ago</small>
              </div>
            </div>
            <div class="notification-item" data-notif-id="2">
              <div class="icon"><i class="fas fa-shopping-bag"></i></div>
              <div class="text">
                <p>New order #1024 received</p>
                <small>15 minutes ago</small>
              </div>
            </div>
            <div class="notification-item" data-notif-id="3">
              <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
              <div class="text">
                <p>Server load is high</p>
                <small>1 hour ago</small>
              </div>
            </div>
          </div>
        </div>
        <div class="user-profile" id="userProfileBtn">
          <div class="user-avatar" id="userAvatar"><?= htmlspecialchars($adminInitial, ENT_QUOTES, 'UTF-8') ?></div>
          <span><?= htmlspecialchars($adminName, ENT_QUOTES, 'UTF-8') ?></span>
          <div class="dropdown" id="userDropdown">
            <button class="dropdown-item danger" data-action="logout">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="content-area">
      <div class="page-view active-view" id="view-users">
        <div class="page-header">
          <div>
            <h1 id="pageTitle">User Management</h1>
            <p id="pageSubtitle">Manage all registered users, roles and permissions.</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card" data-filter="all">
            <div class="stat-icon"><i class="fas fa-user-friends"></i></div>
            <div class="stat-info">
              <h3 id="totalUsersStat">5</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div class="stat-card" data-filter="active">
            <div class="stat-icon"><i class="fas fa-user-check"></i></div>
            <div class="stat-info">
              <h3 id="activeUsersStat">3</h3>
              <p>Active</p>
            </div>
          </div>
          <div class="stat-card" data-filter="pending">
            <div class="stat-icon"><i class="fas fa-user-clock"></i></div>
            <div class="stat-info">
              <h3 id="pendingUsersStat">1</h3>
              <p>Pending</p>
            </div>
          </div>
          <div class="stat-card" data-filter="inactive">
            <div class="stat-icon"><i class="fas fa-user-slash"></i></div>
            <div class="stat-info">
              <h3 id="inactiveUsersStat">1</h3>
              <p>Inactive</p>
            </div>
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h2>All Users</h2>
            <a id="viewAllLink">View all <i class="fas fa-arrow-right"></i></a>
          </div>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Score</th>
                <th>Joined</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
            </tbody>
          </table>
        </div>
      </div>

      <div class="page-view" id="view-generic">
        <div class="page-header">
          <div>
            <h1 id="genericTitle">Page Title</h1>
            <p id="genericSubtitle">This section is under construction.</p>
          </div>
        </div>
        <div class="table-container" style="padding: 3rem; text-align:center; color:#64748b;">
          <i class="fas fa-tools" style="font-size:3rem; color:#cbd5e1; margin-bottom:1rem; display:block;"></i>
          <h3 style="color:#0f172a; margin-bottom:0.5rem;">Coming Soon</h3>
          <p>This page is a placeholder. Use the sidebar to navigate back.</p>
        </div>
      </div>

      <div class="page-view" id="view-questions">
        <div class="page-header">
          <div>
            <h1>Questioners</h1>
            <p>Manage the PHP questions used in the game.</p>
          </div>
          <button class="primary-btn" id="addQuestionBtn">
            <i class="fas fa-plus"></i> Add Question
          </button>
        </div>
        <div class="table-container">
          <div class="table-header">
            <h2>All Questions</h2>
            <a id="questionCountLabel">0 questions</a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Options</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="questionsTableBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

  <div class="modal-overlay" id="addUserModal">
    <div class="modal">
      <h3>Add New User</h3>
      <p>Fill in the details below to create a new user account.</p>
      <div class="modal-field">
        <label>Full Name</label>
        <input type="text" id="newUserName" placeholder="e.g. John Doe">
      </div>
      <div class="modal-field">
        <label>Role</label>
        <select id="newUserRole">
          <option value="Administrator">Administrator</option>
          <option value="Editor">Editor</option>
          <option value="Moderator">Moderator</option>
          <option value="Viewer" selected>Viewer</option>
        </select>
      </div>
      <div class="modal-field">
        <label>Status</label>
        <select id="newUserStatus">
          <option value="active">Active</option>
          <option value="pending" selected>Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" id="cancelAddUser">Cancel</button>
        <button class="btn-primary-sm" id="confirmAddUser">Create User</button>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="questionModal">
    <div class="modal question-modal">
      <h3 id="questionModalTitle">Add Question</h3>
      <p>Create a question with four answer choices for the PHP challenge.</p>
      <div class="modal-field">
        <label for="questionText">Question</label>
        <textarea id="questionText" rows="3" placeholder="Which symbol starts a PHP variable?"></textarea>
      </div>
      <div class="modal-field">
        <label for="questionCode">Code snippet</label>
        <textarea id="questionCode" rows="2" placeholder="$score = 100;"></textarea>
      </div>
      <div class="question-options-grid">
        <div class="modal-field"><label for="questionOption1">Option 1</label><input id="questionOption1" type="text"></div>
        <div class="modal-field"><label for="questionOption2">Option 2</label><input id="questionOption2" type="text"></div>
        <div class="modal-field"><label for="questionOption3">Option 3</label><input id="questionOption3" type="text"></div>
        <div class="modal-field"><label for="questionOption4">Option 4</label><input id="questionOption4" type="text"></div>
      </div>
      <div class="modal-field">
        <label for="questionAnswer">Correct answer</label>
        <input id="questionAnswer" type="text" placeholder="Must exactly match one option">
      </div>
      <div class="modal-field">
        <label for="questionHint">Hint</label>
        <textarea id="questionHint" rows="2" placeholder="Explain the concept briefly."></textarea>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" id="cancelQuestion">Cancel</button>
        <button class="btn-primary-sm" id="saveQuestion">Save Question</button>
      </div>
    </div>
  </div>

  <div class="toast-container" id="toastContainer"></div>

  <script src="../js/admin.js?v=20260921-3"></script>
</body>
</html>