/**
 * How It Works page functionality for Tsafira
 */

document.addEventListener('DOMContentLoaded', function() {
  initScrollProgress();
  initFaqToggles();
  initTestimonials();
  fixPageLinks();
});

/**
 * Initialize scroll progress indicator
 */
function initScrollProgress() {
  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  
  if (!scrollProgressBar) return;
  
  // Update scroll progress on scroll
  function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    scrollProgressBar.style.width = scrolled + '%';
  }
  
  // Listen for scroll events
  window.addEventListener('scroll', updateScrollProgress);
  
  // Initial update
  updateScrollProgress();
}

/**
 * Initialize FAQ accordion toggles
 */
function initFaqToggles() {
  const faqToggles = document.querySelectorAll('.faq-toggle');
  
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('i');
      
      // Toggle content visibility
      content.classList.toggle('hidden');
      
      // Update icon
      if (content.classList.contains('hidden')) {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      } else {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      }
    });
  });
}

/**
 * Initialize testimonial slider
 */
function initTestimonials() {
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  
  // Handle dot navigation
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      // Hide all slides
      testimonialSlides.forEach(slide => slide.classList.add('hidden'));
      
      // Show selected slide
      testimonialSlides[index].classList.remove('hidden');
      
      // Update dots
      testimonialDots.forEach(d => {
        d.classList.remove('bg-[var(--color-primary)]');
        d.classList.add('bg-[var(--color-border)]');
      });
      
      // Highlight active dot
      dot.classList.remove('bg-[var(--color-border)]');
      dot.classList.add('bg-[var(--color-primary)]');
    });
  });
}

/**
 * Fix links and paths in the page
 */
function fixPageLinks() {
  // Fix wizard link path
  const getStartedButton = document.querySelector('a[href="/wizard.html"]');
  if (getStartedButton) {
    getStartedButton.href = '/pages/index.html';
  }
  
  // Highlight current page in navigation
  document.addEventListener('allPartialsLoaded', function() {
    const howItWorksLinks = document.querySelectorAll('a[href="/pages/how-it-works.html"]');
    howItWorksLinks.forEach(link => {
      link.classList.add('text-[var(--color-primary)]');
      link.classList.add('font-semibold');
    });
  });
}

// Export main functions
export default {
  initScrollProgress,
  initFaqToggles,
  initTestimonials,
  fixPageLinks
};