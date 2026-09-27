CREATE DATABASE IF NOT EXISTS puzzle_code_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE puzzle_code_db;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('player', 'admin') NOT NULL DEFAULT 'player',
  status ENUM('active', 'pending', 'inactive') NOT NULL DEFAULT 'active',
  avatar_url VARCHAR(500) DEFAULT NULL,
  last_login_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_status (status),
  KEY idx_users_role (role)
) ENGINE=InnoDB;

        CREATE TABLE IF NOT EXISTS admin (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('player', 'admin') NOT NULL DEFAULT 'player',
        status ENUM('active', 'pending', 'inactive') NOT NULL DEFAULT 'active',
        avatar_url VARCHAR(500) DEFAULT NULL,
        last_login_at DATETIME DEFAULT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_email (email),
  KEY idx_admin_status (status),
  KEY idx_admin_role (role)
) ENGINE=InnoDB;

INSERT INTO admin (full_name, email, password_hash, role, status)
VALUES (
  'Administrator',
  'admin',
  '$2y$10$UVFbfwZF539hKDe6lklhceYik0e5dPzGch2/eVFbGvgdv1BG7IU46',
  'admin',
  'active'
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role = 'admin',
  status = 'active';

CREATE TABLE IF NOT EXISTS level_progress (
  user_id INT UNSIGNED NOT NULL,
  level_id TINYINT UNSIGNED NOT NULL,
  status ENUM('locked', 'unlocked', 'completed') NOT NULL DEFAULT 'locked',
  best_puzzle_score INT UNSIGNED NOT NULL DEFAULT 0,
  best_code_score INT UNSIGNED NOT NULL DEFAULT 0,
  best_time_seconds INT UNSIGNED DEFAULT NULL,
  attempts INT UNSIGNED NOT NULL DEFAULT 0,
  completed_at DATETIME DEFAULT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, level_id),
  CONSTRAINT fk_level_progress_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS game_scores (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  attempt_id CHAR(64) DEFAULT NULL,
  level_id TINYINT UNSIGNED NOT NULL,
  puzzle_score INT NOT NULL DEFAULT 0,
  code_score INT NOT NULL DEFAULT 0,
  total_score INT NOT NULL DEFAULT 0,
  time_seconds INT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_scores_leaderboard (total_score, time_seconds),
  KEY idx_scores_user (user_id),
  KEY idx_scores_attempt (user_id, attempt_id),
  KEY idx_scores_level (level_id),
  CONSTRAINT fk_game_scores_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

ALTER TABLE game_scores
  ADD COLUMN IF NOT EXISTS attempt_id CHAR(64) DEFAULT NULL,
  ADD KEY IF NOT EXISTS idx_scores_attempt (user_id, attempt_id),
  MODIFY puzzle_score INT NOT NULL DEFAULT 0,
  MODIFY code_score INT NOT NULL DEFAULT 0,
  MODIFY total_score INT NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS questions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  question TEXT NOT NULL,
  code TEXT NOT NULL,
  options JSON NOT NULL,
  answer VARCHAR(255) NOT NULL,
  hint TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO questions (question, code, options, answer, hint)
SELECT * FROM (
  SELECT
    'In PHP, which symbol is used at the beginning of all variable names?',
    '$score = 100;',
    '["$", "@", "#", "&"]',
    '$',
    'All variables in PHP must begin with a dollar sign ($).'
  UNION ALL SELECT
    'Which keyword/construct is most commonly used to output strings in PHP?',
    '___ ''Welcome to the game!'';',
    '["echo", "print_line", "console.log", "System.out"]',
    'echo',
    '''echo'' is the standard statement used to print text.'
  UNION ALL SELECT
    'Which operator is used to concatenate two strings in PHP?',
    '$msg = ''Hello'' ___ '' World'';',
    '[".", "+", "&", "++"]',
    '.',
    'PHP uses the dot (.) operator for string concatenation.'
  UNION ALL SELECT
    'What is the standard opening tag used to begin PHP code?',
    '___ echo ''Starting...''; ?>',
    '["<?php", "<script php>", "<?xml>", "<%php%>"]',
    '<?php',
    'Standard PHP code blocks start with <?php.'
  UNION ALL SELECT
    'What character must be placed at the end of most PHP statements?',
    '$active = true___',
    '[";",".",":","$"]',
    ';',
    'Statements in PHP end with a semicolon (;).'
  UNION ALL SELECT
    'Which built-in function checks if a variable is declared and not null?',
    'if (___($crate)) { }',
    '["isset()", "is_null()", "empty()", "exists()"]',
    'isset()',
    'isset() returns true if the variable is declared and is not null.'
  UNION ALL SELECT
    'Which comparison operator checks if two values are equal AND of the same type?',
    'if ($x ___ 10) { }',
    '["===", "==", "=", "<=>"]',
    '===',
    'The identity operator === checks both value and data type.'
  UNION ALL SELECT
    'Which superglobal array holds form data sent with method=''POST''?',
    '$name = ___[ ''user'' ];',
    '["$_POST", "$_GET", "$_REQUEST_POST", "$_SERVER"]',
    '$_POST',
    'POST requests store form variables in $_POST.'
  UNION ALL SELECT
    'Which syntax is used to define an indexed array in modern PHP?',
    '$items = ___ ''crate'', ''key'' ___;',
    '["[ ... ]", "( ... )", "{ ... }", "< ... >"]',
    '[ ... ]',
    'Modern PHP uses bracket syntax [ ] for arrays.'
  UNION ALL SELECT
    'Which keyword is used to declare a function in PHP?',
    '___ pushBox($dir) { }',
    '["function", "def", "func", "method"]',
    'function',
    'Functions in PHP are declared using the ''function'' keyword.'
  UNION ALL SELECT
    'Which of the following creates a single-line comment in PHP?',
    '___ This is a comment',
    '["//", "--", ">>", "#"]',
    '//',
    'Single-line PHP comments start with // or #.'
  UNION ALL SELECT
    'Which superglobal is used to collect URL query parameters in PHP?',
    '$id = ___[ ''id'' ];',
    '["$_GET", "$_POST", "$_URL", "$_PARAM"]',
    '$_GET',
    'Query parameters in the URL are accessible via $_GET.'
) AS default_questions (question, code, options, answer, hint)
WHERE NOT EXISTS (SELECT 1 FROM questions);

CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id INT UNSIGNED NOT NULL,
  achievement_id VARCHAR(50) NOT NULL,
  unlocked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, achievement_id),
  CONSTRAINT fk_user_achievements_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_achievements_achievement
    FOREIGN KEY (achievement_id) REFERENCES achievements (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


