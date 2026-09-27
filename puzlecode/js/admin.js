    let users = JSON.parse(document.body.dataset.users || '[]');
    let questions = JSON.parse(document.body.dataset.questions || '[]');
    let editingQuestionId = null;

    let activeFilter = 'all';
    let searchQuery = '';

    const sidebar = document.getElementById('sidebar');
    const usersTableBody = document.getElementById('usersTableBody');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const totalUsersStat = document.getElementById('totalUsersStat');
    const activeUsersStat = document.getElementById('activeUsersStat');
    const pendingUsersStat = document.getElementById('pendingUsersStat');
    const inactiveUsersStat = document.getElementById('inactiveUsersStat');
    const searchInput = document.getElementById('searchInput');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdown');
    const adminName = document.body.dataset.adminName || 'Admin';
    const adminInitial = adminName.charAt(0).toUpperCase() || 'A';
    const userAvatar = document.getElementById('userAvatar');
    const userNameLabel = userProfileBtn ? userProfileBtn.querySelector('span') : null;
    const toastContainer = document.getElementById('toastContainer');
    const menuToggle = document.getElementById('menuToggle');
    const logoutBtn = document.getElementById('logoutBtn');
    const viewAllLink = document.getElementById('viewAllLink');
    const questionsTableBody = document.getElementById('questionsTableBody');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionModal = document.getElementById('questionModal');
    const questionModalTitle = document.getElementById('questionModalTitle');
    const cancelQuestion = document.getElementById('cancelQuestion');
    const saveQuestion = document.getElementById('saveQuestion');
    const questionCountLabel = document.getElementById('questionCountLabel');

    function escapeHtml(value) {
      const div = document.createElement('div');
      div.textContent = value;
      return div.innerHTML;
    }

    function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      const icons = { success: 'fa-check-circle', info: 'fa-info-circle', error: 'fa-exclamation-circle' };
      toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
      toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    function closeAllDropdowns() {
      notificationDropdown.classList.remove('show');
      userDropdown.classList.remove('show');
      document.querySelectorAll('.action-dropdown.show').forEach(d => d.classList.remove('show'));
    }

    function getStatusCounts() {
      const filtered = users.filter(u => {
        const matchesFilter = activeFilter === 'all' || u.status === activeFilter;
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              u.role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      });
      return {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        pending: users.filter(u => u.status === 'pending').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        filtered: filtered
      };
    }

    function updateStats() {
      const counts = getStatusCounts();
      totalUsersStat.textContent = counts.total;
      activeUsersStat.textContent = counts.active;
      pendingUsersStat.textContent = counts.pending;
      inactiveUsersStat.textContent = counts.inactive;
    }

    function renderUsers() {
      const { filtered } = getStatusCounts();
      const tbody = usersTableBody;

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr class="empty-row">
            <td colspan="6">
              <i class="fas fa-user-slash"></i>
              No users found matching your criteria.
            </td>
          </tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(user => `
        <tr data-user-id="${user.id}">
          <td>
            <div class="user-cell">
              <img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}">
              <span>${escapeHtml(user.name)}</span>
            </div>
          </td>
          <td>${escapeHtml(user.role)}</td>
          <td>
            <span class="status ${user.status}" data-user-id="${user.id}" data-current-status="${user.status}">
              ${escapeHtml(user.status.charAt(0).toUpperCase() + user.status.slice(1))}
            </span>
          </td>
          <td>${Number(user.score || 0).toLocaleString()} pts</td>
          <td>${user.joined}</td>
          <td class="action-cell">
            <button class="action-btn" data-action-menu="${user.id}">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="action-dropdown" id="action-dropdown-${user.id}">
              <button data-action="edit" data-user-id="${user.id}">
                <i class="fas fa-edit"></i> Edit User
              </button>
              <button data-action="toggle-status" data-user-id="${user.id}">
                <i class="fas fa-sync-alt"></i> Toggle Status
              </button>
              <button class="danger" data-action="delete" data-user-id="${user.id}">
                <i class="fas fa-trash-alt"></i> Delete
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('[data-action-menu]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const userId = btn.dataset.actionMenu;
          const dropdown = document.getElementById(`action-dropdown-${userId}`);
          const isOpen = dropdown.classList.contains('show');
          document.querySelectorAll('.action-dropdown.show').forEach(d => d.classList.remove('show'));
          if (!isOpen) dropdown.classList.add('show');
        });
      });

      document.querySelectorAll('.action-dropdown button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          const userId = parseInt(btn.dataset.userId);
          handleUserAction(action, userId);
        });
      });

      document.querySelectorAll('.status').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const userId = parseInt(el.dataset.userId);
          cycleStatus(userId);
        });
      });
    }

    function renderQuestions() {
      questionCountLabel.textContent = `${questions.length} question${questions.length === 1 ? '' : 's'}`;
      if (questions.length === 0) {
        questionsTableBody.innerHTML = `
          <tr class="empty-row"><td colspan="4"><i class="fas fa-question-circle"></i>No questions found. Add your first question.</td></tr>`;
        return;
      }

      questionsTableBody.innerHTML = questions.map(question => `
        <tr>
          <td><strong>${escapeHtml(question.question)}</strong><small class="question-code">${escapeHtml(question.code)}</small></td>
          <td><span class="answer-pill">${escapeHtml(question.answer)}</span></td>
          <td>${question.options.length} choices</td>
          <td class="action-cell">
            <button class="action-btn" data-question-menu="${question.id}" aria-label="Question actions"><i class="fas fa-ellipsis-v"></i></button>
            <div class="action-dropdown" id="question-dropdown-${question.id}">
              <button data-question-action="edit" data-question-id="${question.id}"><i class="fas fa-edit"></i> Edit</button>
              <button class="danger" data-question-action="delete" data-question-id="${question.id}"><i class="fas fa-trash-alt"></i> Delete</button>
            </div>
          </td>
        </tr>
      `).join('');

      questionsTableBody.querySelectorAll('[data-question-menu]').forEach(button => {
        button.addEventListener('click', event => {
          event.stopPropagation();
          const dropdown = document.getElementById(`question-dropdown-${button.dataset.questionMenu}`);
          document.querySelectorAll('.action-dropdown.show').forEach(item => item.classList.remove('show'));
          dropdown.classList.add('show');
        });
      });
      questionsTableBody.querySelectorAll('[data-question-action]').forEach(button => {
        button.addEventListener('click', event => {
          event.stopPropagation();
          closeAllDropdowns();
          handleQuestionAction(button.dataset.questionAction, Number(button.dataset.questionId));
        });
      });
    }

    function questionPayload() {
      return {
        question: document.getElementById('questionText').value.trim(),
        code: document.getElementById('questionCode').value.trim(),
        options: [1, 2, 3, 4].map(index => document.getElementById(`questionOption${index}`).value.trim()),
        answer: document.getElementById('questionAnswer').value.trim(),
        hint: document.getElementById('questionHint').value.trim(),
      };
    }

    function openQuestionModal(question = null) {
      editingQuestionId = question ? question.id : null;
      questionModalTitle.textContent = question ? 'Edit Question' : 'Add Question';
      document.getElementById('questionText').value = question?.question || '';
      document.getElementById('questionCode').value = question?.code || '';
      [1, 2, 3, 4].forEach((index) => {
        document.getElementById(`questionOption${index}`).value = question?.options?.[index - 1] || '';
      });
      document.getElementById('questionAnswer').value = question?.answer || '';
      document.getElementById('questionHint').value = question?.hint || '';
      questionModal.classList.add('show');
      document.getElementById('questionText').focus();
    }

    function handleQuestionAction(action, questionId) {
      const question = questions.find(item => item.id === questionId);
      if (!question) return;
      if (action === 'edit') {
        openQuestionModal(question);
        return;
      }
      if (confirm('Are you sure you want to permanently delete this question?')) {
        fetch('questions.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: questionId }),
        })
          .then(response => response.json().then(data => ({ ok: response.ok, data })))
          .then(({ ok, data }) => {
            if (!ok || !data.success) throw new Error(data.message || 'Unable to delete question.');
            questions = questions.filter(item => item.id !== questionId);
            renderQuestions();
            showToast('Question deleted', 'success');
          })
          .catch(error => showToast(error.message, 'error'));
      }
    }

    function handleUserAction(action, userId) {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      closeAllDropdowns();

      switch (action) {
        case 'edit':
          const newName = prompt('Edit user name:', user.name);
          if (newName && newName.trim()) {
            user.name = newName.trim();
            user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random&size=40`;
            renderUsers();
            showToast(`User updated to "${newName}"`, 'success');
          }
          break;
        case 'toggle-status':
          cycleStatus(userId);
          break;
        case 'delete':
          if (confirm(`Are you sure you want to permanently delete ${user.name}?`)) {
            fetch('delete-user.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: userId }),
            })
              .then(response => response.json().then(data => ({ ok: response.ok, data })))
              .then(({ ok, data }) => {
                if (!ok || !data.success) throw new Error(data.message || 'Unable to delete user.');
                users = users.filter(u => u.id !== userId);
                renderUsers();
                updateStats();
                showToast(`${user.name} has been permanently deleted`, 'success');
              })
              .catch(error => showToast(error.message, 'error'));
          }
          break;
      }
    }

    function cycleStatus(userId) {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      const statuses = ['active', 'pending', 'inactive'];
      const currentIndex = statuses.indexOf(user.status);
      user.status = statuses[(currentIndex + 1) % statuses.length];
      renderUsers();
      updateStats();
      showToast(`${user.name} status changed to ${user.status}`, 'info');
    }

    function navigateToPage(page, title) {
      document.querySelectorAll('.sidebar-btn[data-page]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
      });

      const usersView = document.getElementById('view-users');
      const genericView = document.getElementById('view-generic');
      const questionsView = document.getElementById('view-questions');

      if (page === 'dashboard' || page === 'users') {
        usersView.classList.add('active-view');
        genericView.classList.remove('active-view');
        questionsView.classList.remove('active-view');
        pageTitle.textContent = 'User Management';
        pageSubtitle.textContent = 'Manage all registered users, roles and permissions.';
      } else if (page === 'questioners') {
        usersView.classList.remove('active-view');
        genericView.classList.remove('active-view');
        questionsView.classList.add('active-view');
        renderQuestions();
      } else {
        usersView.classList.remove('active-view');
        genericView.classList.add('active-view');
        questionsView.classList.remove('active-view');
        document.getElementById('genericTitle').textContent = title || 'Page';
        document.getElementById('genericSubtitle').textContent = `This is the ${title || 'page'} section. Functionality coming soon.`;
      }

      if (window.innerWidth <= 900) {
        sidebar.classList.add('collapsed');
      }
    }

    document.querySelectorAll('.sidebar-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigateToPage(btn.dataset.page, btn.dataset.pageTitle);
        showToast(`Navigated to ${btn.dataset.pageTitle}`, 'info');
      });
    });

    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });

    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        showToast('Logging out...', 'info');
        setTimeout(() => {
          window.location.href = 'logout.php';
        }, 800);
      }
    });

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderUsers();
    });

    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.remove('show');
      notificationDropdown.classList.toggle('show');
    });

    document.getElementById('markAllRead').addEventListener('click', (e) => {
      e.stopPropagation();
      notificationBadge.style.display = 'none';
      document.querySelectorAll('.notification-item').forEach(item => {
        item.style.opacity = '0.5';
      });
      showToast('All notifications marked as read', 'success');
    });

    document.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', () => {
        showToast('Opening notification...', 'info');
        notificationDropdown.classList.remove('show');
      });
    });

    userProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.remove('show');
      userDropdown.classList.toggle('show');
    });

    userDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = item.dataset.action;
        userDropdown.classList.remove('show');
        if (action === 'logout') {
          logoutBtn.click();
        }
      });
    });

    addQuestionBtn.addEventListener('click', () => openQuestionModal());
    cancelQuestion.addEventListener('click', () => questionModal.classList.remove('show'));
    questionModal.addEventListener('click', (e) => {
      if (e.target === questionModal) questionModal.classList.remove('show');
    });

    saveQuestion.addEventListener('click', () => {
      const payload = questionPayload();
      if (!payload.question || !payload.code || payload.options.some(option => !option) || !payload.answer || !payload.hint) {
        showToast('Complete every question field', 'error');
        return;
      }
      if (!payload.options.includes(payload.answer)) {
        showToast('The answer must match one option exactly', 'error');
        return;
      }

      const method = editingQuestionId ? 'PUT' : 'POST';
      if (editingQuestionId) payload.id = editingQuestionId;
      saveQuestion.disabled = true;
      fetch('questions.php', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
          if (!ok || !data.success) throw new Error(data.message || 'Unable to save question.');
          const savedQuestion = { ...payload, id: editingQuestionId || data.id };
          if (editingQuestionId) {
            questions = questions.map(item => item.id === editingQuestionId ? savedQuestion : item);
          } else {
            questions.unshift(savedQuestion);
          }
          questionModal.classList.remove('show');
          renderQuestions();
          showToast(editingQuestionId ? 'Question updated' : 'Question added', 'success');
        })
        .catch(error => showToast(error.message, 'error'))
        .finally(() => { saveQuestion.disabled = false; });
    });

    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('click', () => {
        const filter = card.dataset.filter;
        activeFilter = filter;
        renderUsers();
        showToast(`Filtering: ${filter === 'all' ? 'All users' : filter}`, 'info');
      });
    });

    viewAllLink.addEventListener('click', () => {
      activeFilter = 'all';
      searchInput.value = '';
      searchQuery = '';
      renderUsers();
      showToast('Showing all users', 'info');
    });

    document.addEventListener('click', (e) => {
      if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
        notificationDropdown.classList.remove('show');
      }
      if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('show');
      }
      document.querySelectorAll('.action-dropdown.show').forEach(d => {
        if (!d.contains(e.target) && !e.target.closest('[data-action-menu]')) {
          d.classList.remove('show');
        }
      });
    });

    if (userAvatar) {
      userAvatar.textContent = adminInitial;
    }
    if (userNameLabel) {
      userNameLabel.textContent = adminName;
    }

    renderUsers();
    renderQuestions();
    updateStats();
    showToast(`Welcome back, ${adminName}`, 'success');