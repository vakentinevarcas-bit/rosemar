<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PUZZLE AND CODE</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/website.css">
</head>
<body>
<nav class="nav">
  <div class="nav-inner">
    <a class="logo" href="#top" aria-label="GAME CODE PUZZLE home">
      <img src="logo.png" alt="GAME CODE PUZZLE logo" class="logo-img">
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <div class="nav-links" id="navLinks">
      <a href="#levels">Levels</a>
      <a href="#how">How to Play</a>
      <a href="#features">Features</a>
      <a href="#palette">Palette</a>
      <a href="#stories">Stories</a>
      <a class="nav-cta" href="php/index.php">Play Free</a>
    </div>
  </div>
</nav>

<header class="hero" id="top">
  <div class="wrap hero-grid">
    <div>
      <div class="eyebrow-pill"><span class="dot"></span> New levels added every week</div>
      <h1>Push blocks. <span class="hl">Write code.</span><br>Beat the puzzle.</h1>
      <p class="lead">GAME CODE PUZZLE turns real programming logic into a playable puzzle board — move your character, solve the code challenge, and unlock the next level.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" id="playBtn" href="push%20and%20code.html">▶ Play Level 1</a>
        <a class="btn btn-secondary" href="#how">See how it works</a>
      </div>
      <div class="stat-row">
        <div class="stat"><b>9</b><span>puzzle levels</span></div>
        <div class="stat"><b>9</b><span>coding topics</span></div>
        <div class="stat"><b>0€</b><span>to start playing</span></div>
      </div>
    </div>
    <div class="board-wrap">
      <div class="board" role="group" aria-label="Sample puzzle board">
        <div class="board-head">
          <span class="title">LEVEL 01 · Push Box</span>
          <div class="board-dots"><span class="bd1"></span><span class="bd2"></span><span class="bd3"></span></div>
        </div>
        <img class="grid8" src="puzzle-board.png" alt="Puzzle board with player character, walls, and goal flag" style="width:100%;height:auto;border-radius:12px">      
      </div>
    </div>
  </div>
</header>
<section class="section-purple" id="how">
  <div class="wrap">
    <div class="section-head">
      <h2>Four steps to your next level</h2>
      <p>Every level follows the same simple loop, so beginners always know what to do next.</p>
    </div>
    <div class="steps">
      <div class="step-card chunk"><div class="step-num">1</div><h3>Read the goal</h3><p>Each board shows your character, a red goal flag, and the obstacles in your way.</p></div>
      <div class="step-card chunk"><div class="step-num">2</div><h3>Plan your moves</h3><p>Drag movement blocks or write short code to plot a path around the walls.</p></div>
      <div class="step-card chunk"><div class="step-num">3</div><h3>Run the code</h3><p>Hit run and watch your character step through the board tile by tile.</p></div>
      <div class="step-card chunk"><div class="step-num">4</div><h3>Reach the flag</h3><p>Land on the goal to clear the level, earn stars, and unlock the next one.</p></div>
    </div>
  </div>
</section>
<section class="section-yellow" id="levels">
  <div class="wrap">
    <div class="section-head section-yellow-head">
      <h2>Pick a level, pick a topic</h2>
      <p>Levels are grouped by the coding concept they teach — start wherever fits your class.</p>
    </div>
    <div class="levels">
      <div class="level-card chunk">
        <div class="level-top"><div class="level-icon">🧩</div><span class="badge done">Cleared</span></div>
        <h3>Variables</h3><p>Store values and move your character using named boxes.</p>
        <div class="level-bar"><div style="width:100%"></div></div>
      </div>
      <div class="level-card chunk">
        <div class="level-top"><div class="level-icon">🔁</div><span class="badge">In progress</span></div>
        <h3>Loops</h3><p>Repeat a move pattern to cross long stretches of the board.</p>
        <div class="level-bar"><div style="width:60%"></div></div>
      </div>
      <div class="level-card chunk">
        <div class="level-top"><div class="level-icon">🔀</div><span class="badge locked">Locked</span></div>
        <h3>Conditionals</h3><p>Choose a different path depending on what's blocking you.</p>
        <div class="level-bar"><div style="width:0%"></div></div>
      </div>
      <div class="level-card chunk">
        <div class="level-top"><div class="level-icon">🧠</div><span class="badge locked">Locked</span></div>
        <h3>Functions</h3><p>Bundle up a move sequence and reuse it across the board.</p>
        <div class="level-bar"><div style="width:0%"></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section-purple" id="features">
  <div class="wrap split">
    <div class="split-visual chunk">
      <div class="code-line cl-if"><span class="tag">IF</span> wall ahead → turn right</div>
      <div class="code-line cl-move"><span class="tag">MOVE</span> forward × 3</div>
      <div class="code-line cl-win"><span class="tag">WIN</span> reached the flag 🚩</div>
      <div class="code-line cl-fail"><span class="tag">RETRY</span> hit an obstacle</div>
    </div>
    <div>
      <h2 style="color:var(--white);font-size:clamp(26px,3.6vw,36px)">Built for how kids actually learn code</h2>
      <p style="color:#e6dbff;font-weight:700;margin-top:12px;font-size:15.5px">Every mechanic maps to a real programming concept — so progress in the game means progress in the classroom.</p>
      <ul class="feature-list">
        <li><span class="fi fi-red">🚩</span> Clear goals — the red flag always marks exactly what "done" looks like.</li>
        <li><span class="fi fi-green">✔</span> Instant feedback — green tiles confirm every correct step in real time.</li>
        <li><span class="fi fi-orange">⚡</span> Bite-sized levels — each puzzle teaches one idea in under five minutes.</li>
        <li><span class="fi fi-purple">🎓</span> Teacher dashboard — track class progress across every level and topic.</li>
      </ul>
    </div>
  </div>
