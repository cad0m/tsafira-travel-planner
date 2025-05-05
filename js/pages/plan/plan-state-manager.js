/**
 * Plan State Manager
 * Manages the state of the travel plan including change tracking and saving
 */

import { showToast } from './dom-utils.js';
import { loadPlanData, updateCachedData } from './data-manager.js';

// State management structure
const state = {
  originalPlan: null,  // Original plan.json (never modified)
  currentPlan: null,   // Working copy that gets updated with changes
  changeLog: [],       // Array to track all changes made
  pendingChanges: [],  // Array to track changes since last save
  lastSaveTimestamp: null, // Timestamp of last save
  isSaved: true        // Whether the current state has been saved
};

/**
 * Initialize the state manager with data
 * @returns {Promise<Object>} - The initialized state
 */
export async function initializePlanState() {
  try {
    // Check if we have saved plan data in localStorage
    const savedPlan = loadSavedPlanState();

    if (savedPlan) {
      console.log('Using saved plan data from localStorage');
      return state;
    }

    // If no saved plan, load plan data from JSON file
    const planData = await loadPlanData(true); // Force refresh to ensure we have the latest

    // Store as original plan
    state.originalPlan = JSON.parse(JSON.stringify(planData)); // Deep clone

    // Create working copy
    state.currentPlan = JSON.parse(JSON.stringify(planData)); // Deep clone

    // Reset change log
    state.changeLog = [];
    state.pendingChanges = [];
    state.lastSaveTimestamp = null;
    state.isSaved = true;

    // Update the cached data to ensure UI components use the current plan
    updateCachedData('plan', state.currentPlan);

    return state;
  } catch (error) {
    console.error('Failed to initialize plan state:', error);
    showToast('Error loading plan data. Please try again.', 'error');
    throw error;
  }
}

/**
 * Update trip name in the plan
 * @param {string} newName - New trip name
 */
export function updateTripName(newName) {
  if (!state.currentPlan || !newName.trim()) return;

  const oldName = state.currentPlan.trip.name;

  // Only update if actually changed
  if (oldName === newName) return;

  // Update the current plan
  state.currentPlan.trip.name = newName;

  // Log the change
  addPendingChange({
    type: 'trip_name',
    timestamp: new Date().toISOString(),
    oldValue: oldName,
    newValue: newName
  });

  // Mark as unsaved
  state.isSaved = false;

  // Update the cached data to ensure UI components use the current plan
  updateCachedData('plan', state.currentPlan);

  // Return true to indicate successful update
  return true;
}

/**
 * Update lodging in the plan
 * @param {number} dayIndex - Index of the day to update (0-based)
 * @param {Object} newLodging - New lodging object
 */
export function updateLodging(dayIndex, newLodging) {
  if (!state.currentPlan || !state.currentPlan.days || dayIndex < 0 ||
      dayIndex >= state.currentPlan.days.length || !newLodging) {
    return false;
  }

  const currentDay = state.currentPlan.days[dayIndex];
  const oldLodging = currentDay.lodging;

  // Log the change before updating
  addPendingChange({
    type: 'lodging',
    timestamp: new Date().toISOString(),
    dayNumber: currentDay.day_number,
    oldValue: {
      name: oldLodging.name,
      location: oldLodging.location
    },
    newValue: {
      name: newLodging.name,
      location: newLodging.location
    }
  });

  // Update the lodging in the current plan
  // Adapt the hotel object from recommendations to the plan.json structure
  currentDay.lodging = {
    name: newLodging.name,
    location: newLodging.location,
    address: newLodging.location_details?.description || newLodging.location,
    check_in: currentDay.lodging.check_in,
    check_out: currentDay.lodging.check_out,
    confirmation_number: `${newLodging.id}-${Date.now()}`,
    phone: "+212 5XX XXX XXX", // Placeholder
    email: `reservations@${newLodging.name.toLowerCase().replace(/\s+/g, '')}.com`, // Placeholder
    image: newLodging.image,
    rating: newLodging.rating,
    room_details: currentDay.lodging.room_details,
    amenities: newLodging.amenities.map(amenity => ({
      name: amenity.name,
      icon: amenity.icon
    })),
    location_details: {
      description: newLodging.location_details?.description || "",
      points: newLodging.location_details?.points.map(point => ({
        icon: point.icon,
        text: point.text
      })) || [],
      map_coordinates: {
        latitude: newLodging.location_details?.coordinates?.lat || 0,
        longitude: newLodging.location_details?.coordinates?.lng || 0
      }
    },
    costs: {
      currency: "USD",
      nightly: newLodging.price,
      nights: currentDay.lodging.costs.nights,
      taxes: Math.round(newLodging.price * 0.1 * currentDay.lodging.costs.nights), // 10% tax as example
      total: Math.round(newLodging.price * currentDay.lodging.costs.nights * 1.1) // price * nights * (1 + tax rate)
    },
    cancellation: `Free cancellation until ${getFormattedDate(-7, currentDay.date)}` // 7 days before
  };

  // Mark as unsaved
  state.isSaved = false;

  // Update the cached data to ensure UI components use the current plan
  updateCachedData('plan', state.currentPlan);

  return true;
}

