/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

/**
 * Safely query selector with error handling
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (defaults to document)
 * @returns {Element|null} - Found element or null
 */
export function $(selector, parent = document) {
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return null;
  }
}

/**
 * Safely query selector all with error handling
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (defaults to document)
 * @returns {NodeList} - Found elements or empty NodeList
 */
export function $$(selector, parent = document) {
  try {
    return parent.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return [];
  }
}

/**
 * Create element with attributes and children
 * @param {string} tag - HTML tag
 * @param {Object} attributes - Element attributes
 * @param {Array|string|Element} children - Child elements or text
 * @returns {Element} - Created element
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Add children
  if (children) {
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof Element) {
          element.appendChild(child);
        } else if (child !== null && child !== undefined) {
          element.appendChild(document.createTextNode(child.toString()));
        }
      });
    } else if (children instanceof Element) {
      element.appendChild(children);
    } else if (children !== null && children !== undefined) {
      element.textContent = children.toString();
    }
  }
  
  return element;
}

/**
 * Add event listener with delegation
 * @param {Element} element - Parent element
 * @param {string} eventType - Event type (e.g., 'click')
 * @param {string} selector - CSS selector for child elements
 * @param {Function} handler - Event handler
 * @returns {Function} - Function to remove the event listener
 */
export function delegateEvent(element, eventType, selector, handler) {
  const listener = (event) => {
    let target = event.target;
    
    while (target && target !== element) {
      if (target.matches(selector)) {
        handler.call(target, event, target);
        return;
      }
      target = target.parentNode;
    }
  };
  
  element.addEventListener(eventType, listener);
  
  // Return function to remove event listener
  return () => element.removeEventListener(eventType, listener);
}

/**
 * Toggle class on element
 * @param {Element} element - Target element
 * @param {string} className - Class to toggle
 * @param {boolean} force - Force add or remove
 * @returns {boolean} - Class is present after toggle
 */
export function toggleClass(element, className, force) {
  if (!element) return false;
  return element.classList.toggle(className, force);
}

/**
 * Create and show a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = 'success', duration = 3000) {
  // Create toast element
  const toast = createElement('div', {
    className: `toast ${type}`,
  }, message);
  
  // Append to body
  document.body.appendChild(toast);
  
  // Show the toast with a slight delay for animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove the toast after duration
  setTimeout(() => {
    toast.classList.remove('show');
    
    // Remove element after animation completes
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

/**
 * Show error message
 * @param {string} message - Error message
 * @param {number} duration - Duration in milliseconds
 */
export function showErrorMessage(message, duration = 5000) {
  showToast(message, 'error', duration);
}

/**
 * Create and show a modal
 * @param {string|Element} content - Modal content
 * @param {Object} options - Modal options
 * @returns {Object} - Modal control methods
 */
export function showModal(content, options = {}) {
  const defaults = {
    maxWidth: '600px',
    closeOnOutsideClick: true,
    showCloseButton: true,
    onClose: null
  };
  
  const settings = { ...defaults, ...options };
  
  // Create modal elements
  const modalOverlay = createElement('div', { className: 'modal-overlay' });
  
  const modalContent = createElement('div', {
    className: 'modal-content',
    style: { maxWidth: settings.maxWidth }
  });
  
  // Add close button if needed
  if (settings.showCloseButton) {
    const closeButton = createElement('button', {
      className: 'close-modal-btn',
      ariaLabel: 'Close modal',
      onClick: close
    }, createElement('i', { className: 'fa-solid fa-times' }));
    
    modalContent.appendChild(closeButton);
  }
  
  // Add content
  if (typeof content === 'string') {
    modalContent.innerHTML += content;
  } else if (content instanceof Element) {
    modalContent.appendChild(content);
  }
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  // Show modal with animation
  setTimeout(() => {
    modalOverlay.classList.add('active');
  }, 10);
  
  // Handle outside click
  if (settings.closeOnOutsideClick) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        close();
      }
    });
  }
  
  // Close function
  function close() {
    modalOverlay.classList.remove('active');
    
    // Remove from DOM after animation
    setTimeout(() => {
      modalOverlay.remove();
      if (typeof settings.onClose === 'function') {
        settings.onClose();
      }
    }, 300);
  }
  
  // Return modal control methods
  return {
    close,
    modalElement: modalOverlay,
    contentElement: modalContent
  };
}

/**
 * Create and manage a carousel
 * @param {string} containerId - Carousel container ID
 * @param {Array} slides - Array of slide content
 * @param {Object} options - Carousel options
 * @returns {Object} - Carousel control methods
 */
