<?php
declare(strict_types=1);

session_start();
require_once __DIR__ . '/config.php';

if (!isset($_SESSION['user'])) {
  header('Location: index.php');
  exit;
}

$sessionUser = $_SESSION['user'];
$currentUser = [
  'name' => (string) ($sessionUser['name'] ?? 'User'),
  'role' => (string) ($sessionUser['role'] ?? 'player'),
  'avatar' => strtoupper(substr((string) ($sessionUser['name'] ?? 'U'), 0, 1)),
];

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
  <title>Puzzle &amp; Code</title>
  <link rel="stylesheet" href="../css/buttons.css">
</head>
<body
  data-user-id="<?= escape((string) ($sessionUser['id'] ?? '')) ?>"
  data-user-name="<?= escape($currentUser['name']) ?>"
  data-user-email="<?= escape((string) ($sessionUser['email'] ?? '')) ?>"
  data-user-role="<?= escape(ucfirst($currentUser['role'])) ?>"
  data-user-avatar="<?= escape($currentUser['avatar']) ?>"
>

  <div class="shell">

    <aside class="sidebar">

      <div class="user-card" id="userCard">
        <div class="user-avatar" id="userAvatar"><?= escape($currentUser['avatar']) ?></div>
        <div class="user-info">
          <div class="user-name" id="userName"><?= escape($currentUser['name']) ?></div>
          <div class="user-role" id="userRole"><?= escape(ucfirst($currentUser['role'])) ?></div>
        </div>
        <div class="user-status" title="Online"></div>
      </div>

      

      <div class="sidebar-sub">main menu</div>

      <ul class="nav-list">
        <li>
         <button class="nav-item active" id="navPlay" data-action="play">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v4M8 6h8M6 10h12M4 14h16M2 18h20" stroke="currentColor" fill="none"/>
              <rect x="4" y="8" width="4" height="12" rx="1" fill="none" stroke="currentColor"/>
              <rect x="16" y="8" width="4" height="12" rx="1" fill="none" stroke="currentColor"/>
              <rect x="10" y="6" width="4" height="14" rx="1" fill="none" stroke="currentColor"/>
            </svg>
            Play Game
          </button>
        </li>

        <li>
          <button class="nav-item" id="navLeaderboard" data-action="leaderboard">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v4M8 6h8M6 10h12M4 14h16M2 18h20" stroke="currentColor" fill="none"/>
              <rect x="4" y="8" width="4" height="12" rx="1" fill="none" stroke="currentColor"/>
              <rect x="16" y="8" width="4" height="12" rx="1" fill="none" stroke="currentColor"/>
              <rect x="10" y="6" width="4" height="14" rx="1" fill="none" stroke="currentColor"/>
            </svg>
            Leaderboard
          </button>
        </li>

        <li>
          <button class="nav-item" id="navSettings" data-action="settings">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" fill="none"/>
            </svg>
            Settings
          </button>
        </li>

        <li>
          <button class="nav-item" id="navSelectStage" data-action="select-stage">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" fill="none"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" fill="none"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" fill="none"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" fill="none"/>
            </svg>
            Select Stage
          </button>
        </li>

        <div class="sidebar-divider"></div>

        <li>
          <button class="nav-item logout" id="navLogout" data-action="logout">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" fill="none"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" fill="none"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" fill="none"/>
            </svg>
            Logout
          </button>
        </li>
      </ul>
    </aside>

    <main class="main-content" id="mainContent">
      <div class="brand-title" id="brandTitle">
        Push blocks. <span class="highlight">Write code.</span><br>Beat the puzzle.
      </div>
      <div class="brand-sub" id="brandSub">
        <strong>GAME CODE PUZZLE</strong> turns real programming logic into a playable puzzle board — move your character, solve the code challenge, and unlock the next level.
      </div>
    </main>

  </div>

  <div class="action-toast" id="actionToast">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
    <span id="toastText">Action</span>
  </div>

  <script src="../js/buttons.js?v=20260921-4"></script>
</body>
</html>