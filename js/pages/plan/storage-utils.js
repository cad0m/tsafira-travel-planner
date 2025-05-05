/**
 * Storage Utilities
 * Provides abstraction for various storage mechanisms
 */

// Storage keys
export const STORAGE_KEYS = {
  DARK_MODE: "tsafira_dark_mode",
  CURRENT_DAY: "tsafira_current_day",
  CURRENT_TAB: "tsafira_current_tab",
  USER_PREFERENCES: "tsafira_user_preferences",
};

/**
 * Save data to storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - Success status
 */
export function saveToStorage(key, value) {
  try {
    // Convert object/array values to JSON strings
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
    
    // Store in session storage
    sessionStorage.setItem(key, valueToStore);
    return true;
  } catch (error) {
    console.warn(`Failed to save to storage: ${error.message}`);
    return false;
  }
}

/**
 * Get data from storage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} - Retrieved value or default
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = sessionStorage.getItem(key);
    
    // Return default if item doesn't exist
    if (item === null) return defaultValue;
    
    // Try parsing as JSON first
    try {
      return JSON.parse(item);
    } catch {
      // If not valid JSON, return as is
      return item;
    }
  } catch (error) {
    console.warn(`Failed to retrieve from storage: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Remove item from storage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export function removeFromStorage(key) {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove from storage: ${error.message}`);
    return false;
  }
}

/**
 * Clear all storage
 * @returns {boolean} - Success status
 */
export function clearStorage() {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.warn(`Failed to clear storage: ${error.message}`);
    return false;
  }
}

/**
 * Save preference to local storage
 * @param {string} key - Preference key
 * @param {any} value - Preference value
 */
export function savePreference(key, value) {
  try {
    const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || "{}");
    preferences[key] = value;
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.warn(`Failed to save preference: ${error.message}`);
    return false;
  }
}

/**
 * Get preference from local storage
 * @param {string} key - Preference key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} - Preference value
 */
export function getPreference(key, defaultValue) {
  try {
    const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || "{}");
    return preferences[key] !== undefined ? preferences[key] : defaultValue;
  } catch (error) {
    console.warn(`Failed to get preference: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Save current day to storage
 * @param {number} dayNumber - Current day number
 */
export function saveCurrentDay(dayNumber) {
  return saveToStorage(STORAGE_KEYS.CURRENT_DAY, dayNumber.toString());
}

/**
 * Get current day from storage
 * @returns {number} - Current day number
 */
export function getCurrentDay() {
  try {
    const day = getFromStorage(STORAGE_KEYS.CURRENT_DAY);
    return day ? Number.parseInt(day, 10) : 1;
  } catch (error) {
    console.warn(`Failed to get current day: ${error.message}`);
    return 1;
  }
}

/**
 * Save current tab to storage
 * @param {string} tabId - Current tab ID
 */
export function saveCurrentTab(tabId) {
  return saveToStorage(STORAGE_KEYS.CURRENT_TAB, tabId);
}

/**
 * Get current tab from storage
 * @returns {string} - Current tab ID
 */
export function getCurrentTab() {
  return getFromStorage(STORAGE_KEYS.CURRENT_TAB) || "day-by-day";
}

/**
 * Save dark mode preference
 * @param {boolean} isDarkMode - Dark mode state
 */
export function saveDarkModePreference(isDarkMode) {
  return saveToStorage(STORAGE_KEYS.DARK_MODE, isDarkMode ? "true" : "false");
}

/**
 * Get dark mode preference
 * @returns {boolean} - Dark mode state
 */
export function getDarkModePreference() {
  try {
    const preference = getFromStorage(STORAGE_KEYS.DARK_MODE);
    return preference === "true";
  } catch (error) {
    console.warn(`Failed to get dark mode preference: ${error.message}`);
    return false;
  }
}