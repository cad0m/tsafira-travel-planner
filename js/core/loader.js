/**
 * Loader module for loading and injecting HTML partials
 */
import { partials } from './config.js';
import { qs } from '../utils/utils.js';
import { fetchHtml } from './api.js';

/**
 * Load and inject a partial into a placeholder element
 * @param {string} partialUrl - URL of the partial to load
 * @param {string} placeholderId - ID of the placeholder element
 * @returns {Promise<void>} - Promise that resolves when the partial is loaded
 */
export async function loadPartial(partialUrl, placeholderId) {
  try {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
      console.warn(`Placeholder element ${placeholderId} not found.`);
      return;
    }

    console.log(`Loading partial from: ${partialUrl} into #${placeholderId}`);
    const html = await fetchHtml(partialUrl);
    placeholder.innerHTML = html;

    // Dispatch event when partial is loaded
    const event = new CustomEvent('partialLoaded', {
      detail: {
        id: placeholderId,
        url: partialUrl
      }
    });
    document.dispatchEvent(event);

    console.log(`Successfully loaded partial from: ${partialUrl} into #${placeholderId}`);
    return placeholder;
  } catch (error) {
    console.error(`Error loading partial ${partialUrl}:`, error);
    throw error;
  }
}

/**
 * Load all partials for the page
 * @returns {Promise<void>} - Promise that resolves when all partials are loaded
 */
export async function loadAllPartials() {
  try {
    // Load header and footer partials
    // Use paths relative to the current page
    // For pages in the pages directory, we need to go up one level
    const isInPagesDir = window.location.pathname.includes('/pages/');
    const headerUrl = isInPagesDir ? '../partials/header.html' : './partials/header.html';
    const footerUrl = isInPagesDir ? '../partials/footer.html' : './partials/footer.html';

    const headerPromise = loadPartial(headerUrl, 'header-placeholder');
    const footerPromise = loadPartial(footerUrl, 'footer-placeholder');

    // Wait for all partials to load
    await Promise.all([headerPromise, footerPromise]);

    // Dispatch event when all partials are loaded
    document.dispatchEvent(new CustomEvent('allPartialsLoaded'));
  } catch (error) {
    console.error('Error loading partials:', error);
    throw error;
  }
}

/**
 * Initialize partials loading for the page
 */
export function initPartials() {
  // Load all partials when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllPartials);
  } else {
    loadAllPartials();
  }
}

// Export default object with all functions
export default {
  loadPartial,
  loadAllPartials,
  initPartials
};