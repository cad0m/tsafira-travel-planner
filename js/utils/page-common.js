/**
 * Common page functionality for Tsafira
 * Shared across multiple pages to reduce code duplication
 */

import { loadPartial } from '../core/loader.js';
import { initUI } from '../ui.js';

/**
 * Initializes common functions needed across most pages
 * - UI components
 * - Header and footer loading
 * - Any other shared functionality
 */
export function initCommonPageFunctions() {
  // Initialize UI components (theme toggle, menu, etc)
  initUI();

  // Load header and footer partials
  loadPartial('../partials/header.html', 'header-placeholder');
  loadPartial('../partials/footer.html', 'footer-placeholder');

  // Initialize scroll progress bar if it exists
  initScrollProgressBar();
}

/**
 * Initialize the scroll progress bar if it exists on the page
 */
function initScrollProgressBar() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercentage + '%';
  });
}

// Export additional utility functions if needed
export default {
  initCommonPageFunctions
};