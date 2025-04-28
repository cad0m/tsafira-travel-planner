/**
 * Form validation helper functions
 */

// Validation regex patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
  phone: /^\+?[0-9\s-()]{8,20}$/,
  name: /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{2,50}$/,
  postalCode: /^[A-Za-z0-9\s-]{3,10}$/,
  airportCode: /^[A-Z]{3}$/
};

/**
 * Validate an email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
export function isValidEmail(email) {
  return patterns.email.test(email);
}

/**
 * Validate a password
 * @param {string} password - Password to validate
 * @returns {boolean} - Whether the password is valid
 */
export function isValidPassword(password) {
  return patterns.password.test(password);
}

/**
 * Validate a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export function isValidPhone(phone) {
  return patterns.phone.test(phone);
}

/**
 * Validate a name
 * @param {string} name - Name to validate
 * @returns {boolean} - Whether the name is valid
 */
export function isValidName(name) {
  return patterns.name.test(name);
}

/**
 * Validate a postal code
 * @param {string} postalCode - Postal code to validate
 * @returns {boolean} - Whether the postal code is valid
 */
export function isValidPostalCode(postalCode) {
  return patterns.postalCode.test(postalCode);
}

/**
 * Validate an airport code
 * @param {string} code - Airport code to validate
 * @returns {boolean} - Whether the airport code is valid
 */
export function isValidAirportCode(code) {
  return patterns.airportCode.test(code);
}

/**
 * Validate a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {boolean} - Whether the date range is valid
 */
export function isValidDateRange(startDate, endDate) {
  return startDate instanceof Date && 
         endDate instanceof Date && 
         !isNaN(startDate) && 
         !isNaN(endDate) && 
         startDate < endDate;
}

/**
 * Get validation error message for a specific field
 * @param {string} fieldName - Field name
 * @param {string} value - Field value
 * @returns {string|null} - Error message or null if valid
 */
export function getValidationError(fieldName, value) {
  switch (fieldName) {
    case 'email':
      return isValidEmail(value) ? null : 'Please enter a valid email address';
    case 'password':
      return isValidPassword(value) ? null : 'Password must be at least 8 characters and include both letters and numbers';
    case 'phone':
      return isValidPhone(value) ? null : 'Please enter a valid phone number';
    case 'name':
      return isValidName(value) ? null : 'Please enter a valid name (2-50 characters)';
    case 'postalCode':
      return isValidPostalCode(value) ? null : 'Please enter a valid postal code';
    case 'airportCode':
      return isValidAirportCode(value) ? null : 'Please enter a valid 3-letter airport code (e.g., JFK)';
    default:
      return null;
  }
}

/**
 * Show validation error in the UI
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
export function showValidationError(input, message) {
  // Remove any existing error message
  const existingError = input.parentElement.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error class to input
  input.classList.add('border-red-500', 'bg-red-50');
  
  // Create error message element
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message text-red-500 text-sm mt-1';
  errorElement.textContent = message;
  
  // Add error message after the input
  input.parentElement.appendChild(errorElement);
}

/**
 * Clear validation error in the UI
 * @param {HTMLElement} input - Input element
 */
export function clearValidationError(input) {
  // Remove error class from input
  input.classList.remove('border-red-500', 'bg-red-50');
  
  // Remove any existing error message
  const existingError = input.parentElement.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
}

/**
 * Validate a form element
 * @param {HTMLElement} input - Input element
 * @returns {boolean} - Whether the input is valid
 */
export function validateInput(input) {
  const value = input.value.trim();
  const fieldName = input.name || input.id;
  
  // Check for required fields
  if (input.required && value === '') {
    showValidationError(input, 'This field is required');
    return false;
  }
  
  // Skip validation if field is empty and not required
  if (value === '' && !input.required) {
    clearValidationError(input);
    return true;
  }
  
  // Validate based on field type
  const error = getValidationError(fieldName, value);
  if (error) {
    showValidationError(input, error);
    return false;
  }
  
  // Clear any errors
  clearValidationError(input);
  return true;
}