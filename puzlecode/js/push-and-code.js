/* Game behavior for push-and-code.html is currently kept inline while the game logic is migrated in verified sections. */
const ICONS = {
  boxes: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/></svg>',
  keyboard: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/></svg>',
  code: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  lock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  reset: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
  resetSmall: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
  up: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
  down: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  left: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  right: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  check: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  next: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  skull: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8v3l-1.5 2.5A1 1 0 0 0 3.5 17H6v2a2 2 0 0 0 2 2h1v-2h6v2h1a2 2 0 0 0 2-2v-2h2.5a1 1 0 0 0 .84-1.5L19 13v-3a8 8 0 0 0-8-8Z"/><circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg>',
  rocket: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
  bolt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/></svg>',
  shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
  brain: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2a2.5 2.5 0 0 0-2.45 3H7a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0 5h.05A2.5 2.5 0 0 0 9.5 18h1V4a2 2 0 0 0-1-2Z"/><path d="M14.5 2a2.5 2.5 0 0 1 2.45 3H17a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0 5h-.05A2.5 2.5 0 0 1 14.5 18h-1V4a2 2 0 0 1 1-2Z"/></svg>',
  flag: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4"/><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1"/></svg>',
  crown: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z"/><path d="M5 19h14"/></svg>',
};

const LEVELS = [
  {
    id: 1, title: "Loading Dock",
    grid: [
      [0,0,0,0,0,0,0],
      [0,1,1,1,1,1,0],
      [0,1,1,2,1,1,0],
      [0,1,1,1,1,1,0],
      [0,1,2,1,3,1,0],
      [0,1,1,1,2,1,0],
      [0,0,0,0,0,0,0],
    ],
    boxes: [{ r: 3, c: 3 }, { r: 3, c: 2 }, { r: 2, c: 4 }],
    player: { r: 1, c: 1 },
    code: {
      lang: "PHP",
      lines: [
        "<?php",
        "$id = 5;",
        "if ($id ___ 5) {",
        '  echo "exact match";',
        "}",
      ],
      options: ["==", "===", "=", "<=>"],
      answer: "===",
      hint: "Which operator checks both value AND type match?",
    },
  },
  {
    id: 2, title: "Storeroom Shuffle",
    grid: [
      [0,0,0,0,0,0,0],
      [0,1,1,3,1,1,0],
      [0,1,2,1,1,2,0],
      [0,1,1,1,1,1,0],
      [0,2,1,1,1,1,0],
      [0,1,1,3,1,1,0],
      [0,0,0,0,0,0,0],
    ],
    boxes: [{ r: 3, c: 2 }, { r: 3, c: 5 }, { r: 3, c: 1 }],
    player: { r: 1, c: 1 },
    code: {
      lang: "PHP",
      lines: [
        "<?php",
        '$items = ["a", "b", "c"];',
        "if (!___($items[3])) {",
        '  echo "no fourth item";',
        "}",
      ],
      options: ["is_null", "empty", "isset", "array_key_exists"],
      answer: "isset",
      hint: "Which function checks if an array offset exists AND isn't null?",
    },
  },
  {
    id: 3, title: "Freight Puzzle",
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,1,1,3,1,1,1,0],
      [0,1,2,1,1,1,2,0],
      [0,1,1,1,3,1,1,0],
      [0,2,1,1,1,1,1,0],
      [0,1,1,3,1,1,2,0],
      [0,0,0,0,0,0,0,0],
    ],
    boxes: [{ r: 3, c: 2 }, { r: 3, c: 6 }, { r: 3, c: 1 }, { r: 4, c: 4 }],
    player: { r: 3, c: 3 },
    code: {
      lang: "PHP",
      lines: [
        "<?php",
        "switch ($day) {",
        '  case "Mon":',
        '    echo "Start";',
        "    ___;",
        '  case "Fri":',
        '    echo "End";',
        "}",
      ],
      options: ["exit", "continue", "return", "break"],
      answer: "break",
      hint: "Which keyword stops a switch case from falling into the next one?",
    },
  },
  {
    id: 4, title: "Narrow Aisle",
    grid: [
      [0,0,0,0,0,0,0],
      [0,1,1,3,1,1,0],
      [0,1,2,1,2,1,0],
      [0,1,1,3,1,1,0],
      [0,2,1,3,1,1,0],
      [0,1,1,1,1,1,0],
      [0,0,0,0,0,0,0],
    ],
    boxes: [{ r: 3, c: 2 }, { r: 3, c: 4 }, { r: 3, c: 1 }],
    player: { r: 1, c: 1 },
    code: {
      lang: "PHP",
      lines: [
        "<?php",
        "function addOne(___$num) {",
        "  $num++;",
        "}",
        "$x = 5;",
        "addOne($x);",
        "echo $x;",
      ],
      options: ["*", "&", "@", "%"],
      answer: "&",
      hint: "Which symbol makes the parameter a reference to the caller's variable?",
    },
  },
  {
    id: 5, title: "Kitchen Corner",
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,1,1,1,3,1,1,0],
      [0,1,2,1,1,1,2,0],
      [0,1,1,1,3,1,1,0],
      [0,1,3,1,1,1,1,0],
      [0,2,1,1,1,1,2,0],
      [0,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0],
    ],
    boxes: [{ r: 2, c: 3 }, { r: 3, c: 6 }, { r: 4, c: 1 }, { r: 5, c: 5 }],
    player: { r: 1, c: 1 },
    code: {
      lang: "PHP",
      lines: [
        "<?php",
        "class Counter {",
        "  public static $count = 0;",
        "  public function inc() {",
        "    self::$count___;",
        "  }",
        "}",
      ],
      options: ["++", "--", "+=2", "**"],
      answer: "++",
      hint: "Which operator bumps a static property up by one?",
    },
  },
  {
    id: 6, title: "Guest Wing",
    grid: [
      [0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,0],
      [0,1,2,1,3,1,2,1,0],
      [0,1,1,1,1,1,1,1,0],
      [0,2,1,3,1,3,1,2,0],
      [0,1,1,1,2,1,1,1,0],
      [0,0,0,0,0,0,0,0,0],
    ],
    boxes: [{ r: 3, c: 2 }, { r: 3, c: 6 }, { r: 3, c: 1 }, { r: 3, c: 7 }, { r: 4, c: 4 }],
    player: { r: 1, c: 1 },
    code: {
      lang: "PHP",
      lines: [
        "<?php",
        'if ($_SERVER["REQUEST_METHOD"] ___ "POST") {',
        '  $name = $_POST["name"];',
        "}",
      ],
      options: ["==", "===", "=", "=>"],
      answer: "===",
      hint: "Which comparison operator checks exact value and type equality in PHP?",
    },
  },
  {
    id: 7, title: "Rooftop Storage",
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,1,1,3,1,1,1,0],
      [0,1,2,1,1,2,1,0],
      [0,1,1,1,3,1,1,0],
      [0,2,1,1,1,1,2,0],
      [0,1,1,3,1,1,1,0],
      [0,1,2,1,1,1,1,0],
      [0,0,0,0,0,0,0,0],
    ],
    boxes: [{ r: 3, c: 2 }, { r: 3, c: 5 }, { r: 3, c: 1 }, { r: 3, c: 6 }, { r: 5, c: 5 }],
    player: { r: 1, c: 1 },
    code: {
      lang: "PHP",
      lines: [
        "<?php",
        "function total(...$nums) {",
        "  return array_sum($nums);",
        "}",
        "$vals = [1, 2, 3];",
        "echo total(___$vals);",
      ],
      options: ["*", "&", "...", "::"],
      answer: "...",
      hint: "Which operator unpacks an array into individual arguments?",
    },
  },
  {
    id: 8, title: "Banquet Setup",
    grid: [
      [0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,0],
      [0,1,2,1,1,1,2,1,0],
      [0,1,1,1,3,1,1,1,0],
      [0,1,3,1,1,1,3,1,0],
      [0,2,1,1,1,1,1,2,0],
      [0,1,1,2,1,2,1,1,0],
      [0,0,0,0,0,0,0,0,0],
    ],
    boxes: [{ r: 2, c: 3 }, { r: 2, c: 5 }, { r: 4, c: 1 }, { r: 4, c: 7 }, { r: 3, c: 3 }, { r: 3, c: 5 }],
    player: { r: 1, c: 4 },
    code: {
      lang: "PHP",
      lines: [
        "<?php",
        "$username = $_GET['user'] ___ \"guest\";",
      ],
      options: ["&&", "?:", "||", "??"],
      answer: "??",
      hint: "Which operator falls back to a default only when the value is unset or null?",
    },
  },
  {
    id: 9, title: "Final Inventory",
    grid: [
      [0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,0],
      [0,1,2,1,1,1,1,2,1,0],
      [0,1,1,1,3,3,1,1,1,0],
      [0,1,1,1,2,2,1,1,1,0],
      [0,1,1,1,3,3,1,1,1,0],
      [0,2,1,1,1,1,1,1,2,0],
      [0,1,1,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0],
    ],
    boxes: [
      { r: 3, c: 2 }, { r: 3, c: 7 }, { r: 4, c: 3 }, { r: 4, c: 6 }, { r: 5, c: 1 }, { r: 5, c: 8 },
    ],
    player: { r: 1, c: 1 },
    code: {
      lang: "PHP",
      lines: [
        "<?php",
        "function factorial($n) {",
        "  if ($n ___ 1) {",
        "    return 1;",
        "  }",
        "  return $n * factorial($n - 1);",
        "}",
      ],
      options: ["==", ">=", "<=", "!="],
      answer: "<=",
      hint: "Which comparison safely stops the recursion for both 0 and 1?",
    },
  },
];

