/**
 * Dedicated fix for city page mobile menu issues
 */

document.addEventListener('DOMContentLoaded', function() {
  // Defer execution slightly to let other scripts initialize first
  setTimeout(() => {
    initMobileMenuFix();
  }, 100);
});

/**
 * Initialize mobile menu fixes after small delay
 */
function initMobileMenuFix() {
  // Immediately hide any mobile menu that might be visible
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    console.log('Forcing mobile menu to be hidden on page load');
    mobileMenu.style.display = 'none';
    mobileMenu.classList.remove('visible');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
  
  // Set up mutation observer to catch dynamically loaded mobile menu
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        const newMobileMenu = document.getElementById('mobile-menu');
        if (newMobileMenu && !newMobileMenu.dataset.fixed) {
          console.log('New mobile menu detected, hiding it');
          newMobileMenu.style.display = 'none';
          newMobileMenu.classList.remove('visible');
          newMobileMenu.setAttribute('aria-hidden', 'true');
          newMobileMenu.dataset.fixed = 'true';
          
          // Set up proper event listeners
          setupMobileMenuToggle();
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Also set up menu toggle immediately if elements already exist
  setupMobileMenuToggle();
  
  // Make sure theme toggles are working
  fixDarkModeToggles();
}

/**
 * Fix dark mode toggle buttons
 */
function fixDarkModeToggles() {
  const themeToggles = document.querySelectorAll('[data-theme-toggle], #theme-toggle, #theme-toggle-mobile');
  
  themeToggles.forEach(toggle => {
    // Remove existing listeners by cloning and replacing
    const newToggle = toggle.cloneNode(true);
    if (toggle.parentNode) {
      toggle.parentNode.replaceChild(newToggle, toggle);
    }
    
    // Add fresh click listener
    newToggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle theme class
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
      
      // Update icons
      updateThemeIcons();
    });
  });
  
  // Initial icon state
  updateThemeIcons();
}

/**
 * Update theme toggle icons based on current theme
 */
function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  const themeToggles = document.querySelectorAll('[data-theme-toggle], #theme-toggle, #theme-toggle-mobile');
  
  themeToggles.forEach(toggle => {
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
 * Set up proper toggle functionality for mobile menu
 */
function setupMobileMenuToggle() {
  const menuButton = document.getElementById('mobile-menu-button');
  const closeButton = document.getElementById('close-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!menuButton || !mobileMenu) {
    return; // Elements don't exist yet
  }
  
  // Only setup once
  if (menuButton.dataset.fixed) {
    return;
  }
  
  menuButton.dataset.fixed = 'true';
  
  // Remove any existing listeners to avoid duplicates
  const newMenuButton = menuButton.cloneNode(true);
  const newCloseButton = closeButton ? closeButton.cloneNode(true) : null;
  
  if (menuButton.parentNode) {
    menuButton.parentNode.replaceChild(newMenuButton, menuButton);
  }
  
  if (closeButton && closeButton.parentNode) {
    closeButton.parentNode.replaceChild(newCloseButton, closeButton);
  }
  
  // Open menu when hamburger is clicked
  newMenuButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Mobile menu button clicked');
    
    // Toggle hamburger icon to X
    const icon = this.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    }
    
    // Show the menu
    mobileMenu.style.display = 'block';
    setTimeout(() => {
      mobileMenu.classList.add('visible');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }, 10);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
  });
  
  // Close menu when X is clicked
  if (newCloseButton) {
    newCloseButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Close button clicked');
      closeMenu(mobileMenu, newMenuButton);
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (mobileMenu && mobileMenu.classList.contains('visible') && 
        !newMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu(mobileMenu, newMenuButton);
    }
  });
}

/**
 * Close mobile menu with animation
 */
function closeMenu(menu, menuButton) {
  if (!menu) return;
  console.log('Closing mobile menu');
  
  menu.classList.remove('visible');
  menu.setAttribute('aria-hidden', 'true');
  
  // Toggle X icon back to hamburger
  const icon = menuButton.querySelector('i');
  if (icon) {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
  
  // Hide after animation completes
  setTimeout(() => {
    menu.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
} 