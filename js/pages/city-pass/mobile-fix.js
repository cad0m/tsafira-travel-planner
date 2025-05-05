/**
 * Mobile menu and theme toggle fix for city-pass.html
 * This script ensures that mobile menu and theme toggle work correctly
 * after the header partial is loaded.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait for header to be loaded from placeholder
  const checkHeaderLoaded = setInterval(function() {
    const header = document.getElementById('header');
    if (header) {
      clearInterval(checkHeaderLoaded);
      console.log('Header loaded, initializing mobile menu and theme toggle');
      initMobileMenuFix();
      initThemeToggleFix();
    }
  }, 100);
});

/**
 * Fix mobile menu toggle functionality
 */
function initMobileMenuFix() {
  // Get mobile menu elements
  const mobileMenu = document.getElementById('mobile-menu');
  const menuButton = document.getElementById('mobile-menu-button');
  const closeButton = document.getElementById('close-menu-button');
  
  if (!mobileMenu || !menuButton || !closeButton) {
    console.warn('Mobile menu elements not found');
    return;
  }
  
  // Reset mobile menu state
  mobileMenu.style.display = 'none';
  mobileMenu.classList.remove('visible');
  
  // Fix menu button click handler
  menuButton.onclick = function(e) {
    e.preventDefault();
    openMobileMenu();
    return false;
  };
  
  // Fix close button click handler
  closeButton.onclick = function(e) {
    e.preventDefault();
    closeMobileMenu();
    return false;
  };
  
  console.log('Mobile menu fix initialized');
}

/**
 * Fix theme toggle functionality
 */
function initThemeToggleFix() {
  // Get theme toggle buttons
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('theme-toggle-mobile');
  
  if (!themeToggle && !mobileThemeToggle) {
    console.warn('Theme toggle buttons not found');
    return;
  }
  
  // Update theme toggle icons based on current theme
  updateThemeIcons();
  
  // Fix theme toggle click handlers
  if (themeToggle) {
    themeToggle.onclick = function(e) {
      e.preventDefault();
      toggleTheme();
      return false;
    };
  }
  
  if (mobileThemeToggle) {
    mobileThemeToggle.onclick = function(e) {
      e.preventDefault();
      toggleTheme();
      return false;
    };
  }
  
  console.log('Theme toggle fix initialized');
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
  // Toggle dark/light theme
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  // Add transition class for smooth color change
  html.classList.add('transition');
  
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
  
  // Remove transition class after animation completes
  setTimeout(() => {
    html.classList.remove('transition');
  }, 500);
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

// Make functions globally available
window.toggleTheme = toggleTheme;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.updateThemeIcons = updateThemeIcons;