const TOTAL_LEVELS = LEVELS.length;
const key = (r, c) => `${r},${c}`;

function cloneLevelState(level) {
  return {
    player: { ...level.player },
    facing: "down",
    boxes: level.boxes.map((b) => ({ ...b })),
  };
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mascotSVG(facing) {
  const eyeOffset = {
    up: { x: 0, y: -1.5 },
    down: { x: 0, y: 1 },
    left: { x: -1.6, y: 0 },
    right: { x: 1.6, y: 0 },
  }[facing];
  const showFace = facing !== "up";

  return `
    <div class="mascot-wrap">
      <svg viewBox="0 0 40 40" width="40" height="40" class="mascot-svg">
        <ellipse cx="20" cy="37" rx="11" ry="2.4" fill="rgba(0,0,0,0.25)" />
        <line x1="20" y1="5" x2="20" y2="1.5" stroke="#9aa4c9" stroke-width="1.6" stroke-linecap="round" />
        <rect x="18.2" y="0" width="3.6" height="3" rx="0.8" fill="#ffc44d" />
        <circle cx="6.5" cy="26" r="3.2" fill="#c7cde3" stroke="#6b7196" stroke-width="1.2" />
        <circle cx="33.5" cy="26" r="3.2" fill="#c7cde3" stroke="#6b7196" stroke-width="1.2" />
        <rect x="7" y="6" width="26" height="23" rx="9" fill="#dbe0f2" stroke="#4b5170" stroke-width="1.5" />
        <rect x="7" y="6" width="26" height="9" rx="9" fill="#f0f2fa" opacity="0.7" />
        ${showFace ? `
        <rect x="10.5" y="13" width="19" height="12" rx="6" fill="#141a33" />
        <circle cx="${15.5 + eyeOffset.x * 0.5}" cy="${19 + eyeOffset.y * 0.5}" r="3.1" fill="#5ee0ff" />
        <circle cx="${24.5 + eyeOffset.x * 0.5}" cy="${19 + eyeOffset.y * 0.5}" r="3.1" fill="#5ee0ff" />
        <circle cx="${14.3 + eyeOffset.x * 0.5}" cy="${17.6 + eyeOffset.y * 0.5}" r="1.1" fill="#eafcff" />
        <circle cx="${23.3 + eyeOffset.x * 0.5}" cy="${17.6 + eyeOffset.y * 0.5}" r="1.1" fill="#eafcff" />` : `
        <rect x="12" y="14" width="16" height="10" rx="4" fill="#c2c9e2" stroke="#8891b5" stroke-width="0.8" />
        <line x1="20" y1="14" x2="20" y2="24" stroke="#8891b5" stroke-width="0.8" />`}
        <circle cx="10" cy="9" r="0.9" fill="#8891b5" />
        <circle cx="30" cy="9" r="0.9" fill="#8891b5" />
        <rect x="11" y="27" width="18" height="10" rx="4" fill="#dbe0f2" stroke="#4b5170" stroke-width="1.5" />
        ${showFace ? `
        <rect x="15" y="30.5" width="10" height="3" rx="1" fill="#141a33" />
        <rect x="16.3" y="31.3" width="2.4" height="1.4" rx="0.5" fill="#ffc44d" />
        <rect x="19.4" y="31.3" width="2.4" height="1.4" rx="0.5" fill="#7ee0a8" />
        <rect x="22.5" y="31.3" width="1.6" height="1.4" rx="0.5" fill="#5ee0ff" />` : `
        <rect x="14.5" y="30.5" width="11" height="4" rx="1.5" fill="#c2c9e2" stroke="#8891b5" stroke-width="0.7" />
        <line x1="16" y1="32" x2="24" y2="32" stroke="#8891b5" stroke-width="0.6" />`}
        <rect x="12.5" y="36" width="6" height="3.4" rx="1.6" fill="#c7cde3" stroke="#6b7196" stroke-width="1.1" />
        <rect x="21.5" y="36" width="6" height="3.4" rx="1.6" fill="#c7cde3" stroke="#6b7196" stroke-width="1.1" />
      </svg>
    </div>`;
}

let soundOn = true;
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(freq, dur, { type = "square", vol = 0.14, delay = 0, glideTo = null } = {}) {
  if (!soundOn) return;
  try {
    const ctx = getAudioCtx();
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch (e) { }
}

const sfx = {
  step: () => tone(220, 0.06, { type: "square", vol: 0.08 }),
  blocked: () => tone(110, 0.09, { type: "sawtooth", vol: 0.1 }),
  push: () => tone(160, 0.09, { type: "square", vol: 0.12, glideTo: 130 }),
  target: () => { tone(440, 0.08, { vol: 0.12 }); tone(660, 0.09, { vol: 0.1, delay: 0.07 }); },
  solved: () => { tone(523, 0.1, { vol: 0.14 }); tone(659, 0.1, { vol: 0.14, delay: 0.1 }); tone(784, 0.16, { vol: 0.14, delay: 0.2 }); },
  correct: () => { tone(660, 0.09, { vol: 0.14 }); tone(880, 0.14, { vol: 0.14, delay: 0.09 }); },
  wrong: () => { tone(200, 0.12, { type: "sawtooth", vol: 0.12 }); tone(140, 0.18, { type: "sawtooth", vol: 0.12, delay: 0.1 }); },
  timeout: () => { tone(300, 0.1, { type: "sawtooth", vol: 0.12 }); tone(220, 0.1, { type: "sawtooth", vol: 0.12, delay: 0.1 }); tone(140, 0.2, { type: "sawtooth", vol: 0.12, delay: 0.2 }); },
  gameOver: () => { tone(392, 0.16, { type: "sawtooth", vol: 0.13 }); tone(330, 0.16, { type: "sawtooth", vol: 0.13, delay: 0.16 }); tone(262, 0.16, { type: "sawtooth", vol: 0.13, delay: 0.32 }); tone(196, 0.34, { type: "sawtooth", vol: 0.14, delay: 0.48 }); },
  complete: () => { tone(523, 0.11, { vol: 0.14 }); tone(659, 0.11, { vol: 0.14, delay: 0.11 }); tone(784, 0.11, { vol: 0.14, delay: 0.22 }); tone(1047, 0.22, { vol: 0.15, delay: 0.33 }); },
  click: () => tone(400, 0.05, { type: "square", vol: 0.08 }),
  achievement: () => { tone(587, 0.09, { vol: 0.13 }); tone(740, 0.09, { vol: 0.13, delay: 0.09 }); tone(880, 0.09, { vol: 0.13, delay: 0.18 }); tone(1175, 0.24, { vol: 0.15, delay: 0.27 }); },
};

function initSoundToggle() {
  const btn = document.getElementById('soundToggle');
  const iconOn = document.getElementById('soundIconOn');
  const iconOff = document.getElementById('soundIconOff');
  if (!btn) return;
  btn.addEventListener('click', () => {
    soundOn = !soundOn;
    iconOn.style.display = soundOn ? "" : "none";
    iconOff.style.display = soundOn ? "none" : "";
    if (soundOn) { getAudioCtx(); sfx.click(); }
  });
}

function initHeaderBackButton() {
  const btn = document.getElementById('headerBackBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    sfx.click();
    await returnToMenu();
  });
}

let levelIdx = 0;
let stage = "puzzle";
let completedLevels = new Set();
let puzzleScore = 0;
let codeScore = 0;
let levelScoreSaved = new Set();
let levelScoreSavePromise = null;
const STAGE_STORAGE_KEY = `puzzleStageProgress:${document.body.dataset.userId || 'guest'}`;
const WRONG_ANSWER_PENALTY = 10;

function createAttemptId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

let attemptId = createAttemptId();

function applyWrongAnswerPenalty(scoreType) {
  puzzleScore -= WRONG_ANSWER_PENALTY;
  codeScore -= WRONG_ANSWER_PENALTY;
  renderHeader();
}

function saveLevelScore() {
  const levelId = currentLevel().id;
  if (levelScoreSaved.has(levelId)) return levelScoreSavePromise || Promise.resolve(true);
  levelScoreSaved.add(levelId);

  const elapsedSeconds = (puzzleTimeLimit(levelIdx) - puzzleTimeLeft) + (CODE_TIME_LIMIT - codeTimeLeft);
  levelScoreSavePromise = fetch('save-score.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      attempt_id: attemptId,
      level_id: levelId,
      puzzle_score: puzzleScore,
      code_score: 0,
      time_seconds: Math.max(0, elapsedSeconds),
    }),
  }).then(async (response) => {
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'The score could not be saved.');
    }
    return true;
  }).catch((error) => {
    levelScoreSaved.delete(levelId);
    console.warn('Unable to save level score:', error);
    showToast(error.message, 'gear');
    return false;
  });
  return levelScoreSavePromise;
}

