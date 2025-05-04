/**
 * Main index file to re-export all modules
 * This provides a single entry point for imports
 */

// Core utilities
export * from './utils/utils.js';
export * from './core/config.js';

// UI Components
export * as UI from './ui.js';

// API and Auth
export * from './core/api.js';
export * from './core/auth.js';
export * from './core/loader.js';
export * from './utils/validate.js';

// Default export
export default {
  UI,
}; 