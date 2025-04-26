  // Wait for DOM to be fully loaded before executing any JavaScript
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize all page components
    initTestimonialCarousel();
    initScrollProgressBar();
    initMobileMenu();
    updateAuthDisplay();
  });
  
  // ===== TESTIMONIAL CAROUSEL FUNCTIONALITY =====
  // Global variables for the carousel
  let testimonials = [
    // First slide (2 testimonials)
    [
      {
        name: "Sarah M.",
        location: "New York, USA",
        rating: 5,
        text: "Tsafira made planning our Moroccan adventure effortless. The personalized itinerary perfectly matched our interests and budget.",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
      },
      {
        name: "James R.",
        location: "London, UK",
        rating: 5,
        text: "An incredible experience from start to finish. The local expertise really showed in the unique experiences we had.",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
      }
    ],
    // Second slide (2 testimonials)
    [
      {
        name: "Maria L.",
        location: "Barcelona, Spain",
        rating: 5,
        text: "Our family trip to Morocco was the highlight of our year. The local guides were exceptional and the accommodations were perfect.",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
      },
      {
        name: "David K.",
        location: "Toronto, Canada",
        rating: 4,
        text: "The attention to detail in our itinerary was impressive. Every recommendation was spot on and saved us so much research time.",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
      }
    ],
    // Third slide (2 testimonials)
    [
      {
        name: "Sophia T.",
        location: "Sydney, Australia",
        rating: 5,
        text: "I never would have discovered those hidden gems without Tsafira's expertise. The authentic experiences made this trip unforgettable.",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
      },
      {
        name: "Michael B.",
        location: "Berlin, Germany",
        rating: 5,
        text: "From the desert to the mountains, our journey through Morocco was flawless. The cultural insights provided added so much depth to our travels.",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg"
      }
    ]
  ];
  
  let currentSlide = 0;
  let carouselIntervalId = null;
  
  function initTestimonialCarousel() {
    const container = document.querySelector('.testimonial-container');
    
    // Exit if testimonial container doesn't exist on this page
    if (!container) return;
    
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
    container.addEventListener('mouseenter', pauseCarouselRotation);
    container.addEventListener('mouseleave', startCarouselRotation);
  }
  
  function createTestimonialSlide(slideData, index) {
    const slide = document.createElement('div');
    slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;
    slide.dataset.index = index;
    
    // Create grid container for the two testimonials
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid md:grid-cols-2 gap-8';
    
    // Add testimonials to the grid
    slideData.forEach(testimonial => {
      const card = document.createElement('div');
      card.className = 'bg-white p-8 rounded-xl shadow-lg';
      
      // Create rating stars
      const stars = Array(testimonial.rating)
        .fill('<i class="fas fa-star"></i>')
        .join('');
      
      // Create testimonial content
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
  
  function createNavigationDots(totalSlides) {
    const dotsContainer = document.getElementById('carousel-dots');
    
    // Exit if dots container doesn't exist
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot w-3 h-3 rounded-full ${i === 0 ? 'bg-orange-600' : 'bg-gray-300'}`;
      dot.dataset.index = i;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }
  
  function goToSlide(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
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
  
  function startCarouselRotation() {
    // Clear any existing interval
    if (carouselIntervalId) clearInterval(carouselIntervalId);
    
    // Set new interval
    carouselIntervalId = setInterval(() => {
      const totalSlides = document.querySelectorAll('.testimonial-slide').length;
      if (totalSlides > 0) {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
      }
    }, 5000); // Change slide every 5 seconds
  }
  
  function pauseCarouselRotation() {
    if (carouselIntervalId) {
      clearInterval(carouselIntervalId);
      carouselIntervalId = null;
    }
  }
  
  // ===== SCROLL PROGRESS BAR FUNCTIONALITY =====
  function initScrollProgressBar() {
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    
    // Exit if scroll progress bar doesn't exist on this page
    if (!scrollProgressBar) return;
    
    function updateScrollProgress() {
      const scrollPosition = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Avoid division by zero
      if (scrollHeight <= 0) {
        scrollProgressBar.style.width = '0%';
        return;
      }
      
      const scrollPercentage = (scrollPosition / scrollHeight) * 100;
      
      scrollProgressBar.style.width = `${scrollPercentage}%`;
      // Add a subtle animation effect when scrolling
      scrollProgressBar.style.boxShadow = `0 1px ${3 + scrollPercentage/20}px rgba(242, 101, 34, 0.4)`;
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    
    // Initialize on page load
    updateScrollProgress();
  }
  
  // ===== MOBILE MENU FUNCTIONALITY =====
  function initMobileMenu() {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const closeMenuButton = document.getElementById("close-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    
    // Exit if elements don't exist on this page
    if (!mobileMenuButton || !closeMenuButton || !mobileMenu) return;
    
    // Open mobile menu when hamburger icon is clicked
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("hidden");
      document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
    });
    
    // Close mobile menu when X icon is clicked
    closeMenuButton.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = ""; // Re-enable scrolling
    });
  }
  
  // ===== USER AUTHENTICATION DISPLAY =====
  function updateAuthDisplay() {
    // Check if user data exists
    if (!window.currentUser) return;
    
    // Update desktop nav
    const navActions = document.getElementById("nav-actions");
    if (navActions) {
      navActions.innerHTML = `
        <a href="${window.currentUser.profileUrl}"
          class="flex items-center space-x-2 px-2 py-1 rounded-full border-2 border-transparent hover:border-orange-600 transition-colors duration-300">
          <img src="${window.currentUser.avatarUrl}" alt="${window.currentUser.name}" class="w-8 h-8 rounded-full object-cover">
          <span class="text-gray-800">${window.currentUser.name}</span>
        </a>
        <a href="/wizard.html" class="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors duration-300">
          Plan Your Trip
        </a>`;
    }
    
    // Update mobile auth section
    const mobileAuthSection = document.querySelector("#mobile-menu .border-t");
    if (mobileAuthSection) {
      mobileAuthSection.innerHTML = `
        <a href="${window.currentUser.profileUrl}" class="flex items-center space-x-3 mb-3 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-600">
          <img src="${window.currentUser.avatarUrl}" alt="${window.currentUser.name}" class="w-10 h-10 rounded-full object-cover">
          <span class="text-gray-800 font-medium">${window.currentUser.name}</span>
        </a>
        <a href="/wizard.html" class="block w-full text-center bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors duration-300">
          Plan Your Trip
        </a>`;
    }
  }
  
  // Function to load testimonials from backend (for future use)
  function loadTestimonialsFromBackend() {
    // Example implementation:
    fetch('/api/testimonials')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        testimonials = data;
        // Reinitialize the carousel with new data
        const container = document.querySelector('.testimonial-container');
        if (container) {
          container.innerHTML = '';
          initTestimonialCarousel();
        }
      })
      .catch(error => {
        console.error('Error fetching testimonials:', error);
      });
  }
  document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const newsletterForm = document.querySelector('#newsletter form');
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const subscribeButton = newsletterForm.querySelector('button');
    const checkboxLabel = newsletterForm.querySelector('label');
    const checkbox = newsletterForm.querySelector('input[type="checkbox"]');
    const newsletterContainer = document.querySelector('#newsletter .container .max-w-2xl');
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Add validation states and enable button only when valid
    emailInput.addEventListener('input', function() {
      validateEmail();
    });
    
    checkbox.addEventListener('change', function() {
      validateForm();
    });
    
    function validateEmail() {
      if (emailInput.value.trim() === '') {
        setEmailState('empty');
      } else if (emailRegex.test(emailInput.value)) {
        setEmailState('valid');
      } else {
        setEmailState('invalid');
      }
      validateForm();
    }
    
    function setEmailState(state) {
      // Remove all states
      emailInput.classList.remove('border-gray-300', 'border-red-500', 'border-green-500', 'bg-red-50', 'bg-green-50', 'pr-10');
      
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
    
    function addValidationIcon(type, className) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'validation-icon absolute right-12 top-1/2 transform -translate-y-1/2 pointer-events-none';
      
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
    
    function validateForm() {
      const isEmailValid = emailRegex.test(emailInput.value);
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
    
    // Form submission
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!emailRegex.test(emailInput.value)) {
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
    
    function showError(message) {
      // Remove any existing error message
      const existingError = newsletterForm.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }
      
      // Create error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message text-red-500 text-sm mt-2 animate-fadeIn';
      errorDiv.textContent = message;
      
      // Add error message to form
      newsletterForm.appendChild(errorDiv);
      
      // Auto-remove error after 4 seconds
      setTimeout(function() {
        errorDiv.classList.add('animate-fadeOut');
        setTimeout(function() {
          errorDiv.remove();
        }, 300);
      }, 4000);
    }
    
    // Add needed animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      
      .animate-fadeOut {
        animation: fadeOut 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
    
    // Initial validation
    validateEmail();
    validateForm();
  });

    // ===== DARK MOOD =====
    document.addEventListener('DOMContentLoaded', function() {
        // Check for saved user preference, default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        // Apply the saved theme on page load
        if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Set the toggle button state based on current theme
        updateToggleUI();
        
        // Add event listener to the theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
          themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Add event listener to the theme dropdown options if they exist
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
          option.addEventListener('click', function() {
            const theme = this.dataset.theme;
            setTheme(theme);
          });
        });
        
        // Function to toggle between light and dark theme
        function toggleTheme() {
          if (document.documentElement.classList.contains('dark')) {
            setTheme('light');
          } else {
            setTheme('dark');
          }
        }
        
        // Function to set theme and save preference
        function setTheme(theme) {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
          } else if (theme === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          
          localStorage.setItem('theme', theme);
          updateToggleUI();
        }
        
        // Function to update toggle button appearance
        function updateToggleUI() {
          const themeToggle = document.getElementById('theme-toggle');
          const currentTheme = localStorage.getItem('theme') || 'light';
          
          if (!themeToggle) return;
          
          // Update button icon
          const moonIcon = themeToggle.querySelector('.moon-icon');
          const sunIcon = themeToggle.querySelector('.sun-icon');
          
          if (moonIcon && sunIcon) {
            if (document.documentElement.classList.contains('dark')) {
              moonIcon.classList.add('hidden');
              sunIcon.classList.remove('hidden');
            } else {
              sunIcon.classList.add('hidden');
              moonIcon.classList.remove('hidden');
            }
          }
          
          // Update dropdown UI if it exists
          const themeOptions = document.querySelectorAll('.theme-option');
          themeOptions.forEach(option => {
            const checkIcon = option.querySelector('.check-icon');
            if (checkIcon) {
              if (option.dataset.theme === currentTheme) {
                checkIcon.classList.remove('hidden');
              } else {
                checkIcon.classList.add('hidden');
              }
            }
          });
        }
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
          if (localStorage.getItem('theme') === 'system') {
            if (event.matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            updateToggleUI();
          }
        });
      });