export function createCarousel(containerId, slides, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  const defaults = {
    autoPlay: true,
    interval: 5000,
    showDots: true,
    showArrows: true,
    slidesToShow: 1
  };
  
  const settings = { ...defaults, ...options };
  let currentIndex = 0;
  let slideInterval = null;
  
  // If slides are null, the container already has slides
  if (slides === null) {
    // Get existing slides
    const existingSlides = container.querySelectorAll('.carousel-slide');
    if (existingSlides.length === 0) {
      console.warn('No slides found in the container');
      return null;
    }
    
    // Get existing dots
    const dotsContainer = container.querySelector('.carousel-dots');
    if (dotsContainer) {
      // Create dots if they don't exist
      if (dotsContainer.children.length === 0 && existingSlides.length > 1) {
        for (let i = 0; i < existingSlides.length; i++) {
          const dot = createElement('button', {
            className: `carousel-dot ${i === 0 ? 'active' : ''}`,
            ariaLabel: `Go to slide ${i + 1}`,
            onClick: () => goToSlide(i)
          });
          dotsContainer.appendChild(dot);
        }
      }
    }
    
    // Function to show slide at index
    function goToSlide(index) {
      // Get all slides and dots
      const allSlides = container.querySelectorAll('.carousel-slide');
      const allDots = dotsContainer?.querySelectorAll('.carousel-dot');
      
      // Update slides
      allSlides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      
      // Update dots
      if (allDots) {
        allDots.forEach((dot, i) => {
          if (i === index) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
      
      currentIndex = index;
    }
    
    // Start auto-play if enabled
    function startAutoPlay() {
      if (settings.autoPlay && existingSlides.length > 1) {
        slideInterval = setInterval(() => {
          goToSlide((currentIndex + 1) % existingSlides.length);
        }, settings.interval);
      }
    }
    
    // Stop auto-play
    function stopAutoPlay() {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    }
    
    // Handle pause on hover
    if (settings.autoPlay) {
      container.addEventListener('mouseenter', stopAutoPlay);
      container.addEventListener('mouseleave', startAutoPlay);
      startAutoPlay();
    }
    
    // Return carousel control methods
    return {
      goToSlide,
      next: () => goToSlide((currentIndex + 1) % existingSlides.length),
      prev: () => goToSlide((currentIndex - 1 + existingSlides.length) % existingSlides.length),
      getCurrentIndex: () => currentIndex,
      startAutoPlay,
      stopAutoPlay
    };
  }
  
  // Original implementation for when slides are provided
  // Add CSS classes to container
  container.classList.add('carousel-container');
  
  // Create slides container if it doesn't exist
  let slidesContainer = container.querySelector('.carousel-slides');
  if (!slidesContainer) {
    slidesContainer = createElement('div', {
      className: 'carousel-slides'
    });
    container.appendChild(slidesContainer);
  } else {
    // Clear existing slides
    slidesContainer.innerHTML = '';
  }
  
  // Create slides
  slides.forEach((slide, index) => {
    const slideElement = createElement('div', {
      className: `carousel-slide ${index === 0 ? 'active' : ''}`,
    });
    
    if (typeof slide === 'string') {
      slideElement.innerHTML = slide;
    } else if (slide instanceof Element) {
      slideElement.appendChild(slide);
    } else if (typeof slide === 'object') {
      // Handle object with HTML structure like { icon, title, content }
      if (slide.icon) {
        slideElement.appendChild(createElement('i', { className: slide.icon }));
      }
      
      if (slide.title) {
        slideElement.appendChild(createElement('h4', {}, slide.title));
      }
      
      if (slide.content || slide.description) {
        slideElement.appendChild(createElement('p', {}, slide.content || slide.description));
      }
    }
    
    slidesContainer.appendChild(slideElement);
  });
  
  // Create arrow navigation if needed
  if (settings.showArrows && slides.length > 1) {
    // Check if arrows already exist
    let prevButton = container.querySelector('.nav-arrow.prev');
    let nextButton = container.querySelector('.nav-arrow.next');
    
    if (!prevButton) {
      prevButton = createElement('button', {
        className: 'nav-arrow prev',
        ariaLabel: 'Previous slide'
      }, createElement('i', { className: 'fa-solid fa-chevron-left' }));
      container.appendChild(prevButton);
    }
    
    if (!nextButton) {
      nextButton = createElement('button', {
        className: 'nav-arrow next',
        ariaLabel: 'Next slide'
      }, createElement('i', { className: 'fa-solid fa-chevron-right' }));
      container.appendChild(nextButton);
    }
  }
  
  // Create dots navigation if needed
  let dotsContainer = container.querySelector('.carousel-dots');
  if (!dotsContainer && settings.showDots && slides.length > 1) {
    dotsContainer = createElement('div', {
      className: 'carousel-dots'
    });
    container.appendChild(dotsContainer);
  }
  
  if (dotsContainer && settings.showDots && slides.length > 1) {
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    slides.forEach((_, index) => {
      const dot = createElement('button', {
        className: `carousel-dot ${index === 0 ? 'active' : ''}`,
        ariaLabel: `Go to slide ${index + 1}`
      });
      dotsContainer.appendChild(dot);
    });
  }
  
  // Function to show slide at index
  function goToSlide(index) {
    // Get all slides and dots
    const allSlides = container.querySelectorAll('.carousel-slide');
    const allDots = dotsContainer?.querySelectorAll('.carousel-dot');
    
    // Update slides
    allSlides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    
    // Update dots
    if (allDots) {
      allDots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    currentIndex = index;
  }
  
  // Add click event listeners
  const navArrows = container.querySelectorAll('.nav-arrow');
  navArrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
      if (arrow.classList.contains('prev')) {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
      } else {
        goToSlide((currentIndex + 1) % slides.length);
      }
    });
  });
  
  const dots = container.querySelectorAll('.carousel-dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });
  
  // Start auto-play if enabled
  function startAutoPlay() {
    if (settings.autoPlay && slides.length > 1) {
      slideInterval = setInterval(() => {
        goToSlide((currentIndex + 1) % slides.length);
      }, settings.interval);
    }
  }
  
  // Stop auto-play
  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }
  
  // Handle pause on hover
  if (settings.autoPlay) {
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  }
  
  // Return carousel control methods
  return {
    goToSlide,
    next: () => goToSlide((currentIndex + 1) % slides.length),
    prev: () => goToSlide((currentIndex - 1 + slides.length) % slides.length),
    getCurrentIndex: () => currentIndex,
    startAutoPlay,
    stopAutoPlay
  };
}