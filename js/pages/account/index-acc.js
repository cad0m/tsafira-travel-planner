/**
 * Account Page Main Script
 * Loads data from userData.json and populates the UI
 */

import userDataManager from './userData.js';
import uiManager from './uiManager.js';
import { initializeFiltersAndToggles } from './filters.js';
import { initTheme } from './theme.js';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('DOM content loaded, initializing application');

    // Initialize UI manager
    await uiManager.initialize();

    // Set up global event listeners
    setupGlobalEventListeners();

    // Initialize filters and view toggles
    setTimeout(() => {
      console.log('Initializing filters with delay to ensure DOM is ready');
      initializeFiltersAndToggles();
    }, 500);

    // Initialize theme
    initTheme();

    console.log('Account page initialized successfully');
  } catch (error) {
    console.error('Error initializing account page:', error);
  }
});

/**
 * Set up global event listeners
 */
function setupGlobalEventListeners() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar-nav');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');

      // Add/remove overlay
      if (sidebar.classList.contains('active')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('active');
          document.body.removeChild(overlay);
        });
        document.body.appendChild(overlay);
      } else {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
          document.body.removeChild(overlay);
        }
      }
    });
  }

  // Theme toggle is now handled in darkMode.js

  // Password visibility toggle
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('input');
      const icon = button.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // Password strength meter
  const passwordInput = document.querySelector('.password-input');
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const strengthMeter = document.querySelector('.strength-meter-fill');
      const strengthText = document.querySelector('.strength-text');

      if (!password) {
        strengthMeter.className = 'strength-meter-fill';
        strengthMeter.style.width = '0';
        strengthText.textContent = 'Password strength will appear here';
        return;
      }

      // Simple password strength calculation
      let strength = 0;

      // Length check
      if (password.length >= 8) strength += 1;
      if (password.length >= 12) strength += 1;

      // Character variety check
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;

      // Update UI based on strength
      if (strength <= 2) {
        strengthMeter.className = 'strength-meter-fill weak';
        strengthText.textContent = 'Weak password';
      } else if (strength <= 4) {
        strengthMeter.className = 'strength-meter-fill medium';
        strengthText.textContent = 'Medium strength password';
      } else {
        strengthMeter.className = 'strength-meter-fill strong';
        strengthText.textContent = 'Strong password';
      }
    });
  }
}

// Make userDataManager globally available for debugging
window.userDataManager = userDataManager;