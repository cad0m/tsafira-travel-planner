/**
 * How It Works page functionality for Tsafira
 */

import { initCommonPageFunctions } from '../utils/page-common.js';

document.addEventListener('DOMContentLoaded', function() {
  console.log('How It Works page initialized');

  // Initialize common page functionality
  initCommonPageFunctions();

  // Initialize FAQ functionality
  setupFAQs();
});

/**
 * Sets up FAQ toggle functionality
 */
function setupFAQs() {
  // Direct approach to set up FAQ toggles
  console.log('Setting up FAQ toggles');

  // Get all the toggles
  const toggles = document.querySelectorAll('.faq-toggle');
  console.log('Found', toggles.length, 'FAQ toggles');

  // Add click handler to each toggle
  for (let i = 0; i < toggles.length; i++) {
    const toggle = toggles[i];

    // Add click handler
    toggle.onclick = function() {
      // This is the toggle button that was clicked
      console.log('Toggle clicked!');

      // Get the next element (content panel) and the icon
      const content = this.nextElementSibling;
      const icon = this.querySelector('i');

      // Toggle hidden class
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }

      // Toggle icon
      if (icon) {
        if (icon.classList.contains('fa-chevron-down')) {
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-up');
        } else {
          icon.classList.remove('fa-chevron-up');
          icon.classList.add('fa-chevron-down');
        }
      }

      // Stop event propagation
      return false;
    };
  }

  // Trigger a test open after a short delay
  setTimeout(function() {
    const firstToggle = document.querySelector('.faq-toggle');
    if (firstToggle) {
      console.log('Testing first toggle click');
      firstToggle.click();
    }
  }, 1000);
}

// Export main functions
export default { setupFAQs };