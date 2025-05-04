/**
 * Main JavaScript file for the Guides page
 * Uses the core, utils, and ui.js files without modifying them
 */
import { initUI, initTheme } from '../../ui.js';
import { initPartials } from '../../core/loader.js';
import * as auth from '../../core/auth.js';
import { GuidesManager } from './guides.js';
import { ModalManager } from './modal.js';

// Apply initial theme immediately to prevent flash of wrong theme
(function() {
  // Use the initTheme function from ui.js to ensure consistent theme handling
  initTheme();
})();

// Initialize UI components
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing guides page...');

  // Initialize UI components from ui.js
  initUI();

  // Initialize authentication
  auth.initAuth();

  // Initialize partials loading (header and footer)
  initPartials();

  // Listen for partials loaded to update auth state
  document.addEventListener('allPartialsLoaded', () => {
    // Sync auth state after partials are loaded
    syncAuthState();
  });

  // Create instances of our managers
  const guidesManager = new GuidesManager();
  const modalManager = new ModalManager();

  // Initialize the modal manager first
  modalManager.init();

  // Initialize the guides manager
  guidesManager.init()
    .then(() => {
      // After guides are loaded, update the modal manager with the city name
      const cityName = guidesManager.getCity();
      modalManager.setCity(cityName);

      // Set up click event delegation for guide cards
      document.getElementById('guides-list').addEventListener('click', (event) => {
        const card = event.target.closest('.guide-card');
        if (card) {
          const guideId = card.dataset.guideId;
          const guide = guidesManager.getGuideById(guideId);
          if (guide) {
            modalManager.openModal(guide);
          }
        }
      });
    })
    .catch(error => {
      console.error('Failed to initialize guides:', error);
    });

  // Handle auth state changes
  document.addEventListener('authStateChanged', () => {
    syncAuthState();
  });

  // Update the CTA button when partials are loaded
  document.addEventListener('allPartialsLoaded', () => {
    syncAuthState();
  });

  // Initialize the auth CTA button
  syncAuthState();
});

/**
 * Synchronizes the authentication state across the entire page
 * This only updates the CTA section without modifying the header
 */
function syncAuthState() {
  // We're not modifying the header buttons anymore
  // Just update the CTA button based on auth state
  updateAuthCTAButton();
}

/**
 * Updates the CTA section auth button based on authentication state
 * This only affects the CTA section, not the header
 */
function updateAuthCTAButton() {
  const authCTAButton = document.getElementById('auth-cta-button');
  if (!authCTAButton) return;

  const isAuthenticated = auth.isAuthenticated();

  if (isAuthenticated) {
    const user = auth.getCurrentUser();
    // User is authenticated, show avatar
    authCTAButton.innerHTML = `
      <a href="../account.html" class="cta-account-btn">
        <img src="${user.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=f97316&color=fff'}" alt="${user.name}">
        <span>My Account</span>
      </a>
    `;
  } else {
    // User is not authenticated, show sign in button
    authCTAButton.innerHTML = `
      <a href="../signin.html" class="cta-btn">
        <i class="fa-solid fa-user"></i> Sign In
      </a>
    `;
  }

  // Show the button
  authCTAButton.classList.remove('hidden');
}
