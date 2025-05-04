// This script handles the functionality of the sign-in and sign-up forms, including theme toggling, form switching, password strength checking, and form submission.
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    function setTheme(theme) {
      body.setAttribute('data-theme', theme);
      themeToggle.innerHTML = `<i class="fas fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
      localStorage.setItem('theme', theme);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navMenu = document.getElementById('nav-menu');
    
    mobileMenuButton.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });

    // Form switching - Fixed the variable redeclaration issue
    const tabs = document.querySelectorAll('.tab');
    const formElements = {
      signin: document.getElementById('signin-form'),
      signup: document.getElementById('signup-form')
    };

    function switchForm(formId) {
      // Update tabs
      tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === formId);
      });

      // Switch forms with fade animation
      Object.entries(formElements).forEach(([id, form]) => {
        if (id === formId) {
          form.style.display = 'block';
          form.style.opacity = '0';
          setTimeout(() => form.style.opacity = '1', 50);
        } else {
          form.style.opacity = '0';
          setTimeout(() => form.style.display = 'none', 300);
        }
      });
    }

    // Tab click handlers
    tabs.forEach(tab => {
      tab.addEventListener('click', () => switchForm(tab.dataset.tab));
    });

    // Form toggle links - Fixed by using a new class
    document.querySelectorAll('.form-toggle').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        switchForm(link.dataset.form);
      });
    });

    // Password visibility toggle - Fix to ensure proper functionality
    document.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.innerHTML = `<i class="fas fa-${type === 'password' ? 'eye' : 'eye-slash'}"></i>`;
      });
    });

    // Password strength checker
    const passwordInput = document.getElementById('signup-password');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text span');
    const strengthContainer = document.querySelector('.strength-bars');

    function checkPasswordStrength(password) {
      let score = 0;
      
      // Length check
      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      
      // Character variety checks
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      return {
        score: Math.min(score, 3),
        label: score <= 1 ? 'weak' : score === 2 ? 'medium' : 'strong'
      };
    }

    passwordInput.addEventListener('input', function() {
      const { score, label } = checkPasswordStrength(this.value);
      
      // Remove previous classes
      strengthContainer.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
      
      // Add appropriate class
      if (this.value) {
        strengthContainer.classList.add(`strength-${label}`);
      }
      
      // Update bars
      strengthBars.forEach((bar, index) => {
        bar.style.backgroundColor = index < score 
          ? score === 1 ? '#EF4444' : score === 2 ? '#F59E0B' : '#10B981'
          : 'var(--border-color)';
      });
      
      strengthText.textContent = this.value ? label : 'weak';
    });

    // Form validation and submission
    const allForms = document.querySelectorAll('form');
    
    allForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('.submit-button');
        const spinner = submitButton.querySelector('.spinner');
        
        // Basic validation
        let isValid = true;
        
        // Validate email
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
          const emailError = document.getElementById(`${emailInput.id}-error`);
          if (!emailInput.value || !emailInput.value.includes('@')) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.display = 'block';
            isValid = false;
          } else {
            emailError.style.display = 'none';
          }
        }
        
        // Validate password
        const passwordInput = form.querySelector('input[type="password"]');
        if (passwordInput) {
          const passwordError = document.getElementById(`${passwordInput.id}-error`);
          if (!passwordInput.value || passwordInput.value.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            passwordError.style.display = 'block';
            isValid = false;
          } else {
            passwordError.style.display = 'none';
          }
        }
        
        if (!isValid) return;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.style.color = 'transparent';
        spinner.style.display = 'block';
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } catch (error) {
          console.error('Error:', error);
          submitButton.disabled = false;
          submitButton.style.color = 'white';
          spinner.style.display = 'none';
        }
      });
    });

    // Terms acceptance toggle
    const termsCheckbox = document.getElementById('terms-acceptance');
    const signupButton = document.querySelector('#signup-form .submit-button');

    termsCheckbox.addEventListener('change', function() {
      signupButton.disabled = !this.checked;
    });

    // Social login handlers
    document.querySelectorAll('.social-button').forEach(button => {
      button.addEventListener('click', async () => {
        const provider = button.classList[1];
        button.disabled = true;
        
        try {
          // Simulate social login
          await new Promise(resolve => setTimeout(resolve, 1500));
          window.location.href = '/dashboard';
        } catch (error) {
          console.error('Error:', error);
          button.disabled = false;
        }
      });
    });

    // Add form validation in real-time
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateInput(this);
      });
    });

    function validateInput(input) {
      const errorElement = document.getElementById(`${input.id}-error`);
      
      if (!errorElement) return;
      
      // Email validation
      if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!input.value) {
          errorElement.textContent = 'Email is required';
          errorElement.style.display = 'block';
        } else if (!emailRegex.test(input.value)) {
          errorElement.textContent = 'Please enter a valid email address';
          errorElement.style.display = 'block';
        } else {
          errorElement.style.display = 'none';
        }
      }
      
      // Name validation
      if (input.id === 'signup-name') {
        if (!input.value) {
          errorElement.textContent = 'Name is required';
          errorElement.style.display = 'block';
        } else if (input.value.length < 2) {
          errorElement.textContent = 'Name is too short';
          errorElement.style.display = 'block';
        } else {
          errorElement.style.display = 'none';
        }
      }
      
      // Password validation
      if (input.type === 'password') {
        if (!input.value) {
          errorElement.textContent = 'Password is required';
          errorElement.style.display = 'block';
        } else if (input.value.length < 6) {
          errorElement.textContent = 'Password must be at least 6 characters';
          errorElement.style.display = 'block';
        } else {
          errorElement.style.display = 'none';
        }
      }
    }
  });