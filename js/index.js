/**
 * Main index file to re-export all modules
 * This provides a single entry point for imports
 */

// Core utilities
export * from '/tsafira-travel-planner/utils/utils.js';
export * from '/tsafira-travel-planner/core/config.js';

// UI Components
export * as UI from '/tsafira-travel-planner/ui.js';

// API and Auth
export * from '/tsafira-travel-planner/core/api.js';
export * from '/tsafira-travel-planner/core/auth.js';
export * from '/tsafira-travel-planner/core/loader.js';
export * from '/tsafira-travel-planner/utils/validate.js';

// Default export
export default {
  UI,
}; 