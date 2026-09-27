<?php
declare(strict_types=1);

session_start();

if (!isset($_SESSION['user']['id'])) {
  header('Location: buttons.php');
  exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Puzzle &amp; Code</title>
<link rel="stylesheet" href="../css/push-and-code.css" />
</head>
<body data-user-id="<?= (int) $_SESSION['user']['id'] ?>">

<div class="shell" id="gameShell">
  <div class="header">
    <div>
      <h1>Puzzle &amp; Code</h1>
      <div class="sub">Stage 1: place every crate. Stage 2: solve the code that unlocks.</div>
    </div>
    <div class="header-right">
      <button class="trophy-toggle" id="trophyToggle" aria-label="achievements" title="Achievements">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3a2 2 0 0 1 0 4h-1"/><path d="M7 5H4a2 2 0 0 0 0 4h1"/></svg>
        <span class="trophy-count" id="trophyCount">0</span>
      </button>
      <button class="sound-toggle" id="soundToggle" aria-label="toggle sound" title="Toggle sound">
        <svg id="soundIconOn" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e7eaf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#e7eaf6" stroke="none"></polygon><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M18 6a9 9 0 0 1 0 12"></path></svg>
        <svg id="soundIconOff" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b71a0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#6b71a0" stroke="none"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
      </button>
      <div class="score-badge score-badge-box" title="Crate puzzle score">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffc44d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
        <span id="puzzleScoreVal">0</span>
      </div>
      <div class="score-badge score-badge-code" title="Code stage score">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5ee0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        <span id="codeScoreVal">0</span>
      </div>
      <button class="score-badge score-badge-code header-back-btn" id="headerBackBtn" type="button" title="Back to menu" aria-label="Back to menu">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        <span>Back</span>
      </button>
    </div>
  </div>

  <div class="level-track" id="levelTrack"></div>

  <div class="card-top">
    <span id="levelCounter">Level 1 / 9</span>
  </div>
  <div class="card">
    <h2 class="level-title" id="levelTitle"></h2>

    <div id="stageContent"></div>
  </div>

  <div class="achv-toast" id="achvToast">
    <div class="achv-icon" id="achvToastIcon"></div>
    <div class="achv-toast-text">
      <div class="label">Achievement unlocked</div>
      <h3 id="achvToastTitle"></h3>
    </div>
  </div>

  <div class="achv-overlay" id="achvOverlay" style="display:none;">
    <div class="achv-panel">
      <div class="achv-panel-head">
        <h2>Achievements</h2>
        <span class="achv-progress" id="achvProgress">0 / 0</span>
        <button class="achv-close" id="achvClose" aria-label="close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div id="achvList"></div>
    </div>
  </div>
</div>
<script src="../js/push-and-code.js?v=20260921-15"></script>
</body>
</html>