/**
 * Update meal in the plan
 * @param {number} dayIndex - Index of the day to update (0-based)
 * @param {number} mealIndex - Index of the meal to update
 * @param {Object} newMeal - New meal object from recommendations
 */
export function updateMeal(dayIndex, mealIndex, newMeal) {
  if (!state.currentPlan || !state.currentPlan.days || dayIndex < 0 ||
      dayIndex >= state.currentPlan.days.length) {
    return false;
  }

  const currentDay = state.currentPlan.days[dayIndex];

  if (!currentDay.meals || mealIndex < 0 || mealIndex >= currentDay.meals.length || !newMeal) {
    return false;
  }

  const oldMeal = currentDay.meals[mealIndex];

  // Log the change
  addPendingChange({
    type: 'meal',
    timestamp: new Date().toISOString(),
    dayNumber: currentDay.day_number,
    mealType: oldMeal.type,
    oldValue: {
      restaurant: oldMeal.restaurant,
      description: oldMeal.description
    },
    newValue: {
      restaurant: newMeal.name,
      description: newMeal.description
    }
  });

  // Update the meal in the current plan
  // Keep the original meal structure but update with new restaurant details
  const updatedMeal = { ...currentDay.meals[mealIndex] };
  updatedMeal.restaurant = newMeal.name;
  updatedMeal.description = newMeal.type;
  updatedMeal.details = newMeal.description;
  updatedMeal.price = newMeal.price;
  updatedMeal.image = newMeal.image;

  // Update tags if they exist in the new meal
  if (newMeal.tags) {
    updatedMeal.tags = newMeal.tags.map(tag => ({
      icon: tag.icon,
      description: tag.description
    }));
  }

  // Update reservation if needed
  updatedMeal.reservation = {
    status: "pending",
    confirmation: `${newMeal.id}-${Date.now()}`,
    time: oldMeal.reservation.time
  };

  // Update in the current plan
  currentDay.meals[mealIndex] = updatedMeal;

  // Mark as unsaved
  state.isSaved = false;

  // Update the cached data to ensure UI components use the current plan
  updateCachedData('plan', state.currentPlan);

  return true;
}

/**
 * Update transport in the plan
 * @param {number} dayIndex - Index of the day to update (0-based)
 * @param {number} transportIndex - Index of the transport to update
 * @param {Object} newTransport - New transport object
 */
export function updateTransport(dayIndex, transportIndex, newTransport) {
  if (!state.currentPlan || !state.currentPlan.days || dayIndex < 0 ||
      dayIndex >= state.currentPlan.days.length) {
    return false;
  }

  const currentDay = state.currentPlan.days[dayIndex];

  if (!currentDay.transport || transportIndex < 0 ||
      transportIndex >= currentDay.transport.length || !newTransport) {
    return false;
  }

  const oldTransport = currentDay.transport[transportIndex];

  // Log the change
  addPendingChange({
    type: 'transport',
    timestamp: new Date().toISOString(),
    dayNumber: currentDay.day_number,
    transportType: oldTransport.type,
    oldValue: {
      provider: oldTransport.provider,
      price: oldTransport.price
    },
    newValue: {
      provider: newTransport.provider,
      price: newTransport.price
    }
  });

  // Update the transport in the current plan
  // Keep the existing structure but update with new transport details
  const updatedTransport = { ...currentDay.transport[transportIndex] };
  updatedTransport.provider = newTransport.provider;
  updatedTransport.price = newTransport.price;
  updatedTransport.icon = newTransport.icon;
  updatedTransport.confirmation_code = `${newTransport.id}-${Date.now()}`;

  // Update details if they exist in the new transport
  if (newTransport.details) {
    updatedTransport.details = newTransport.details.map(detail => ({
      label: detail.label,
      value: detail.value
    }));
  }

  // Update in the current plan
  currentDay.transport[transportIndex] = updatedTransport;

  // Mark as unsaved
  state.isSaved = false;

  // Update the cached data to ensure UI components use the current plan
  updateCachedData('plan', state.currentPlan);

  return true;
}

/**
 * Add a pending change to be added to the change log on next save
 * @param {Object} change - Change details
 */
function addPendingChange(change) {
  if (!change) return;

  // Add to pending changes
  state.pendingChanges.push(change);

  // Log to console for debugging
  console.log('Plan change pending:', change);
}

/**
 * Helper function to get formatted date relative to a reference date
 * @param {number} dayOffset - Number of days to offset (negative for past, positive for future)
 * @param {string} referenceDate - Reference date string
 * @returns {string} - Formatted date string
 */
