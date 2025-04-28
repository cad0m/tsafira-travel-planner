/**
 * Main JavaScript entry point
 * Initializes all necessary components based on the current page
 */
import { initPartials } from '/tsafira-travel-planner/loader.js';
import { qs } from '/tsafira-travel-planner/utils.js';
import { initAuth, updateAuthUI } from '/tsafira-travel-planner/auth.js';
import { initUI } from '/tsafira-travel-planner/ui.js';

// Initialize the partials (header and footer)
initPartials();

// Main initialization function
function init() {
  // Initialize UI components
  initUI();
  
  // Initialize theme and auth after partials are loaded
  document.addEventListener('partialLoaded', function(e) {
    if (e.detail.id === '#header-placeholder') {
      // Initialize authentication
      initAuth();
    }
  });
  
  // Also initialize auth for cases where partials might already be loaded
  initAuth();
  
  // Dynamically import page-specific modules based on data-page attribute
  const body = document.body;
  const pageName = body.dataset.page;
  
  if (pageName) {
    try {
      import(`./${pageName}-page.js`)
        .then(module => {
          if (typeof module.init === 'function') {
            module.init();
          } else if (typeof module.default === 'object' && typeof module.default.init === 'function') {
            module.default.init();
          }
        })
        .catch(error => console.error(`Error loading page module for ${pageName}:`, error));
    } catch (error) {
      console.error(`Error importing page module for ${pageName}:`, error);
    }
  }
}

// Make sure auth UI is updated when auth state changes
document.addEventListener('authStateChanged', () => {
  const mobileNavActions = qs('#mobile-nav-actions');
  if (mobileNavActions) {
    updateAuthUI(mobileNavActions);
  }
});

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}