 (function() {
      const toggle = document.getElementById('togglePassword');
      const passwordInput = document.getElementById('password');
      
      if (toggle && passwordInput) {
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
          passwordInput.setAttribute('type', type);
          
          const icon = this.querySelector('i');
          if (icon) {
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
          }
          
          this.setAttribute('title', type === 'password' ? 'Show password' : 'Hide password');
        });
      }
    })();