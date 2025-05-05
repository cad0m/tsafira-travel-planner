/**
 * Meals Editor Module
 * Handles meal-specific functionality
 */

import { showToast } from './dom-utils.js';
import { createUniversalChangeModal } from './modals.js';
import { loadRecommendationsData } from './data-manager.js';
import { updateMeal } from './plan-state-manager.js';

/**
 * Setup meals editor
 */
export function setupMealsEditor() {
  // Setup change restaurant buttons
  setupChangeRestaurantButtons();
}

/**
 * Setup change restaurant buttons
 */
function setupChangeRestaurantButtons() {
  const changeButtons = document.querySelectorAll('.meal-card .change-btn');
  if (!changeButtons.length) return;

  // Remove existing event listeners by cloning and replacing nodes
  changeButtons.forEach(button => {
    const clone = button.cloneNode(true);
    if (button.parentNode) {
      button.parentNode.replaceChild(clone, button);
    }
  });

  // Get the fresh buttons after replacement
  const freshButtons = document.querySelectorAll('.meal-card .change-btn');

  freshButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      try {
        // Prevent default button behavior
        event.preventDefault();

        // Get meal card element
        const mealCard = button.closest('.meal-card');
        if (!mealCard) return;

        // Get current day index
        const currentDayIndex = window.appState?.currentDay - 1 || 0;

        // Get meal index
        const mealCards = Array.from(document.querySelectorAll('.meal-card'));
        const mealIndex = mealCards.indexOf(mealCard);

        // Show loading toast
        showToast('Loading alternative restaurant options...', 'info');

        // Load recommendations data
        const recommendationsData = await loadRecommendationsData();

        // Get alternative restaurants from recommendations
        const restaurantOptions = recommendationsData.restaurants || [];

        // Create and show universal change modal
        const modal = createUniversalChangeModal('restaurant', restaurantOptions, (selectedOption) => {
          // Update meal in the state manager
          const updated = updateMeal(currentDayIndex, mealIndex, selectedOption);

          if (updated) {
            showToast(`Selected ${selectedOption.name} as your new restaurant.`, 'success');

            // Update the UI to reflect the change
            updateMealUI(mealCard, selectedOption);
          } else {
            showToast('Failed to update meal. Please try again.', 'error');
          }
        });

        modal.show();
      } catch (error) {
        console.error('Failed to load restaurant options:', error);
        showToast('Error loading restaurant options. Please try again.', 'error');
      }
    });
  });
}

/**
 * Update the UI to reflect meal changes
 * @param {HTMLElement} mealCard - The meal card element
 * @param {Object} newMeal - New meal object
 */
function updateMealUI(mealCard, newMeal) {
  // Update restaurant name
  const restaurantNameEl = mealCard.querySelector('.meal-name');
  if (restaurantNameEl) {
    restaurantNameEl.textContent = newMeal.name;
  }

  // Update meal type/description
  const mealTypeEl = mealCard.querySelector('.meal-type');
  if (mealTypeEl) {
    mealTypeEl.textContent = newMeal.type;
  }

  // Update meal details
  const mealDetailsEl = mealCard.querySelector('.meal-details');
  if (mealDetailsEl) {
    mealDetailsEl.textContent = newMeal.description;
  }

  // Update meal image if it exists
  const mealImageEl = mealCard.querySelector('.meal-image img');
  if (mealImageEl && newMeal.image) {
    mealImageEl.src = newMeal.image;
    mealImageEl.alt = newMeal.name;
  }

  // Update price
  const mealPriceEl = mealCard.querySelector('.meal-price .price');
  if (mealPriceEl) {
    mealPriceEl.textContent = `$${newMeal.price}`;
  }

  // Update tags if they exist
  const tagsContainer = mealCard.querySelector('.meal-tags');
  if (tagsContainer && newMeal.tags && newMeal.tags.length > 0) {
    tagsContainer.innerHTML = ''; // Clear existing tags

    newMeal.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'meal-tag';
      tagSpan.innerHTML = `<i class="fa-solid ${tag.icon}"></i> ${tag.description}`;
      tagsContainer.appendChild(tagSpan);
    });
  }

  // Update daily meal summary costs
  updateMealSummaryCosts();
}

/**
 * Update meal summary costs in the UI
 */
function updateMealSummaryCosts() {
  const mealCards = document.querySelectorAll('.meal-card');
  let totalCost = 0;

  // Calculate total from each meal card
  mealCards.forEach(card => {
    const priceEl = card.querySelector('.meal-price .price');
    if (priceEl) {
      const price = parseFloat(priceEl.textContent.replace('$', ''));
      if (!isNaN(price)) {
        totalCost += price;
      }
    }
  });

  // Update total in summary
  const totalEl = document.querySelector('.summary-items .summary-total .summary-value');
  if (totalEl) {
    totalEl.textContent = `$${totalCost.toFixed(2)}`;
  }

  // Update budget display
  const budgetDisplay = document.querySelector('.meal-budget span');
  if (budgetDisplay) {
    budgetDisplay.textContent = `$${totalCost.toFixed(2)} meal budget for today`;
  }
}

/**
 * Add change buttons to meal cards
 * This function should be called after the meal cards are rendered
 */
export function addChangeButtonsToMealCards() {
  const mealCards = document.querySelectorAll('.meal-card');

  mealCards.forEach(card => {
    // Check if button already exists
    if (card.querySelector('.change-btn')) return;

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'meal-card-actions';

    // Create change button
    const changeButton = document.createElement('button');
    changeButton.className = 'btn btn-outline change-btn';
    changeButton.innerHTML = '<i class="fa-solid fa-exchange-alt"></i> Change Restaurant';

    // Append button to container
    buttonContainer.appendChild(changeButton);

    // Append container to card
    card.appendChild(buttonContainer);
  });

  // Setup event listeners for the newly added buttons
  setupChangeRestaurantButtons();
}