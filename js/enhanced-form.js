/**
 * Enhanced Form Functionality for Tsafira Travel Planner
 * Provides improved interactions and animations for the trip planning form
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize enhanced form elements
  initEnhancedForm();
});

/**
 * Initialize all enhanced form elements and interactions
 */
function initEnhancedForm() {
  // Initialize budget range slider
  initBudgetSlider();
  
  // Initialize airport autocomplete
  initAirportAutocomplete();
  
  // Initialize date pickers with validation
  initDatePickers();
  
  // Initialize preference checkboxes
  initPreferenceCheckboxes();
  
  // Initialize city card options
  initCityCardOptions();
  
  // Initialize form validation
  initFormValidation();
  
  // Initialize form submission
  initFormSubmission();
}

/**
 * Initialize enhanced budget slider with dynamic tooltip and labels
 */
function initBudgetSlider() {
  const budgetSlider = document.getElementById('quick-budget');
  const budgetTooltip = document.getElementById('budget-tooltip');
  const budgetLabels = document.querySelectorAll('.range-label');
  
  if (!budgetSlider || !budgetTooltip) return;
  
  // Update tooltip on slider change
  function updateTooltip() {
    const value = budgetSlider.value;
    const min = parseInt(budgetSlider.min);
    const max = parseInt(budgetSlider.max);
    const percent = ((value - min) / (max - min)) * 100;
    
    // Update tooltip text and position
    budgetTooltip.textContent = `$${value}`;
    budgetTooltip.style.left = `${percent}%`;
    
    // Update active label
    if (budgetLabels) {
      budgetLabels.forEach(label => {
        label.classList.remove('active');
        if (label.dataset.value === value) {
          label.classList.add('active');
        }
      });
    }
  }
  
  // Show tooltip on interaction
  budgetSlider.addEventListener('input', function() {
    updateTooltip();
    budgetTooltip.classList.add('visible');
  });
  
  // Hide tooltip after interaction
  budgetSlider.addEventListener('mouseup', function() {
    setTimeout(() => {
      budgetTooltip.classList.remove('visible');
    }, 1500);
  });
  
  budgetSlider.addEventListener('touchend', function() {
    setTimeout(() => {
      budgetTooltip.classList.remove('visible');
    }, 1500);
  });
  
  // Show tooltip on hover
  budgetSlider.addEventListener('mouseover', function() {
    updateTooltip();
    budgetTooltip.classList.add('visible');
  });
  
  // Hide tooltip when mouse leaves
  budgetSlider.addEventListener('mouseleave', function() {
    budgetTooltip.classList.remove('visible');
  });
  
  // Initialize tooltip position
  updateTooltip();
}

/**
 * Initialize airport input with autocomplete functionality
 */