async function returnToMenu() {
  if (completedLevels.has(levelIdx)) {
    await saveLevelScore();
  }
  window.location.href = 'buttons.php';
}

function getUnlockedStage() {
  try {
    const saved = Number(localStorage.getItem(STAGE_STORAGE_KEY));
    if (!Number.isNaN(saved) && saved >= 0) {
      return Math.min(saved, LEVELS.length - 1);
    }
  } catch (error) {
    console.warn('Unable to read stage progress:', error);
  }
  return 0;
}

function unlockNextStage() {
  const nextUnlocked = Math.max(getUnlockedStage(), Math.min(levelIdx + 1, LEVELS.length - 1));
  try {
    localStorage.setItem(STAGE_STORAGE_KEY, String(nextUnlocked));
  } catch (error) {
    console.warn('Unable to save stage progress:', error);
  }
  return nextUnlocked;
}

let puzzleState = null;
let moves = 0;
let solved = false;
const PUZZLE_TIME_BASE = 35;
const PUZZLE_TIME_STEP = 3;
const PUZZLE_TIME_MIN = 12;
function puzzleTimeLimit(idx) {
  return Math.max(PUZZLE_TIME_MIN, PUZZLE_TIME_BASE - idx * PUZZLE_TIME_STEP);
}
let puzzleTimeLeft = PUZZLE_TIME_BASE;
let puzzleTimerId = null;
let puzzleTimedOut = false;

const PHP_BASIC_QUESTIONS = [
  {
    q: "In PHP, which symbol is used at the beginning of all variable names?",
    code: "$score = 100;",
    options: ["$", "@", "#", "&"],
    answer: "$",
    hint: "All variables in PHP must begin with a dollar sign ($)."
  },
  {
    q: "Which keyword/construct is most commonly used to output strings in PHP?",
    code: "___ 'Welcome to the game!';",
    options: ["echo", "print_line", "console.log", "System.out"],
    answer: "echo",
    hint: "'echo' is the standard statement used to print text."
  },
  {
    q: "Which operator is used to concatenate two strings in PHP?",
    code: "$msg = 'Hello' ___ ' World';",
    options: [".", "+", "&", "++"],
    answer: ".",
    hint: "PHP uses the dot (.) operator for string concatenation."
  },
  {
    q: "What is the standard opening tag used to begin PHP code?",
    code: "___ echo 'Starting...'; ?>",
    options: ["<?php", "<script php>", "<?xml>", "<%php%>"],
    answer: "<?php",
    hint: "Standard PHP code blocks start with <?php."
  },
  {
    q: "What character must be placed at the end of most PHP statements?",
    code: "$active = true___",
    options: [";", ".", ":", "$"],
    answer: ";",
    hint: "Statements in PHP end with a semicolon (;)."
  },
  {
    q: "Which built-in function checks if a variable is declared and not null?",
    code: "if (___($crate)) { }",
    options: ["isset()", "is_null()", "empty()", "exists()"],
    answer: "isset()",
    hint: "isset() returns true if the variable is declared and is not null."
  },
  {
    q: "Which comparison operator checks if two values are equal AND of the same type?",
    code: "if ($x ___ 10) { }",
    options: ["===", "==", "=", "<=>"],
    answer: "===",
    hint: "The identity operator === checks both value and data type."
  },
  {
    q: "Which superglobal array holds form data sent with method='POST'?",
    code: "$name = ___[ 'user' ];",
    options: ["$_POST", "$_GET", "$_REQUEST_POST", "$_SERVER"],
    answer: "$_POST",
    hint: "POST requests store form variables in $_POST."
  },
  {
    q: "Which syntax is used to define an indexed array in modern PHP?",
    code: "$items = ___ 'crate', 'key' ___;",
    options: ["[ ... ]", "( ... )", "{ ... }", "< ... >"],
    answer: "[ ... ]",
    hint: "Modern PHP uses bracket syntax [ ] for arrays."
  },
  {
    q: "Which keyword is used to declare a function in PHP?",
    code: "___ pushBox($dir) { }",
    options: ["function", "def", "func", "method"],
    answer: "function",
    hint: "Functions in PHP are declared using the 'function' keyword."
  },
  {
    q: "Which of the following creates a single-line comment in PHP?",
    code: "___ This is a comment",
    options: ["//", "--", ">>", "#"],
    answer: "//",
    hint: "Single-line PHP comments start with // or #."
  },
  {
    q: "Which superglobal is used to collect URL query parameters in PHP?",
    code: "$id = ___[ 'id' ];",
    options: ["$_GET", "$_POST", "$_URL", "$_PARAM"],
    answer: "$_GET",
    hint: "Query parameters in the URL are accessible via $_GET."
  }
];

