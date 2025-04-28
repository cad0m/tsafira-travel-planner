/**
 * Global fixes for all pages in Tsafira website
 * Handles dark mode toggle and mobile menu functionality
 */

// Make functions globally available
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleTheme = toggleTheme;

document.addEventListener('DOMContentLoaded', function() {
  console.log('Global fixes initialized');
  
  // Initialize theme on load
  initTheme();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Mark body as loaded
  document.body.classList.add('loaded');
});

/**
 * Initialize theme based on stored preference
 */
function initTheme() {
  const storedTheme = localStorage.getItem('theme') || 'light';
  const htmlElement = document.documentElement;
  
  // Apply theme class
  if (storedTheme === 'dark') {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
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
        toggleTheme(this);
      });
      toggle.hasThemeListener = true;
    }
  });
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme(button) {
  // Toggle dark/light theme
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  
  console.log('Theme toggled to:', !isDark ? 'dark' : 'light');
  
  // Update all theme buttons
  updateThemeIcons();
}

/**
 * Update all theme toggle button icons
 */
function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
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
function initMobileMenu() {
  // Ensure the mobile menu is hidden initially
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.style.display = 'none';
    mobileMenu.classList.remove('visible');
  }
  
  // Set up click handlers for mobile menu buttons if not already set via inline handlers
  const menuButton = document.getElementById('mobile-menu-button');
  if (menuButton && !menuButton.hasMobileListener) {
    menuButton.addEventListener('click', function(e) {
      e.preventDefault();
      openMobileMenu();
    });
    menuButton.hasMobileListener = true;
  }
  
  const closeButton = document.getElementById('close-menu-button');
  if (closeButton && !closeButton.hasMobileListener) {
    closeButton.addEventListener('click', function(e) {
      e.preventDefault();
      closeMobileMenu();
    });
    closeButton.hasMobileListener = true;
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
        
        if (newMenuButton && !newMenuButton.hasMobileListener) {
          newMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            openMobileMenu();
          });
          newMenuButton.hasMobileListener = true;
        }
        
        if (newCloseButton && !newCloseButton.hasMobileListener) {
          newCloseButton.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
          });
          newCloseButton.hasMobileListener = true;
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Open the mobile menu
 */
function openMobileMenu() {
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
  }
  
  // Prevent scrolling
  document.body.style.overflow = 'hidden';
}

/**
 * Close the mobile menu
 */
function closeMobileMenu() {
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
  }
  
  // Wait for animation to complete
  setTimeout(() => {
    mobileMenu.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
} 