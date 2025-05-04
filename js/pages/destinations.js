import { apiGet } from '/tsafira-travel-planner/core/api.js';

document.addEventListener('DOMContentLoaded', async function() {
  // DOM elements
  const destinationsContainer = document.getElementById('destinations-container');
  const skeletonContainer = document.getElementById('skeleton-container');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const searchInput = document.querySelector('input[type="text"]');
  const regionSelect = document.querySelector('select:nth-of-type(1)');
  const sortSelect = document.querySelector('select:nth-of-type(3)');
  const applyFiltersBtn = document.querySelector('.btn-primary');
  const clearAllBtn = document.querySelector('button.text-orange-600');
  const resetSearchBtn = document.getElementById('reset-search-btn');
  const noResultsDiv = document.getElementById('no-results');
  const destinationsCountSpan = document.getElementById('destinations-count');
  const viewToggleButtons = document.querySelectorAll('.view-toggle button');
  const mapView = document.getElementById('map-view');
  const popularSearchTags = document.querySelectorAll('.popular-search-tag');
  const filterTags = document.querySelectorAll('.filter-tag');
  const mobileFilterBtn = document.querySelector('.fixed.bottom-6.right-6 button');
  const mobileFilterSheet = document.querySelector('.mobile-filter-sheet');
  const mobileFilterOverlay = document.querySelector('.mobile-filter-overlay');
  const closeFilterSheetBtn = document.getElementById('close-filter-sheet');
  const recentlyViewedSection = document.getElementById('recently-viewed-section');
  const recentlyViewedContainer = document.querySelector('.recently-viewed');

  // Settings
  const destinationsPerLoad = 3;
  let displayedDestinations = 0;
  let allDestinations = [];
  let filteredDestinations = [];
  let currentView = 'grid'/tsafira-travel-planner// 'grid' or 'map'
  let recentlyViewed = [];
  let isLoading = true;

  // Feature mapping for checkboxes
  const featureMapping = {
    "Cultural": ["landmark", "shop", "utensils"],
    "Nature": ["mountain", "sun", "tree", "water"],
    "Luxury": ["spa", "concierge", "glass-martini"],
    "Historical": ["landmark", "monument", "book"],
    "Beaches": ["umbrella-beach", "water"],
    "Culinary": ["utensils", "coffee"]
  };

  // Function to create a destination card with enhanced UI
  function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'tsafira-card bg-white dark:bg-dark-bg-accent rounded-xl overflow-hidden shadow-lg';
    card.setAttribute('data-destination-id', destination.name.toLowerCase());

    // Determine if this is a popular destination (for demo purposes, let's say Marrakech and Casablanca are popular)
    const isPopular = ['Marrakech', 'Casablanca'].includes(destination.name);

    // Create feature icons HTML with enhanced styling
    const featuresHTML = destination.features.map(feature =>
      `<div class="feature-icon">
        <i class="fa-solid fa-${feature}"></i>
      </div>`
    ).join('');

    card.innerHTML = `
      <div class="card-image relative">
        <img src="${destination.image}" alt="${destination.name}" class="w-full h-64 object-cover"/>
        <span class="card-badge badge badge-secondary">${destination.region}</span>
        ${isPopular ? '<span class="popular-badge">Popular</span>' : ''}
        <button class="card-favorite" aria-label="Add to favorites">
          <i class="fa-regular fa-heart text-white text-xl"></i>
        </button>
      </div>
      <div class="card-content p-6">
        <h3 class="text-xl font-bold mb-2 dark:text-gray-100">${destination.name}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">${destination.description}</p>
        <div class="destination-features mb-6">
          ${featuresHTML}
        </div>
        <a href="${destination.url}"
           class="btn-primary w-full py-3 text-center block"
           aria-label="Explore ${destination.name}"
           data-destination="${destination.name}">
          Explore ${destination.name}
        </a>
      </div>
    `;

    // Add event listener to the favorite button
    const favoriteBtn = card.querySelector('.card-favorite');
    favoriteBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.toggle('active');

      const heartIcon = this.querySelector('i');
      if (this.classList.contains('active')) {
        heartIcon.classList.remove('fa-regular');
        heartIcon.classList.add('fa-solid');
      } else {
        heartIcon.classList.remove('fa-solid');
        heartIcon.classList.add('fa-regular');
      }
    });

    // Add event listener to the explore link to track recently viewed
    const exploreLink = card.querySelector('a[data-destination]');
    exploreLink.addEventListener('click', function() {
      addToRecentlyViewed(destination);
    });

    return card;
  }

  // Function to create a recently viewed card
  function createRecentlyViewedCard(destination) {
    const card = document.createElement('div');
    card.className = 'recently-viewed-card bg-white dark:bg-dark-bg-accent rounded-lg overflow-hidden shadow-md flex-shrink-0';

    card.innerHTML = `
      <div class="relative h-24 w-full">
        <img src="${destination.image}" alt="${destination.name}" class="w-full h-full object-cover"/>
      </div>
      <div class="p-3">
        <h4 class="font-medium text-sm dark:text-gray-100">${destination.name}</h4>
        <a href="${destination.url}" class="text-orange-600 dark:text-orange-500 text-xs hover:underline">View again</a>
      </div>
    `;

    return card;
  }

  // Function to add a destination to recently viewed
  function addToRecentlyViewed(destination) {
    // Check if already in recently viewed
    const existingIndex = recentlyViewed.findIndex(item => item.name === destination.name);

    // If exists, remove it (to add it to the front later)
    if (existingIndex !== -1) {
      recentlyViewed.splice(existingIndex, 1);
    }

    // Add to front of array
    recentlyViewed.unshift(destination);

    // Keep only the last 5
    if (recentlyViewed.length > 5) {
      recentlyViewed.pop();
    }

    // Save to localStorage
    localStorage.setItem('tsafira_recently_viewed', JSON.stringify(recentlyViewed));

    // Update the UI
    updateRecentlyViewedUI();
  }

  // Function to update the recently viewed UI
  function updateRecentlyViewedUI() {
    if (recentlyViewed.length === 0) {
      recentlyViewedSection.classList.add('hidden');
      return;
    }

    // Show the section
    recentlyViewedSection.classList.remove('hidden');

    // Clear the container
    recentlyViewedContainer.innerHTML = '';

    // Add each destination
    recentlyViewed.forEach(destination => {
      const card = createRecentlyViewedCard(destination);
      recentlyViewedContainer.appendChild(card);
    });
  }

  // Function to load destinations with loading state
  function loadDestinations() {
    // Show loading state
    isLoading = true;
    skeletonContainer.classList.remove('hidden');
    destinationsContainer.classList.add('hidden');
    noResultsDiv.classList.add('hidden');

    // Clear any existing destinations
    destinationsContainer.innerHTML = '';
    displayedDestinations = 0;

    // Simulate network delay for better UX demonstration
    setTimeout(() => {
      // Hide loading state
      isLoading = false;
      skeletonContainer.classList.add('hidden');

      // Check if we have results
      if (filteredDestinations.length === 0) {
        noResultsDiv.classList.remove('hidden');
        loadMoreBtn.style.display = 'none';
        destinationsCountSpan.textContent = '0';
        return;
      }

      // Show destinations container
      destinationsContainer.classList.remove('hidden');

      // Update count
      destinationsCountSpan.textContent = filteredDestinations.length;

      // Show load more button if we have more destinations than the initial load
      loadMoreBtn.style.display = filteredDestinations.length > destinationsPerLoad ? 'flex' : 'none';

      // Load initial batch
      loadMoreDestinations();
    }, 800); // Simulate network delay
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
    const selectedFeatures = Array.from(document.querySelectorAll('.filter-tag input:checked'))
      .map(cb => cb.closest('.filter-tag').querySelector('span').textContent.trim());

    // Start with all destinations
    filteredDestinations = [...allDestinations];

    // Filter by search term
    if (searchTerm) {
      filteredDestinations = filteredDestinations.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm) ||
        dest.description.toLowerCase().includes(searchTerm) ||
        dest.region.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by region
    if (selectedRegion && selectedRegion !== 'all regions') {
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

    // Sort destinations if needed
    if (sortSelect && sortSelect.value) {
      sortDestinations(sortSelect.value);
    }

    // Load filtered destinations
    loadDestinations();

    // Close mobile filter sheet if open
    closeMobileFilterSheet();
  }

  // Function to sort destinations
  function sortDestinations(sortBy) {
    switch (sortBy) {
      case 'az':
        filteredDestinations.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        filteredDestinations.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'popular':
        // For demo purposes, prioritize Marrakech and Casablanca
        filteredDestinations.sort((a, b) => {
          const popularDestinations = ['Marrakech', 'Casablanca'];
          const aIsPopular = popularDestinations.includes(a.name);
          const bIsPopular = popularDestinations.includes(b.name);

          if (aIsPopular && !bIsPopular) return -1;
          if (!aIsPopular && bIsPopular) return 1;
          return 0;
        });
        break;
      // Add more sorting options as needed
    }
  }

  // Clear all filters
  function clearAllFilters() {
    searchInput.value = '';
    if (regionSelect) regionSelect.selectedIndex = 0;
    if (sortSelect) sortSelect.selectedIndex = 0;

    // Uncheck all filter tags
    document.querySelectorAll('.filter-tag input').forEach(checkbox => {
      checkbox.checked = false;
      checkbox.closest('.filter-tag').classList.remove('active');
    });

    // Reset to all destinations
    filteredDestinations = [...allDestinations];
    loadDestinations();
  }

  // Toggle view between grid and map
  function toggleView(view) {
    currentView = view;

    // Update active button
    viewToggleButtons.forEach(btn => {
      if (btn.textContent.trim().toLowerCase().includes(view)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Show/hide appropriate view
    if (view === 'map') {
      destinationsContainer.classList.add('hidden');
      skeletonContainer.classList.add('hidden');
      mapView.classList.remove('hidden');
      loadMoreBtn.style.display = 'none';
    } else {
      mapView.classList.add('hidden');
      if (!isLoading) {
        destinationsContainer.classList.remove('hidden');
        loadMoreBtn.style.display = filteredDestinations.length > displayedDestinations ? 'flex' : 'none';
      } else {
        skeletonContainer.classList.remove('hidden');
      }
    }
  }

  // Open mobile filter sheet
  function openMobileFilterSheet() {
    mobileFilterSheet.classList.add('open');
    mobileFilterOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'/tsafira-travel-planner// Prevent scrolling
  }

  // Close mobile filter sheet
  function closeMobileFilterSheet() {
    mobileFilterSheet.classList.remove('open');
    mobileFilterOverlay.classList.remove('open');
    document.body.style.overflow = '/tsafira-travel-planner/tsafira-travel-planner// Restore scrolling
  }

  // Handle popular search tag click
  function handlePopularSearchClick(e) {
    const searchTerm = e.target.textContent.trim();
    searchInput.value = searchTerm;
    filterDestinations();
  }

  // Handle filter tag click with enhanced animations
  function handleFilterTagClick(e) {
    const tag = e.currentTarget;
    const checkbox = tag.querySelector('input[type="checkbox"]');
    const iconContainer = tag.querySelector('div');

    // Toggle checkbox state
    checkbox.checked = !checkbox.checked;

    // Toggle active class with enhanced animations
    if (checkbox.checked) {
      tag.classList.add('active');

      // Add ripple effect
      const ripple = document.createElement('span');
      ripple.className = 'absolute inset-0 bg-orange-600 opacity-10 rounded-xl';
      ripple.style.animation = 'rippleEffect 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      tag.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);

      // Animate icon
      if (iconContainer) {
        iconContainer.style.backgroundColor = 'rgba(242, 101, 34, 0.2)';
        iconContainer.style.transform = 'scale(1.1)';
        setTimeout(() => {
          iconContainer.style.transform = '';
        }, 300);
      }
    } else {
      tag.classList.remove('active');
      if (iconContainer) {
        iconContainer.style.backgroundColor = '';
      }
    }

    // Trigger a subtle page-wide animation to draw attention to the change
    const filterSection = tag.closest('.filter-section');
    if (filterSection) {
      filterSection.classList.add('pulse-highlight');
      setTimeout(() => {
        filterSection.classList.remove('pulse-highlight');
      }, 500);
    }
  }

  // Initialize
  async function initialize() {
    try {
      // Load recently viewed from localStorage
      const savedRecentlyViewed = localStorage.getItem('tsafira_recently_viewed');
      if (savedRecentlyViewed) {
        recentlyViewed = JSON.parse(savedRecentlyViewed);
        updateRecentlyViewedUI();
      }

      // Fetch destinations from JSON file
      allDestinations = await apiGet('/tsafira-travel-planner/assets/data/destinations.json');
      filteredDestinations = [...allDestinations];

      // Initial load
      loadDestinations();

      // Add event listeners
      loadMoreBtn.addEventListener('click', loadMoreDestinations);
      if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', filterDestinations);
      if (clearAllBtn) clearAllBtn.addEventListener('click', clearAllFilters);
      if (resetSearchBtn) resetSearchBtn.addEventListener('click', clearAllFilters);

      // View toggle
      viewToggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const view = this.textContent.trim().toLowerCase().includes('map') ? 'map' : 'grid';
          toggleView(view);
        });
      });

      // Mobile filter sheet
      if (mobileFilterBtn) {
        mobileFilterBtn.addEventListener('click', openMobileFilterSheet);
      }

      if (closeFilterSheetBtn) {
        closeFilterSheetBtn.addEventListener('click', closeMobileFilterSheet);
      }

      if (mobileFilterOverlay) {
        mobileFilterOverlay.addEventListener('click', closeMobileFilterSheet);
      }

      // Popular search tags
      popularSearchTags.forEach(tag => {
        tag.addEventListener('click', handlePopularSearchClick);
      });

      // Filter tags
      filterTags.forEach(tag => {
        tag.addEventListener('click', handleFilterTagClick);
      });

      // Add event listener for immediate search
      searchInput.addEventListener('input', function() {
        if (this.value.length > 2 || this.value.length === 0) {
          filterDestinations();
        }
      });

      // Sort select change
      if (sortSelect) {
        sortSelect.addEventListener('change', function() {
          filterDestinations();
        });
      }

      // Smooth scroll for "Start Exploring" button
      const startExploringBtn = document.querySelector('a[href="#search-filters"]');
      if (startExploringBtn) {
        startExploringBtn.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 80, // Adjust for header height
              behavior: 'smooth'
            });
          }
        });
      }

    } catch (error) {
      console.error('Failed to load destinations:', error);
      skeletonContainer.classList.add('hidden');
      destinationsContainer.classList.remove('hidden');
      destinationsContainer.innerHTML = `
        <div class="col-span-full text-center p-8">
          <p class="text-red-600 dark:text-red-400">Failed to load destinations. Please try again later.</p>
          <button class="btn-secondary mt-4" onclick="window.location.reload()">Try Again</button>
        </div>
      `;
      loadMoreBtn.style.display = 'none';
    }
  }

  // Start initialization
  initialize();
});
