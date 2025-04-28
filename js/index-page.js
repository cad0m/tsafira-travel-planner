/**
 * JavaScript for the index page
 * Handles specific functionality and interactions for the home page
 */
import { selectors, defaults } from '/tsafira-travel-planner/config.js';
import { qs, qsa, on, createElement } from '/tsafira-travel-planner/utils.js';
import { isValidEmail } from '/tsafira-travel-planner/validate.js';
import { initUI } from '/tsafira-travel-planner/ui.js';
import { apiGet } from '/tsafira-travel-planner/api.js';
/**
 * Initialize the testimonial carousel
 */
export function initTestimonialCarousel() {
  const container = qs(selectors.testimonialContainer);
  
  // Exit if testimonial container doesn't exist on this page
  if (!container) return;
  
  let currentSlide = 0;
  let carouselIntervalId = null;
  
  // Fetch testimonial data from JSON file
  apiGet('/data/testimonials.json')
    .then(testimonialData => {
      // Group testimonials into pairs for slides
      const testimonials = groupTestimonialsInPairs(testimonialData);
      
      // Create slides
      testimonials.forEach((slideData, index) => {
        const slide = createTestimonialSlide(slideData, index);
        container.appendChild(slide);
      });
      
      // Create navigation dots
      createNavigationDots(testimonials.length);
      
      // Start auto-rotation
      startCarouselRotation();
      
      // Add event listeners for pause/resume
      on(container, 'mouseenter', pauseCarouselRotation);
      on(container, 'mouseleave', startCarouselRotation);
    })
    .catch(error => {
      console.error('Failed to load testimonials:', error);
      // Optional: Show error message or fallback content
      container.innerHTML = '<p class="text-center py-4">Unable to load testimonials</p>';
    });
  
  /**
   * Group testimonials into pairs for slides
   * @param {Array} flatTestimonials - Flat array of testimonial objects
   * @returns {Array} - Array of testimonial pairs for slides
   */
  function groupTestimonialsInPairs(flatTestimonials) {
    const groupedTestimonials = [];
    
    // Loop through the flat array and create pairs
    for (let i = 0; i < flatTestimonials.length; i += 2) {
      // If we have an odd number of testimonials, the last "pair" might only have one item
      const pair = flatTestimonials.slice(i, i + 2);
      groupedTestimonials.push(pair);
    }
    
    return groupedTestimonials;
  }
  
  /**
   * Create a testimonial slide
   * @param {Array} slideData - Data for testimonials in the slide
   * @param {number} index - Slide index
   * @returns {HTMLElement} - Slide element
   */
  function createTestimonialSlide(slideData, index) {
    const slide = createElement('div', {
      className: `testimonial-slide ${index === 0 ? 'active' : ''}`,
      dataset: { index }
    });
    
    // Create grid container for the two testimonials
    const gridContainer = createElement('div', {
      className: 'grid md:grid-cols-2 gap-8'
    });
    
    // Add testimonials to the grid
    slideData.forEach(testimonial => {
      const stars = Array(testimonial.rating)
        .fill('<i class="fas fa-star"></i>')
        .join('');
      
      const card = createElement('div', {
        className: 'bg-white p-8 rounded-xl shadow-lg'
      });
      
      card.innerHTML = `
        <div class="flex items-center mb-4">
          <img src="${testimonial.avatar}" alt="${testimonial.name}" class="w-12 h-12 rounded-full mr-4">
          <div>
            <h4 class="font-bold">${testimonial.name}</h4>
            <p class="text-gray-600 text-sm">${testimonial.location}</p>
          </div>
        </div>
        <div class="flex text-orange-400 mb-4">
          ${stars}
        </div>
        <p class="text-gray-600">"${testimonial.text}"</p>
      `;
      
      gridContainer.appendChild(card);
    });
    
    slide.appendChild(gridContainer);
    return slide;
  }
  
  /**
   * Create navigation dots for the carousel
   * @param {number} totalSlides - Total number of slides
   */
  function createNavigationDots(totalSlides) {
    const dotsContainer = qs(selectors.carouselDots);
    
    // Exit if dots container doesn't exist
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
      const dot = createElement('button', {
        className: `carousel-dot w-3 h-3 rounded-full ${i === 0 ? 'bg-orange-600' : 'bg-gray-300'}`,
        dataset: { index: i },
        'aria-label': `Go to slide ${i + 1}`,
        onclick: () => goToSlide(i)
      });
      
      dotsContainer.appendChild(dot);
    }
  }
  
  /**
   * Go to a specific slide
   * @param {number} index - Slide index
   */
  function goToSlide(index) {
    const slides = qsa('.testimonial-slide');
    const dots = qsa('.carousel-dot');
    
    // Validate index
    if (index < 0 || index >= slides.length) return;
    
    // Hide all slides and deactivate all dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.replace('bg-orange-600', 'bg-gray-300'));
    
    // Show the selected slide and activate the corresponding dot
    slides[index].classList.add('active');
    dots[index].classList.replace('bg-gray-300', 'bg-orange-600');
    
    // Update current slide index
    currentSlide = index;
  }
  
  /**
   * Start carousel auto-rotation
   */
  function startCarouselRotation() {
    // Clear any existing interval
    if (carouselIntervalId) clearInterval(carouselIntervalId);
    
    // Set new interval
    carouselIntervalId = setInterval(() => {
      const totalSlides = qsa('.testimonial-slide').length;
      if (totalSlides > 0) {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
      }
    }, defaults.carouselAutoplayDelay);
  }
  
  /**
   * Pause carousel auto-rotation
   */
  function pauseCarouselRotation() {
    if (carouselIntervalId) {
      clearInterval(carouselIntervalId);
      carouselIntervalId = null;
    }
  }
}

