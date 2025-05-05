/**
 * Main Application Module
 * Initializes the application and coordinates between modules
 */

import {
  loadPlanData,
  loadRecommendationsData
} from './data-manager.js';

import {
  getCurrentDay,
  getCurrentTab,
  getDarkModePreference,
  saveCurrentDay,
  saveCurrentTab
} from './storage-utils.js';

import {
  setupTabNavigation,
  setupDarkModeToggle,
  setupDaySelector,
  renderDayDetail,
  renderBudgetSummary,
  renderWeatherSummary,
  renderLodgingDay,
  renderMealDay,
  renderTransportDay,
  renderRecommendations,
  renderVideos,
  setupFeedbackForm
} from './plan-ui.js';

import {
  setupEnhancedDaySelector,
  renderEnhancedDayDetail,
  initializeDayByDayEnhancements
} from './day-by-day.js';

import { setupInteractions } from './plan-interactions.js';
import { showErrorMessage } from './dom-utils.js';
import { setupLodgingEditor } from './lodging-editor.js';
import { setupMealsEditor, addChangeButtonsToMealCards } from './meals-editor.js';
import { setupTransportEditor, addChangeButtonsToTransportCards } from './transport-editor.js';
import {
  initializePlanState,
  updateTripName,
  getCurrentPlanData,
  updateAppStateWithCurrentPlan,
  ensureCurrentDataIsUsed
} from './plan-state-manager.js';

// Global state - expose to window for easier access by other modules
const appState = {
  planData: null,
  recommendationsData: null,
  currentDay: 1,
  currentTab: 'day-by-day',
  isDarkMode: false,
  isLoading: true
};

// Make appState available globally
window.appState = appState;

/**
 * Initialize the application
 */
export async function setupItinerary() {
  try {
    // Show loading state
    showLoadingState(true);

    // Load preferences
    appState.currentDay = getCurrentDay();
    appState.currentTab = getCurrentTab();
    appState.isDarkMode = getDarkModePreference();

    // Apply dark mode if needed
    if (appState.isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Initialize the plan state manager first to ensure we load any saved data
    await initializePlanState();

    // Get the current plan data from state manager
    const currentPlanData = getCurrentPlanData();

    // Load data - use the current plan data if available
    const planData = currentPlanData || await loadPlanData();
    let recommendationsData;

    try {
      recommendationsData = await loadRecommendationsData();
    } catch (error) {
      console.warn('Failed to load recommendations, continuing without them');
      recommendationsData = { activities: [], videos: [] };
    }

    // Update app state
    appState.planData = planData;
    appState.recommendationsData = recommendationsData;
    appState.isLoading = false;

    // Initialize UI
    initializeUI();

    // Setup component editors
    setupLodgingEditor();
    setupMealsEditor();
    setupTransportEditor();

    // We're removing the initial call to add change buttons here
    // since we'll set up the listeners every time the cards are rendered
    // The buttons will be auto-attached by the render functions

    // Setup interactions
    setupInteractions(appState);

    // Hide loading state
    showLoadingState(false);

    // Set up a global event listener for tab changes to ensure buttons work after tab switching
    document.addEventListener('tabChanged', (event) => {
      if (event.detail && event.detail.tabId) {
        // Save the current tab
        saveCurrentTab(event.detail.tabId);
        appState.currentTab = event.detail.tabId;
      }

      // Make sure we're using the current plan data
      ensureCurrentDataIsUsed();

      // Update appState with current plan data
      updateAppStateWithCurrentPlan(appState);

      // Re-render the content for the selected tab
      const currentDayIndex = appState.currentDay - 1;
      switch (appState.currentTab) {
        case 'lodging':
          renderLodgingDay(appState.planData.days[currentDayIndex]);
          break;
        case 'meals':
          renderMealDay(appState.planData.days[currentDayIndex], appState.planData.regional_info);
          break;
        case 'transport':
          renderTransportDay(appState.planData.days[currentDayIndex], appState.planData.regional_info);
          break;
        case 'day-by-day':
          renderDayDetail(appState.planData.days[currentDayIndex]);
          break;
      }

      // Refresh editors on tab change
      setupLodgingEditor();
      setupMealsEditor();
      setupTransportEditor();
    });

    // Set up a global event listener for day changes
    document.addEventListener('dayChanged', (event) => {
      if (event.detail && event.detail.dayNumber) {
        // Save the current day
        saveCurrentDay(event.detail.dayNumber);
        appState.currentDay = event.detail.dayNumber;
      }

      // Make sure we're using the current plan data
      ensureCurrentDataIsUsed();

      // Update appState with current plan data
      updateAppStateWithCurrentPlan(appState);

      // Re-render the content for the selected day
      const currentDayIndex = appState.currentDay - 1;

      // Render content based on the current tab
      switch (appState.currentTab) {
        case 'lodging':
          renderLodgingDay(appState.planData.days[currentDayIndex]);
          break;
        case 'meals':
          renderMealDay(appState.planData.days[currentDayIndex], appState.planData.regional_info);
          break;
        case 'transport':
          renderTransportDay(appState.planData.days[currentDayIndex], appState.planData.regional_info);
          break;
        case 'day-by-day':
          renderDayDetail(appState.planData.days[currentDayIndex]);
          break;
      }

      // Refresh editors on day change
      setupLodgingEditor();
      setupMealsEditor();
      setupTransportEditor();
    });

    // Setup itinerary name editing to update state
    setupItineraryNameEditing();

    // Return the app state for external use
    return appState;
  } catch (error) {
    console.error('Failed to initialize application:', error);
    showLoadingState(false);
    showErrorState(error);
    throw error;
  }
}

/**
 * Setup itinerary name editing to update state
 */
function setupItineraryNameEditing() {
  const itineraryName = document.querySelector('.itinerary-name');
  if (!itineraryName) return;

  // Add event listener for blur (lose focus) event
  itineraryName.addEventListener('blur', () => {
    if (itineraryName.value.trim() !== '') {
      // Update the trip name in the state manager
      updateTripName(itineraryName.value);
    }
  });

  // Add event listener for Enter key
  itineraryName.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      itineraryName.blur(); // Trigger blur event
    }
  });
}

