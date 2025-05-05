/**
 * Data Manager
 * Handles data loading, caching, and state management
 */

import { showErrorMessage } from './dom-utils.js';

// Cache for loaded data
const dataCache = {
  plan: null,
  recommendations: null,
  timestamp: {}
};

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Load data from a JSON file with caching
 * @param {string} url - URL of the JSON file
 * @param {string} cacheKey - Cache key for this data
 * @param {boolean} forceRefresh - Force refresh from source
 * @returns {Promise<Object>} - Promise resolving to the parsed JSON data
 */
export async function loadData(url, cacheKey, forceRefresh = false) {
  try {
    // Check if we have cached data that isn't expired
    const now = Date.now();
    if (
      !forceRefresh &&
      dataCache[cacheKey] &&
      dataCache.timestamp[cacheKey] &&
      now - dataCache.timestamp[cacheKey] < CACHE_EXPIRATION
    ) {
      console.log(`Using cached ${cacheKey} data`);
      return dataCache[cacheKey];
    }

    // Add a timestamp parameter to prevent browser caching
    const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${now}`;

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(fetchUrl, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to load data from ${url}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the data
    dataCache[cacheKey] = data;
    dataCache.timestamp[cacheKey] = now;

    return data;
  } catch (error) {
    console.error(`Error loading ${cacheKey} data:`, error);

    if (error.name === 'AbortError') {
      showErrorMessage(`Request timed out when loading ${cacheKey} data. Please check your connection.`);
    } else {
      showErrorMessage(`Failed to load ${cacheKey} data: ${error.message}`);
    }

    // Return cached data if available, even if expired
    if (dataCache[cacheKey]) {
      console.log(`Using expired cached ${cacheKey} data as fallback`);
      return dataCache[cacheKey];
    }

    throw error;
  }
}

/**
 * Load the trip plan data
 * @param {boolean} forceRefresh - Force refresh from source
 * @returns {Promise<Object>} - Promise resolving to the plan data
 */
export async function loadPlanData(forceRefresh = false) {
  try {
    // First try to load from the provided JSON file
    return await loadData('../../../assets/data/plan.json', 'plan', forceRefresh);
  } catch (error) {
    console.error('Failed to load plan data:', error);

    // Fallback to embedded data if available
    if (window.embeddedPlanData) {
      console.log('Using embedded plan data as fallback');
      dataCache.plan = window.embeddedPlanData;
      dataCache.timestamp.plan = Date.now();
      return window.embeddedPlanData;
    }

    // If all else fails, create a minimal data structure
    return {
      trip: {
        name: 'My Trip',
        dates: { start: 'Unknown', end: 'Unknown', duration: 0 },
        budget: {
          total_allocated: 0,
          spent_to_date: 0,
          remaining: 0,
          expenses_by_category: []
        }
      },
      days: []
    };
  }
}

/**
 * Load recommendations data
 * @param {boolean} forceRefresh - Force refresh from source
 * @returns {Promise<Object>} - Promise resolving to the recommendations data
 */
export async function loadRecommendationsData(forceRefresh = false) {
  try {
    // First try to load from the provided JSON file
    return await loadData('../../../assets/data/recommendations.json', 'recommendations', forceRefresh);
  } catch (error) {
    console.warn('Failed to load recommendations, continuing without them');
    return { activities: [], videos: [] };
  }
}

/**
 * Update cached data
 * @param {string} cacheKey - Cache key
 * @param {Object} data - Data to update
 */
export function updateCachedData(cacheKey, data) {
  if (!cacheKey || !data) return;

  dataCache[cacheKey] = data;
  dataCache.timestamp[cacheKey] = Date.now();
}

/**
 * Get cached data
 * @param {string} cacheKey - Cache key
 * @returns {Object|null} - Cached data or null if not found
 */
export function getCachedData(cacheKey) {
  return dataCache[cacheKey] || null;
}

/**
 * Sync the app state with cached data
 * Makes sure the app state reflects the latest cached data
 * @param {Object} appState - The application state object
 */
export function syncAppStateWithCache(appState) {
  if (!appState) return;

  // Update plan data if available
  if (dataCache.plan) {
    appState.planData = dataCache.plan;
  }

  // Update recommendations data if available
  if (dataCache.recommendations) {
    appState.recommendationsData = dataCache.recommendations;
  }

  console.log('App state synchronized with data cache');
}

/**
 * Clear specific cache entry
 * @param {string} cacheKey - Cache key to clear
 */
export function clearCache(cacheKey) {
  if (dataCache[cacheKey]) {
    dataCache[cacheKey] = null;
    dataCache.timestamp[cacheKey] = null;
  }
}

/**
 * Clear all cached data
 */
export function clearAllCache() {
  Object.keys(dataCache).forEach(key => {
    if (key !== 'timestamp') {
      dataCache[key] = null;
    }
  });
  dataCache.timestamp = {};
}