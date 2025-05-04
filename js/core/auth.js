/**
 * Authentication module for Tsafira
 * Handles user authentication state and UI updates
 */

// Mock user data structure
const mockUser = {
  id: '123',
  name: 'Ayoub Erraouy',
  email: 'erraouy49@outlook.fr',
  avatarUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSBfGjV83r6lnGai-mjjBjCv9vcizZ-WspiMCLY_zxsrycBe5pI4dlGTHOW-QXyA329LqrVdJDbuUiX0yzNVl0h5DXHZYSU8uZvc-HJAg',
  profileUrl: '/pages/account.html'
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export function isAuthenticated() {
  return !!localStorage.getItem('user');
}

/**
 * Sign in user
 * @param {Object} userData User data to store
 */
export function signIn(userData = mockUser) {
  localStorage.setItem('user', JSON.stringify(userData));
  // Dispatch event to notify other components about auth state change
  document.dispatchEvent(new CustomEvent('authStateChanged', { 
    detail: { authenticated: true, user: userData } 
  }));
  updateAuthUI();
}

/**
 * Sign out user
 */
export function signOut() {
  localStorage.removeItem('user');
  // Dispatch event to notify other components about auth state change
  document.dispatchEvent(new CustomEvent('authStateChanged', { 
    detail: { authenticated: false } 
  }));
  updateAuthUI();
}

/**
 * Get current user data
 * @returns {Object|null} User data or null if not authenticated
 */
export function getCurrentUser() {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

/**
 * Update navigation UI based on auth state
 * @param {HTMLElement} container Optional container to update instead of searching in DOM
 */
export function updateAuthUI(container = null) {
  const user = getCurrentUser();
  // Find the elements to update
  const navActions = container || document.querySelector('#nav-actions');
  const mobileNavActions = container?.id === 'mobile-nav-actions' ? container : document.querySelector('#mobile-nav-actions');
  
  if (!navActions && !mobileNavActions) {
    // No elements found to update
    return;
  }

  // HTML templates for different states
  const signedInDesktopHTML = user => `
    <a href="/pages/account.html" class="flex items-center space-x-2 px-2 py-1 rounded-full border-2 border-transparent hover:border-[var(--color-primary)]">
      <img src="${user.avatarUrl}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover border border-[var(--color-border)]">
      <span class="text-[var(--color-text)]">${user.name}</span>
    </a>
    <a href="/wizard.html" class="bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-6 py-2 rounded-full hover:bg-[var(--color-primary-hover)]">
      Plan Your Trip
    </a>
  `;

  const signedInMobileHTML = user => `
    <a href="/pages/account.html" class="flex items-center space-x-3 mb-3 px-4 py-2 border-2 border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)]">
      <img src="${user.avatarUrl}" alt="${user.name}" class="w-10 h-10 rounded-full object-cover border border-[var(--color-border)]">
      <span class="text-[var(--color-text)]">${user.name}</span>
    </a>
    <a href="/wizard.html" class="block w-full text-center bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-4 py-2 rounded-full hover:bg-[var(--color-primary-hover)]">
      Plan Your Trip
    </a>
    <button onclick="document.dispatchEvent(new CustomEvent('signOut'))" class="block w-full text-center mt-3 px-4 py-2 border-2 border-[var(--color-border)] rounded-full text-[var(--color-text)] hover:border-[var(--color-primary)]">
      Sign Out
    </button>
  `;

  const signedOutDesktopHTML = `
    <a href="/signin.html" class="px-4 py-2 rounded-full border-2 border-transparent text-[var(--color-text)] hover:border-[var(--color-primary)]">
      Sign In
    </a>
    <a href="/wizard.html" class="bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-6 py-2 rounded-full hover:bg-[var(--color-primary-hover)]">
      Plan Your Trip
    </a>
  `;

  const signedOutMobileHTML = `
    <a href="/signin.html" class="block w-full text-center mb-3 px-4 py-2 border-2 border-[var(--color-border)] rounded-full text-[var(--color-text)] hover:border-[var(--color-primary)]">
      Sign In
    </a>
    <a href="/wizard.html" class="block w-full text-center bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-4 py-2 rounded-full hover:bg-[var(--color-primary-hover)]">
      Plan Your Trip
    </a>
  `;

  // Update the UI based on authentication state
  if (user) {
    if (navActions) navActions.innerHTML = signedInDesktopHTML(user);
    if (mobileNavActions) mobileNavActions.innerHTML = signedInMobileHTML(user);
  } else {
    if (navActions) navActions.innerHTML = signedOutDesktopHTML;
    if (mobileNavActions) mobileNavActions.innerHTML = signedOutMobileHTML;
  }
}

/**
 * Initialize authentication
 * For demo purposes, this sets up a mock user and sign-out listener
 */
export function initAuth() {
  // For demo: Toggle auth state with signOut event
  document.addEventListener('signOut', signOut);
  
  // For demo: Set mock user data if testing authentication
  // Comment out next line to start with sign-in state
  // localStorage.removeItem('user');
  
  // For demo: Uncomment to start with signed in state
  if (!isAuthenticated()) {
    localStorage.setItem('user', JSON.stringify(mockUser));
  }
  
  // Update UI based on current auth state
  updateAuthUI();
}

// Export default object with all functions
export default {
  isAuthenticated,
  getCurrentUser,
  signIn,
  signOut,
  updateAuthUI,
  initAuth
};