let boxQuestionPool = shuffleArray(PHP_BASIC_QUESTIONS);
let boxQuestionPoolIdx = 0;
function nextBoxPHPQuestion() {
  if (boxQuestionPoolIdx >= boxQuestionPool.length) {
    boxQuestionPool = shuffleArray(PHP_BASIC_QUESTIONS);
    boxQuestionPoolIdx = 0;
  }
  return boxQuestionPool[boxQuestionPoolIdx++];
}

let boxQuestionOpen = false;
let boxQuestionOptions = [];
let boxQuestionTimerId = null;
const BOX_QUESTION_TIME_LIMIT = 20;
let boxQuestionTimeLeft = BOX_QUESTION_TIME_LIMIT;
let currentBoxQuestion = null;
let boxQuestionSelected = null;
let boxQuestionFeedback = null;
let completedFlags = new Set();
let pendingSolveAfterQuestion = false;
let autoProceedTimer = null;

let codeSelected = null;
let codeDone = false;
let codeFeedback = null;
const CODE_TIME_LIMIT = 20;
let codeTimeLeft = CODE_TIME_LIMIT;
let codeTimerId = null;
let codeTimedOut = false;

let shuffledOptions = [];

let puzzleBumped = false;
let codeWrongUsed = false;

const ACHIEVEMENTS = [
  { id: "first-steps", title: "First Steps", desc: "Complete your first level", icon: "rocket" },
  { id: "speedrunner", title: "Speedrunner", desc: "Solve a crate puzzle with over half the timer left", icon: "bolt" },
  { id: "flawless", title: "Flawless Run", desc: "Clear a level with no wall bumps and a correct code answer on the first try", icon: "shield" },
  { id: "code-whiz", title: "Code Whiz", desc: "Answer a coding challenge correctly on your first try", icon: "brain" },
  { id: "halfway", title: "Halfway There", desc: "Complete half of all levels", icon: "flag" },
  { id: "champion", title: "Warehouse Champion", desc: "Complete every level in the game", icon: "crown" },
];
let unlockedAchievements = new Set();
let achvToastTimer = null;

const trophyCountEl = document.getElementById('trophyCount');
const achvOverlayEl = document.getElementById('achvOverlay');
const achvListEl = document.getElementById('achvList');
const achvProgressEl = document.getElementById('achvProgress');
const achvToastEl = document.getElementById('achvToast');
const achvToastIconEl = document.getElementById('achvToastIcon');
const achvToastTitleEl = document.getElementById('achvToastTitle');

function unlockAchievement(id) {
  if (unlockedAchievements.has(id)) return;
  unlockedAchievements.add(id);
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a) return;
  trophyCountEl.textContent = unlockedAchievements.size;
  sfx.achievement();
  achvToastIconEl.innerHTML = ICONS[a.icon];
  achvToastTitleEl.textContent = a.title;
  achvToastEl.classList.add('show');
  clearTimeout(achvToastTimer);
  achvToastTimer = setTimeout(() => achvToastEl.classList.remove('show'), 2800);
  if (achvOverlayEl.style.display !== "none") renderAchvPanel();
}

function renderAchvPanel() {
  achvProgressEl.textContent = `${unlockedAchievements.size} / ${ACHIEVEMENTS.length}`;
  achvListEl.innerHTML = ACHIEVEMENTS.map((a) => {
    const unlocked = unlockedAchievements.has(a.id);
    return `
      <div class="achv-item ${unlocked ? "unlocked" : "locked"}">
        <div class="achv-icon">${unlocked ? ICONS[a.icon] : ICONS.lock}</div>
        <div class="achv-text">
          <h3>${a.title}</h3>
          <p>${unlocked ? a.desc : "???"}</p>
        </div>
      </div>`;
  }).join('');
}

function initAchievementsUI() {
  const trophyBtn = document.getElementById('trophyToggle');
  const closeBtn = document.getElementById('achvClose');
  trophyBtn.addEventListener('click', () => {
    sfx.click();
    renderAchvPanel();
    achvOverlayEl.style.display = "flex";
  });
  closeBtn.addEventListener('click', () => {
    sfx.click();
    achvOverlayEl.style.display = "none";
  });
  achvOverlayEl.addEventListener('click', (e) => {
    if (e.target === achvOverlayEl) achvOverlayEl.style.display = "none";
  });
}

const puzzleScoreValEl = document.getElementById('puzzleScoreVal');
const codeScoreValEl = document.getElementById('codeScoreVal');
const levelTrackEl = document.getElementById('levelTrack');
const levelCounterEl = document.getElementById('levelCounter');
const levelTitleEl = document.getElementById('levelTitle');
const stageContentEl = document.getElementById('stageContent');

function currentLevel() { return LEVELS[levelIdx]; }

async function restartGame() {
  await saveLevelScore();
  levelIdx = 0;
  completedLevels = new Set();
  levelScoreSaved = new Set();
  levelScoreSavePromise = null;
  attemptId = createAttemptId();
  puzzleScore = 0;
  codeScore = 0;
  stage = "puzzle";
  renderAll();
}

function renderLevelTrack() {
  levelTrackEl.innerHTML = LEVELS.map((_, i) => {
    let cls = 'level-dot';
    if (completedLevels.has(i)) cls += ' done';
    else if (i === levelIdx) cls += ' current';
    return `<div class="${cls}"></div>`;
  }).join('');
}

function renderHeader() {
  puzzleScoreValEl.textContent = puzzleScore;
  codeScoreValEl.textContent = codeScore;
  puzzleScoreValEl.classList.toggle('negative-score', puzzleScore < 0);
  codeScoreValEl.classList.toggle('negative-score', codeScore < 0);
  levelCounterEl.textContent = `Level ${levelIdx + 1} / ${TOTAL_LEVELS}`;
  levelTitleEl.textContent = currentLevel().title;
  renderLevelTrack();
}

