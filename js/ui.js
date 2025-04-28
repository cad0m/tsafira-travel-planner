/**
 * UI Module for Tsafira Travel Planner
 * Handles theme management and mobile menu functionality
 */

// Constants for theme handling 
const THEME_KEY = 'theme';
const DARK_CLASS = 'dark';

/**
 * Initialize UI components when DOM is ready
 */
export function initUI() {
  console.log('Initializing UI components');
  
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize scroll progress bar
    initScrollProgressBar();
    
    // Mark body as loaded for proper CSS transitions
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
  });
}

/**
 * Initialize theme based on stored preference
 */
export function initTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY) || 'light';
  const htmlElement = document.documentElement;
  
  // Apply theme class
  if (storedTheme === 'dark') {
    htmlElement.classList.add(DARK_CLASS);
  } else {
    htmlElement.classList.remove(DARK_CLASS);
  }
  
  // Update all toggle buttons
  updateThemeIcons();
  
  console.log('Theme initialized:', storedTheme);
  
  // Add click handlers to theme toggles if not already set via inline handlers
  const toggles = document.querySelectorAll('[data-theme-toggle], #theme-toggle, #theme-toggle-mobile');
  toggles.forEach(toggle => {
    if (!toggle.hasThemeListener) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
      });
      toggle.hasThemeListener = true;
    }
  });
}

/**
 * Toggle between dark and light themes
 */
export function toggleTheme() {
  // Toggle dark/light theme
  const html = document.documentElement;
  const isDark = html.classList.contains(DARK_CLASS);
  
  // Add transition class for smooth color change
  html.classList.add('transition');
  
  if (isDark) {
    html.classList.remove(DARK_CLASS);
    localStorage.setItem(THEME_KEY, 'light');
  } else {
    html.classList.add(DARK_CLASS);
    localStorage.setItem(THEME_KEY, 'dark');
  }
  
  console.log('Theme toggled to:', !isDark ? 'dark' : 'light');
  
  // Update all theme buttons
  updateThemeIcons();
  
  // Remove transition class after animation completes
  setTimeout(() => {
    html.classList.remove('transition');
  }, 500);
}

/**
 * Update all theme toggle button icons
 */
export function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains(DARK_CLASS);
  const toggles = document.querySelectorAll('[data-theme-toggle], #theme-toggle, #theme-toggle-mobile');
  
  toggles.forEach(toggle => {
    const moonIcon = toggle.querySelector('.moon-icon, .fa-moon');
    const sunIcon = toggle.querySelector('.sun-icon, .fa-sun');
    
    if (moonIcon && sunIcon) {
      if (isDark) {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
      } else {
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
      }
    }
  });
}

/**
 * Initialize mobile menu
 */
export function initMobileMenu() {
  // Ensure the mobile menu is hidden initially
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.style.display = 'none';
    mobileMenu.classList.remove('visible');
  }
  
  // Set up click handlers for mobile menu buttons if not already set via inline handlers
  const menuButton = document.getElementById('mobile-menu-button');
  if (menuButton) {
    menuButton.onclick = function(e) {
      e.preventDefault();
      openMobileMenu();
      return false;
    };
  }
  
  const closeButton = document.getElementById('close-menu-button');
  if (closeButton) {
    closeButton.onclick = function(e) {
      e.preventDefault();
      closeMobileMenu();
      return false;
    };
  }
  
  // Also watch for dynamically loaded elements
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        const newMobileMenu = document.getElementById('mobile-menu');
        const newMenuButton = document.getElementById('mobile-menu-button');
        const newCloseButton = document.getElementById('close-menu-button');
        
        if (newMobileMenu && !newMobileMenu.hasOwnProperty('isFixed')) {
          newMobileMenu.style.display = 'none';
          newMobileMenu.classList.remove('visible');
          newMobileMenu.isFixed = true;
        }
        
        if (newMenuButton) {
          newMenuButton.onclick = function(e) {
            e.preventDefault();
            openMobileMenu();
            return false;
          };
        }
        
        if (newCloseButton) {
          newCloseButton.onclick = function(e) {
            e.preventDefault();
            closeMobileMenu();
            return false;
          };
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Add click outside handler to close menu
  document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('mobile-menu-button');
    
    if (mobileMenu && mobileMenu.classList.contains('visible') && 
        (!menuButton || !menuButton.contains(e.target)) && 
        (!mobileMenu || !mobileMenu.contains(e.target))) {
      closeMobileMenu();
    }
  });
}

/**
 * Open the mobile menu
 */
export function openMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuButton = document.getElementById('mobile-menu-button');
  
  if (!mobileMenu) {
    console.error('Mobile menu element not found');
    return;
  }
  
  console.log('Opening mobile menu');
  
  // Show the menu
  mobileMenu.style.display = 'block';
  setTimeout(() => {
    mobileMenu.classList.add('visible');
  }, 10);
  
  // Change hamburger to X
  if (menuButton) {
    const icon = menuButton.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    }
    
    // Change the onclick handler to close the menu when clicked again
    menuButton.onclick = function(e) {
      e.preventDefault();
      closeMobileMenu();
      return false;
    };
  }
  
  // Prevent scrolling
  document.body.style.overflow = 'hidden';
}

/**
 * Close the mobile menu
 */
export function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuButton = document.getElementById('mobile-menu-button');
  
  if (!mobileMenu) {
    console.error('Mobile menu element not found');
    return;
  }
  
  console.log('Closing mobile menu');
  
  // Hide the menu
  mobileMenu.classList.remove('visible');
  
  // Change X back to hamburger
  if (menuButton) {
    const icon = menuButton.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
    
    // Reset the onclick handler to open the menu again
    menuButton.onclick = function(e) {
      e.preventDefault();
      openMobileMenu();
      return false;
    };
  }
  
  // Wait for animation to complete
  setTimeout(() => {
    mobileMenu.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

/**
 * Initialize scroll progress bar
 */
export function initScrollProgressBar() {
  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  
  // Exit if scroll progress bar doesn't exist on this page
  if (!scrollProgressBar) return;
  
  function updateScrollProgress() {
    const scrollPosition = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Avoid division by zero
    if (scrollHeight <= 0) {
      scrollProgressBar.style.width = '0%';
      return;
    }
    
    const scrollPercentage = (scrollPosition / scrollHeight) * 100;
    
    scrollProgressBar.style.width = `${scrollPercentage}%`;
    // Add a subtle animation effect when scrolling
    scrollProgressBar.style.boxShadow = `0 1px ${3 + scrollPercentage/20}px rgba(242, 101, 34, 0.4)`;
  }
  
  // Add event listener for scroll
  window.addEventListener('scroll', updateScrollProgress);
  
  // Initialize on page load
  updateScrollProgress();
}

// Export all functions and initialize UI
export default {
  initUI,
  initTheme,
  toggleTheme,
  updateThemeIcons,
  initMobileMenu,
  openMobileMenu,
  closeMobileMenu,
  initScrollProgressBar
};

// Make functions globally available for inline handlers
window.toggleTheme = toggleTheme;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu; 