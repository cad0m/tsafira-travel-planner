/**
 * Interactions Module
 * Handles user interactions and events
 */

import { showToast } from './dom-utils.js';
import {
  createShareModal,
  createLocalGuideModal
} from './modals.js';
import {
  savePlanState,
  hasUnsavedChanges,
  sendPlanToBackend
} from './plan-state-manager.js';

/**
 * Setup interactions
 * @param {Object} appState - Application state
 */
export function setupInteractions(appState) {
  // Setup scroll effects
  setupScrollEffects();

  // Setup action bar interactions
  setupActionBarInteractions();

  // Setup itinerary name editing
  setupItineraryNameEditing();

  // Setup export PDF functionality
  setupExportPDF();

  // Setup share functionality
  setupShareFunctionality();

  // Setup save functionality
  setupSaveFunctionality();

  // Setup find guide functionality
  setupFindGuideFunctionality();

  // Setup beforeunload event to warn about unsaved changes
  setupUnsavedChangesWarning();
}

/**
 * Setup scroll effects
 */
function setupScrollEffects() {
  const header = document.getElementById('header');
  const itineraryNav = document.querySelector('.itinerary-nav');

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Header effect
    if (currentScrollY > 10) {
      if (header) header.classList.add('scrolled');
    } else {
      if (header) header.classList.remove('scrolled');
    }

    // Itinerary nav effect
    if (currentScrollY > 200) {
      if (itineraryNav) itineraryNav.classList.add('scrolled');
    } else {
      if (itineraryNav) itineraryNav.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  });
}

/**
 * Setup action bar interactions
 */
function setupActionBarInteractions() {
  const actionBar = document.getElementById('action-bar');
  if (!actionBar) return;

  // Show/hide action bar on scroll
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      // Scrolling down
      actionBar.style.transform = 'translateY(100%)';
    } else {
      // Scrolling up
      actionBar.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  });

  // Show action bar when near the bottom of the page
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.body.offsetHeight;

    if (pageHeight - scrollPosition < 300) {
      actionBar.style.transform = 'translateY(0)';
    }
  });

  // Show action bar when there are unsaved changes
  const checkUnsavedChanges = () => {
    if (hasUnsavedChanges()) {
      actionBar.style.transform = 'translateY(0)';

      // Add visual indicator for unsaved changes
      actionBar.classList.add('has-unsaved');
    } else {
      actionBar.classList.remove('has-unsaved');
    }
  };

  // Check periodically for unsaved changes
  setInterval(checkUnsavedChanges, 2000);
}

/**
 * Setup itinerary name editing
 */
function setupItineraryNameEditing() {
  const itineraryName = document.querySelector('.itinerary-name');
  if (!itineraryName) return;

  // Save original value
  let originalValue = itineraryName.value;

  // Focus event
  itineraryName.addEventListener('focus', () => {
    originalValue = itineraryName.value;
  });

  // Blur event
  itineraryName.addEventListener('blur', () => {
    if (itineraryName.value.trim() === '') {
      itineraryName.value = originalValue;
    } else if (itineraryName.value !== originalValue) {
      // Save new value (in a real app, this would update the server)
      showToast('Itinerary name updated');

      // Save original value for future comparisons
      originalValue = itineraryName.value;
    }
  });

  // Enter key event
  itineraryName.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      itineraryName.blur();
    }
  });
}

/**
 * Setup export PDF functionality
 */
function setupExportPDF() {
  const exportButtons = document.querySelectorAll('[aria-label="Export to PDF"]');
  if (!exportButtons.length) return;

  exportButtons.forEach(button => {
    button.addEventListener('click', () => {
      // In a real app, this would generate and download a PDF
      showToast('Exporting PDF...');

      // Simulate PDF generation
      setTimeout(() => {
        showToast('PDF exported successfully!');
      }, 2000);
    });
  });
}

/**
 * Setup share functionality
 */
function setupShareFunctionality() {
  const shareButton = document.querySelector('[aria-label="Share itinerary"]');
  if (!shareButton) return;

  shareButton.addEventListener('click', () => {
    const modal = createShareModal();
    modal.show();
  });
}

/**
 * Setup save functionality
 */
function setupSaveFunctionality() {
  const saveButtons = document.querySelectorAll('[aria-label="Save itinerary"]');
  if (!saveButtons.length) return;

  // Remove existing event listeners by cloning and replacing
  saveButtons.forEach(button => {
    const clone = button.cloneNode(true);
    if (button.parentNode) {
      button.parentNode.replaceChild(clone, button);
    }
  });

  // Get fresh buttons after replacement
  const freshButtons = document.querySelectorAll('[aria-label="Save itinerary"]');

  freshButtons.forEach(button => {
    button.addEventListener('click', async () => {
      try {
        // Use the plan state manager to save the current state
        const savedData = savePlanState();

        if (savedData) {
          // If we have pending changes, visually update the save button
          button.classList.remove('has-unsaved');

          // If we want to send to backend as well, we can do it here
          if (window.SEND_TO_BACKEND_ENABLED) {
            try {
              // Show sending toast
              showToast('Sending itinerary to server...', 'info');

              // Send plan to backend
              const response = await sendPlanToBackend();

              if (response.success) {
                showToast('Itinerary saved and synced with server!', 'success');
              }
            } catch (backendError) {
              console.error('Failed to save to server:', backendError);
              showToast('Failed to sync with server, but saved locally.', 'warning');
            }
          }
        }
      } catch (error) {
        console.error('Error saving itinerary:', error);
        showToast('Error saving itinerary. Please try again.', 'error');
      }
    });
  });

  // Add styles for unsaved changes indicator
  const style = document.createElement('style');
  style.textContent = `
    .action-bar.has-unsaved [aria-label="Save itinerary"] {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
        background-color: var(--color-warning);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Setup find guide functionality
 */
function setupFindGuideFunctionality() {
  const findGuideButton = document.querySelector('[aria-label="Find local guide"]');
  if (!findGuideButton) return;

  findGuideButton.addEventListener('click', () => {
    const modal = createLocalGuideModal();
    modal.show();
  });
}

/**
 * Setup warning for unsaved changes when navigating away
 */
function setupUnsavedChangesWarning() {
  window.addEventListener('beforeunload', (event) => {
    if (hasUnsavedChanges()) {
      // Standard way of showing confirm dialog when leaving page with unsaved changes
      const message = 'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = message; // Standard for most browsers
      return message; // For older browsers
    }
  });
}