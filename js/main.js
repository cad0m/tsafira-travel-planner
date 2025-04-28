/**
 * Main JavaScript entry point
 * Initializes all necessary components based on the current page
 */
import { initPartials } from '/js/loader.js';
import { qs, on } from '/js/utils.js';
import { selectors } from '/js/config.js';
import { initAuth, updateAuthUI } from '/js/auth.js';
import { initTheme, updateThemeClass } from '/js/theme.js';

// Initialize the partials (header and footer)
initPartials();

// Main initialization function
function init() {
  // Initialize theme and auth after partials are loaded
  document.addEventListener('partialLoaded', function(e) {
    if (e.detail.id === '#header-placeholder') {
      // Initialize theme after header is loaded
      initTheme();
      
      // Initialize mobile menu
      initMobileMenu();
      
      // Initialize authentication
      initAuth();
    }
  });
  
  // Also initialize for cases where partials might already be loaded
  initTheme();
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

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const mobileMenuButton = qs(selectors.mobileMenuButton);
  const closeMenuButton = qs(selectors.closeMenuButton);
  const mobileMenu = qs(selectors.mobileMenu);
  
  // Exit if elements don't exist on this page
  if (!mobileMenuButton || !closeMenuButton || !mobileMenu) return;
  
  // Add hidden class to mobile menu on init
  if (!mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }
  
  // Open mobile menu when hamburger icon is clicked
  on(mobileMenuButton, 'click', (e) => {
    e.preventDefault();
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  });
  
  // Close mobile menu when X icon is clicked
  on(closeMenuButton, 'click', (e) => {
    e.preventDefault();
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = ''; // Re-enable scrolling
  });
  
  // Close menu when clicking outside
  on(document, 'click', (e) => {
    if (!mobileMenu.classList.contains('hidden') && 
        !mobileMenuButton.contains(e.target) && 
        !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
  
  // Make sure mobile auth UI is updated when auth state changes
  document.addEventListener('authStateChanged', () => {
    const mobileNavActions = qs('#mobile-nav-actions');
    if (mobileNavActions) {
      updateAuthUI(mobileNavActions);
    }
    
    // Also ensure theme is applied correctly on auth state change
    updateThemeClass();
  });
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}