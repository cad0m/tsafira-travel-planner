/**
 * Lodging Editor Module
 * Handles lodging-specific functionality
 */

import { showToast } from './dom-utils.js';
import {
  createAmenitiesModal,
  createUniversalChangeModal,
  createMapModal
} from './modals.js';
import { loadRecommendationsData } from './data-manager.js';
import { updateLodging } from './plan-state-manager.js';

/**
 * Setup lodging editor
 */
export function setupLodgingEditor() {
  // Setup view all amenities button
  setupViewAllAmenitiesButton();

  // Setup change stay button
  setupChangeStayButton();

  // Setup map functionality
  setupMapFunctionality();
}

/**
 * Setup view all amenities button
 */
function setupViewAllAmenitiesButton() {
  const viewAllButton = document.querySelector('.lodging-amenities .btn-link');
  if (!viewAllButton) return;

  viewAllButton.addEventListener('click', () => {
    const modal = createAmenitiesModal();
    modal.show();
  });
}

/**
 * Setup change stay button
 */
function setupChangeStayButton() {
  const changeStayButton = document.querySelector('.lodging-cost .btn');
  if (!changeStayButton) return;

  // Remove existing event listener by cloning and replacing
  const clone = changeStayButton.cloneNode(true);
  if (changeStayButton.parentNode) {
    changeStayButton.parentNode.replaceChild(clone, changeStayButton);
  }

  // Add event listener to the fresh button
  const freshButton = document.querySelector('.lodging-cost .btn');
  if (!freshButton) return;

  freshButton.addEventListener('click', async () => {
    try {
      // Show loading toast
      showToast('Loading alternative lodging options...', 'info');

      // Load recommendations data
      const recommendationsData = await loadRecommendationsData();

      // Get alternative hotels from recommendations
      const hotelOptions = recommendationsData.hotels || [];

      // Get current day index
      const currentDayIndex = window.appState?.currentDay - 1 || 0;

      // Create and show universal change modal
      const modal = createUniversalChangeModal('lodging', hotelOptions, (selectedOption) => {
        // Update the lodging in the state manager
        const updated = updateLodging(currentDayIndex, selectedOption);

        if (updated) {
          showToast(`Selected ${selectedOption.name} as your new lodging.`, 'success');

          // Update the UI to reflect the change
          updateLodgingUI(selectedOption);
        } else {
          showToast('Failed to update lodging. Please try again.', 'error');
        }
      });

      modal.show();
    } catch (error) {
      console.error('Failed to load hotel options:', error);
      showToast('Error loading hotel options. Please try again.', 'error');
    }
  });
}

/**
 * Update the UI to reflect lodging changes
 * @param {Object} newLodging - New lodging object
 */
function updateLodgingUI(newLodging) {
  // Update the hotel name in the UI
  const hotelNameEl = document.querySelector('.lodging-info h2');
  if (hotelNameEl) {
    hotelNameEl.textContent = newLodging.name;
  }

  // Update the location in the UI
  const locationEl = document.querySelector('.lodging-info .location');
  if (locationEl) {
    locationEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${newLodging.location}`;
  }

  // Update the hotel image
  const hotelImageEl = document.querySelector('.lodging-banner img');
  if (hotelImageEl) {
    hotelImageEl.src = newLodging.image;
    hotelImageEl.alt = newLodging.name;
  }

  // Update the hotel rating
  const ratingScoreEl = document.querySelector('.rating-score span:first-child');
  const ratingDescEl = document.querySelector('.rating-score span:last-child');
  if (ratingScoreEl && newLodging.rating) {
    ratingScoreEl.textContent = newLodging.rating.score;
  }
  if (ratingDescEl && newLodging.rating) {
    ratingDescEl.textContent = newLodging.rating.description;
  }

  // Update the cost
  const costItemEl = document.querySelector('.cost-item:first-child span:last-child');
  const costTotalEl = document.querySelector('.cost-total span:last-child');
  if (costItemEl) {
    // Extract the number of nights from the text
    const nightsMatch = document.querySelector('.cost-item:first-child span:first-child').textContent.match(/(\d+) nights/);
    const nights = nightsMatch ? parseInt(nightsMatch[1]) : 7;

    costItemEl.textContent = `$${(newLodging.price * nights).toLocaleString()}`;
  }
  if (costTotalEl) {
    // Calculate total (price * nights * 1.1 for 10% tax)
    const nightsMatch = document.querySelector('.cost-item:first-child span:first-child').textContent.match(/(\d+) nights/);
    const nights = nightsMatch ? parseInt(nightsMatch[1]) : 7;

    const total = Math.round(newLodging.price * nights * 1.1);
    costTotalEl.textContent = `$${total.toLocaleString()}`;
  }

  // Note: This is a simplified UI update and would need to be expanded in a real application
  // to update all the necessary elements.
}

/**
 * Setup map functionality
 */
function setupMapFunctionality() {
  const fullscreenMapBtn = document.getElementById('fullscreen-map-btn');
  if (!fullscreenMapBtn) return;

  fullscreenMapBtn.addEventListener('click', () => {
    const modal = createMapModal();
    modal.show();
  });
}