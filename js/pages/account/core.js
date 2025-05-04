/**
 * Core Module
 * Contains ThemeManager and UIManager functionality
 */
import { getCurrentUser } from '/tsafira-travel-planner/../core/auth.js';

/**
 * Theme Manager
 * Handles the dark/light mode functionality
 */
export class ThemeManager {
  constructor() {
    this.darkMode = false;
    this.themeToggleBtn = null;
    this.themes = {
      light: {
        '--primary': '#f97316',
        '--primary-hover': '#ea580c',
        '--bg-color': '#ffffff',
        '--text-color': '#1f2937',
        '--border-color': '#e5e7eb',
        '--card-bg': '#ffffff',
        '--input-bg': '#ffffff',
      },
      dark: {
        '--primary': '#f97316',
        '--primary-hover': '#ea580c',
        '--bg-color': '#1f2937',
        '--text-color': '#f3f4f6',
        '--border-color': '#374151',
        '--card-bg': '#111827',
        '--input-bg': '#374151',
      }
    };
  }

  /**
   * Initialize the theme manager
   */
  init() {
    this.createThemeToggle();
    this.loadSavedTheme();
    this.setupEventListeners();
  }

  /**
   * Create the theme toggle button if it doesn't exist
   */
  createThemeToggle() {
    // Check if toggle already exists
    if (document.querySelector('.theme-toggle')) {
      this.themeToggleBtn = document.querySelector('.theme-toggle');
      return;
    }

    // If no theme toggle is found in the header, try to find the header nav
    const headerNav = document.querySelector('.header-nav');
    if (headerNav) {
      // Create theme toggle button for header
      this.themeToggleBtn = document.createElement('button');
      this.themeToggleBtn.className = 'theme-toggle nav-link';
      this.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i><i class="fas fa-moon"></i>';
      this.themeToggleBtn.setAttribute('aria-label', 'Toggle dark/light mode');

      // Add to header nav before the profile dropdown
      const profileDropdown = headerNav.querySelector('.profile-dropdown');
      if (profileDropdown) {
        headerNav.insertBefore(this.themeToggleBtn, profileDropdown);
      } else {
        headerNav.appendChild(this.themeToggleBtn);
      }
    } else {
      // Fallback: add to body if header not found
      this.themeToggleBtn = document.createElement('button');
      this.themeToggleBtn.className = 'theme-toggle';
      this.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i><i class="fas fa-moon"></i>';
      this.themeToggleBtn.setAttribute('aria-label', 'Toggle dark/light mode');
      document.body.appendChild(this.themeToggleBtn);
    }

    // Add button styles to stylesheet if not already present
    if (!document.querySelector('style#theme-toggle-styles')) {
      const style = document.createElement('style');
      style.id = 'theme-toggle-styles';
      style.textContent = `
        .nav-link.theme-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-color);
          cursor: pointer;
          background: none;
          border: none;
          transition: color var(--transition-speed) ease;
        }

        .nav-link.theme-toggle:hover {
          color: var(--primary);
        }

        .theme-toggle i {
          font-size: 1.25rem;
          transition: all 0.3s ease;
        }

        body:not(.dark-mode) .theme-toggle i.fa-moon {
          display: none;
        }

        body.dark-mode .theme-toggle i.fa-sun {
          display: none;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Load saved theme preference
   */
  loadSavedTheme() {
    // First check for main app theme preference
    const mainAppTheme = localStorage.getItem('theme');

    // Then check for account-specific theme preferences
    const accountTheme = localStorage.getItem('tsafira-theme');
    const legacyDarkMode = localStorage.getItem('darkMode');

    // Determine which theme to use, prioritizing main app theme
    if (mainAppTheme === 'dark') {
      this.enableDarkMode();
    } else if (accountTheme === 'dark') {
      this.enableDarkMode();
    } else if (legacyDarkMode === 'true') {
      this.enableDarkMode();
    } else {
      this.enableLightMode();
    }

    // Make sure the icons are displayed correctly
    this.updateThemeIcons();

    // Also check if the main app has already set dark mode on html element
    if (document.documentElement.classList.contains('dark')) {
      this.enableDarkMode();
    }
  }

  /**
   * Update theme icons based on current theme
   */
  updateThemeIcons() {
    // First check if the main app has already updated the icons
    if (window.updateThemeIcons) {
      window.updateThemeIcons();
      return;
    }

    // Fallback to our own implementation
    const moonIcons = document.querySelectorAll('.theme-toggle .fa-moon');
    const sunIcons = document.querySelectorAll('.theme-toggle .fa-sun');

    // Determine dark mode status from either our internal state or the document class
    const isDarkMode = this.darkMode || document.documentElement.classList.contains('dark');

    if (isDarkMode) {
      // Show moon icons, hide sun icons
      moonIcons.forEach(icon => icon.style.display = 'block');
      sunIcons.forEach(icon => icon.style.display = 'none');
    } else {
      // Show sun icons, hide moon icons
      moonIcons.forEach(icon => icon.style.display = 'none');
      sunIcons.forEach(icon => icon.style.display = 'block');
    }
  }

  /**
   * Setup event listeners for theme toggle
   */
  setupEventListeners() {
    this.themeToggleBtn.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  /**
   * Toggle between dark and light themes
   */
  toggleTheme() {
    // Use the main app's theme toggle if available
    if (window.toggleTheme) {
      window.toggleTheme();

      // Update our internal state based on the main app's theme
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        this.enableDarkMode(false); // Don't toggle main app theme again
      } else {
        this.enableLightMode(false); // Don't toggle main app theme again
      }
    } else {
      // Fallback to our own implementation
      if (this.darkMode) {
        this.enableLightMode();
      } else {
        this.enableDarkMode();
      }
    }
  }

  /**
   * Enable dark mode
   * @param {boolean} updateMainApp - Whether to update the main app's theme (default: true)
   */
  enableDarkMode(updateMainApp = true) {
    // Update theme variables
    Object.entries(this.themes.dark).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });

    // Update document classes
    document.body.classList.add('dark-mode');

    // Update main app theme if requested
    if (updateMainApp) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }

    // Save account-specific preference for backward compatibility
    localStorage.setItem('tsafira-theme', 'dark');
    localStorage.setItem('darkMode', 'true');
    this.darkMode = true;

    // Update theme icons
    this.updateThemeIcons();
  }

  /**
   * Enable light mode
   * @param {boolean} updateMainApp - Whether to update the main app's theme (default: true)
   */
  enableLightMode(updateMainApp = true) {
    // Update theme variables
    Object.entries(this.themes.light).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });

    // Update document classes
    document.body.classList.remove('dark-mode');

    // Update main app theme if requested
    if (updateMainApp) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Save account-specific preference for backward compatibility
    localStorage.setItem('tsafira-theme', 'light');
    localStorage.setItem('darkMode', 'false');
    this.darkMode = false;

    // Update theme icons
    this.updateThemeIcons();
  }
}

/**
 * UI Manager
 * Handles general UI interactions and updates
 */
export class UIManager {
  constructor() {
    this.currentSection = 'profile';
    this.mobileBreakpoint = 768;
    this.userRole = 'traveler'/tsafira-travel-planner// Default role
  }

  /**
   * Show an error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    const errorToast = document.createElement('div');
    errorToast.className = 'toast-message error';
    errorToast.textContent = message;

    document.body.appendChild(errorToast);

    setTimeout(() => {
      errorToast.classList.add('fade-out');
      setTimeout(() => {
        errorToast.remove();
      }, 300);
    }, 5000);
  }

  /**
   * Show a success message
   * @param {string} message - Success message to display
   */
  showSuccess(message) {
    const successToast = document.createElement('div');
    successToast.className = 'toast-message success';
    successToast.textContent = message;

    document.body.appendChild(successToast);

    setTimeout(() => {
      successToast.classList.add('fade-out');
      setTimeout(() => {
        successToast.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Update UI elements based on user role
   * @param {string} role - User role ('traveler' or 'guide')
   */
  updateUIForRole(role) {
    // Normalize role to prevent issues
    const normalizedRole = (role || 'traveler').toLowerCase();
    this.userRole = normalizedRole;

    console.log(`Updating UI for role: ${normalizedRole}`);

    // First, update body classes for CSS targeting
    document.body.classList.remove('role-guide', 'role-traveler');
    document.body.classList.add(`role-${normalizedRole}`);

    // Find all role-specific elements
    const guideElements = document.querySelectorAll('.guide-only');
    const travelerElements = document.querySelectorAll('.traveler-only');

    console.log(`Found ${guideElements.length} guide elements and ${travelerElements.length} traveler elements`);

    // Helper function to set display based on element type
    const setDisplayProperty = (element, show) => {
      if (!show) {
        element.style.display = 'none';
        return;
      }

      // Determine the appropriate display value based on element type
      if (element.classList.contains('nav-item')) {
        element.style.display = 'flex';
      } else if (element.classList.contains('content-section')) {
        // Content sections should be 'block' but only if they're active
        if (element.classList.contains('active')) {
          element.style.display = 'block';
        } else {
          element.style.display = 'none';
        }
      } else {
        element.style.display = 'block';
      }
    };

    // Show/hide elements based on role
    guideElements.forEach(element => {
      setDisplayProperty(element, normalizedRole === 'guide');
    });

    travelerElements.forEach(element => {
      setDisplayProperty(element, normalizedRole === 'traveler');
    });

    console.log(`UI updated for ${normalizedRole} role`);
  }

  /**
   * Handle mobile menu toggle
   */
  toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar-nav');
    sidebar.classList.toggle('active');

    // Add overlay when sidebar is active
    if (sidebar.classList.contains('active')) {
      const overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.remove();
      });
      document.body.appendChild(overlay);
    } else {
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) {
        overlay.remove();
      }
    }
  }

  /**
   * Switch to a different section
   * @param {string} sectionId - ID of the section to show
   */
  switchSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
      if (section.id === sectionId) {
        section.classList.add('active');
        section.style.display = 'block';
      } else {
        section.classList.remove('active');
        section.style.display = 'none';
      }
    });

    // Update current section tracker
    this.currentSection = sectionId;

    // Handle mobile menu
    if (window.innerWidth <= this.mobileBreakpoint) {
      const sidebar = document.querySelector('.sidebar-nav');
      sidebar.classList.remove('active');

      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) {
        overlay.remove();
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Account Manager
 * Main controller for the account page functionality
 */
export class AccountManager {
  constructor() {
    this.user = null;
    this.userData = null;
    this.currentSection = 'profile';

    // Initialize managers
    this.themeManager = new ThemeManager();
    this.uiManager = new UIManager();
  }

  /**
   * Initialize the account page
   */
  async init() {
    try {
      // Load user data
      await this.loadUserData();

      // Initialize UI components
      this.initializeUI();

      // Initialize event listeners
      this.setupEventListeners();

      // Listen for auth state changes
      document.addEventListener('authStateChanged', this.handleAuthStateChanged.bind(this));

      console.log('Account page initialized successfully');
    } catch (error) {
      console.error('Failed to initialize account page:', error);
      this.uiManager.showError('Failed to load account data. Please try again later.');
    }
  }

  /**
   * Handle authentication state changes
   * @param {CustomEvent} event - The auth state change event
   */
  handleAuthStateChanged(event) {
    console.log('Auth state changed:', event.detail);
    if (event.detail.authenticated && event.detail.user) {
      // Update user data
      this.user = event.detail.user;

      // Update UI for user role
      this.uiManager.updateUIForRole(this.user.role || 'traveler');

      // Update header UI
      this.updateHeaderUI();

      // Reload the appropriate section based on role
      if (this.user.role === 'guide') {
        // Show guide dashboard for guides
        this.showSection('guide');
      } else {
        // Show itineraries for travelers
        this.showSection('itineraries');
      }
    }
  }

  /**
   * Load user data from the authentication system and sessionStorage
   */
  async loadUserData() {
    // Get authenticated user from auth system
    this.user = getCurrentUser();

    if (!this.user) {
      console.error('No authenticated user found');
      // Redirect to login if not authenticated
      window.location.href = '/signin.html';
      return;
    }

    console.log('Authenticated user:', this.user);

    // Store the auth role which should take precedence
    const authRole = this.user.role;
    console.log('Auth role from session:', authRole);

    try {
      // Get the full user data from sessionStorage (already loaded by auth.js)
      const savedUserData = sessionStorage.getItem('tsafira-user-data');
      if (savedUserData) {
        this.userData = JSON.parse(savedUserData);

        if (!this.userData || !this.userData.userData) {
          console.error('Invalid user data format in sessionStorage');
          return;
        }

        console.log('Full user data from sessionStorage:', this.userData);

        // Create a new user object with merged data
        const mergedUser = {
          ...this.userData.userData,  // Base properties from userData.json
          ...this.user,               // Override with authenticated user properties
          role: authRole || this.userData.userData.role || 'traveler'/tsafira-travel-planner/ Ensure role is set
        };

        // Update the user object
        this.user = mergedUser;

        console.log('Final merged user data:', this.user);
      } else {
        console.warn('No user data found in sessionStorage');

        // Try to load data from userData.json as a fallback
        try {
          const response = await fetch('/tsafira-travel-planner/../../assets/data/userData.json');
          if (response.ok) {
            this.userData = await response.json();
            sessionStorage.setItem('tsafira-user-data', JSON.stringify(this.userData));

            // Merge with auth user
            this.user = {
              ...this.userData.userData,
              ...this.user,
              role: authRole || this.userData.userData.role || 'traveler'
            };

            console.log('Loaded user data from userData.json as fallback');
          }
        } catch (fetchError) {
          console.error('Error loading fallback data:', fetchError);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  /**
   * Initialize the UI components
   */
  initializeUI() {
    // Initialize theme before other UI components
    this.themeManager.init();

    // Update header with user info
    this.updateHeaderUI();

    // Update UI for user role
    const userRole = this.user.role || 'traveler';
    this.uiManager.updateUIForRole(userRole);

    // Determine which section to show based on role
    let initialSection = 'profile'/tsafira-travel-planner// Default to profile

    if (userRole === 'guide') {
      // For guides, show the guide dashboard
      initialSection = 'guide';
    } else if (userRole === 'traveler') {
      // For travelers, show itineraries if available
      const travelerSection = document.querySelector('.traveler-only.content-section');
      if (travelerSection) {
        initialSection = travelerSection.id;
      }
    }

    // Update current section tracker
    this.currentSection = initialSection;

    // Show initial section
    this.showSection(initialSection);

    console.log(`UI initialized with role ${userRole}, showing section ${initialSection}`);
  }

  /**
   * Update the header UI with user information
   */
  updateHeaderUI() {
    // Update profile image in header
    const headerProfileImg = document.querySelector('header .profile-image');
    if (headerProfileImg && this.user.avatarUrl) {
      headerProfileImg.src = this.user.avatarUrl;
      headerProfileImg.alt = this.user.name;
    }

    // Update sidebar profile section
    const sidebarProfileImg = document.querySelector('.sidebar-nav .profile-photo');
    const sidebarName = document.querySelector('.sidebar-nav .profile-name');
    const sidebarEmail = document.querySelector('.sidebar-nav .profile-email');

    if (sidebarProfileImg && this.user.avatarUrl) {
      sidebarProfileImg.src = this.user.avatarUrl;
    }

    if (sidebarName && this.user.name) {
      sidebarName.textContent = this.user.name;
    }

    if (sidebarEmail && this.user.email) {
      sidebarEmail.textContent = this.user.email;
    }
  }

  /**
   * Set up event listeners for UI interactions
   */
  setupEventListeners() {
    // Navigation event listeners
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
      if (!item.dataset.section) return;

      item.addEventListener('click', () => {
        this.showSection(item.dataset.section);

        // Close mobile sidebar if open
        if (window.innerWidth <= 768) {
          document.querySelector('.sidebar-nav').classList.remove('active');
        }
      });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar-nav');

    mobileMenuToggle?.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });

    // Logout event listener
    document.querySelector('.logout-button')?.addEventListener('click', () => {
      this.handleLogout();
    });

    // Role switcher (for testing)
    const switchRoleBtn = document.getElementById('switch-role-btn');
    const roleSelector = document.getElementById('role-selector');

    if (switchRoleBtn && roleSelector) {
      // Set the initial value based on current user role
      if (this.user && this.user.role) {
        roleSelector.value = this.user.role;
      }

      switchRoleBtn.addEventListener('click', () => {
        const newRole = roleSelector.value;
        console.log(`Switching role to: ${newRole}`);

        // Update the user object
        this.user.role = newRole;

        // Update sessionStorage for auth user
        const authUser = JSON.parse(sessionStorage.getItem('user')) || {};
        authUser.role = newRole;
        sessionStorage.setItem('user', JSON.stringify(authUser));

        // Also update the role in the full user data
        const fullUserData = JSON.parse(sessionStorage.getItem('tsafira-user-data')) || {};
        if (fullUserData && fullUserData.userData) {
          fullUserData.userData.role = newRole;
          sessionStorage.setItem('tsafira-user-data', JSON.stringify(fullUserData));

          // Mark data as modified so it won't be overwritten by fresh data
          sessionStorage.setItem('tsafira-data-modified', 'true');
        }

        // Update UI
        this.uiManager.updateUIForRole(newRole);

        // Show appropriate section
        if (newRole === 'guide') {
          this.showSection('guide');
        } else {
          this.showSection('itineraries');
        }

        // Show success message
        this.uiManager.showSuccess(`Role switched to ${newRole}`);

        // Dispatch auth state changed event
        document.dispatchEvent(new CustomEvent('authStateChanged', {
          detail: { authenticated: true, user: this.user }
        }));
      });
    }
  }

  /**
   * Show a specific section and hide others
   * @param {string} sectionId - The ID of the section to show
   */
  showSection(sectionId) {
    console.log(`Showing section: ${sectionId}`);

    // Check if the section is role-specific and if the user has the right role
    const section = document.getElementById(sectionId);
    if (!section) {
      console.error(`Section with ID "${sectionId}" not found`);
      return;
    }

    const isGuideSection = section.classList.contains('guide-only');
    const isTravelerSection = section.classList.contains('traveler-only');

    // If trying to access a role-specific section that doesn't match the user's role,
    // redirect to an appropriate section
    if ((isGuideSection && this.user.role !== 'guide') ||
        (isTravelerSection && this.user.role !== 'traveler')) {
      console.warn(`User with role ${this.user.role} cannot access ${sectionId} section`);

      // Redirect to an appropriate section based on role
      if (this.user.role === 'guide') {
        sectionId = 'guide'/tsafira-travel-planner// Guide dashboard
      } else {
        sectionId = 'profile'/tsafira-travel-planner// Default to profile for travelers
      }

      console.log(`Redirected to ${sectionId} section based on role`);
    }

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
      if (section.id === sectionId) {
        section.classList.add('active');
        section.style.display = 'block';
      } else {
        section.classList.remove('active');
        section.style.display = 'none';
      }
    });

    // Update current section tracker
    this.currentSection = sectionId;

    console.log(`Section changed to: ${sectionId}`);
  }

  /**
   * Save user data changes to sessionStorage
   * @param {Object} changes - The changes to apply to user data
   * @param {string} dataType - The type of data being updated (e.g., 'profile', 'itineraries')
   */
  saveUserDataChanges(changes, dataType = 'userData') {
    try {
      // Get current user data
      const userData = JSON.parse(sessionStorage.getItem('tsafira-user-data') || '{}');

      // Apply changes based on data type
      if (dataType === 'userData' || dataType === 'profile') {
        // Update user profile data
        userData.userData = { ...userData.userData, ...changes };

        // Also update auth user if profile data changed
        const authUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (changes.name) authUser.name = changes.name;
        if (changes.email) authUser.email = changes.email;
        if (changes.avatarUrl) authUser.avatarUrl = changes.avatarUrl;
        if (changes.role) authUser.role = changes.role;
        sessionStorage.setItem('user', JSON.stringify(authUser));
      } else {
        // Update other data types (itineraries, notifications, etc.)
        userData[dataType] = changes;
      }

      // Save updated data
      sessionStorage.setItem('tsafira-user-data', JSON.stringify(userData));

      // Mark data as modified
      sessionStorage.setItem('tsafira-data-modified', 'true');

      console.log(`User data updated for ${dataType}:`, changes);
      return true;
    } catch (error) {
      console.error('Error saving user data changes:', error);
      return false;
    }
  }

  /**
   * Handle user logout
   */
  handleLogout() {
    // Confirm logout
    if (confirm('Are you sure you want to log out?')) {
      // Trigger sign out event for auth.js to handle
      document.dispatchEvent(new CustomEvent('signOut'));

      // Redirect to home page
      window.location.href = '/';
    }
  }
}

// Export default object with all classes
export default {
  ThemeManager,
  UIManager,
  AccountManager
};