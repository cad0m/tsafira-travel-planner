document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Load active tab from localStorage if available
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
      const activeTabButton = document.querySelector(`.tab-button[data-tab="${savedTab}"]`);
      const activeTabPane = document.getElementById(savedTab);
      
      if (activeTabButton && activeTabPane) {
        // Remove active class from all tabs and panes
        tabs.forEach(t => t.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to saved tab and pane
        activeTabButton.classList.add('active');
        activeTabPane.classList.add('active');
      }
    }
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and panes
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding pane
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const tabName = tab.getAttribute('data-tab');
        const tabPane = document.getElementById(tabName);
        tabPane.classList.add('active');
        
        // Save active tab to localStorage
        localStorage.setItem('activeTab', tabName);
        
        // Add animation class based on tab position
        const tabIndex = Array.from(tabs).indexOf(tab);
        const previousTabIndex = Array.from(tabs).findIndex(t => t.classList.contains('active'));
        
        if (tabIndex > previousTabIndex) {
          tabPane.classList.add('slide-in-right');
        } else {
          tabPane.classList.add('slide-in-left');
        }
        
        // Remove animation class after animation completes
        setTimeout(() => {
          tabPane.classList.remove('slide-in-right', 'slide-in-left');
        }, 300);
      });
    });
    
    // Day selector functionality
    const dayButtons = document.querySelectorAll('.day-button');
    dayButtons.forEach(button => {
      button.addEventListener('click', () => {
        dayButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
      });
    });
    
    // Rating functionality
    const stars = document.querySelectorAll('.rating i');
    stars.forEach((star, idx) => {
      star.addEventListener('click', () => {
        stars.forEach((s, i) => {
          if (i <= idx) {
            s.classList.replace('fa-regular', 'fa-solid');
            s.classList.add('active');
          } else {
            s.classList.replace('fa-solid', 'fa-regular');
            s.classList.remove('active');
          }
        });
      });
      
      star.addEventListener('mouseover', () => {
        stars.forEach((s, i) => {
          if (i <= idx) {
            s.classList.add('hover');
          }
        });
      });
      
      star.addEventListener('mouseout', () => {
        stars.forEach(s => s.classList.remove('hover'));
      });
    });
    
    // Fullscreen map functionality
    const fullscreenBtn = document.getElementById('fullscreen-map-btn');
    const journeyMap = document.querySelector('.journey-map');
    
    if (fullscreenBtn && journeyMap) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          journeyMap.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
        } else {
          document.exitFullscreen();
        }
      });
    }
    
    // Textarea expansion
    const textarea = document.querySelector('.feedback-input textarea');
    const expandBtn = document.querySelector('.expand-btn');
    
    if (textarea && expandBtn) {
      expandBtn.addEventListener('click', () => {
        if (textarea.style.height === '200px') {
          textarea.style.height = '100px';
          expandBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
        } else {
          textarea.style.height = '200px';
          expandBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
        }
      });
    }
    
    // Navigation buttons
    const prevDayBtn = document.querySelector('.day-navigation button:first-child');
    const nextDayBtn = document.querySelector('.day-navigation button:last-child');
    
    if (prevDayBtn && nextDayBtn && dayButtons.length) {
      prevDayBtn.addEventListener('click', () => {
        const activeIndex = Array.from(dayButtons).findIndex(btn => btn.classList.contains('active'));
        if (activeIndex > 0) {
          dayButtons[activeIndex - 1].click();
          dayButtons[activeIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
      
      nextDayBtn.addEventListener('click', () => {
        const activeIndex = Array.from(dayButtons).findIndex(btn => btn.classList.contains('active'));
        if (activeIndex < dayButtons.length - 1) {
          dayButtons[activeIndex + 1].click();
          dayButtons[activeIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }
    
    // Meal day navigation
    const prevMealDayBtn = document.getElementById('prev-meal-day');
    const nextMealDayBtn = document.getElementById('next-meal-day');
    
    if (prevMealDayBtn && nextMealDayBtn) {
      let currentDay = 1;
      const totalDays = 8;
      
      const updateMealDay = () => {
        document.querySelector('#meals .day-title h2').textContent = `Day ${currentDay} - ${getDayName(currentDay)}`;
      };
      
      const getDayName = (day) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        // Starting with Monday (March 15)
        return `${days[(day - 1) % 7]}, March ${14 + day}`;
      };
      
      prevMealDayBtn.addEventListener('click', () => {
        if (currentDay > 1) {
          currentDay--;
          updateMealDay();
        }
      });
      
      nextMealDayBtn.addEventListener('click', () => {
        if (currentDay < totalDays) {
          currentDay++;
          updateMealDay();
        }
      });
    }
    
    // Add scroll behavior to day selector
    const daySelector = document.querySelector('.day-selector');
    if (daySelector) {
      daySelector.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          daySelector.scrollLeft += e.deltaY;
        }
      });
    }
    
    // Animate elements when they come into view
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.timeline-card, .card, .meal-card, .transport-card, .recommendation-card, .video-card');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = elementTop < window.innerHeight && elementBottom > 0;
        
        if (isVisible) {
          element.classList.add('fade-in');
        }
      });
    };
    
    // Initial call to animate elements that are already visible
    animateOnScroll();
    
    // Add event listener for scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add accessibility attributes to tabs
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('active'));
      tab.setAttribute('id', `tab-${tab.getAttribute('data-tab')}`);
      
      const tabPane = document.getElementById(tab.getAttribute('data-tab'));
      if (tabPane) {
        tabPane.setAttribute('role', 'tabpanel');
        tabPane.setAttribute('aria-labelledby', `tab-${tab.getAttribute('data-tab')}`);
      }
    });
  
    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
      htmlElement.classList.add('dark');
      updateDarkModeIcon(true);
    }
    
    function updateDarkModeIcon(isDark) {
      if (darkModeToggle) {
        darkModeToggle.innerHTML = isDark 
          ? '<i class="fas fa-sun"></i>' 
          : '<i class="fas fa-moon"></i>';
      }
    }
    
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => {
        const isDarkMode = htmlElement.classList.toggle('dark');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        updateDarkModeIcon(isDarkMode);
      });
    }
  
    // Calendar view functionality
    const calendarViewBtn = document.getElementById('calendar-view-btn');
    const calendarModal = document.getElementById('calendar-modal');
    const closeCalendarBtn = document.getElementById('close-calendar-btn');
    
    if (calendarViewBtn && calendarModal && closeCalendarBtn) {
      calendarViewBtn.addEventListener('click', () => {
        calendarModal.classList.add('active');
      });
      
      closeCalendarBtn.addEventListener('click', () => {
        calendarModal.classList.remove('active');
      });
      
      // Close on click outside the content
      calendarModal.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
          calendarModal.classList.remove('active');
        }
      });
      
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && calendarModal.classList.contains('active')) {
          calendarModal.classList.remove('active');
        }
      });
    }
  
    // Video modal functionality
    const videoCards = document.querySelectorAll('.video-card');
    const videoModal = document.getElementById('video-modal');
    const videoModalTitle = document.getElementById('video-modal-title');
    const closeVideoBtn = document.getElementById('close-video-btn');
    
    if (videoCards.length && videoModal && closeVideoBtn) {
      videoCards.forEach(card => {
        card.addEventListener('click', () => {
          const videoTitle = card.querySelector('.video-title').textContent;
          videoModalTitle.textContent = videoTitle;
          videoModal.classList.add('active');
        });
      });
      
      closeVideoBtn.addEventListener('click', () => {
        videoModal.classList.remove('active');
      });
      
      // Close on click outside the content
      videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
          videoModal.classList.remove('active');
        }
      });
      
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
          videoModal.classList.remove('active');
        }
      });
    }
  
    // Transport tips carousel functionality
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    let carouselInterval;
    
    function showSlide(index) {
      // Hide all slides
      carouselSlides.forEach(slide => {
        slide.classList.remove('active');
      });
      
      // Deactivate all dots
      carouselDots.forEach(dot => {
        dot.classList.remove('active');
      });
      
      // Show the selected slide and activate its dot
      carouselSlides[index].classList.add('active');
      carouselDots[index].classList.add('active');
      
      // Update current slide index
      currentSlide = index;
    }
    
    function nextSlide() {
      showSlide((currentSlide + 1) % carouselSlides.length);
    }
    
    function prevSlide() {
      showSlide((currentSlide - 1 + carouselSlides.length) % carouselSlides.length);
    }
    
    function startCarousel() {
      carouselInterval = setInterval(nextSlide, 5000);
    }
    
    function resetCarousel() {
      clearInterval(carouselInterval);
      startCarousel();
    }
    
    if (carouselSlides.length && prevSlideBtn && nextSlideBtn) {
      // Show first slide initially
      showSlide(0);
      
      // Start automatic carousel
      startCarousel();
      
      // Add event listeners to navigation buttons
      prevSlideBtn.addEventListener('click', () => {
        prevSlide();
        resetCarousel();
      });
      
      nextSlideBtn.addEventListener('click', () => {
        nextSlide();
        resetCarousel();
      });
      
      // Add event listeners to dots
      carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          showSlide(index);
          resetCarousel();
        });
      });
      
      // Pause carousel on hover
      const transportCarousel = document.getElementById('transport-carousel');
      if (transportCarousel) {
        transportCarousel.addEventListener('mouseenter', () => {
          clearInterval(carouselInterval);
        });
        
        transportCarousel.addEventListener('mouseleave', () => {
          startCarousel();
        });
      }
    }
  
    // Recommendation cards hover effects
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    recommendationCards.forEach(card => {
      card.addEventListener('mouseover', () => {
        card.classList.add('hover');
      });
      
      card.addEventListener('mouseout', () => {
        card.classList.remove('hover');
      });
      
      // Add to itinerary functionality
      const addButton = card.querySelector('.recommendation-button');
      if (addButton) {
        addButton.addEventListener('click', () => {
          // Show a confirmation message
          const title = card.querySelector('.recommendation-title').textContent;
          alert(`Added "${title}" to your itinerary!`);
        });
      }
    });
  
    // Day notes expansion
    const dayNotes = document.querySelector('.day-notes');
    if (dayNotes) {
      const notesParagraph = dayNotes.querySelector('p');
      const originalText = notesParagraph.textContent;
      let isExpanded = false;
      
      dayNotes.addEventListener('click', () => {
        if (!isExpanded) {
          notesParagraph.textContent = originalText + ' Pack light layers as temperatures can vary throughout the day. Remember to bring a hat and sunglasses for sun protection. It\'s also recommended to have some local currency for small purchases in the markets.';
          isExpanded = true;
        } else {
          notesParagraph.textContent = originalText;
          isExpanded = false;
        }
      });
    }
  
    // Budget progress bar animation
    const budgetProgressBar = document.querySelector('.budget-progress-bar');
    if (budgetProgressBar) {
      // Set initial width to 0
      budgetProgressBar.style.width = '0';
      
      // Animate to the final width with a slight delay for visual effect
      setTimeout(() => {
        budgetProgressBar.style.width = '75%';
      }, 500);
    }
  
    // Adding tooltips to meal tags
    const mealTags = document.querySelectorAll('.meal-tags i');
    mealTags.forEach(tag => {
      // Using the title attribute for tooltips
      const title = tag.getAttribute('title');
      if (title) {
        tag.setAttribute('aria-label', title);
      }
    });
  
    // Animate budget categories on scroll
    const animateBudgetCategories = () => {
      const budgetCategories = document.querySelectorAll('.budget-category');
      
      budgetCategories.forEach((category, index) => {
        const rect = category.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          setTimeout(() => {
            category.classList.add('fade-in');
          }, index * 150);
        }
      });
    };
    
    animateBudgetCategories();
    window.addEventListener('scroll', animateBudgetCategories);
  
    // Add smooth scrolling to section links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
          document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  });