/**
 * Mobile Menu Fix
 * A direct approach to fixing mobile menu issues
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Mobile menu fix script loaded');
  
  // Wait for header to be loaded from placeholder
  waitForElement('#header', function() {
    console.log('Header found, initializing mobile menu fix');
    setupMobileMenu();
    setupThemeToggle();
  });
});

/**
 * Wait for an element to be available in the DOM
 * @param {string} selector - CSS selector for the element
 * @param {Function} callback - Function to call when element is found
 */
function waitForElement(selector, callback) {
  const checkInterval = 100; // Check every 100ms
  const maxAttempts = 50; // Maximum 5 seconds of waiting
  let attempts = 0;
  
  const checkElement = function() {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      return;
    }
    
    attempts++;
    if (attempts < maxAttempts) {
      setTimeout(checkElement, checkInterval);
    } else {
      console.error(`Element ${selector} not found after ${maxAttempts} attempts`);
    }
  };
  
  checkElement();
}

/**
 * Set up mobile menu functionality
 */
function setupMobileMenu() {
  // First, let's completely recreate the mobile menu toggle functionality
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeButton = document.getElementById('close-menu-button');
  
  if (!menuButton || !mobileMenu || !closeButton) {
    console.error('Mobile menu elements not found');
    return;
  }
  
  // Remove any existing click handlers by cloning and replacing the elements
  const newMenuButton = menuButton.cloneNode(true);
  const newCloseButton = closeButton.cloneNode(true);
  
  menuButton.parentNode.replaceChild(newMenuButton, menuButton);
  closeButton.parentNode.replaceChild(newCloseButton, closeButton);
  
  // Reset mobile menu state
  mobileMenu.style.display = 'none';
  mobileMenu.classList.remove('visible');
  
  // Add new event listeners
  newMenuButton.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Menu button clicked');
    openMobileMenu();
  });
  
  newCloseButton.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Close button clicked');
    closeMobileMenu();
  });
  
  // Also close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (mobileMenu.classList.contains('visible') && 
        !mobileMenu.contains(e.target) && 
        e.target !== newMenuButton && 
        !newMenuButton.contains(e.target)) {
      closeMobileMenu();
    }
  });
  
  console.log('Mobile menu setup complete');
}

/**
 * Set up theme toggle functionality
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('theme-toggle-mobile');
  
  if (!themeToggle && !mobileThemeToggle) {
    console.error('Theme toggle buttons not found');
    return;
  }
  
  // Remove existing click handlers
  if (themeToggle) {
    const newThemeToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
    
    newThemeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      toggleTheme();
    });
  }
  
  if (mobileThemeToggle) {
    const newMobileThemeToggle = mobileThemeToggle.cloneNode(true);
    mobileThemeToggle.parentNode.replaceChild(newMobileThemeToggle, mobileThemeToggle);
    
    newMobileThemeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      toggleTheme();
    });
  }
  
  // Update icons based on current theme
  updateThemeIcons();
  
  console.log('Theme toggle setup complete');
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
  
  // Force reflow to ensure transition works
  void mobileMenu.offsetWidth;
  
  // Add visible class for transition
  mobileMenu.classList.add('visible');
  
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
  
  // Remove visible class for transition
  mobileMenu.classList.remove('visible');
  
  // Change X back to hamburger
  if (menuButton) {
    const icon = menuButton.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  }
  
  // Wait for transition to complete before hiding
  setTimeout(() => {
    mobileMenu.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
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

// Make functions globally available
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleTheme = toggleTheme;
window.updateThemeIcons = updateThemeIcons;
