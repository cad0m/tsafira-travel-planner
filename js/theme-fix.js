/**
 * Theme and Mobile Menu fixes for Tsafira
 */

document.addEventListener('DOMContentLoaded', function() {
  // Fix dark mode toggle
  initDarkModeToggle();
  
  // Check if we're on city page
  const isOnCityPage = document.body && document.body.dataset.page === 'city';
  
  // Only initialize mobile menu if not on city page (to avoid conflicts)
  if (!isOnCityPage) {
    initMobileMenu();
  }
  
  // Mark body as loaded after a small delay (ensures CSS transitions work properly)
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

/**
 * Initialize dark mode toggle functionality
 */
function initDarkModeToggle() {
  // Check for stored theme preference or use default
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply the theme
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Find all theme toggle buttons
  const toggleButtons = document.querySelectorAll('[data-theme-toggle], #theme-toggle, #theme-toggle-mobile');
  
  // Update toggle UI based on current theme
  updateToggleUI(currentTheme);
  
  // Check if we're on city page - if so, let city-mobile-fix.js handle theme toggles
  if (document.body && document.body.dataset.page === 'city') {
    return;
  }
  
  // Add click event for all toggle buttons
  toggleButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle the theme
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateToggleUI('light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateToggleUI('dark');
      }
    });
  });
}

/**
 * Update theme toggle button UI
 */
function updateToggleUI(theme) {
  const toggleButtons = document.querySelectorAll('[data-theme-toggle], #theme-toggle, #theme-toggle-mobile');
  
  toggleButtons.forEach(button => {
    const moonIcon = button.querySelector('.moon-icon, .fa-moon');
    const sunIcon = button.querySelector('.sun-icon, .fa-sun');
    
    if (moonIcon && sunIcon) {
      if (theme === 'dark') {
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
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  // CRITICAL: Force hide mobile menu when page loads
  const existingMobileMenu = document.querySelector('#mobile-menu');
  if (existingMobileMenu) {
    existingMobileMenu.classList.remove('visible');
    existingMobileMenu.style.display = 'none';
  }
  
  // Watch for mobile menu elements that might be loaded later
  const observer = new MutationObserver(function() {
    const mobileMenuButton = document.querySelector('#mobile-menu-button');
    const closeMenuButton = document.querySelector('#close-menu-button');
    const mobileMenu = document.querySelector('#mobile-menu');
    
    if (mobileMenuButton && mobileMenu && !mobileMenuButton.hasClickListener) {
      setupMobileMenuListeners(mobileMenuButton, closeMenuButton, mobileMenu);
      
      // Force hide the menu again after it's been created
      if (mobileMenu) {
        mobileMenu.classList.remove('visible');
        mobileMenu.style.display = 'none';
      }
      
      observer.disconnect();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Set up mobile menu event listeners
 */
function setupMobileMenuListeners(menuButton, closeButton, menu) {
  console.log('Setting up mobile menu listeners');
  
  // Make sure the menu is hidden initially
  if (menu) {
    menu.classList.remove('visible');
    menu.style.display = 'none';
  }
  
  // Open menu when hamburger is clicked
  if (menuButton) {
    menuButton.hasClickListener = true;
    menuButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (menu) {
        menu.style.display = 'block';
        // Small delay to allow display block to take effect before adding visible class
        setTimeout(() => {
          menu.classList.add('visible');
        }, 10);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Change hamburger to X icon
        const hamburgerIcon = menuButton.querySelector('.fa-bars');
        if (hamburgerIcon) {
          hamburgerIcon.classList.remove('fa-bars');
          hamburgerIcon.classList.add('fa-times');
        }
      }
    });
  }
  
  // Close menu when X is clicked
  if (closeButton) {
    closeButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeMenu(menu, menuButton);
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (menu && menu.classList.contains('visible') && 
        (!menuButton || !menuButton.contains(e.target)) && 
        (!menu || !menu.contains(e.target))) {
      closeMenu(menu, menuButton);
    }
  });
}

/**
 * Helper function to close the mobile menu
 */
function closeMenu(menu, menuButton) {
  if (!menu) return;
  
  menu.classList.remove('visible');
  // Wait for transition to complete before hiding
  setTimeout(() => {
    menu.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
    
    // Change X back to hamburger icon
    if (menuButton) {
      const closeIcon = menuButton.querySelector('.fa-times');
      if (closeIcon) {
        closeIcon.classList.remove('fa-times');
        closeIcon.classList.add('fa-bars');
      }
    }
  }, 300);
} 