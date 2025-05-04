/**
 * Configuration file for Tsafira website
 * Contains CSS selectors and default constants
 */

// CSS selectors for various DOM elements
export const selectors = {
  // Header and footer placeholders
  headerPlaceholder: '#header-placeholder',
  footerPlaceholder: '#footer-placeholder',

  // Mobile menu elements
  mobileMenuButton: '#mobile-menu-button',
  closeMenuButton: '#close-menu-button',
  mobileMenu: '#mobile-menu',

  // Navigation and auth elements
  navActions: '#nav-actions',

  // Testimonial carousel elements
  testimonialContainer: '.testimonial-container',
  carouselDots: '#carousel-dots',

  // Scroll progress bar
  scrollProgressBar: '.scroll-progress-bar',

  // Newsletter form
  newsletterForm: '#newsletter form',
  emailInput: '#newsletter input[type="email"]',
  subscribeButton: '#newsletter button[type="submit"]',
  checkbox: '#newsletter input[type="checkbox"]',
  newsletterContainer: '#newsletter .container .max-w-2xl'
};

// Default configuration values
export const defaults = {
  carouselAutoplayDelay: 5000, // Milliseconds between testimonial slides
  apiBaseUrl: '/api', // Base URL for API calls
  headerColor: {
    transparent: 'bg-transparent',
    solid: 'bg-white shadow-sm'
  }
};

// Pages configuration
export const pages = {
  index: 'index',
  destinations: 'destinations',
  howItWorks: 'how-it-works',
  about: 'about',
  contact: 'contact'
};

// Path to partials
export const partials = {
  header: '../partials/header.html',
  footer: '../partials/footer.html'
};