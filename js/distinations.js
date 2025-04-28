import { apiGet } from '/tsafira-travel-planner/api.js';

document.addEventListener('DOMContentLoaded', async function() {
  // DOM elements
  const destinationsContainer = document.getElementById('destinations-container');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const searchInput = document.querySelector('input[type="text"]');
  const regionSelect = document.querySelector('select:nth-of-type(1)');
  const applyFiltersBtn = document.querySelector('button.bg-orange-600');
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const clearAllBtn = document.querySelector('button.text-orange-600');
  
  // Settings
  const destinationsPerLoad = 3;
  let displayedDestinations = 0;
  let allDestinations = [];
  let filteredDestinations = [];
  
  // Feature mapping for checkboxes
  const featureMapping = {
    "Cultural": ["landmark", "shop", "utensils"],
    "Nature": ["mountain", "sun", "tree", "water"],
    "Luxury": ["spa", "concierge", "glass-martini"],
    "Historical": ["landmark", "monument", "book"]
  };
  
  // Function to create a destination card
  function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-dark-bg-accent rounded-xl overflow-hidden shadow-lg';
    
    // Create feature icons HTML
    const featuresHTML = destination.features.map(feature =>
      `<i class="fa-solid fa-${feature} text-orange-600 dark:text-orange-500"></i>`
    ).join(' ');
    
    card.innerHTML = `
      <div class="relative">
        <img src="${destination.image}" alt="${destination.name}" class="w-full h-64 object-cover"/>
        <span class="absolute top-4 left-4 bg-white dark:bg-dark-bg-accent px-3 py-1 rounded-full text-sm dark:text-gray-100">${destination.region}</span>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2 dark:text-gray-100">${destination.name}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">${destination.description}</p>
        <div class="flex items-center space-x-2 mb-6">
          ${featuresHTML}
        </div>
        <a href="${destination.url}" class="w-full bg-orange-600 text-white py-3 rounded-full hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 text-center block">
          Explore ${destination.name}
        </a>
      </div>
    `;
    
    return card;
  }
  
  // Function to load destinations
  function loadDestinations() {
    // Clear any existing destinations
    destinationsContainer.innerHTML = '';
    displayedDestinations = 0;
    
    // Show load more button if we have more destinations than the initial load
    loadMoreBtn.style.display = filteredDestinations.length > destinationsPerLoad ? 'flex' : 'none';
    
    // Load initial batch
    loadMoreDestinations();
  }
  
  // Function to load more destinations
  function loadMoreDestinations() {
    const nextBatch = filteredDestinations.slice(
      displayedDestinations,
      displayedDestinations + destinationsPerLoad
    );
    
    nextBatch.forEach(destination => {
      const card = createDestinationCard(destination);
      destinationsContainer.appendChild(card);
    });
    
    displayedDestinations += nextBatch.length;
    
    // Hide "Load More" button if all destinations are displayed
    if (displayedDestinations >= filteredDestinations.length) {
      loadMoreBtn.style.display = 'none';
    }
  }
  
  // Function to filter destinations
  function filterDestinations() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedRegion = regionSelect.value.toLowerCase();
    const selectedFeatures = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.nextElementSibling.textContent.trim());
    
    // Start with all destinations
    filteredDestinations = [...allDestinations];
    
    // Filter by search term
    if (searchTerm) {
      filteredDestinations = filteredDestinations.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm) || 
        dest.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by region
    if (selectedRegion && selectedRegion !== 'region') {
      filteredDestinations = filteredDestinations.filter(dest => 
        dest.region.toLowerCase() === selectedRegion
      );
    }
    
    // Filter by features
    if (selectedFeatures.length > 0) {
      filteredDestinations = filteredDestinations.filter(dest => {
        return selectedFeatures.some(feature => {
          const mappedFeatures = featureMapping[feature] || [];
          return mappedFeatures.some(f => dest.features.includes(f));
        });
      });
    }
    
    // Load filtered destinations
    loadDestinations();
  }
  
  // Clear all filters
  function clearAllFilters() {
    searchInput.value = '';
    regionSelect.selectedIndex = 0;
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    // Reset to all destinations
    filteredDestinations = [...allDestinations];
    loadDestinations();
  }
  
  // Initialize
  try {
    // Fetch destinations from JSON file
    allDestinations = await apiGet('/data/distinations.json');
    filteredDestinations = [...allDestinations];
    
    // Initial load
    loadDestinations();
    
    // Add event listeners
    loadMoreBtn.addEventListener('click', loadMoreDestinations);
    applyFiltersBtn.addEventListener('click', filterDestinations);
    clearAllBtn.addEventListener('click', clearAllFilters);
    
    // Add event listener for immediate search
    searchInput.addEventListener('input', function() {
      if (this.value.length > 2 || this.value.length === 0) {
        filterDestinations();
      }
    });
    
  } catch (error) {
    console.error('Failed to load destinations:', error);
    destinationsContainer.innerHTML = `
      <div class="col-span-full text-center p-8">
        <p class="text-red-600 dark:text-red-400">Failed to load destinations. Please try again later.</p>
      </div>
    `;
    loadMoreBtn.style.display = 'none';
  }
});
