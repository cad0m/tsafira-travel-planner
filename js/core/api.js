/**
 * API utility functions for making requests to the server
 */

/**
 * Base function for making API requests
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Promise resolving to response data
 */
async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // Check if response is empty
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Make a GET request to the API
 * @param {string} url - API endpoint URL
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Promise resolving to response data
 */
export function apiGet(url, options = {}) {
  return apiFetch(url, {
    method: 'GET',
    ...options
  });
}

/**
 * Make a POST request to the API
 * @param {string} url - API endpoint URL
 * @param {Object} data - Data to send in request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Promise resolving to response data
 */
export function apiPost(url, data = {}, options = {}) {
  return apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  });
}

/**
 * Make a PUT request to the API
 * @param {string} url - API endpoint URL
 * @param {Object} data - Data to send in request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Promise resolving to response data
 */
export function apiPut(url, data = {}, options = {}) {
  return apiFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  });
}

/**
 * Make a DELETE request to the API
 * @param {string} url - API endpoint URL
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Promise resolving to response data
 */
export function apiDelete(url, options = {}) {
  return apiFetch(url, {
    method: 'DELETE',
    ...options
  });
}

/**
 * Fetch HTML content (used for loading partials)
 * @param {string} url - URL to fetch HTML from
 * @returns {Promise<string>} - Promise resolving to HTML content
 */
export function fetchHtml(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch HTML: ${response.status}`);
      }
      return response.text();
    })
    .catch(error => {
      console.error('Error fetching HTML:', error);
      throw error;
    });
}