/**
 * Initialize the newsletter form
 */
export function initNewsletterForm() {
  const form = qs(selectors.newsletterForm);
  if (!form) return;
  
  const emailInput = qs(selectors.emailInput);
  const subscribeButton = qs(selectors.subscribeButton);
  const checkbox = qs(selectors.checkbox);
  const newsletterContainer = qs(selectors.newsletterContainer);
  
  // Add validation states and enable button only when valid
  on(emailInput, 'input', validateEmail);
  on(checkbox, 'change', validateForm);
  
  // Form submission
  on(form, 'submit', function(e) {
    e.preventDefault();
    
    if (!isValidEmail(emailInput.value)) {
      showError('Please enter a valid email address');
      return;
    }
    
    if (!checkbox.checked) {
      showError('Please agree to receive newsletters');
      return;
    }
    
    // Show loading state
    subscribeButton.disabled = true;
    subscribeButton.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Subscribing...
    `;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(function() {
      // Show success message
      newsletterContainer.innerHTML = `
        <div class="text-center">
          <div class="mx-auto mb-6 rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
            <svg class="w-8 h-8 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-2 text-gray-800">Thank you for subscribing!</h3>
          <p class="text-gray-600">We've sent a confirmation email to <span class="font-medium">${emailInput.value}</span></p>
        </div>
      `;
    }, 1500);
  });
  
  /**
   * Validate email input
   */
  function validateEmail() {
    if (emailInput.value.trim() === '') {
      setEmailState('empty');
    } else if (isValidEmail(emailInput.value)) {
      setEmailState('valid');
    } else {
      setEmailState('invalid');
    }
    validateForm();
  }
  
  /**
   * Set email input state with appropriate styling
   * @param {string} state - State of the email input ('empty', 'valid', or 'invalid')
   */
  function setEmailState(state) {
    // Remove all states
    emailInput.classList.remove(
      'border-gray-300', 'border-red-500', 'border-green-500', 
      'bg-red-50', 'bg-green-50', 'pr-10'
    );
    
    // Remove any existing icons
    const existingIcon = emailInput.parentElement.querySelector('.validation-icon');
    if (existingIcon) {
      existingIcon.remove();
    }
    
    // Set appropriate classes based on state
    switch(state) {
      case 'empty':
        emailInput.classList.add('border-gray-300');
        break;
      case 'valid':
        emailInput.classList.add('border-green-500', 'bg-green-50', 'pr-10');
        // Add checkmark icon
        addValidationIcon('check', 'text-green-500');
        break;
      case 'invalid':
        emailInput.classList.add('border-red-500', 'bg-red-50', 'pr-10');
        // Add error icon
        addValidationIcon('error', 'text-red-500');
        break;
    }
  }
  
  /**
   * Add validation icon to input
   * @param {string} type - Icon type ('check' or 'error')
   * @param {string} className - CSS class for icon color
   */
  function addValidationIcon(type, className) {
    const iconWrapper = createElement('div', {
      className: 'validation-icon absolute right-12 top-1/2 transform -translate-y-1/2 pointer-events-none'
    });
    
    if (type === 'check') {
      iconWrapper.innerHTML = `
        <svg class="w-5 h-5 ${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      `;
    } else {
      iconWrapper.innerHTML = `
        <svg class="w-5 h-5 ${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      `;
    }
    
    // Add icon inside the input's parent container
    const inputContainer = emailInput.parentElement;
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(iconWrapper);
  }
  
  /**
   * Validate form and update button state
   */
  function validateForm() {
    const isEmailValid = isValidEmail(emailInput.value);
    const isCheckboxChecked = checkbox.checked;
    
    // Enable/disable button based on validation
    if (isEmailValid && isCheckboxChecked) {
      subscribeButton.disabled = false;
      subscribeButton.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      subscribeButton.disabled = true;
      subscribeButton.classList.add('opacity-50', 'cursor-not-allowed');
    }
  }
  
  /**
   * Show error message
   * @param {string} message - Error message text
   */
  function showError(message) {
    // Remove any existing error message
    const existingError = form.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Create error message
    const errorDiv = createElement('div', {
      className: 'error-message text-red-500 text-sm mt-2 animate-fadeIn'
    });
    errorDiv.textContent = message;
    
    // Add error message to form
    form.appendChild(errorDiv);
    
    // Auto-remove error after 4 seconds
    setTimeout(function() {
      errorDiv.classList.add('animate-fadeOut');
      setTimeout(function() {
        errorDiv.remove();
      }, 300);
    }, 4000);
  }
  
  // Initial validation
  validateEmail();
  validateForm();
}

/**
 * Initialize index page functionality
 */
export function init() {
  console.log('Initializing index page');
  
  // Initialize UI framework components first
  initUI();
  
  // Initialize page-specific components
  initTestimonialCarousel();
  initNewsletterForm();
  
  // Handle destination selection
  const destinationCards = qsa(selectors.destinationCard);
  destinationCards.forEach(card => {
    on(card, 'click', function(e) {
      e.preventDefault();
      const destination = this.dataset.destination;
      window.location.href = `/pages/destination.html?name=${destination}`;
    });
  });
  
  console.log('Index page initialization complete');
}

// Export main functions
export default {
  init,
  initTestimonialCarousel,
  initNewsletterForm
};