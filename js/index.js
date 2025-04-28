/**
 * Main index file to re-export all modules
 * This provides a single entry point for imports
 */

// Core utilities
export * from '/tsafira-travel-planner/utils.js';
export * from '/tsafira-travel-planner/config.js';

// UI Components
export * as UI from '/tsafira-travel-planner/ui.js';

// API and Auth
export * from '/tsafira-travel-planner/api.js';
export * from '/tsafira-travel-planner/auth.js';
export * from '/tsafira-travel-planner/loader.js';
export * from '/tsafira-travel-planner/validate.js';

// Default export
export default {
  UI,
}; 