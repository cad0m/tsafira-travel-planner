/**
 * Simple theme manager for the account page
 * Handles dark/light mode toggle
 */

/**
 * Apply the current theme based on localStorage
 */
export function applyTheme() {
  const isDark = localStorage.getItem('theme') === 'dark';
  
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark-mode');
  }
  
  // Update calendar elements if they exist
  applyThemeToCalendar();
}

/**
 * Apply theme to calendar elements
 */
export function applyThemeToCalendar() {
  const isDark = document.documentElement.classList.contains('dark') || 
                 document.body.classList.contains('dark-mode');
  
  const calendarElements = document.querySelectorAll(
    '.calendar-container, .calendar-day, .calendar-day-header, ' +
    '.month-option, .calendar-nav-btn, .calendar-title, .calendar-year-display'
  );
  
  if (calendarElements.length > 0) {
    calendarElements.forEach(el => {
      if (isDark) {
        el.classList.add('dark-mode');
      } else {
        el.classList.remove('dark-mode');
      }
    });
  }
}

/**
 * Toggle between dark and light themes
 */
export function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Save preference
  localStorage.setItem('theme', newTheme);
  
  // Apply the theme
  applyTheme();
  
  return newTheme;
}

/**
 * Initialize theme functionality
 */
export function initTheme() {
  // Apply theme on load
  applyTheme();
  
  // Add click handler to theme toggle button
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const newTheme = toggleTheme();
      
      // Show notification if userDataManager is available
      if (window.userDataManager) {
        window.userDataManager.showToast(
          'info',
          'Theme Changed',
          `${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated.`
        );
      }
    });
  }
  
  // Watch for changes to the calendar
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && 
          (mutation.target.classList.contains('calendar-grid') || 
           mutation.target.classList.contains('calendar-container'))) {
        applyThemeToCalendar();
      }
    });
  });
  
  // Start observing the document body for calendar changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
}

// Export default object
export default {
  applyTheme,
  toggleTheme,
  initTheme,
  applyThemeToCalendar
};
