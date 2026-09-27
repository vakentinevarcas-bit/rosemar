(function() {
      
      const LEVELS = [
        { id: 1, title: 'Loading Dock' },
        { id: 2, title: 'Storeroom Shuffle' },
        { id: 3, title: 'Freight Puzzle' },
        { id: 4, title: 'Narrow Aisle' },
        { id: 5, title: 'Kitchen Corner' },
        { id: 6, title: 'Guest Wing' },
        { id: 7, title: 'Rooftop Storage' },
        { id: 8, title: 'Banquet Setup' },
        { id: 9, title: 'Final Inventory' },
      ];

      const state = {
        user: {
          id: document.body.dataset.userId || '',
          name: document.body.dataset.userName || 'User',
          email: document.body.dataset.userEmail || '',
          role: document.body.dataset.userRole || 'Player',
          avatar: document.body.dataset.userAvatar || 'U',
        },
        activePage: 'play',
      };

      const STAGE_STORAGE_KEY = `puzzleStageProgress:${state.user.id || 'guest'}`;

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

      function setUnlockedStage(levelIndex) {
        const nextUnlocked = Math.max(getUnlockedStage(), Math.min(levelIndex + 1, LEVELS.length - 1));
        try {
          localStorage.setItem(STAGE_STORAGE_KEY, String(nextUnlocked));
        } catch (error) {
          console.warn('Unable to save stage progress:', error);
        }
        return nextUnlocked;
      }

      const navItems = document.querySelectorAll('.nav-item');
      const toast = document.getElementById('actionToast');
      const toastText = document.getElementById('toastText');
      const userCard = document.getElementById('userCard');
      const userAvatar = document.getElementById('userAvatar');
      const userName = document.getElementById('userName');
      const userRole = document.getElementById('userRole');

      function renderUser() {
        userAvatar.textContent = state.user.avatar;
        userName.textContent = state.user.name;
        userRole.textContent = state.user.role;
      }

      function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>'"]/g, character => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[character]));
      }

      let toastTimer = null;
      function showToast(message, icon = 'check') {
        toastText.textContent = message;
        const icons = {
          check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
          play: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3" fill="none" stroke="currentColor"/></svg>',
          trophy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3a2 2 0 0 1 0 4h-1"/><path d="M7 5H4a2 2 0 0 0 0 4h1"/></svg>',
          gear: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
          logout: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
        };
        const existingSvg = toast.querySelector('svg');
        if (existingSvg) existingSvg.remove();
        toast.insertAdjacentHTML('afterbegin', icons[icon] || icons.check);
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
      }

      function renderStageSelector() {
        const highestUnlocked = getUnlockedStage();
        const cardsHTML = LEVELS.map((lvl, i) => {
          const unlocked = i <= highestUnlocked;
          return `
            <button class="stage-card ${unlocked ? 'unlocked' : 'locked'}" data-level="${i}" data-locked="${unlocked ? 'false' : 'true'}" title="${lvl.title}">
              <span class="stage-lock">${unlocked ? 'Unlocked' : 'Locked'}</span>
              <span class="stage-num">${String(lvl.id).padStart(2, '0')}</span>
              <span class="stage-name">${lvl.title}</span>
            </button>
          `;
        }).join('');

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
          <div class="stage-selector-title">Select a Stage</div>
          <div class="stage-selector-sub">Clear each stage to unlock the next one.</div>
          <div class="stage-grid" id="stageGrid">
            ${cardsHTML}
          </div>
        `;

        document.getElementById('stageGrid').querySelectorAll('.stage-card').forEach(btn => {
          btn.addEventListener('click', () => {
            const levelIndex = parseInt(btn.dataset.level, 10);
            const isLocked = btn.dataset.locked === 'true';

            if (isLocked) {
              showToast('🔒 Finish the previous stage to unlock this one.', 'gear');
              return;
            }

            showToast(`Loading Level ${levelIndex + 1}…`, 'play');
            setTimeout(() => {
              window.location.href = `push-and-code.php?level=${levelIndex}`;
            }, 500);
          });
        });
      }

      async function renderLeaderboard(sortBy = 'score') {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = '<div class="leaderboard-panel"><div class="leaderboard-title">Leaderboard</div><div class="leaderboard-sub">Loading scores...</div></div>';

        let players;
        try {
          const response = await fetch('leaderboard.php', { headers: { Accept: 'application/json' } });
          if (!response.ok) throw new Error('Unable to load leaderboard');
          players = await response.json();
        } catch (error) {
          mainContent.innerHTML = '<div class="leaderboard-panel"><div class="leaderboard-title">Leaderboard</div><div class="leaderboard-sub">Unable to load scores right now.</div></div>';
          return;
        }

        players.sort((a, b) => {
          if (sortBy !== 'speed') return b.score - a.score;
          if (a.time === '--') return 1;
          if (b.time === '--') return -1;
          return a.time.localeCompare(b.time);
        });

        const rows = players.length === 0
          ? '<div class="leaderboard-row"><span class="leaderboard-player">No scores yet. Complete a level to appear here.</span></div>'
          : players.map((player, index) => `
          <div class="leaderboard-row${String(player.id) === state.user.id ? ' current' : ''}">
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-player">${escapeHTML(player.name)}<small>${escapeHTML(player.email)}</small></span>
            <span class="leaderboard-score">${player.score.toLocaleString()} pts</span>
            <span class="leaderboard-time">${player.time}</span>
          </div>
        `).join('');

        mainContent.innerHTML = `
          <div class="leaderboard-panel">
            <div class="leaderboard-head">
              <div>
                <div class="leaderboard-title">Leaderboard</div>
                <div class="leaderboard-sub">Compare your score and fastest clear time.</div>
              </div>
              <div class="leaderboard-tabs" role="group" aria-label="Leaderboard sort">
                <button class="leaderboard-tab${sortBy === 'score' ? ' active' : ''}" data-sort="score">Score</button>
                <button class="leaderboard-tab${sortBy === 'speed' ? ' active' : ''}" data-sort="speed">Speed</button>
              </div>
            </div>
            <div class="leaderboard-list" aria-live="polite">${rows}</div>
          </div>
        `;

        mainContent.querySelectorAll('.leaderboard-tab').forEach((tab) => {
          tab.addEventListener('click', () => renderLeaderboard(tab.dataset.sort));
        });
      }

      function setActivePage(page) {
        state.activePage = page;

        navItems.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.action === page);
        });

        if (page === 'select-stage') {
          renderStageSelector();
          return;
        }
        if (page === 'leaderboard') {
          renderLeaderboard();
          return;
        }

        const pages = {
          play: {
            title: 'Push blocks. <span class="highlight">Write code.</span><br>Beat the puzzle.',
            sub: '<strong>GAME CODE PUZZLE</strong> turns real programming logic into a playable puzzle board — move your character, solve the code challenge, and unlock the next level.'
          },
          leaderboard: {
            title: 'Leaderboard',
            sub: 'See how you stack up against other players. Top scores and fastest times.'
          },
          settings: {
            title: 'Settings',
            sub: 'Customize your experience — sound, controls, difficulty, and more.'
          },
        };

        const info = pages[page] || pages.play;
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
          <div class="brand-title">${info.title}</div>
          <div class="brand-sub">${info.sub}</div>
        `;
        document.title = 'Puzzle & Code';
      }

      function handleNavClick(e) {
        const btn = e.currentTarget;
        const action = btn.dataset.action;

        if (action === 'back') {
          window.location.href = 'push-and-code.php';
          return;
        }

        if (action === 'logout') {
          showToast('Logging out…', 'logout');
          setTimeout(() => {
            window.location.href = 'logout.php';
          }, 300);
          return;
        }

        if (action === 'play') {
          showToast('Starting game…', 'play');
          setTimeout(() => {
            window.location.href = 'push-and-code.php';
          }, 300);
          return;
        }

        if (action === 'select-stage') {
          setActivePage('select-stage');
          showToast('Pick a level!', 'check');
          return;
        }

        const messages = {
          play: 'Starting game…',
          leaderboard: 'Loading leaderboard…',
          settings: 'Opening settings…',
        };

        const icons = {
          play: 'play',
          leaderboard: 'trophy',
          settings: 'gear',
        };

        setActivePage(action);
        showToast(messages[action] || 'Done', icons[action] || 'check');
      }

      navItems.forEach(btn => btn.addEventListener('click', handleNavClick));
      renderUser();
      setActivePage('play');

      userCard.addEventListener('click', () => {
        showToast(`Profile: ${state.user.name}`, 'check');
      });
    })();