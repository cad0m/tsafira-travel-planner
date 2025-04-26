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