/**
 * Initialize the UI components
 */
function initializeUI() {
  // Ensure we're using the current plan data
  ensureCurrentDataIsUsed();

  // Update app state with current plan data
  updateAppStateWithCurrentPlan(appState);

  // Setup tab navigation
  setupTabNavigation(appState.currentTab);

  // Setup dark mode toggle
  setupDarkModeToggle(appState.isDarkMode);

  // Setup day selector for other tabs (lodging, meals, transport)
  setupDaySelector(appState.planData.days, appState.currentDay);

  // Setup enhanced day selector for day-by-day tab
  setupEnhancedDaySelector(appState.planData.days, appState.currentDay);

  // Render budget summary
  renderBudgetSummary(appState.planData.trip.budget);

  // Render weather summary
  renderWeatherSummary(appState.planData.days);

  // Render current day detail
  const currentDayIndex = appState.currentDay - 1;
  if (appState.planData.days && appState.planData.days.length > currentDayIndex) {
    // Use enhanced day detail for day-by-day tab
    renderEnhancedDayDetail(appState.planData.days[currentDayIndex]);

    // Initialize day-by-day enhancements
    initializeDayByDayEnhancements();

    // Render lodging day
    renderLodgingDay(appState.planData.days[currentDayIndex]);

    // Render meal day
    renderMealDay(appState.planData.days[currentDayIndex], appState.planData.regional_info);

    // Render transport day
    renderTransportDay(appState.planData.days[currentDayIndex], appState.planData.regional_info);
  }

  // Render recommendations
  if (appState.recommendationsData && appState.recommendationsData.activities) {
    renderRecommendations(appState.recommendationsData.activities);
  }

  // Render videos
  if (appState.recommendationsData && appState.recommendationsData.videos) {
    renderVideos(appState.recommendationsData.videos);
  }

  // Setup feedback form
  setupFeedbackForm();

  // Update trip cost in action bar
  if (appState.planData.trip && appState.planData.trip.budget) {
    const tripCostElement = document.querySelector('.trip-cost div:last-child');
    if (tripCostElement) {
      tripCostElement.textContent = `$${appState.planData.trip.budget.total_allocated.toLocaleString()}`;
    }
  }

  // Update itinerary name to reflect the current plan data
  const itineraryNameEl = document.querySelector('.itinerary-name');
  if (itineraryNameEl && appState.planData.trip && appState.planData.trip.name) {
    itineraryNameEl.value = appState.planData.trip.name;
  }
}

