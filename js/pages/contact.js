import { initCommonPageFunctions } from '../utils/page-common.js';
import { validateInput, isValidEmail, isValidPhone, isValidName } from '../utils/validate.js';
    
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Contact page initialized');
      
      // Initialize common page functionality
      initCommonPageFunctions();
      
      // Tab switching 
      document.getElementById('general-tab').addEventListener('click', function() { 
        document.getElementById('general-form').classList.remove('hidden'); 
        document.getElementById('press-form').classList.add('hidden'); 
        this.classList.add('text-[var(--color-primary)]', 'border-b-2', 'border-[var(--color-primary)]'); 
        document.getElementById('press-tab').classList.remove('text-[var(--color-primary)]', 'border-b-2', 'border-[var(--color-primary)]');
        document.getElementById('press-tab').classList.add('text-[var(--color-text-muted)]');
      }); 
      
      document.getElementById('press-tab').addEventListener('click', function() { 
        document.getElementById('press-form').classList.remove('hidden'); 
        document.getElementById('general-form').classList.add('hidden'); 
        this.classList.add('text-[var(--color-primary)]', 'border-b-2', 'border-[var(--color-primary)]'); 
        document.getElementById('general-tab').classList.remove('text-[var(--color-primary)]', 'border-b-2', 'border-[var(--color-primary)]');
        document.getElementById('general-tab').classList.add('text-[var(--color-text-muted)]');
      });
      
      // Form validation for general inquiries
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        
        // Add blur event listeners to validate fields
        formInputs.forEach(input => {
          if (input.type !== 'checkbox') {
            input.addEventListener('blur', function() {
              validateInput(this);
            });
          }
        });
        
        // Form submission
        contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          let isValid = true;
          
          // Validate all fields
          formInputs.forEach(input => {
            if (input.type !== 'checkbox') {
              if (!validateInput(input)) {
                isValid = false;
              }
            }
          });
          
          if (isValid) {
            // Here you would normally send the form data to the server
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
          }
        });
      }
      
      // Form validation for press inquiries
      const pressForm = document.getElementById('press-contact-form');
      if (pressForm) {
        const formInputs = pressForm.querySelectorAll('input, textarea, select');
        
        // Add blur event listeners to validate fields
        formInputs.forEach(input => {
          if (input.type !== 'checkbox') {
            input.addEventListener('blur', function() {
              validateInput(this);
            });
          }
        });
        
        // Form submission
        pressForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          let isValid = true;
          
          // Validate all fields
          formInputs.forEach(input => {
            if (input.type !== 'checkbox') {
              if (!validateInput(input)) {
                isValid = false;
              }
            }
          });
          
          if (isValid) {
            // Here you would normally send the form data to the server
            alert('Thank you for your inquiry! Our team will contact you within 48 hours.');
            pressForm.reset();
          }
        });
      }
      
      // Initialize FAQ toggles
      setupFAQs();
    });
    
    /**
     * Sets up FAQ toggle functionality
     */
    function setupFAQs() {
      // Get all the toggles
      const toggles = document.querySelectorAll('.faq-toggle');
      console.log('Found', toggles.length, 'FAQ toggles');
      
      // Add click handler to each toggle
      for (let i = 0; i < toggles.length; i++) {
        const toggle = toggles[i];
        
        // Add click handler
        toggle.onclick = function() {
          // Get the next element (content panel) and the icon
          const content = this.nextElementSibling;
          const icon = this.querySelector('i');
          
          // Toggle hidden class
          if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
          } else {
            content.classList.add('hidden');
          }
          
          // Toggle icon
          if (icon) {
            if (icon.classList.contains('fa-chevron-down')) {
              icon.classList.remove('fa-chevron-down');
              icon.classList.add('fa-chevron-up');
            } else {
              icon.classList.remove('fa-chevron-up');
              icon.classList.add('fa-chevron-down');
            }
          }
        };
      }
    }