function startLevel() {
  const level = currentLevel();
  puzzleState = cloneLevelState(level);
  moves = 0;
  solved = false;
  puzzleTimedOut = false;
  puzzleBumped = false;
  codeWrongUsed = false;
  codeSelected = null;
  codeDone = false;
  codeFeedback = null;
  codeTimedOut = false;
  boxQuestionOpen = false;
  boxQuestionOptions = [];
  currentBoxQuestion = null;
  boxQuestionSelected = null;
  boxQuestionFeedback = null;
  completedFlags = new Set();
  pendingSolveAfterQuestion = false;
  if (autoProceedTimer) {
    clearTimeout(autoProceedTimer);
    autoProceedTimer = null;
  }
  clearBoxQuestionTimer();
  clearCodeTimer();
  startPuzzleTimer();
  renderPuzzleStage();
}

function isWall(level, r, c) {
  const t = level.grid[r] ? level.grid[r][c] : undefined;
  return t === undefined || t === 0 || t === 3;
}
function boxAt(r, c, boxes) {
  return boxes.find((b) => b.r === r && b.c === c);
}
function dirName(dr, dc) {
  return dr === -1 ? "up" : dr === 1 ? "down" : dc === -1 ? "left" : "right";
}

function doMove(dr, dc) {
  if (solved || puzzleTimedOut || boxQuestionOpen) return;
  const level = currentLevel();
  const facing = dirName(dr, dc);
  const player = puzzleState.player;
  const boxes = puzzleState.boxes;
  const nr = player.r + dr;
  const nc = player.c + dc;

  if (isWall(level, nr, nc)) {
    puzzleState.facing = facing;
    puzzleBumped = true;
    sfx.blocked();
    renderPuzzleStage();
    return;
  }

  const hitBox = boxAt(nr, nc, boxes);
  let pushedOntoTarget = false;
  if (hitBox) {
    const br = nr + dr;
    const bc = nc + dc;
    if (isWall(level, br, bc) || boxAt(br, bc, boxes)) {
      puzzleState.facing = facing;
      puzzleBumped = true;
      sfx.blocked();
      renderPuzzleStage();
      return;
    }
    hitBox.r = br;
    hitBox.c = bc;
    pushedOntoTarget = level.grid[br][bc] === 2;
  }

  puzzleState.player = { r: nr, c: nc };
  puzzleState.facing = facing;
  moves += 1;

  const targets = new Set();
  level.grid.forEach((row, r) => row.forEach((t, c) => { if (t === 2) targets.add(key(r, c)); }));
  const allOnTarget = boxes.every((b) => targets.has(key(b.r, b.c)));

  if (pushedOntoTarget && !allOnTarget) {
    const flagKey = key(hitBox.r, hitBox.c);
    if (!completedFlags.has(flagKey)) {
      completedFlags.add(flagKey);
      sfx.target();
      openBoxPHPQuestion(allOnTarget);
      return;
    }
  }

  if (allOnTarget) {
    solved = true;
    clearPuzzleTimer();
    puzzleScore += 50;
    saveLevelScore();
    sfx.solved();
    if (puzzleTimeLeft > puzzleTimeLimit(levelIdx) / 2) unlockAchievement("speedrunner");
    renderPuzzleStage();
    setTimeout(() => {
      stage = "code";
      shuffledOptions = shuffleArray(currentLevel().code.options);
      startCodeTimer();
      renderAll();
    }, 600);
    return;
  }

  if (hitBox) {
    pushedOntoTarget ? sfx.target() : sfx.push();
  } else {
    sfx.step();
  }

  renderPuzzleStage();
}

function resetPuzzle() {
  const level = currentLevel();
  puzzleState = cloneLevelState(level);
  moves = 0;
  solved = false;
  puzzleTimedOut = false;
  puzzleBumped = false;
  boxQuestionOpen = false;
  boxQuestionOptions = [];
  currentBoxQuestion = null;
  boxQuestionSelected = null;
  boxQuestionFeedback = null;
  completedFlags = new Set();
  pendingSolveAfterQuestion = false;
  if (autoProceedTimer) {
    clearTimeout(autoProceedTimer);
    autoProceedTimer = null;
  }
  clearBoxQuestionTimer();
  startPuzzleTimer();
  renderPuzzleStage();
}

function clearPuzzleTimer() {
  if (puzzleTimerId) {
    clearInterval(puzzleTimerId);
    puzzleTimerId = null;
  }
}

function pausePuzzleTimer() {
  if (puzzleTimerId) {
    clearInterval(puzzleTimerId);
    puzzleTimerId = null;
  }
}

function resumePuzzleTimer() {
  if (puzzleTimedOut || solved || boxQuestionOpen) return;
  if (!puzzleTimerId) {
    puzzleTimerId = setInterval(() => {
      puzzleTimeLeft -= 1;
      if (puzzleTimeLeft <= 0) {
        puzzleTimeLeft = 0;
        clearPuzzleTimer();
        puzzleTimedOut = true;
        sfx.gameOver();
        renderPuzzleStage();
        return;
      }
      renderPuzzleStage();
    }, 1000);
  }
}

function startPuzzleTimer() {
  clearPuzzleTimer();
  puzzleTimeLeft = puzzleTimeLimit(levelIdx);
  puzzleTimerId = setInterval(() => {
    puzzleTimeLeft -= 1;
    if (puzzleTimeLeft <= 0) {
      puzzleTimeLeft = 0;
      clearPuzzleTimer();
      puzzleTimedOut = true;
      sfx.gameOver();
      renderPuzzleStage();
      return;
    }
    renderPuzzleStage();
  }, 1000);
}

function clearBoxQuestionTimer() {
  if (boxQuestionTimerId) {
    clearInterval(boxQuestionTimerId);
    boxQuestionTimerId = null;
  }
}

function startBoxQuestionTimer() {
  clearBoxQuestionTimer();
  boxQuestionTimeLeft = BOX_QUESTION_TIME_LIMIT;
  boxQuestionTimerId = setInterval(() => {
    boxQuestionTimeLeft -= 1;
    if (boxQuestionTimeLeft <= 0) {
      boxQuestionTimeLeft = 0;
      clearBoxQuestionTimer();
      boxQuestionFeedback = { ok: false, timeout: true };
      sfx.timeout();
      renderPuzzleStage();
      return;
    }
    renderPuzzleStage();
  }, 1000);
}

function openBoxPHPQuestion(isFinalCrate) {
  pausePuzzleTimer();
  clearBoxQuestionTimer();
  if (autoProceedTimer) {
    clearTimeout(autoProceedTimer);
    autoProceedTimer = null;
  }
  boxQuestionOpen = true;
  currentBoxQuestion = nextBoxPHPQuestion();
  boxQuestionOptions = shuffleArray(currentBoxQuestion.options);
  boxQuestionSelected = null;
  boxQuestionFeedback = null;
  pendingSolveAfterQuestion = isFinalCrate;
  startBoxQuestionTimer();
  renderPuzzleStage();
}

function handleBoxQuestionSelect(opt) {
  if (!boxQuestionOpen || boxQuestionSelected !== null || boxQuestionTimeLeft <= 0) return;
  clearBoxQuestionTimer();
  boxQuestionSelected = opt;
  const isCorrect = opt === currentBoxQuestion.answer;
  boxQuestionFeedback = { ok: isCorrect, timeout: false };

  if (isCorrect) {
    sfx.correct();
    puzzleScore += 25;
    renderHeader();
    renderPuzzleStage();
    autoProceedTimer = setTimeout(() => {
      closeBoxQuestionAndProceed();
    }, 1100);
  } else {
    applyWrongAnswerPenalty('puzzle');
    sfx.wrong();
    renderPuzzleStage();
  }
}

