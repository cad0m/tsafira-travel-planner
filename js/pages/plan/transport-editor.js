/**
 * Transport Editor Module
 * Handles transport-specific functionality
 */

import { showToast } from './dom-utils.js';
import { createUniversalChangeModal } from './modals.js';
import { loadRecommendationsData } from './data-manager.js';
import { updateTransport } from './plan-state-manager.js';

/**
 * Setup transport editor
 */
export function setupTransportEditor() {
  // Setup change transport buttons
  setupChangeTransportButtons();
}

/**
 * Setup change transport buttons
 */
function setupChangeTransportButtons() {
  const changeButtons = document.querySelectorAll('.transport-card .change-btn');
  if (!changeButtons.length) return;

  // Remove existing event listeners by cloning and replacing nodes
  changeButtons.forEach(button => {
    const clone = button.cloneNode(true);
    if (button.parentNode) {
      button.parentNode.replaceChild(clone, button);
    }
  });

  // Get the fresh buttons after replacement
  const freshButtons = document.querySelectorAll('.transport-card .change-btn');

  freshButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      try {
        // Prevent default button behavior
        event.preventDefault();

        // Get transport card element
        const transportCard = button.closest('.transport-card');
        if (!transportCard) return;

        // Get current day index
        const currentDayIndex = window.appState?.currentDay - 1 || 0;

        // Get transport index
        const transportCards = Array.from(document.querySelectorAll('.transport-card'));
        const transportIndex = transportCards.indexOf(transportCard);

        // Show loading toast
        showToast('Loading alternative transport options...', 'info');

        // Load recommendations data
        const recommendationsData = await loadRecommendationsData();

        // Get alternative transport options from recommendations
        const transportOptions = recommendationsData.transport || [];

        // Create and show universal change modal
        const modal = createUniversalChangeModal('transport', transportOptions, (selectedOption) => {
          // Update transport in the state manager
          const updated = updateTransport(currentDayIndex, transportIndex, selectedOption);

          if (updated) {
            showToast(`Selected ${selectedOption.provider} as your new transport.`, 'success');

            // Update the UI to reflect the change
            updateTransportUI(transportCard, selectedOption);
          } else {
            showToast('Failed to update transport. Please try again.', 'error');
          }
        });

        modal.show();
      } catch (error) {
        console.error('Failed to load transport options:', error);
        showToast('Error loading transport options. Please try again.', 'error');
      }
    });
  });
}

/**
 * Update the UI to reflect transport changes
 * @param {HTMLElement} transportCard - The transport card element
 * @param {Object} newTransport - New transport object
 */
function updateTransportUI(transportCard, newTransport) {
  // Update provider name
  const transportNameEl = transportCard.querySelector('.transport-title');
  if (transportNameEl) {
    transportNameEl.textContent = newTransport.provider;
  }

  // Update description
  const transportDescEl = transportCard.querySelector('.transport-description');
  if (transportDescEl && newTransport.description) {
    transportDescEl.textContent = newTransport.description;
  }

  // Update price
  const transportPriceEl = transportCard.querySelector('.transport-price .price-value');
  if (transportPriceEl) {
    transportPriceEl.textContent = `$${newTransport.price}`;
  }

  // Update icon if applicable
  const transportIconEl = transportCard.querySelector('.transport-icon i');
  if (transportIconEl && newTransport.icon) {
    // Replace icon class while preserving other classes
    const currentClasses = transportIconEl.className.split(' ');
    const newClasses = currentClasses.filter(cls => !cls.startsWith('fa-')); // Remove any font awesome icon classes
    newClasses.push(`fa-solid`); // Add the solid style
    newClasses.push(newTransport.icon); // Add the new icon
    transportIconEl.className = newClasses.join(' ');
  }

  // Update details if applicable
  const detailsContainer = transportCard.querySelector('.transport-details');
  if (detailsContainer && newTransport.details && newTransport.details.length > 0) {
    // Clear existing details
    detailsContainer.innerHTML = '';

    // Add new details
    newTransport.details.forEach(detail => {
      const detailDiv = document.createElement('div');
      detailDiv.className = 'transport-detail-item';
      detailDiv.innerHTML = `<span class="detail-label">${detail.label}:</span> <span class="detail-value">${detail.value}</span>`;
      detailsContainer.appendChild(detailDiv);
    });
  }

  // Update summary costs
  updateTransportSummaryCosts();
}

/**
 * Update transport summary costs in the UI
 */
function updateTransportSummaryCosts() {
  const transportCards = document.querySelectorAll('.transport-card');
  let totalCost = 0;

  // Calculate total from each transport card
  transportCards.forEach(card => {
    const priceEl = card.querySelector('.transport-price .price-value');
    if (priceEl) {
      const price = parseFloat(priceEl.textContent.replace('$', ''));
      if (!isNaN(price)) {
        totalCost += price;
      }
    }
  });

  // Update total in summary
  const totalEl = document.querySelector('.summary-items .transport-total .summary-value');
  if (totalEl) {
    totalEl.textContent = `$${totalCost.toFixed(2)}`;
  }
}

/**
 * Add change buttons to transport cards
 * This function should be called after the transport cards are rendered
 */
export function addChangeButtonsToTransportCards() {
  const transportCards = document.querySelectorAll('.transport-card');

  transportCards.forEach(card => {
    // Check if button already exists
    if (card.querySelector('.change-btn')) return;

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'transport-card-actions';

    // Create change button
    const changeButton = document.createElement('button');
    changeButton.className = 'btn btn-outline change-btn';
    changeButton.innerHTML = '<i class="fa-solid fa-exchange-alt"></i> Change Transport';

    // Append button to container
    buttonContainer.appendChild(changeButton);

    // Append container to card
    card.appendChild(buttonContainer);
  });

  // Setup event listeners for the newly added buttons
  setupChangeTransportButtons();
}