/**
 * How It Works page functionality for Tsafira
 */

import { loadPartial } from '/js/loader.js';
import { initUI } from '/js/ui.js';

document.addEventListener('DOMContentLoaded', function() {
  console.log('How It Works page initialized');
  
  // Initialize UI components
  initUI();
  
  // Load header and footer partials
  loadPartial('/partials/header.html', 'header-placeholder');
  loadPartial('/partials/footer.html', 'footer-placeholder');
});

// Export main functions
export default {};