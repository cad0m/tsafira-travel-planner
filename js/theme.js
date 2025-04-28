/**
 * Theme management module for Tsafira
 * Handles dark/light mode switching and persistence
 */

const THEME_KEY = 'theme';
const DARK_CLASS = 'dark';

/**
 * Get current theme preference
 * @returns {'dark'|'light'} Current theme
 */
export function getCurrentTheme() {
  // Check localStorage first
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    return storedTheme;
  }
  
  // If no stored preference, check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Set theme preference
 * @param {'dark'|'light'} theme - Theme to set
 */
export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  updateThemeClass();
}

/**
 * Toggle between dark and light themes
 */
export function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Add transition class for smooth color change
  document.documentElement.classList.add('transition');
  
  // Set the new theme
  setTheme(newTheme);
  
  // Remove transition class after animation completes
  setTimeout(() => {
    document.documentElement.classList.remove('transition');
  }, 500);
}

/**
 * Update HTML class based on current theme
 */
export function updateThemeClass() {
  const theme = getCurrentTheme();
  const html = document.documentElement;
  
  if (theme === 'dark') {
    html.classList.add(DARK_CLASS);
  } else {
    html.classList.remove(DARK_CLASS);
  }
  
  // Update theme toggle button state
  updateToggleUI();
}

/**
 * Update theme toggle button UI
 */
function updateToggleUI() {
  const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
  const isDark = getCurrentTheme() === 'dark';

  toggleButtons.forEach(button => {
    const moonIcon = button.querySelector('.moon-icon');
    const sunIcon = button.querySelector('.sun-icon');

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
 * Initialize theme functionality
 */
export function initTheme() {
  // Apply theme on load
  updateThemeClass();
  
  // Set up theme toggle click handlers
  const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
  toggleButtons.forEach(button => {
    // Remove existing event listeners if any
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Add new event listener
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      toggleTheme();
    });
  });
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  // Log current theme on init for debugging
  console.log('Current theme:', getCurrentTheme());
}

// Export default object with all functions
export default {
  getCurrentTheme,
  setTheme,
  toggleTheme,
  updateThemeClass,
  initTheme
};