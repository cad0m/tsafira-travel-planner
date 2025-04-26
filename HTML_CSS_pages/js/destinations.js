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
        // Define all your destinations data
        const allDestinations = [
          {
            name: "Marrakech",
            description: "The Red City with its bustling souks and historic medina",
            image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/142411fd97-29251fbcae2275a38d4e.png",
            region: "North",
            url: "/destinations/marrakech.html",
            features: ["landmark", "utensils", "shop"]
          },
          {
            name: "Rabat",
            description: "Elegant capital with coastal views and UNESCO heritage",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/81/Tour_Hassan-Rabat-2.jpg",
            region: "West",
            url: "/destinations/rabat.html",
            features: ["landmark", "utensils", "shop"]
          },
          {
            name: "Casablanca",
            description: "Big, modern coastal city with a unique blend of old and new.",
            image: "https://www.leben-pur.ch/wp-content/uploads/2025/01/Leben-pur-250117-13-48-004-scaled.jpg",
            region: "West",
            url: "/destinations/casablanca.html",
            features: ["landmark", "utensils", "shop"]
          },
          {
            name: "Chefchaouen",
            description: "The blue city nestled in the Rif Mountains",
            image: "https://www.kanaga-at.com/wp-content/uploads/2021/07/marocco_chefchaouen.jpg",
            region: "North",
            url: "/destinations/chefchaouen.html",
            features: ["landmark", "utensils", "shop"]
          },
          {
            name: "Fes",
            description: "Ancient cultural capital with the oldest university in the world",
            image: "https://cdn.bookaway.com/media/files/664dd55445e0b81f2d7f97ee.jpeg?width=1000&quality=20",
            region: "Central",
            url: "/destinations/fes.html",
            features: ["landmark", "utensils", "shop"]
          },
          {
            name: "Essaouira",
            description: "Coastal gem with Portuguese influences and windy beaches",
            image: "https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/03/02/11/istock-171589110.jpg",
            region: "West",
            url: "/destinations/essaouira.html",
            features: ["landmark", "utensils", "shop"]
          },
          {
            name: "Merzouga",
            description: "Gateway to the Sahara Desert with stunning sand dunes",
            image: "https://www.naturallymorocco.co.uk/cms/destinations/13_6399d3af3eb59s_0.jpg?v=1686562388",
            region: "South",
            url: "/destinations/merzouga.html",
            features: ["landmark", "shop"]
          },
          {
            name: "Tangier",
            description: "Historic port city where the Mediterranean meets the Atlantic",
            image: "https://bluedoorcuisine.com/wp-content/uploads/2019/12/tangier-morocco.jpg",
            region: "North",
            url: "/destinations/tangier.html",
            features: ["landmark", "utensils", "shop"]
          },
          {
            name: "Agadir",
            description: "Modern resort town with beautiful beaches",
            image: "https://exploreessaouira.com/wp-content/uploads/2024/10/Agadir-sunset-1200x900.jpg",
            region: "South",
            url: "/destinations/agadir.html",
            features: ["utensils", "shop"]
          }
        ];
        
        const destinationsContainer = document.getElementById('destinations-container');
        const loadMoreBtn = document.getElementById('load-more-btn');
        
        // Number of destinations to show initially and each time "Load More" is clicked
        const destinationsPerLoad = 3;
        let displayedDestinations = 0;
        
        // Function to create a destination card
        function createDestinationCard(destination) {
          const card = document.createElement('div');
          card.className = 'bg-white rounded-xl overflow-hidden shadow-lg';
          
          // Create feature icons HTML
          const featuresHTML = destination.features.map(feature => 
            `<i class="fa-solid fa-${feature} text-orange-600"></i>`
          ).join(' ');
          
          card.innerHTML = `
            <div class="relative">
              <img src="${destination.image}" alt="${destination.name}" class="w-full h-64 object-cover"/>
              <span class="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm">${destination.region}</span>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">${destination.name}</h3>
              <p class="text-gray-600 mb-4">${destination.description}</p>
              <div class="flex items-center space-x-2 mb-6">
                ${featuresHTML}
              </div>
              <a href="${destination.url}" class="w-full bg-orange-600 text-white py-3 rounded-full hover:bg-orange-700 text-center block">
                Explore ${destination.name}
              </a>
            </div>
          `;
          
          return card;
        }
        
        // Function to load more destinations
        function loadMoreDestinations() {
          const nextBatch = allDestinations.slice(
            displayedDestinations, 
            displayedDestinations + destinationsPerLoad
          );
          
          nextBatch.forEach(destination => {
            const card = createDestinationCard(destination);
            destinationsContainer.appendChild(card);
          });
          
          displayedDestinations += nextBatch.length;
          
          // Hide "Load More" button if all destinations are displayed
          if (displayedDestinations >= allDestinations.length) {
            loadMoreBtn.style.display = 'none';
          }
        }
        
        // Initial load
        loadMoreDestinations();
        
        // Add click event listener to "Load More" button
        loadMoreBtn.addEventListener('click', loadMoreDestinations);
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