function retryBoxQuestion() {
  if (autoProceedTimer) {
    clearTimeout(autoProceedTimer);
    autoProceedTimer = null;
  }
  currentBoxQuestion = nextBoxPHPQuestion();
  boxQuestionOptions = shuffleArray(currentBoxQuestion.options);
  boxQuestionSelected = null;
  boxQuestionFeedback = null;
  startBoxQuestionTimer();
  renderPuzzleStage();
}

function closeBoxQuestionAndProceed() {
  if (autoProceedTimer) {
    clearTimeout(autoProceedTimer);
    autoProceedTimer = null;
  }
  clearBoxQuestionTimer();
  boxQuestionOpen = false;
  currentBoxQuestion = null;
  boxQuestionSelected = null;
  boxQuestionFeedback = null;

  if (pendingSolveAfterQuestion) {
    pendingSolveAfterQuestion = false;
    solved = true;
    clearPuzzleTimer();
    puzzleScore += 50;
    sfx.solved();
    if (puzzleTimeLeft > puzzleTimeLimit(levelIdx) / 2) unlockAchievement("speedrunner");
    renderPuzzleStage();
    setTimeout(() => {
      stage = "code";
      shuffledOptions = shuffleArray(currentLevel().code.options);
      startCodeTimer();
      renderAll();
    }, 600);
  } else {
    resumePuzzleTimer();
    renderPuzzleStage();
  }
}

function clearCodeTimer() {
  if (codeTimerId) {
    clearInterval(codeTimerId);
    codeTimerId = null;
  }
}

