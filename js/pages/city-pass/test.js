document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const stage = document.getElementById('carousel-stage');
    const cards = document.querySelectorAll('.carousel-card');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    
    // Variables
    let currentIndex = 0;
    let totalCards = cards.length;
    let isAnimating = false;
    let autoplayInterval;
    let touchStartX = 0;
    
    // Initialize carousel
    function initCarousel() {
      // Set initial state
      updateCarousel();
      
      // Start autoplay
      startAutoplay();
      
      // Add event listeners
      setupEventListeners();
    }
    
    // Update carousel state
    function updateCarousel() {
      cards.forEach((card, index) => {
        // Remove all classes
        card.classList.remove('active', 'prev', 'next');
        
        // Reset any inline transforms
        card.style.transform = '';
        
        // Apply appropriate class based on index
        if (index === currentIndex) {
          card.classList.add('active');
        } else if (index === getPrevIndex()) {
          card.classList.add('prev');
        } else if (index === getNextIndex()) {
          card.classList.add('next');
        }
      });
      
      // Update pagination dots
      paginationDots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    // Get previous index with circular wrapping
    function getPrevIndex() {
      return (currentIndex - 1 + totalCards) % totalCards;
    }
    
    // Get next index with circular wrapping
    function getNextIndex() {
      return (currentIndex + 1) % totalCards;
    }
    
    // Go to specific slide
    function goToSlide(index) {
      if (isAnimating) return;
      if (index === currentIndex) return;
      
      isAnimating = true;
      currentIndex = index;
      updateCarousel();
      
      // Reset animation lock after transition completes
      setTimeout(() => {
        isAnimating = false;
      }, 800); // Match the CSS transition duration
    }
    
    // Go to next slide
    function goToNextSlide() {
      goToSlide(getNextIndex());
    }
    
    // Go to previous slide
    function goToPrevSlide() {
      goToSlide(getPrevIndex());
    }
    
    // Start autoplay
    function startAutoplay() {
      stopAutoplay(); // Clear any existing interval
      autoplayInterval = setInterval(() => {
        goToNextSlide();
      }, 5000); // Change slide every 5 seconds
    }
    
    // Stop autoplay
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    }
    
    // Setup event listeners
    function setupEventListeners() {
      // Navigation buttons
      prevButton.addEventListener('click', () => {
        stopAutoplay();
        goToPrevSlide();
        startAutoplay();
      });
      
      nextButton.addEventListener('click', () => {
        stopAutoplay();
        goToNextSlide();
        startAutoplay();
      });
      
      // Pagination dots
      paginationDots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.getAttribute('data-index'));
          stopAutoplay();
          goToSlide(index);
          startAutoplay();
        });
      });
      
      // Pause autoplay on hover
      stage.addEventListener('mouseenter', stopAutoplay);
      stage.addEventListener('mouseleave', startAutoplay);
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          stopAutoplay();
          goToPrevSlide();
          startAutoplay();
        } else if (e.key === 'ArrowRight') {
          stopAutoplay();
          goToNextSlide();
          startAutoplay();
        }
      });
      
      // Touch events for mobile swipe
      stage.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
      }, { passive: true });
      
      stage.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;
        
        if (Math.abs(diffX) > 50) { // Minimum swipe distance
          if (diffX > 0) {
            goToNextSlide(); // Swipe left
          } else {
            goToPrevSlide(); // Swipe right
          }
        }
        
        startAutoplay();
      }, { passive: true });
      
      // Add animation on load
      cards.forEach((card, index) => {
        // Set initial state - out of view
        if (index !== currentIndex && index !== getPrevIndex() && index !== getNextIndex()) {
          card.style.transform = 'translateX(100%) scale(0.8)';
          card.style.opacity = '0';
        }
        
        // Animate in after a short delay
        setTimeout(() => {
          card.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
          updateCarousel();
        }, 100);
      });
    }
    
    // Initialize the carousel
    initCarousel();
  });