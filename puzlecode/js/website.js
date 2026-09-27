(function () {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function closeNav() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  navToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    toggleNav();
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', function (event) {
    if (navLinks.classList.contains('open') && !navLinks.contains(event.target) && !navToggle.contains(event.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) closeNav();
  });

  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const gamePage = 'push%20and%20code.html';
  let toastTimer = null;

  function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  document.querySelectorAll('.level-card').forEach(function (card) {
    card.addEventListener('click', function () {
      const locked = card.querySelector('.badge.locked');
      if (locked) {
        showToast('🔒 Locked — finish the level before it first');
      } else {
        showToast('▶ Loading the game…');
        setTimeout(function () {
          window.location.href = gamePage;
        }, 400);
      }
    });
  });

  document.querySelectorAll('.swatch').forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      const hex = swatch.getAttribute('data-hex');
      const copied = function () {
        showToast('🎨 Copied ' + hex);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex).then(copied).catch(copied);
      } else {
        copied();
      }
    });
  });
})();