function startCodeTimer() {
  clearCodeTimer();
  codeTimeLeft = CODE_TIME_LIMIT;
  codeTimerId = setInterval(() => {
    codeTimeLeft -= 1;
    if (codeTimeLeft <= 0) {
      codeTimeLeft = 0;
      clearCodeTimer();
      codeTimedOut = true;
      codeFeedback = { ok: false, timeout: true };
      sfx.gameOver();
      renderCodeStage();
      return;
    }
    renderCodeStage();
  }, 1000);
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function selectOption(opt) {
  if (codeDone || codeTimedOut) return;
  clearCodeTimer();
  const level = currentLevel();
  const puzzle = level.code;
  codeSelected = opt;
  const correct = opt === puzzle.answer;
  codeFeedback = { ok: correct };

  if (correct) {
    codeDone = true;
    codeScore += 100;
    sfx.correct();
    if (!codeWrongUsed) unlockAchievement("code-whiz");
    renderCodeStage();
    setTimeout(() => {
      completedLevels.add(levelIdx);
      saveLevelScore();
      unlockNextStage();
      stage = "complete";
      sfx.complete();
      if (completedLevels.size === 1) unlockAchievement("first-steps");
      if (!puzzleBumped && !codeWrongUsed) unlockAchievement("flawless");
      if (completedLevels.size >= Math.ceil(TOTAL_LEVELS / 2)) unlockAchievement("halfway");
      if (completedLevels.size === TOTAL_LEVELS) unlockAchievement("champion");
      renderAll();
    }, 600);
  } else {
    codeWrongUsed = true;
    applyWrongAnswerPenalty('code');
    sfx.wrong();
    renderCodeStage();
  }
}

function renderPuzzleStage() {
  const level = currentLevel();

  const cols = level.grid[0].length;
  let boardHTML = `<div class="board" data-cols="${cols}" style="grid-template-columns: repeat(${cols}, var(--cell-size));">`;
  level.grid.forEach((row, r) => {
    row.forEach((tile, c) => {
      const hasBox = boxAt(r, c, puzzleState.boxes);
      const isPlayer = puzzleState.player.r === r && puzzleState.player.c === c;
      const isTarget = tile === 2;
      const onTarget = hasBox && isTarget;
      const isObstacle = tile === 3;
      let cls = "cell";
      if (tile === 0) {
        cls += " wall";
      } else if (isObstacle) {
        const seed = (r * 7 + c * 13) % 5;
        cls += seed === 0 ? " grassy" : (r + c) % 2 === 0 ? " floor-a" : " floor-b";
      } else if (isTarget) {
        cls += " target";
        if (onTarget) cls += " flag-done";
      } else {
        const seed = (r * 7 + c * 13) % 5;
        cls += seed === 0 ? " grassy" : (r + c) % 2 === 0 ? " floor-a" : " floor-b";
      }

      boardHTML += `<div class="${cls}">`;
      if (isObstacle) {
        boardHTML += `<div class="obstacle-icon ${(r + c) % 2 === 0 ? "rock" : "tree"}"></div>`;
      }
      if (hasBox) {
        boardHTML += `<div class="crate ${onTarget ? "placed" : ""}"></div>`;
      }
      if (isPlayer) {
        boardHTML += mascotSVG(puzzleState.facing);
      }
      boardHTML += `</div>`;
    });
  });
  boardHTML += `</div>`;

  const puzzleTimerPct = Math.max(0, Math.round((puzzleTimeLeft / puzzleTimeLimit(levelIdx)) * 100));
  const puzzleTimerUrgent = puzzleTimeLeft <= 15 && puzzleTimeLeft > 0 && !solved && !puzzleTimedOut;
  const puzzleTimerRunning = !solved && !puzzleTimedOut;

  stageContentEl.innerHTML = `
    <div class="stage-label${solved ? " unlocked" : ""}">
      ${ICONS.boxes}
      <span>Stage 1 of 2 — Push the crates</span>
    </div>
    <p class="instruction">Push every crate onto a marked flag tile. Rocks and trees block the way — you can't push through them, and you can't pull crates.</p>

    <div class="code-timer-row">
      <div class="code-timer-track"><div class="code-timer-fill ${puzzleTimerUrgent ? "urgent" : ""}" style="width:${puzzleTimerRunning ? puzzleTimerPct : 0}%"></div></div>
      <span class="code-timer-val ${puzzleTimerUrgent ? "urgent" : ""}">${puzzleTimedOut ? "0s" : `${puzzleTimeLeft}s`}</span>
    </div>

    <div class="board-wrap">${boardHTML}</div>

    <div class="hud-row">
      <span class="moves">${moves} moves</span>
      <button class="btn ghost small" id="resetBtn" ${(solved || puzzleTimedOut) ? "disabled" : ""}>${ICONS.resetSmall} Reset</button>
    </div>

    ${(boxQuestionOpen && currentBoxQuestion) ? `
      <div class="box-question-overlay" id="boxQuestionOverlay">
        <div class="box-question-modal">
          <div class="box-question-badge">
            ${ICONS.flag}
            <span>Flag Activated • PHP Basics</span>
          </div>
          <h3 class="box-question-title">${escapeHTML(currentBoxQuestion.q)}</h3>

          ${currentBoxQuestion.code ? `<pre class="box-question-code">${escapeHTML(currentBoxQuestion.code)}</pre>` : ''}

          <div class="code-timer-row box-timer-row">
            <div class="code-timer-track">
              <div class="code-timer-fill ${boxQuestionTimeLeft <= 5 ? "urgent" : ""}" style="width:${Math.max(0, Math.round((boxQuestionTimeLeft / BOX_QUESTION_TIME_LIMIT) * 100))}%"></div>
            </div>
            <span class="code-timer-val ${boxQuestionTimeLeft <= 5 ? "urgent" : ""}">${boxQuestionTimeLeft <= 0 ? "0s" : `${boxQuestionTimeLeft}s`}</span>
          </div>

          <div class="box-question-options">
            ${boxQuestionOptions.map((opt, i) => {
              const letter = ["A", "B", "C", "D"][i] || (i + 1);
              const isPicked = boxQuestionSelected === opt;
              const isCorrect = opt === currentBoxQuestion.answer;
              const isDone = boxQuestionSelected !== null || boxQuestionTimeLeft <= 0;
              let cls = "code-option-btn box-opt-btn";
              if (isPicked) {
                cls += (boxQuestionFeedback && boxQuestionFeedback.ok) ? " picked-correct" : " picked-wrong";
              } else if (isDone && isCorrect) {
                cls += " reveal-correct";
              }
              return `<button class="${cls}" data-box-opt="${escapeHTML(opt)}" ${isDone ? "disabled" : ""}>
                <span class="opt-letter">${letter}</span>
                <span class="opt-text">${escapeHTML(opt)}</span>
              </button>`;
            }).join('')}
          </div>

          ${boxQuestionFeedback ? `
            <div class="box-feedback ${boxQuestionFeedback.ok ? "solved" : "wrong"}">
              ${boxQuestionFeedback.ok 
                ? `🎉 Correct! Flag secured. (+25 score)` 
                : (boxQuestionFeedback.timeout 
                    ? `⏰ Time's up (20s)! The correct answer was "${escapeHTML(currentBoxQuestion.answer)}".` 
                  : `❌ Not quite! -10 points. Puzzle score: ${puzzleScore}. The correct answer is "${escapeHTML(currentBoxQuestion.answer)}".`)}
            </div>
            <div class="box-question-footer">
              ${boxQuestionFeedback.ok 
                ? `<button class="btn primary small" id="boxProceedBtn">Continue Pushing &rarr;</button>` 
                : `<button class="btn primary small" id="boxRetryBtn">${ICONS.resetSmall} Try Question Again</button>
                   <button class="btn ghost small" id="boxResetPuzzleBtn">Reset Puzzle</button>`}
            </div>
          ` : ''}
        </div>
      </div>
    ` : ""}

    ${solved
      ? `<p class="feedback solved">All crates placed — sending you to the code stage…</p>`
      : `<div class="locked-hint">${ICONS.lock} Finish the crate puzzle to unlock the coding stage.</div>`}

    ${puzzleTimedOut ? `
      <div class="gameover-overlay" id="gameOverOverlay">
        <div class="gameover-panel">
          <div class="gameover-icon">${ICONS.skull}</div>
          <h2 class="gameover-title">GAME OVER</h2>
          <p>You ran out of time on Level ${levelIdx + 1}. Starting back at Level 1.</p>
          <div class="gameover-actions">
            <button class="btn primary" id="gameOverBtn">${ICONS.resetSmall} Play Again</button>
            <button class="btn ghost" id="backToMenuBtn">Back to Menu</button>
          </div>
        </div>
      </div>
    ` : ""}
  `;

  document.getElementById('resetBtn').addEventListener('click', () => { sfx.click(); resetPuzzle(); });
  const gameOverBtn = document.getElementById('gameOverBtn');
  if (gameOverBtn) gameOverBtn.addEventListener('click', () => { sfx.click(); restartGame(); });
  const backToMenuBtn = document.getElementById('backToMenuBtn');
  if (backToMenuBtn) backToMenuBtn.addEventListener('click', async () => { sfx.click(); await returnToMenu(); });

  stageContentEl.querySelectorAll('.box-opt-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleBoxQuestionSelect(btn.dataset.boxOpt);
    });
  });
  const boxProceedBtn = document.getElementById('boxProceedBtn');
  if (boxProceedBtn) {
    boxProceedBtn.addEventListener('click', () => {
      sfx.click();
      closeBoxQuestionAndProceed();
    });
  }
  const boxRetryBtn = document.getElementById('boxRetryBtn');
  if (boxRetryBtn) {
    boxRetryBtn.addEventListener('click', () => {
      sfx.click();
      retryBoxQuestion();
    });
  }
  const boxResetPuzzleBtn = document.getElementById('boxResetPuzzleBtn');
  if (boxResetPuzzleBtn) {
    boxResetPuzzleBtn.addEventListener('click', () => {
      sfx.click();
      resetPuzzle();
    });
  }

  requestAnimationFrame(autoFitGame);
}

function renderCodeStage() {
  const level = currentLevel();
  const puzzle = level.code;

  const opts = (shuffledOptions && shuffledOptions.length === puzzle.options.length)
    ? shuffledOptions
    : puzzle.options;

  const blankText = codeSelected !== null ? codeSelected : "___";
  const blankCls = codeSelected === null ? "" : (codeFeedback && codeFeedback.ok ? "correct" : "incorrect");

  const codeHTML = puzzle.lines.map((line) => {
    if (line.includes("___")) {
      const [before, after] = line.split("___");
      return `${escapeHTML(before)}<span class="code-blank-display ${blankCls}">${escapeHTML(blankText)}</span>${escapeHTML(after)}`;
    }
    return escapeHTML(line);
  }).join("\n");

  const LETTERS = ["A", "B", "C", "D", "E", "F"];
  const isRevealState = codeTimedOut || (codeSelected !== null && !(codeFeedback && codeFeedback.ok));
  const optionsHTML = opts.map((opt, i) => {
    const letter = LETTERS[i] || (i + 1);
    const isPicked = codeSelected === opt;
    const isCorrectOpt = opt === puzzle.answer;
    let cls = "code-option-btn";
    if (isPicked) {
      cls += codeFeedback && codeFeedback.ok ? " picked-correct" : " picked-wrong";
    } else if (isRevealState && isCorrectOpt) {
      cls += " reveal-correct";
    }
    return `<button class="${cls}" data-opt="${escapeHTML(opt)}" ${(codeSelected !== null || codeTimedOut) ? "disabled" : ""}>
      <span class="opt-letter">${letter}</span><span class="opt-text">${escapeHTML(opt)}</span>
    </button>`;
  }).join("");

  const timerPct = Math.max(0, Math.round((codeTimeLeft / CODE_TIME_LIMIT) * 100));
  const timerUrgent = codeTimeLeft <= 8 && codeTimeLeft > 0 && codeSelected === null && !codeTimedOut;
  const timerRunning = codeSelected === null && !codeTimedOut;

  stageContentEl.innerHTML = `
    <div class="stage-label unlocked">
      ${ICONS.code}
      <span>Stage 2 of 2 — Solve the code${puzzle.lang ? ` (${puzzle.lang})` : ""}</span>
    </div>
    <p class="instruction">Crates placed. Pick the missing piece to complete the code. You have 20 seconds.</p>

    <div class="code-timer-row">
      <div class="code-timer-track"><div class="code-timer-fill ${timerUrgent ? "urgent" : ""}" style="width:${timerRunning ? timerPct : 0}%"></div></div>
      <span class="code-timer-val ${timerUrgent ? "urgent" : ""}">${codeTimedOut ? "0s" : `${codeTimeLeft}s`}</span>
    </div>

    <pre class="code-block">${codeHTML}</pre>

    ${puzzle.hint ? `<p class="code-hint">Hint: ${escapeHTML(puzzle.hint)}</p>` : ""}

    <div class="code-options">${optionsHTML}</div>

    ${codeTimedOut ? `
      <div class="gameover-overlay" id="gameOverOverlay">
        <div class="gameover-panel">
          <div class="gameover-icon">${ICONS.skull}</div>
          <h2 class="gameover-title">GAME OVER</h2>
          <p>Out of time — the correct answer was "${escapeHTML(puzzle.answer)}". Starting back at Level 1.</p>
          <div class="gameover-actions">
            <button class="btn primary" id="gameOverBtn">${ICONS.resetSmall} Play Again</button>
            <button class="btn ghost" id="backToMenuBtn">Back to Menu</button>
          </div>
        </div>
      </div>
    ` : ""}
    ${(!codeTimedOut && codeSelected !== null) ? `<p class="feedback ${codeFeedback && codeFeedback.ok ? "solved" : "wrong"}">You picked "${escapeHTML(codeSelected)}" — ${codeFeedback && codeFeedback.ok ? "correct!" : `not quite. -10 points. The correct answer is "${escapeHTML(puzzle.answer)}".`}</p>` : ""}
    ${(!codeTimedOut && codeSelected !== null && !(codeFeedback && codeFeedback.ok)) ? `<button class="btn ghost small" id="tryAgainBtn">${ICONS.resetSmall} Try Again</button>` : ""}
    ${codeDone ? `<p class="feedback solved">Code solved — level complete!</p>` : ""}
  `;

  stageContentEl.querySelectorAll('.code-option-btn').forEach((btn) => {
    btn.addEventListener('click', () => selectOption(btn.dataset.opt));
  });

  const gameOverBtn = document.getElementById('gameOverBtn');
  if (gameOverBtn) gameOverBtn.addEventListener('click', () => { sfx.click(); restartGame(); });
  const backToMenuBtn = document.getElementById('backToMenuBtn');
  if (backToMenuBtn) backToMenuBtn.addEventListener('click', () => { sfx.click(); window.location.href = 'buttons.php'; });

  const tryAgainBtn = document.getElementById('tryAgainBtn');
  if (tryAgainBtn) {
    tryAgainBtn.addEventListener('click', () => {
      sfx.click();
      codeSelected = null;
      codeFeedback = null;
      codeTimedOut = false;
      startCodeTimer();
      renderCodeStage();
    });
  }

  requestAnimationFrame(autoFitGame);
}

function renderCompleteStage() {
  const isLastLevel = levelIdx === TOTAL_LEVELS - 1;
  const allDone = completedLevels.size === TOTAL_LEVELS;

  stageContentEl.innerHTML = `
    <div class="complete-panel">
      <div class="complete-icon">${ICONS.check}</div>
      <h2>${isLastLevel && allDone ? "All levels cleared!" : "Level complete"}</h2>
      <p>Crates placed, code solved. Score saved to the leaderboard.</p>
      <div class="row-buttons">
        <button class="btn ghost" id="replayBtn">${ICONS.resetSmall} Replay</button>
        ${!isLastLevel ? `<button class="btn primary" id="nextBtn">Continue ${ICONS.next}</button>` : ""}
        <button class="btn ghost" id="menuBtn">Back to Menu</button>
      </div>
    </div>
  `;

  document.getElementById('replayBtn').addEventListener('click', () => {
    sfx.click();
    stage = "puzzle";
    renderAll();
  });
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      sfx.click();
      if (levelIdx < TOTAL_LEVELS - 1) {
        levelIdx += 1;
        stage = "puzzle";
        renderAll();
      }
    });
  }
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', async () => {
      sfx.click();
      await returnToMenu();
    });
  }

  requestAnimationFrame(autoFitGame);
}

function renderAll() {
  renderHeader();
  if (stage === "puzzle") {
    startLevel();
  } else if (stage === "code") {
    renderCodeStage();
  } else if (stage === "complete") {
    renderCompleteStage();
  }
}

window.addEventListener('keydown', (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", " "].includes(e.key)) {
    e.preventDefault();
  }

  if (puzzleTimedOut || codeTimedOut) {
    if (e.key === "Enter" || e.key === " ") {
      sfx.click();
      restartGame();
    } else if (e.key === "Escape") {
      sfx.click();
      window.location.href = 'buttons.php';
    }
    return;
  }

  if (boxQuestionOpen && currentBoxQuestion) {
    if (boxQuestionSelected === null && boxQuestionTimeLeft > 0) {
      const keyMap = { "1": 0, "a": 0, "A": 0, "2": 1, "b": 1, "B": 1, "3": 2, "c": 2, "C": 2, "4": 3, "d": 3, "D": 3 };
      if (e.key in keyMap) {
        const idx = keyMap[e.key];
        if (idx < boxQuestionOptions.length) {
          handleBoxQuestionSelect(boxQuestionOptions[idx]);
        }
      }
    } else if (boxQuestionFeedback) {
      if (e.key === "Enter" || e.key === " ") {
        if (boxQuestionFeedback.ok) {
          closeBoxQuestionAndProceed();
        } else {
          retryBoxQuestion();
        }
      }
    }
    return;
  }
  if (stage !== "puzzle") return;
  if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") doMove(-1, 0);
  else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") doMove(1, 0);
  else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") doMove(0, -1);
  else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") doMove(0, 1);
});

function autoFitGame() {
  const shell = document.getElementById('gameShell');
  if (!shell) return;

  const board = shell.querySelector('.board');
  if (board) {
    const columns = Number(board.dataset.cols);
    const rows = board.children.length / columns;
    const boardWidth = Math.max(0, shell.clientWidth - 64);
    const boardHeight = Math.max(0, shell.clientHeight - 260);
    const gapSpaceX = (columns - 1) * 2 + 22;
    const gapSpaceY = (rows - 1) * 2 + 22;
    const cellSize = Math.max(28, Math.min(60, Math.floor(Math.min(
      (boardWidth - gapSpaceX) / columns,
      (boardHeight - gapSpaceY) / rows
    ))));
    board.style.setProperty('--cell-size', `${cellSize}px`);
  }

  shell.style.transform = 'none';
  shell.style.transformOrigin = 'center center';
}

window.addEventListener('resize', autoFitGame);
window.addEventListener('orientationchange', () => setTimeout(autoFitGame, 150));
if (window.ResizeObserver) {
  new ResizeObserver(() => autoFitGame()).observe(document.body);
}

initSoundToggle();
initHeaderBackButton();
initAchievementsUI();

(function() {
  const params = new URLSearchParams(window.location.search);
  const lvlParam = params.get('level');
  if (lvlParam !== null) {
    const idx = parseInt(lvlParam, 10);
    if (!isNaN(idx) && idx >= 0 && idx < LEVELS.length) {
      levelIdx = idx;
    }
  }
})();

renderAll();
requestAnimationFrame(() => {
  autoFitGame();
  setTimeout(autoFitGame, 300);
});