const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function switchTab(formId) {
  setActiveTab(formId);
}

function setActiveTab(formId) {
  const isLogin = formId === 'loginForm';
  if (tabLogin) tabLogin.classList.toggle('active', isLogin);
  if (tabRegister) tabRegister.classList.toggle('active', !isLogin);
  loginForm.classList.toggle('active', isLogin);
  registerForm.classList.toggle('active', !isLogin);
  showToast('Ready to ' + (isLogin ? 'login' : 'register') + ' ✦');
}

function showToast(message, isError = false) {
  const toastDiv = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  if (!toastDiv || !toastText) return;
  toastText.innerText = message;
  toastDiv.style.borderColor = isError ? 'rgba(255, 100, 100, 0.5)' : 'rgba(255, 255, 255, 0.06)';
  toastDiv.style.color = isError ? '#ffb0b0' : '#b8c8e8';
  toastDiv.style.transition = 'all 0.2s';
}

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const icon = button.querySelector('i');
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  icon.classList.toggle('far', !isPassword);
  icon.classList.toggle('fa-eye', !isPassword);
  icon.classList.toggle('fas', isPassword);
  icon.classList.toggle('fa-eye-slash', isPassword);
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    showToast('Please fill in all fields.', true);
    return false;
  }
  if (!email.includes('@') || !email.includes('.')) {
    showToast('Please enter a valid email address.', true);
    return false;
  }
  if (password.length < 6) {
    showToast('Password must be at least 6 characters.', true);
    return false;
  }
  return true;
}

function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const confirm = document.getElementById('regConfirm').value.trim();

  if (!name || !email || !password || !confirm) {
    showToast('Please fill in all fields.', true);
    return false;
  }
  if (!email.includes('@') || !email.includes('.')) {
    showToast('Please enter a valid email address.', true);
    return false;
  }
  if (password.length < 6) {
    showToast('Password must be at least 6 characters.', true);
    return false;
  }
  if (password !== confirm) {
    showToast('Passwords do not match.', true);
    return false;
  }
  return true;
}

if (tabLogin) tabLogin.addEventListener('click', () => setActiveTab('loginForm'));
if (tabRegister) tabRegister.addEventListener('click', () => setActiveTab('registerForm'));

document.querySelectorAll('.toggle-pw').forEach((button) => {
  button.addEventListener('click', () => togglePassword(button.dataset.input, button));
});

document.querySelectorAll('.switch-tab').forEach((link) => {
  link.addEventListener('click', () => switchTab(link.dataset.form));
});

document.getElementById('forgotPassword').addEventListener('click', (event) => {
  event.preventDefault();
  showToast('Reset link would be sent (demo)');
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (handleLogin()) event.currentTarget.submit();
});

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (handleRegister()) event.currentTarget.submit();
});

setActiveTab('loginForm');