</section>

<section class="section-yellow" id="palette">
  <div class="wrap">
    <div class="section-head section-yellow-head">
      <h2>The color palette</h2>
      <p>Every tile, badge, and button on the board pulls from this same eight-color set. Click a swatch to copy its hex code.</p>
    </div>
    <div class="palette">
      <button class="swatch chunk" data-hex="#FFC000">
        <div class="swatch-color" style="background:var(--yellow)"><span class="copy-hint">Copy</span></div>
        <div class="swatch-info"><div class="name">Yellow</div><div class="hex">#FFC000</div></div>
      </button>
      <button class="swatch chunk" data-hex="#5B22D9">
        <div class="swatch-color" style="background:var(--purple)"><span class="copy-hint">Copy</span></div>
        <div class="swatch-info"><div class="name">Purple</div><div class="hex">#5B22D9</div></div>
      </button>
      <button class="swatch chunk" data-hex="#18BFEA">
        <div class="swatch-color" style="background:var(--cyan)"><span class="copy-hint">Copy</span></div>
        <div class="swatch-info"><div class="name">Cyan</div><div class="hex">#18BFEA</div></div>
      </button>
      <button class="swatch chunk" data-hex="#F21D1D">
        <div class="swatch-color" style="background:var(--red)"><span class="copy-hint">Copy</span></div>
        <div class="swatch-info"><div class="name">Red</div><div class="hex">#F21D1D</div></div>
      </button>
      <button class="swatch chunk" data-hex="#35D34A">
        <div class="swatch-color" style="background:var(--green)"><span class="copy-hint">Copy</span></div>
        <div class="swatch-info"><div class="name">Green</div><div class="hex">#35D34A</div></div>
      </button>
      <button class="swatch chunk" data-hex="#FF9F00">
        <div class="swatch-color" style="background:var(--orange)"><span class="copy-hint">Copy</span></div>
        <div class="swatch-info"><div class="name">Orange</div><div class="hex">#FF9F00</div></div>
      </button>
      <button class="swatch chunk" data-hex="#FFFFFF">
        <div class="swatch-color" style="background:var(--white)"><span class="copy-hint">Copy</span></div>
        <div class="swatch-info"><div class="name">White</div><div class="hex">#FFFFFF</div></div>
      </button>
      <button class="swatch chunk" data-hex="#171717">
        <div class="swatch-color" style="background:var(--dark)"><span class="copy-hint">Copy</span></div>
        <div class="swatch-info"><div class="name">Dark</div><div class="hex">#171717</div></div>
      </button>
    </div>
  </div>
</section>

<section class="success-strip" id="stories">
  <div class="wrap">
    <div class="section-head">
      <h2 style="color:var(--white)">Players leveling up</h2>
      <p style="color:#cfcfcf;font-weight:700;margin-top:12px">Real progress from students and classrooms using the puzzle board.</p>
    </div>
    <div class="success-grid">
      <div class="success-card"><div class="pop">🏆</div><p>"My 4th graders raced each other to unlock the loops level. They didn't even notice they were coding."</p><div class="success-name">Mara T. <span>5th grade teacher</span></div></div>
      <div class="success-card"><div class="pop">⭐</div><p>"The board makes conditionals click instantly — you can see exactly why the path changes."</p><div class="success-name">Devon R. <span>Coding club lead</span></div></div>
      <div class="success-card"><div class="pop">🎮</div><p>"Beat all 9 levels in a weekend. Now waiting on new ones like a new game update."</p><div class="success-name">Priya K. <span>Student, age 12</span></div></div>
    </div>
  </div>
</section>

<section class="cta-banner" id="cta">
  <div class="wrap">
    <div class="cta-box">
      <h2>Ready to push your first block?</h2>
      <p>Free to play, no install, works right in the browser — jump into Level 1 and start solving.</p>
      <a class="btn btn-primary" id="ctaPlayBtn" href="push%20and%20code.html">▶ Play Free Now</a>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="logo-text" style="margin-bottom:10px">GAME CODE PUZZLE<span>Learn to code like a game</span></div>
        <p style="font-size:14px;font-weight:700;opacity:.9;max-width:32ch;margin:0">Push blocks, write code, beat the puzzle — one level at a time.</p>
      </div>
      <div>
        <h4>Play</h4>
        <ul>
          <li><a href="#levels">Levels</a></li>
          <li><a href="#how">How to Play</a></li>
          <li><a href="#features">Features</a></li>
        </ul>
      </div>
      <div>
        <h4>Community</h4>
        <ul>
          <li><a href="#stories">Stories</a></li>
          <li><a href="#cta">Play Free</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 GAME CODE PUZZLE. All rights reserved.</span>
      <span>Made for curious coders.</span>
    </div>
  </div>
</footer>

<div class="toast" id="toast"><span id="toastMsg">Loading level…</span></div>
<script src="js/website.js"></script>
</body>
</html>