function initAirportAutocomplete() {
  const airportInput = document.getElementById('quick-departure');
  if (!airportInput) return;
  
  // Common airport codes and names
  const commonAirports = [
    { code: 'JFK', name: 'New York John F. Kennedy' },
    { code: 'LAX', name: 'Los Angeles International' },
    { code: 'LHR', name: 'London Heathrow' },
    { code: 'CDG', name: 'Paris Charles de Gaulle' },
    { code: 'DXB', name: 'Dubai International' },
    { code: 'AMS', name: 'Amsterdam Schiphol' },
    { code: 'FRA', name: 'Frankfurt International' },
    { code: 'MAD', name: 'Madrid Barajas' },
    { code: 'BCN', name: 'Barcelona El Prat' },
    { code: 'FCO', name: 'Rome Fiumicino' }
  ];
  
  // Create autocomplete container
  const autocompleteContainer = document.createElement('div');
  autocompleteContainer.className = 'absolute z-10 w-full mt-1 bg-white dark:bg-dark-bg-accent rounded-lg shadow-lg overflow-hidden hidden';
  autocompleteContainer.style.maxHeight = '200px';
  autocompleteContainer.style.overflowY = 'auto';
  airportInput.parentNode.appendChild(autocompleteContainer);
  
  // Filter airports based on input
  airportInput.addEventListener('input', function() {
    const value = this.value.toLowerCase();
    
    if (value.length < 2) {
      autocompleteContainer.classList.add('hidden');
      return;
    }
    
    // Filter airports that match the input
    const matches = commonAirports.filter(airport => {
      return airport.code.toLowerCase().includes(value) || 
             airport.name.toLowerCase().includes(value);
    });
    
    // Display matches
    if (matches.length > 0) {
      autocompleteContainer.innerHTML = '';
      matches.forEach(airport => {
        const item = document.createElement('div');
        item.className = 'px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-bg transition duration-150';
        item.innerHTML = `<span class="font-semibold">${airport.code}</span> - ${airport.name}`;
        
        item.addEventListener('click', function() {
          airportInput.value = airport.code;
          autocompleteContainer.classList.add('hidden');
          
          // Trigger validation
          airportInput.dispatchEvent(new Event('input'));
        });
        
        autocompleteContainer.appendChild(item);
      });
      
      autocompleteContainer.classList.remove('hidden');
    } else {
      autocompleteContainer.classList.add('hidden');
    }
  });
  
  // Hide autocomplete when clicking outside
  document.addEventListener('click', function(e) {
    if (!airportInput.contains(e.target) && !autocompleteContainer.contains(e.target)) {
      autocompleteContainer.classList.add('hidden');
    }
  });
  
  // Add popular airport chips
  const popularAirports = ['JFK', 'LHR', 'CDG', 'DXB'];
  const popularContainer = document.createElement('div');
  popularContainer.className = 'flex flex-wrap gap-2 mt-2';
  
  popularAirports.forEach(code => {
    const chip = document.createElement('div');
    chip.className = 'px-3 py-1 text-xs bg-gray-100 dark:bg-dark-bg hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded-full cursor-pointer transition duration-150';
    chip.textContent = code;
    
    chip.addEventListener('click', function() {
      airportInput.value = code;
      airportInput.dispatchEvent(new Event('input'));
    });
    
    popularContainer.appendChild(chip);
  });
  
  // Add "Popular:" text before chips
  const popularText = document.createElement('div');
  popularText.className = 'text-xs text-gray-500 dark:text-gray-400 mr-1 self-center';
  popularText.textContent = 'Popular:';
  popularContainer.insertBefore(popularText, popularContainer.firstChild);
  
  airportInput.parentNode.appendChild(popularContainer);
}

/**
 * Initialize date pickers with enhanced validation
 */
function initDatePickers() {
  const startDateInput = document.getElementById('quick-start-date');
  const endDateInput = document.getElementById('quick-end-date');
  
  if (!startDateInput || !endDateInput) return;
  
  // Set minimum date to today
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  startDateInput.min = todayFormatted;
  endDateInput.min = todayFormatted;
  
  // Update end date min when start date changes
  startDateInput.addEventListener('change', function() {
    if (this.value) {
      endDateInput.min = this.value;
      
      // If end date is before start date, update it
      if (endDateInput.value && endDateInput.value < this.value) {
        endDateInput.value = this.value;
      }
    }
  });
  
  // Add date selection helper
  const dateHelperContainer = document.createElement('div');
  dateHelperContainer.className = 'flex flex-wrap gap-2 mt-2';
  
  // Create quick date selection buttons
  const quickDates = [
    { label: 'Weekend', days: 3 },
    { label: '1 Week', days: 7 },
    { label: '2 Weeks', days: 14 }
  ];
  
  quickDates.forEach(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'px-3 py-1 text-xs bg-gray-100 dark:bg-dark-bg hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded-full cursor-pointer transition duration-150';
    button.textContent = option.label;
    
    button.addEventListener('click', function() {
      // Set start date to tomorrow if not already set
      const startDate = startDateInput.value ? new Date(startDateInput.value) : new Date(today);
      if (!startDateInput.value) {
        startDate.setDate(startDate.getDate() + 1);
      }
      
      // Set end date based on selection
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + option.days);
      
      // Update inputs
      startDateInput.value = startDate.toISOString().split('T')[0];
      endDateInput.value = endDate.toISOString().split('T')[0];
      
      // Trigger validation
      startDateInput.dispatchEvent(new Event('input'));
      endDateInput.dispatchEvent(new Event('input'));
    });
    
    dateHelperContainer.appendChild(button);
  });
  
  // Add helper text
  const helperText = document.createElement('div');
  helperText.className = 'text-xs text-gray-500 dark:text-gray-400 mr-1 self-center';
  helperText.textContent = 'Quick select:';
  dateHelperContainer.insertBefore(helperText, dateHelperContainer.firstChild);
  
  // Add helper container after the end date input
  endDateInput.parentNode.parentNode.appendChild(dateHelperContainer);
}

