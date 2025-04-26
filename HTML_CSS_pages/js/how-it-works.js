
  document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu functionality
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const closeMenuButton = document.getElementById("close-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

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

  // Handle user authentication display
  if (window.currentUser) {
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
});
    
    // FAQ Toggles
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const content = toggle.nextElementSibling;
        content.classList.toggle('hidden');
        
        // Update icon
        const icon = toggle.querySelector('i');
        if (content.classList.contains('hidden')) {
          icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        } else {
          icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
      });
    });
    
    // Testimonial Slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let currentSlide = 0;
    
    function showSlide(n) {
      // Hide all slides
      slides.forEach(slide => slide.classList.add('hidden'));
      dots.forEach(dot => dot.classList.replace('bg-orange-600', 'bg-gray-300'));
      
      // Show the current slide
      slides[n].classList.remove('hidden');
      dots[n].classList.replace('bg-gray-300', 'bg-orange-600');
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }
    
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }
    
    // Add event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Add click events to dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });
    
    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Initialize first slide
    showSlide(0);

    document.addEventListener('DOMContentLoaded', function() {
        const scrollProgressBar = document.querySelector('.scroll-progress-bar');
        
        function updateScrollProgress() {
          const scrollPosition = window.scrollY;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercentage = (scrollPosition / scrollHeight) * 100;
          
          scrollProgressBar.style.width = `${scrollPercentage}%`;
          
          // Add a subtle animation effect when scrolling
          scrollProgressBar.style.boxShadow = `0 1px ${3 + scrollPercentage/20}px rgba(242, 101, 34, 0.4)`;
        }
        
        window.addEventListener('scroll', updateScrollProgress);
        
        // Initialize on page load
        updateScrollProgress();
      });