function getFormattedDate(dayOffset, referenceDate) {
  const date = new Date(referenceDate);
  date.setDate(date.getDate() + dayOffset);

  // Format as MMM D, YYYY
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Save the current plan state
 * @returns {Object} - Object with the original plan, current plan and change log
 */
export function savePlanState() {
  if (!state.currentPlan || !state.originalPlan) {
    showToast('No plan data to save. Please try reloading the page.', 'error');
    return null;
  }

  // If there are no pending changes, don't create a new save entry
  if (state.pendingChanges.length === 0) {
    showToast('No changes to save', 'info');
    return {
      originalPlan: state.originalPlan,
      currentPlan: state.currentPlan,
      changeLog: state.changeLog
    };
  }

  // Create a timestamp for this save action
  const saveTimestamp = new Date().toISOString();

  // Create a save entry that groups all pending changes
  const saveEntry = {
    saveTimestamp: saveTimestamp,
    changes: [...state.pendingChanges] // Make a copy of pending changes
  };

  // Add the save entry to the change log
  state.changeLog.push(saveEntry);

  // Clear pending changes
  state.pendingChanges = [];

  // Update last save timestamp
  state.lastSaveTimestamp = saveTimestamp;

  // Mark as saved
  state.isSaved = true;

  // Create a data object with all relevant state
  const saveData = {
    originalPlan: state.originalPlan,
    currentPlan: state.currentPlan,
    changeLog: state.changeLog,
    savedAt: saveTimestamp
  };

  // Save to local storage (temporary until backend is ready)
  try {
    localStorage.setItem('tsafira_savedPlan', JSON.stringify(saveData));
    showToast('Itinerary saved successfully', 'success');
    console.log('Plan saved successfully', saveData);
  } catch (error) {
    console.error('Failed to save plan to local storage:', error);
    showToast('Error saving itinerary. Please try again.', 'error');
  }

  return saveData;
}

/**
 * Load previously saved plan state
 * @returns {Object|null} - The saved plan state or null if none found
 */
export function loadSavedPlanState() {
  try {
    const savedData = localStorage.getItem('tsafira_savedPlan');
    if (!savedData) return null;

    const parsedData = JSON.parse(savedData);

    // Update current state
    state.originalPlan = parsedData.originalPlan;
    state.currentPlan = parsedData.currentPlan;
    state.changeLog = parsedData.changeLog;
    state.pendingChanges = [];
    state.lastSaveTimestamp = parsedData.savedAt;
    state.isSaved = true;

    // Update the cached data to ensure UI components use the current plan
    updateCachedData('plan', state.currentPlan);

    return state;
  } catch (error) {
    console.error('Failed to load saved plan state:', error);
    return null;
  }
}

/**
 * Get the current plan state
 * @returns {Object} - The current state object
 */
export function getPlanState() {
  return { ...state }; // Return a copy to prevent direct mutation
}

/**
 * Check if there are unsaved changes
 * @returns {boolean} - True if there are unsaved changes
 */
export function hasUnsavedChanges() {
  return !state.isSaved;
}

/**
 * Get the current plan data (for rendering)
 * @returns {Object|null} - The current plan data or null if no plan is loaded
 */
export function getCurrentPlanData() {
  return state.currentPlan;
}

/**
 * Ensure that the current data is used for rendering
 * This should be called before rendering any UI components
 */
export function ensureCurrentDataIsUsed() {
  if (state.currentPlan) {
    // Update the cached data to ensure UI components use the current plan
    updateCachedData('plan', state.currentPlan);
  }
}

/**
 * Updates the app state's plan data with the current plan
 * This ensures that UI renders use the current plan data
 * @param {Object} appState - The app state object from plan.js
 */
export function updateAppStateWithCurrentPlan(appState) {
  if (state.currentPlan && appState) {
    appState.planData = state.currentPlan;
  }
}

/**
 * Sends the plan data to a backend API
 * This is a placeholder for the actual implementation once the backend is ready
 * @returns {Promise<Object>} - Promise resolving to the response from the backend
 */
export async function sendPlanToBackend() {
  showToast('Preparing to send plan data...', 'info');

  // Make sure any pending changes are saved first
  if (state.pendingChanges.length > 0) {
    savePlanState();
  }

  // Create data to send to backend
  const dataToSend = {
    originalPlan: state.originalPlan,
    currentPlan: state.currentPlan,
    changeLog: state.changeLog,
    savedAt: state.lastSaveTimestamp || new Date().toISOString()
  };

  // For now, we'll just simulate a backend call
  return new Promise((resolve) => {
    setTimeout(() => {
      showToast('Plan data sent successfully!', 'success');
      resolve({
        success: true,
        message: 'Plan data received and stored successfully',
        planId: `plan-${Date.now()}`
      });
    }, 1500);
  });
}