/**
 * Initialize preference checkboxes with enhanced styling
 */
function initPreferenceCheckboxes() {
  const checkboxes = document.querySelectorAll('.enhanced-checkbox input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      // Add pulse animation when checked
      if (this.checked) {
        const label = this.nextElementSibling;
        label.classList.add('pulse-animation');
        setTimeout(() => {
          label.classList.remove('pulse-animation');
        }, 500);
      }
    });
  });
}

/**
 * Initialize city card options with smooth animations
 */
function initCityCardOptions() {
  const cityCardCheckbox = document.getElementById('quick-city-card');
  const cityCardOptions = document.getElementById('city-card-options');
  
  if (!cityCardCheckbox || !cityCardOptions) return;
  
  cityCardCheckbox.addEventListener('change', function() {
    if (this.checked) {
      cityCardOptions.classList.remove('hidden');
      cityCardOptions.classList.add('animate-slide-down');
    } else {
      // Add slide up animation then hide
      cityCardOptions.classList.remove('animate-slide-down');
      cityCardOptions.classList.add('animate-slide-up');
      
      setTimeout(() => {
        cityCardOptions.classList.add('hidden');
        cityCardOptions.classList.remove('animate-slide-up');
      }, 300);
    }
  });
}

/**
 * Initialize form validation with inline feedback
 */
function initFormValidation() {
  const form = document.getElementById('trip-form');
  const submitButton = document.getElementById('quick-generate-btn');
  const inputs = form.querySelectorAll('input:not([type="checkbox"]):not([type="radio"])');
  
  if (!form || !submitButton) return;
  
  // Add validation to all inputs
  inputs.forEach(input => {
    // Create error message element if it doesn't exist
    let errorElement = document.getElementById(`${input.id}-error`);
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = `${input.id}-error`;
      errorElement.className = 'error-message';
      input.parentNode.appendChild(errorElement);
    }
    
    // Validate on input
    input.addEventListener('input', function() {
      validateInput(input);
    });
    
    // Validate on blur
    input.addEventListener('blur', function() {
      validateInput(input);
    });
  });
  
  // Validate a single input
  function validateInput(input) {
    const errorElement = document.getElementById(`${input.id}-error`);
    if (!errorElement) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    input.classList.remove('input-error');
    errorElement.classList.remove('visible');
    
    // Validate based on input type
    switch(input.id) {
      case 'quick-departure':
        if (!input.value.trim()) {
          isValid = false;
          errorMessage = 'Please enter your departure airport';
        }
        break;
        
      case 'quick-start-date':
        if (!input.value) {
          isValid = false;
          errorMessage = 'Please select your check-in date';
        }
        break;
        
      case 'quick-end-date':
        if (!input.value) {
          isValid = false;
          errorMessage = 'Please select your check-out date';
        } else if (document.getElementById('quick-start-date').value && 
                  new Date(input.value) <= new Date(document.getElementById('quick-start-date').value)) {
          isValid = false;
          errorMessage = 'Check-out date must be after check-in date';
        }
        break;
    }
    
    // Show error if invalid
    if (!isValid) {
      input.classList.add('input-error');
      errorElement.textContent = errorMessage;
      errorElement.classList.add('visible');
    }
    
    return isValid;
  }
  
  // Validate entire form
  function validateForm() {
    let isValid = true;
    
    // Validate all inputs
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // Update submit button state
  function updateSubmitButtonState() {
    const isValid = validateForm();
    
    if (isValid) {
      submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
      submitButton.removeAttribute('disabled');
    } else {
      submitButton.classList.add('opacity-70', 'cursor-not-allowed');
      // Don't disable the button to allow submission attempts that will show validation errors
    }
  }
  
  // Update button state on any input change
  inputs.forEach(input => {
    input.addEventListener('input', updateSubmitButtonState);
  });
  
  // Initial button state
  updateSubmitButtonState();
}

/**
 * Initialize form submission with animation
 */