/**
 * Show or hide loading state
 * @param {boolean} isLoading - Whether the app is loading
 */
function showLoadingState(isLoading) {
  if (isLoading) {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-overlay';
    loadingElement.innerHTML = `
      <div class="loading-spinner">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <p>Loading your itinerary...</p>
      </div>
    `;
    document.body.appendChild(loadingElement);

    // Add styles for loading overlay
    const style = document.createElement('style');
    style.textContent = `
      #loading-overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      .dark #loading-overlay {
        background-color: rgba(31, 41, 55, 0.9);
      }
      .loading-spinner {
        text-align: center;
      }
      .loading-spinner i {
        font-size: 3rem;
        color: var(--color-primary);
        margin-bottom: 1rem;
      }
      .loading-spinner p {
        font-size: 1.25rem;
        font-weight: 500;
      }

      /* Meal and Transport Card Styles */
      .meal-card, .transport-card {
        position: relative;
        padding-bottom: 3.5rem;
      }

      .meal-card-actions, .transport-card-actions {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: var(--spacing-4);
        width: 100%;
        display: flex;
        justify-content: flex-end;
        background: linear-gradient(to top, rgba(255,255,255,0.9) 60%, rgba(255,255,255,0));
      }

      .dark .meal-card-actions, .dark .transport-card-actions {
        background: linear-gradient(to top, rgba(31, 41, 55, 0.9) 60%, rgba(31, 41, 55, 0));
      }

      .change-btn {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-2);
        transition: all var(--transition-fast);
      }

      .change-btn:hover {
        background-color: var(--color-primary);
        color: white;
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(style);
  } else {
    const loadingElement = document.getElementById('loading-overlay');
    if (loadingElement) {
      loadingElement.remove();
    }
  }
}

/**
 * Show error state when initialization fails
 * @param {Error} error - The error that occurred
 */
function showErrorState(error) {
  const errorElement = document.createElement('div');
  errorElement.id = 'error-overlay';
  errorElement.innerHTML = `
    <div class="error-container">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <h2>Oops! Something went wrong</h2>
      <p>${error ? error.message : "We couldn't load your itinerary. Please try refreshing the page."}</p>
      <button id="retry-button" class="btn btn-primary">Retry</button>
    </div>
  `;
  document.body.appendChild(errorElement);

  // Add styles for error overlay
  const style = document.createElement('style');
  style.textContent = `
    #error-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .dark #error-overlay {
      background-color: rgba(31, 41, 55, 0.9);
    }
    .error-container {
      text-align: center;
      background-color: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      max-width: 90%;
      width: 30rem;
    }
    .dark .error-container {
      background-color: var(--color-gray-100);
      color: var(--color-gray-800);
    }
    .error-container i {
      font-size: 3rem;
      color: var(--color-error);
      margin-bottom: 1rem;
    }
    .error-container h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    .error-container p {
      margin-bottom: 1.5rem;
      color: var(--color-gray-600);
    }
    .dark .error-container p {
      color: var(--color-gray-400);
    }
    #retry-button {
      padding: 0.75rem 1.5rem;
    }
  `;
  document.head.appendChild(style);

  // Add retry button event listener
  document.getElementById('retry-button').addEventListener('click', () => {
    errorElement.remove();
    setupItinerary();
  });
}