function initFormSubmission() {
  const form = document.getElementById('trip-form');
  const submitButton = document.getElementById('quick-generate-btn');
  
  if (!form || !submitButton) return;
  
  submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Validate form
    const inputs = form.querySelectorAll('input:not([type="checkbox"]):not([type="radio"])');
    let isValid = true;
    
    inputs.forEach(input => {
      const errorElement = document.getElementById(`${input.id}-error`);
      
      // Clear previous error
      input.classList.remove('input-error');
      if (errorElement) errorElement.classList.remove('visible');
      
      // Check if input is valid
      switch(input.id) {
        case 'quick-departure':
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add('input-error');
            if (errorElement) {
              errorElement.textContent = 'Please enter your departure airport';
              errorElement.classList.add('visible');
            }
          }
          break;
          
        case 'quick-start-date':
          if (!input.value) {
            isValid = false;
            input.classList.add('input-error');
            if (errorElement) {
              errorElement.textContent = 'Please select your check-in date';
              errorElement.classList.add('visible');
            }
          }
          break;
          
        case 'quick-end-date':
          if (!input.value) {
            isValid = false;
            input.classList.add('input-error');
            if (errorElement) {
              errorElement.textContent = 'Please select your check-out date';
              errorElement.classList.add('visible');
            }
          } else if (document.getElementById('quick-start-date').value && 
                    new Date(input.value) <= new Date(document.getElementById('quick-start-date').value)) {
            isValid = false;
            input.classList.add('input-error');
            if (errorElement) {
              errorElement.textContent = 'Check-out date must be after check-in date';
              errorElement.classList.add('visible');
            }
          }
          break;
      }
    });
    
    if (!isValid) {
      // Shake the form to indicate error
      form.classList.add('shake-animation');
      setTimeout(() => {
        form.classList.remove('shake-animation');
      }, 500);
      return;
    }
    
    // Add loading state to button
    const buttonText = submitButton.querySelector('span');
    const buttonIcon = submitButton.querySelector('i');
    
    if (buttonText && buttonIcon) {
      // Save original text and icon
      const originalText = buttonText.textContent;
      const originalIcon = buttonIcon.className;
      
      // Update to loading state
      buttonText.textContent = 'Creating Your Trip...';
      buttonIcon.className = 'fas fa-spinner fa-spin ml-2';
      
      // Collect form data
      const budget = document.getElementById('quick-budget').value;
      const departure = document.getElementById('quick-departure').value;
      const startDate = document.getElementById('quick-start-date').value;
      const endDate = document.getElementById('quick-end-date').value;
      
      // Get preferences
      const culture = document.getElementById('quick-culture').checked;
      const nature = document.getElementById('quick-nature').checked;
      const luxury = document.getElementById('quick-luxury').checked;
      const sightseeing = document.getElementById('quick-sightseeing').checked;
      
      // Get city card options
      const includeCityCard = document.getElementById('quick-city-card').checked;
      let cityCardDuration = null;
      
      if (includeCityCard) {
        const durationRadios = document.querySelectorAll('input[name="card-duration"]');
        for (const radio of durationRadios) {
          if (radio.checked) {
            cityCardDuration = radio.value;
            break;
          }
        }
      }
      
      // Create URL parameters for wizard page
      const params = new URLSearchParams();
      params.append('budget', budget);
      if (departure) params.append('departure', departure);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      // Add preferences
      if (culture) params.append('culture', 'true');
      if (nature) params.append('nature', 'true');
      if (luxury) params.append('luxury', 'true');
      if (sightseeing) params.append('sightseeing', 'true');
      
      // Add city card options
      if (includeCityCard) {
        params.append('cityCard', 'true');
        if (cityCardDuration) params.append('cityCardDuration', cityCardDuration);
      }
      
      // Simulate processing delay for better UX
      setTimeout(() => {
        // Redirect to wizard page with parameters
        window.location.href = `pages/wizard.html?${params.toString()}`;
      }, 1200);
    } else {
      // Fallback if elements not found
      window.location.href = `pages/wizard.html?budget=${budget}&departure=${departure}&startDate=${startDate}&endDate=${endDate}`;
    }
  });
}

// Add shake animation for form validation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes shakeAnimation {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake-animation {
  animation: shakeAnimation 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes pulseAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.pulse-animation {
  animation: pulseAnimation 0.5s ease;
}
`;
document.head.appendChild(styleSheet);
