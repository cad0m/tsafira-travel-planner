/**
 * Modal Components
 * Reusable components for building modals
 */

import { showToast } from './dom-utils.js';

/**
 * Create amenities modal
 * @param {Array} amenities - Array of amenity objects
 * @returns {Object} - Modal HTML structure and handlers
 */
export function createAmenitiesModal(amenities) {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close-modal-btn';
  closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
  closeButton.setAttribute('aria-label', 'Close modal');

  // Get all amenities
  const baseAmenities = [];
  document.querySelectorAll('.amenity-item').forEach(item => {
    baseAmenities.push({
      icon: item.querySelector('i').className,
      name: item.querySelector('span').textContent
    });
  });

  // Add more amenities for the modal
  const extraAmenities = [
    { icon: 'fa-solid fa-tv', name: 'Flat-screen TV' },
    { icon: 'fa-solid fa-mug-hot', name: 'Coffee Machine' },
    { icon: 'fa-solid fa-bath', name: 'Bathtub' },
    { icon: 'fa-solid fa-shower', name: 'Rain Shower' },
    { icon: 'fa-solid fa-fan', name: 'Ceiling Fan' },
    { icon: 'fa-solid fa-lock', name: 'In-room Safe' },
    { icon: 'fa-solid fa-phone', name: 'Telephone' },
    { icon: 'fa-solid fa-iron', name: 'Iron & Ironing Board' }
  ];

  // Combine all amenities
  const allAmenities = [...baseAmenities, ...extraAmenities];

  // Create amenities content
  const amenitiesContent = document.createElement('div');
  amenitiesContent.className = 'all-amenities-content';

  // Add title
  const title = document.createElement('h2');
  title.textContent = 'All Amenities';
  amenitiesContent.appendChild(title);

  // Create amenities grid
  const amenitiesGrid = document.createElement('div');
  amenitiesGrid.className = 'all-amenities-grid';

  // Add amenities to grid
  allAmenities.forEach(amenity => {
    const amenityItem = document.createElement('div');
    amenityItem.className = 'amenity-item';
    amenityItem.innerHTML = `
      <i class="${amenity.icon}"></i>
      <span>${amenity.name}</span>
    `;
    amenitiesGrid.appendChild(amenityItem);
  });

  amenitiesContent.appendChild(amenitiesGrid);

  // Add styles for amenities modal
  const style = document.createElement('style');
  style.textContent = `
    .all-amenities-content h2 {
      margin-bottom: var(--spacing-6);
      text-align: center;
    }

    .all-amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--spacing-4);
    }

    @media (max-width: 768px) {
      .all-amenities-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `;

  document.head.appendChild(style);

  // Append elements to modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(amenitiesContent);
  modalOverlay.appendChild(modalContent);

  // Function to show modal
  function show() {
    // Append modal to body
    document.body.appendChild(modalOverlay);

    // Show modal with animation
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 10);

    // Add close event listener
    closeButton.addEventListener('click', close);

    // Close modal when clicking outside content
    modalOverlay.addEventListener('click', event => {
      if (event.target === modalOverlay) {
        close();
      }
    });
  }

  // Function to close modal
  function close() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      modalOverlay.remove();
    }, 300);
  }

  // Return modal structure and handlers
  return {
    modalElement: modalOverlay,
    show,
    close
  };
}

/**
 * Create change stay modal
 * @returns {Object} - Modal HTML structure and handlers
 */
export function createChangeStayModal() {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close-modal-btn';
  closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
  closeButton.setAttribute('aria-label', 'Close modal');

  // Create change stay content
  const changeStayContent = document.createElement('div');
  changeStayContent.className = 'change-stay-content';
  changeStayContent.innerHTML = `
    <h2>Change Your Stay</h2>
    <p>Modify your accommodation details below.</p>

    <div class="stay-form">
      <div class="form-group">
        <label for="check-in-date">Check-in Date</label>
        <input type="date" id="check-in-date" value="2025-03-15">
      </div>

      <div class="form-group">
        <label for="check-out-date">Check-out Date</label>
        <input type="date" id="check-out-date" value="2025-03-22">
      </div>

      <div class="form-group">
        <label for="room-type">Room Type</label>
        <select id="room-type">
          <option value="deluxe">Deluxe Suite with Garden View</option>
          <option value="superior">Superior Suite with Pool View</option>
          <option value="standard">Standard Room</option>
          <option value="family">Family Suite</option>
        </select>
      </div>

      <div class="form-group">
        <label for="guests">Number of Guests</label>
        <div class="guests-selector">
          <button class="guest-btn" id="decrease-guests">-</button>
          <input type="number" id="guests" value="2" min="1" max="4">
          <button class="guest-btn" id="increase-guests">+</button>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-outline">Cancel</button>
        <button class="btn btn-primary">Update Stay</button>
      </div>
    </div>
  `;

  // Add styles for change stay modal
  const style = document.createElement('style');
  style.textContent = `
    .change-stay-content h2 {
      margin-bottom: var(--spacing-2);
    }

    .change-stay-content p {
      margin-bottom: var(--spacing-6);
      color: var(--color-gray-600);
    }

    .dark .change-stay-content p {
      color: var(--color-gray-400);
    }

    .stay-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .form-group label {
      font-weight: 500;
    }

    .form-group input,
    .form-group select {
      padding: var(--spacing-3);
      border: 1px solid var(--color-gray-300);
      border-radius: var(--border-radius-lg);
      font-family: inherit;
    }

    .dark .form-group input,
    .dark .form-group select {
      background-color: var(--color-gray-200);
      border-color: var(--color-gray-400);
      color: var(--color-gray-800);
    }

    .guests-selector {
      display: flex;
      align-items: center;
    }

    .guests-selector input {
      width: 60px;
      text-align: center;
      margin: 0 var(--spacing-2);
    }

    .guest-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-gray-100);
      border: 1px solid var(--color-gray-300);
      border-radius: var(--border-radius-lg);
      font-size: 1.25rem;
      transition: all var(--transition-fast);
    }

    .dark .guest-btn {
      background-color: var(--color-gray-200);
      border-color: var(--color-gray-400);
      color: var(--color-gray-800);
    }

    .guest-btn:hover {
      background-color: var(--color-gray-200);
    }

    .dark .guest-btn:hover {
      background-color: var(--color-gray-300);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-4);
      margin-top: var(--spacing-4);
    }
  `;

  document.head.appendChild(style);

  // Append elements to modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(changeStayContent);
  modalOverlay.appendChild(modalContent);

  // Function to show modal
  function show() {
    // Append modal to body
    document.body.appendChild(modalOverlay);

    // Show modal with animation
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 10);

    // Add close event listener
    closeButton.addEventListener('click', close);

    // Close modal when clicking outside content
    modalOverlay.addEventListener('click', event => {
      if (event.target === modalOverlay) {
        close();
      }
    });

    // Add guest count functionality
    const decreaseBtn = modalContent.querySelector('#decrease-guests');
    const increaseBtn = modalContent.querySelector('#increase-guests');
    const guestsInput = modalContent.querySelector('#guests');

    if (decreaseBtn && increaseBtn && guestsInput) {
      decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(guestsInput.value);
        if (currentValue > 1) {
          guestsInput.value = currentValue - 1;
        }
      });

      increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(guestsInput.value);
        if (currentValue < 4) {
          guestsInput.value = currentValue + 1;
        }
      });
    }

    // Add form actions functionality
    const cancelBtn = modalContent.querySelector('.form-actions .btn-outline');
    const updateBtn = modalContent.querySelector('.form-actions .btn-primary');

    if (cancelBtn && updateBtn) {
      cancelBtn.addEventListener('click', close);

      updateBtn.addEventListener('click', () => {
        showToast('Stay updated successfully!');
        close();
      });
    }
  }

  // Function to close modal
  function close() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      modalOverlay.remove();
    }, 300);
  }

  // Return modal structure and handlers
  return {
    modalElement: modalOverlay,
    show,
    close
  };
}

/**
 * Create map modal
 * @returns {Object} - Modal HTML structure and handlers
 */
export function createMapModal() {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.maxWidth = '90%';
  modalContent.style.height = '80vh';
  modalContent.style.padding = '0';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close-modal-btn';
  closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
  closeButton.setAttribute('aria-label', 'Close modal');
  closeButton.style.zIndex = '20';

  // Create map content
  const mapContent = document.createElement('div');
  mapContent.className = 'fullscreen-map';
  mapContent.style.width = '100%';
  mapContent.style.height = '100%';

  // Get the current map image
  const currentMapImage = document.querySelector('.journey-map img');

  if (currentMapImage) {
    mapContent.innerHTML = `
      <img src="${currentMapImage.src}" alt="Journey map" style="width: 100%; height: 100%; object-fit: cover;">
    `;
  } else {
    mapContent.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: var(--color-gray-100);">
        <p>Map not available</p>
      </div>
    `;
  }

  // Append elements to modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(mapContent);
  modalOverlay.appendChild(modalContent);

  // Function to show modal
  function show() {
    // Append modal to body
    document.body.appendChild(modalOverlay);

    // Show modal with animation
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 10);

    // Add close event listener
    closeButton.addEventListener('click', close);

    // Close modal when clicking outside content
    modalOverlay.addEventListener('click', event => {
      if (event.target === modalOverlay) {
        close();
      }
    });
  }

  // Function to close modal
  function close() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      modalOverlay.remove();
    }, 300);
  }

  // Return modal structure and handlers
  return {
    modalElement: modalOverlay,
    show,
    close
  };
}

/**
 * Create share modal
 * @returns {Object} - Modal HTML structure and handlers
 */
export function createShareModal() {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close-modal-btn';
  closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
  closeButton.setAttribute('aria-label', 'Close modal');

  // Create share content
  const shareContent = document.createElement('div');
  shareContent.className = 'share-content';
  shareContent.innerHTML = `
    <h2>Share Your Itinerary</h2>
    <p>Share this itinerary with your travel companions.</p>

    <div class="share-options">
      <button class="share-option" data-type="email">
        <i class="fa-solid fa-envelope"></i>
        <span>Email</span>
      </button>
      <button class="share-option" data-type="whatsapp">
        <i class="fa-brands fa-whatsapp"></i>
        <span>WhatsApp</span>
      </button>
      <button class="share-option" data-type="link">
        <i class="fa-solid fa-link"></i>
        <span>Copy Link</span>
      </button>
    </div>

    <div class="share-link-container">
      <input type="text" value="https://tsafira.com/itinerary/mor-2025-03-15" readonly>
      <button class="btn btn-primary" id="copy-link-btn">Copy</button>
    </div>
  `;

  // Add styles for share modal
  const style = document.createElement('style');
  style.textContent = `
    .share-content h2 {
      margin-bottom: var(--spacing-4);
    }

    .share-content p {
      margin-bottom: var(--spacing-6);
      color: var(--color-gray-600);
    }

    .dark .share-content p {
      color: var(--color-gray-400);
    }

    .share-options {
      display: flex;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-6);
    }

    .share-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-4);
      border-radius: var(--border-radius-lg);
      background-color: var(--color-gray-100);
      transition: all var(--transition-fast);
      flex: 1;
    }

    .dark .share-option {
      background-color: var(--color-gray-200);
    }

    .share-option:hover {
      background-color: var(--color-gray-200);
      transform: translateY(-2px);
    }

    .dark .share-option:hover {
      background-color: var(--color-gray-300);
    }

    .share-option i {
      font-size: 1.5rem;
      color: var(--color-primary);
    }

    .share-link-container {
      display: flex;
      gap: var(--spacing-2);
    }

    .share-link-container input {
      flex: 1;
      padding: var(--spacing-3);
      border: 1px solid var(--color-gray-300);
      border-radius: var(--border-radius-lg);
      font-family: inherit;
    }

    .dark .share-link-container input {
      background-color: var(--color-gray-200);
      border-color: var(--color-gray-400);
      color: var(--color-gray-800);
    }
  `;

  document.head.appendChild(style);

  // Append elements to modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(shareContent);
  modalOverlay.appendChild(modalContent);

  // Function to show modal
  function show() {
    // Append modal to body
    document.body.appendChild(modalOverlay);

    // Show modal with animation
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 10);

    // Add close event listener
    closeButton.addEventListener('click', close);

    // Close modal when clicking outside content
    modalOverlay.addEventListener('click', event => {
      if (event.target === modalOverlay) {
        close();
      }
    });

    // Add copy link functionality
    const copyButton = modalContent.querySelector('#copy-link-btn');
    const linkInput = modalContent.querySelector('.share-link-container input');

    if (copyButton && linkInput) {
      copyButton.addEventListener('click', () => {
        linkInput.select();
        document.execCommand('copy');
        showToast('Link copied to clipboard!');
      });
    }

    // Add share option functionality
    const shareOptions = modalContent.querySelectorAll('.share-option');

    shareOptions.forEach(option => {
      option.addEventListener('click', () => {
        const type = option.getAttribute('data-type');
        showToast(`Sharing via ${type}...`);

        // In a real app, this would open the appropriate sharing method
        setTimeout(() => {
          close();
        }, 1000);
      });
    });
  }

  // Function to close modal
  function close() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      modalOverlay.remove();
    }, 300);
  }

  // Return modal structure and handlers
  return {
    modalElement: modalOverlay,
    show,
    close
  };
}

/**
 * Create local guide modal
 * @returns {Object} - Modal HTML structure and handlers
 */
export function createLocalGuideModal() {
  // Get guide data from recommendations
  const appState = window.appState || {};
  const recommendationsData = appState.recommendationsData || {};
  const guides = recommendationsData.guides || [];

  // Define filter options
  const filterOptions = {
    locations: [
      "Marrakech",
      "Fez",
      "Casablanca",
      "Rabat",
      "Tangier",
      "Essaouira",
      "Chefchaouen",
      "Merzouga",
      "Atlas Mountains",
      "Zagora",
      "Ourika Valley",
      "Meknes"
    ],
    languages: [
      "English",
      "French",
      "Arabic",
      "Spanish",
      "German",
      "Italian",
      "Berber",
      "Portuguese",
      "Russian",
      "Chinese"
    ],
    specializations: [
      "History & Culture",
      "Food & Cuisine",
      "Trekking & Nature",
      "Architecture",
      "Desert Expeditions",
      "Shopping & Crafts",
      "Photography",
      "Family Tours",
      "Adventure Sports",
      "Religious Sites"
    ],
    filters: {
      minimum_rating: [4.0, 4.5, 4.8, 5.0],
      price_ranges: [
        {"label": "Budget", "min": 0, "max": 40},
        {"label": "Standard", "min": 41, "max": 60},
        {"label": "Premium", "min": 61, "max": 100}
      ],
      experience_years: [
        {"label": "All", "min": 0},
        {"label": "5+ years", "min": 5},
        {"label": "10+ years", "min": 10},
        {"label": "15+ years", "min": 15}
      ]
    }
  };

  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content guide-modal';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close-modal-btn';
  closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
  closeButton.setAttribute('aria-label', 'Close modal');

  // Create content
  const guideContent = document.createElement('div');
  guideContent.className = 'guide-modal-content';

  // Create header section
  const header = document.createElement('div');
  header.className = 'guide-modal-header';
  header.innerHTML = `
    <h2>Find a Local Guide</h2>
    <p>Connect with experienced local guides to enhance your trip.</p>
  `;

  // Create filter section
  const filterSection = document.createElement('div');
  filterSection.className = 'guide-filter-section';

  // Get current trip dates from appState
  const planData = appState.planData || {};
  const tripDates = planData.trip?.dates || {
    start: "March 15, 2025"
  };
  const defaultDate = new Date(tripDates.start);
  const formattedDefaultDate = defaultDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  // Basic filters (Location, Date, Language)
  const basicFilters = document.createElement('div');
  basicFilters.className = 'guide-basic-filters';

  // Location filter
  const locationFilter = document.createElement('div');
  locationFilter.className = 'filter-group';
  locationFilter.innerHTML = `
    <label for="guide-location">Location</label>
    <select id="guide-location" class="filter-select">
      <option value="">All Locations</option>
      ${filterOptions.locations.map(location => `<option value="${location}">${location}</option>`).join('')}
    </select>
  `;

  // Date filter
  const dateFilter = document.createElement('div');
  dateFilter.className = 'filter-group';
  dateFilter.innerHTML = `
    <label for="guide-date">Date</label>
    <div class="date-input-wrapper">
      <input type="date" id="guide-date" value="${formattedDefaultDate}">
      <i class="fa-regular fa-calendar"></i>
    </div>
  `;

  // Language filter
  const languageFilter = document.createElement('div');
  languageFilter.className = 'filter-group';
  languageFilter.innerHTML = `
    <label for="guide-language">Language</label>
    <select id="guide-language" class="filter-select">
      <option value="">All Languages</option>
      ${filterOptions.languages.map(language => `<option value="${language}">${language}</option>`).join('')}
    </select>
  `;

  // Add basic filters to the filter section
  basicFilters.appendChild(locationFilter);
  basicFilters.appendChild(dateFilter);
  basicFilters.appendChild(languageFilter);

  // Advanced filters section (initially hidden)
  const advancedFilters = document.createElement('div');
  advancedFilters.className = 'guide-advanced-filters';
  advancedFilters.style.display = 'none';

  // Specialization filter
  const specializationFilter = document.createElement('div');
  specializationFilter.className = 'filter-group';
  specializationFilter.innerHTML = `
    <label for="guide-specialization">Specialization</label>
    <select id="guide-specialization" class="filter-select">
      <option value="">All Specializations</option>
      ${filterOptions.specializations.map(spec => `<option value="${spec}">${spec}</option>`).join('')}
    </select>
  `;

  // Rating filter
  const ratingFilter = document.createElement('div');
  ratingFilter.className = 'filter-group';
  ratingFilter.innerHTML = `
    <label for="guide-rating">Minimum Rating</label>
    <select id="guide-rating" class="filter-select">
      <option value="0">Any Rating</option>
      ${filterOptions.filters.minimum_rating.map(rating => `<option value="${rating}">${rating}+</option>`).join('')}
    </select>
  `;

  // Price range filter
  const priceFilter = document.createElement('div');
  priceFilter.className = 'filter-group';
  priceFilter.innerHTML = `
    <label for="guide-price">Price Range</label>
    <select id="guide-price" class="filter-select">
      <option value="all">All Prices</option>
      ${filterOptions.filters.price_ranges.map(range =>
        `<option value="${range.min}-${range.max}">${range.label} ($${range.min}-$${range.max})</option>`
      ).join('')}
    </select>
  `;

  // Experience filter
  const experienceFilter = document.createElement('div');
  experienceFilter.className = 'filter-group';
  experienceFilter.innerHTML = `
    <label for="guide-experience">Experience</label>
    <select id="guide-experience" class="filter-select">
      ${filterOptions.filters.experience_years.map(exp =>
        `<option value="${exp.min}">${exp.label}</option>`
      ).join('')}
    </select>
  `;

  // Add advanced filters to the advanced filter section
  advancedFilters.appendChild(specializationFilter);
  advancedFilters.appendChild(ratingFilter);
  advancedFilters.appendChild(priceFilter);
  advancedFilters.appendChild(experienceFilter);

  // Toggle button for advanced filters
  const advancedToggle = document.createElement('button');
  advancedToggle.className = 'advanced-filter-toggle';
  advancedToggle.innerHTML = '<i class="fa-solid fa-sliders"></i> Advanced Filters <i class="fa-solid fa-chevron-down"></i>';
  advancedToggle.addEventListener('click', () => {
    const isHidden = advancedFilters.style.display === 'none';
    advancedFilters.style.display = isHidden ? 'grid' : 'none';
    advancedToggle.querySelector('.fa-chevron-down').style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0)';
  });

  // Search button
  const searchButton = document.createElement('button');
  searchButton.className = 'btn btn-primary search-guides-btn';
  searchButton.textContent = 'Search Guides';
  searchButton.addEventListener('click', () => {
    renderGuides(guides, {
      location: document.getElementById('guide-location').value,
      date: document.getElementById('guide-date').value,
      language: document.getElementById('guide-language').value,
      specialization: document.getElementById('guide-specialization').value,
      rating: parseFloat(document.getElementById('guide-rating').value),
      price: document.getElementById('guide-price').value,
      experience: parseInt(document.getElementById('guide-experience').value)
    });
  });

  // Add all filter elements to the filter section
  filterSection.appendChild(basicFilters);
  filterSection.appendChild(advancedToggle);
  filterSection.appendChild(advancedFilters);
  filterSection.appendChild(searchButton);

  // Create guides results section
  const guidesResults = document.createElement('div');
  guidesResults.className = 'guide-results';
  guidesResults.id = 'guide-results';

  // Function to render filtered guides
  function renderGuides(allGuides, filters) {
    const resultsContainer = document.getElementById('guide-results');
    if (!resultsContainer) return;

    // Clear previous results
    resultsContainer.innerHTML = '';

    // Filter guides based on criteria
    let filteredGuides = [...allGuides];

    // Apply location filter
    if (filters.location) {
      filteredGuides = filteredGuides.filter(guide =>
        guide.locations && guide.locations.some(loc =>
          loc.toLowerCase().includes(filters.location.toLowerCase())
        )
      );
    }

    // Apply language filter
    if (filters.language) {
      filteredGuides = filteredGuides.filter(guide =>
        guide.languages && guide.languages.includes(filters.language)
      );
    }

    // Apply date filter
    if (filters.date) {
      filteredGuides = filteredGuides.filter(guide =>
        guide.available_dates && guide.available_dates.includes(filters.date)
      );
    }

    // Apply specialization filter
    if (filters.specialization) {
      filteredGuides = filteredGuides.filter(guide =>
        guide.specialization && guide.specialization.toLowerCase().includes(
          filters.specialization.toLowerCase().replace('&', 'and')
        )
      );
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filteredGuides = filteredGuides.filter(guide =>
        guide.rating >= filters.rating
      );
    }

    // Apply price filter
    if (filters.price && filters.price !== 'all') {
      const [min, max] = filters.price.split('-').map(Number);
      filteredGuides = filteredGuides.filter(guide =>
        guide.hourly_rate >= min && guide.hourly_rate <= max
      );
    }

    // Apply experience filter
    if (filters.experience > 0) {
      filteredGuides = filteredGuides.filter(guide =>
        guide.experience_years >= filters.experience
      );
    }

    // Display results
    if (filteredGuides.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-guides-found">
          <i class="fa-solid fa-search"></i>
          <p>No guides found matching your criteria. Try adjusting your filters.</p>
        </div>
      `;
    } else {
      // Create guide cards for each result
      filteredGuides.forEach(guide => {
        const guideCard = document.createElement('div');
        guideCard.className = 'guide-card';

        // Create guide card content
        guideCard.innerHTML = `
          <div class="guide-profile">
            <img src="${guide.profile_image}" alt="${guide.name}" class="guide-profile-image">
            <div class="guide-info">
              <h3>${guide.name}</h3>
              <div class="guide-rating">
                ${generateStarRating(guide.rating)}
                <span>${guide.rating.toFixed(1)} (${guide.review_count} reviews)</span>
              </div>
              <p class="guide-specialization">${guide.specialization}</p>
              <div class="guide-languages">
                ${guide.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="guide-description">
            <p>${guide.description}</p>
          </div>
          <div class="guide-pricing">
            <div class="price-info">
              <div class="hourly-rate">
                <span class="price-label">Hourly Rate</span>
                <span class="price-value">$${guide.hourly_rate}</span>
              </div>
              <div class="daily-rate">
                <span class="price-label">Full Day</span>
                <span class="price-value">$${guide.full_day_rate}</span>
              </div>
            </div>
            <button class="btn btn-primary contact-guide-btn" data-guide-id="${guide.id}">Contact Guide</button>
          </div>
        `;

        // Add event listener to contact button
        guideCard.querySelector('.contact-guide-btn').addEventListener('click', () => {
          handleContactGuide(guide);
        });

        resultsContainer.appendChild(guideCard);
      });

      // Add "More Guides" button at the bottom
      const moreGuidesButton = document.createElement('div');
      moreGuidesButton.className = 'more-guides-button';
      moreGuidesButton.innerHTML = `
        <button class="btn btn-outline">
          <i class="fa-solid fa-user-group"></i> See More Guides
        </button>
      `;

      moreGuidesButton.querySelector('button').addEventListener('click', () => {
        // This will be implemented later to lead to the guides page
        showToast('Guides page will be available soon!');
        // For now, just close the modal
        close();
      });

      resultsContainer.appendChild(moreGuidesButton);
    }
  }

  // Function to generate star rating HTML
  function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHTML = '';

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fa-solid fa-star"></i>';
    }

    // Add half star if needed
    if (halfStar) {
      starsHTML += '<i class="fa-solid fa-star-half-alt"></i>';
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="fa-regular fa-star"></i>';
    }

    return starsHTML;
  }

  // Function to handle contacting a guide
  function handleContactGuide(guide) {
    // In a real app, this would open a contact form or messaging interface
    showToast(`Contact request sent to ${guide.name}!`);

    // Find and update the contact button
    const contactBtn = document.querySelector(`[data-guide-id="${guide.id}"]`);
    if (contactBtn) {
      contactBtn.textContent = 'Request Sent';
      contactBtn.disabled = true;
      contactBtn.classList.add('btn-success');
    }
  }

  // Assemble modal content
  guideContent.appendChild(header);
  guideContent.appendChild(filterSection);
  guideContent.appendChild(guidesResults);

  modalContent.appendChild(closeButton);
  modalContent.appendChild(guideContent);
  modalOverlay.appendChild(modalContent);

  // Add CSS styles for the guide modal
  const style = document.createElement('style');
  style.textContent = `
    .guide-modal {
      max-width: 900px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      padding: var(--spacing-6);
    }

    .guide-modal-header {
      margin-bottom: var(--spacing-6);
      text-align: center;
    }

    .guide-modal-header h2 {
      margin-bottom: var(--spacing-2);
      font-size: 1.75rem;
    }

    .guide-modal-header p {
      color: var(--color-gray-600);
    }

    .dark .guide-modal-header p {
      color: var(--color-gray-400);
    }

    .guide-filter-section {
      margin-bottom: var(--spacing-6);
      padding: var(--spacing-4);
      background-color: var(--color-gray-50);
      border-radius: var(--border-radius-lg);
    }

    .dark .guide-filter-section {
      background-color: var(--color-gray-850, #1a1e24);
      border: 1px solid var(--color-gray-700);
    }

    .guide-basic-filters {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-4);
    }

    .guide-advanced-filters {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-4);
      padding-top: var(--spacing-4);
      border-top: 1px solid var(--color-border);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .filter-group label {
      font-weight: 500;
      font-size: 0.875rem;
    }

    .filter-select, .date-input-wrapper input {
      padding: var(--spacing-2) var(--spacing-3);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      background-color: white;
      font-family: inherit;
      font-size: 0.95rem;
      width: 100%;
    }

    .dark .filter-select, .dark .date-input-wrapper input {
      background-color: var(--color-gray-700);
      border-color: var(--color-gray-600);
      color: var(--color-gray-200);
    }

    .date-input-wrapper {
      position: relative;
    }

    .date-input-wrapper i {
      position: absolute;
      right: var(--spacing-3);
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-gray-500);
      pointer-events: none;
    }

    .dark .date-input-wrapper i {
      color: var(--color-gray-400);
    }

    .advanced-filter-toggle {
      background: none;
      border: none;
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      color: var(--color-primary);
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      margin-bottom: var(--spacing-4);
      padding: 0;
    }

    .dark .advanced-filter-toggle {
      color: var(--color-primary-light, #5b9bff);
    }

    .advanced-filter-toggle i.fa-chevron-down {
      transition: transform 0.3s ease;
    }

    .search-guides-btn {
      width: 100%;
      padding: var(--spacing-3);
      margin-top: var(--spacing-2);
    }

    .guide-results {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .guide-card {
      padding: var(--spacing-4);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-lg);
      background-color: white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .dark .guide-card {
      background-color: var(--color-gray-800);
      border-color: var(--color-gray-700);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .guide-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .dark .guide-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .guide-profile {
      display: flex;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-4);
    }

    .guide-profile-image {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }

    .guide-info {
      flex: 1;
    }

    .guide-info h3 {
      margin: 0 0 var(--spacing-1) 0;
    }

    .guide-rating {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-2);
    }

    .guide-rating i {
      color: #FFD700;
    }

    .guide-rating span {
      font-size: 0.875rem;
      color: var(--color-gray-600);
    }

    .dark .guide-rating span {
      color: var(--color-gray-400);
    }

    .guide-specialization {
      margin: 0 0 var(--spacing-2) 0;
      color: var(--color-gray-700);
      font-weight: 500;
    }

    .dark .guide-specialization {
      color: var(--color-gray-200);
    }

    .guide-languages {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2);
    }

    .language-tag {
      padding: 2px var(--spacing-2);
      background-color: var(--color-gray-100);
      border-radius: var(--border-radius-sm);
      font-size: 0.75rem;
    }

    .dark .language-tag {
      background-color: var(--color-gray-700);
      color: var(--color-gray-200);
    }

    .guide-description {
      margin-bottom: var(--spacing-4);
      padding-bottom: var(--spacing-4);
      border-bottom: 1px solid var(--color-border);
    }

    .dark .guide-description {
      border-bottom: 1px solid var(--color-gray-700);
    }

    .guide-description p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--color-gray-700);
    }

    .dark .guide-description p {
      color: var(--color-gray-300);
    }

    .guide-pricing {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-info {
      display: flex;
      gap: var(--spacing-4);
    }

    .hourly-rate, .daily-rate {
      display: flex;
      flex-direction: column;
    }

    .price-label {
      font-size: 0.75rem;
      color: var(--color-gray-600);
    }

    .dark .price-label {
      color: var(--color-gray-400);
    }

    .price-value {
      font-weight: 600;
      font-size: 1.125rem;
    }

    .dark .price-value {
      color: var(--color-gray-100);
    }

    .contact-guide-btn {
      min-width: 130px;
    }

    .dark .contact-guide-btn.btn-success {
      background-color: var(--color-success-dark, #0d8d62);
      border-color: var(--color-success-dark, #0d8d62);
      color: white;
    }

    .no-guides-found {
      text-align: center;
      padding: var(--spacing-8) 0;
      color: var(--color-gray-600);
    }

    .dark .no-guides-found {
      color: var(--color-gray-400);
    }

    .no-guides-found i {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-4);
      opacity: 0.5;
    }

    .more-guides-button {
      display: flex;
      justify-content: center;
      margin-top: var(--spacing-4);
    }

    .more-guides-button button {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-6);
    }

    @media (max-width: 768px) {
      .guide-modal {
        padding: var(--spacing-4);
      }

      .guide-basic-filters,
      .guide-advanced-filters {
        grid-template-columns: 1fr;
      }

      .guide-profile {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .guide-rating {
        justify-content: center;
      }

      .guide-languages {
        justify-content: center;
      }

      .guide-pricing {
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .price-info {
        width: 100%;
        justify-content: space-around;
      }

      .contact-guide-btn {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);

  // Function to show modal
  function show() {
    // Append modal to body
    document.body.appendChild(modalOverlay);

    // Show modal with animation
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 10);

    // Add close event listener
    closeButton.addEventListener('click', close);

    // Close modal when clicking outside content
    modalOverlay.addEventListener('click', event => {
      if (event.target === modalOverlay) {
        close();
      }
    });

    // Render initial guides (all guides)
    renderGuides(guides, {});
  }

  // Function to close modal
  function close() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      modalOverlay.remove();
    }, 300);
  }

  // Return modal structure and handlers
  return {
    modalElement: modalOverlay,
    show,
    close
  };
}

/**
 * Create video modal
 * @param {string} videoId - Video ID
 * @returns {Object} - Modal HTML structure and handlers
 */
export function createVideoModal(videoId) {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close-modal-btn';
  closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
  closeButton.setAttribute('aria-label', 'Close modal');

  // Create video placeholder (in a real app, this would be a video player)
  const videoPlayer = document.createElement('div');
  videoPlayer.className = 'video-player';
  videoPlayer.innerHTML = `
    <div style="padding-top: 56.25%; position: relative; background-color: #000;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; text-align: center;">
        <i class="fa-solid fa-play" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <p>Video player would load here with ID: ${videoId}</p>
      </div>
    </div>
  `;

  // Append elements to modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(videoPlayer);
  modalOverlay.appendChild(modalContent);

  // Function to show modal
  function show() {
    // Append modal to body
    document.body.appendChild(modalOverlay);

    // Show modal with animation
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 10);

    // Add close event listener
    closeButton.addEventListener('click', close);

    // Close modal when clicking outside content
    modalOverlay.addEventListener('click', event => {
      if (event.target === modalOverlay) {
        close();
      }
    });
  }

  // Function to close modal
  function close() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      modalOverlay.remove();
    }, 300);
  }

  // Return modal structure and handlers
  return {
    modalElement: modalOverlay,
    show,
    close
  };
}

/**
 * Create calendar view modal
 * Displays a traditional monthly calendar with trip days highlighted
 * @returns {Object} - Modal HTML structure and handlers
 */
export function createCalendarModal() {
  // Get trip data from appState to ensure we're using the most current data
  const appState = window.appState || {};
  const planData = appState.planData || {};
  const tripDates = planData.trip?.dates || {
    start: "March 15, 2025",
    end: "March 22, 2025",
    duration: 8,
    current_day: 1
  };

  // Parse start and end dates
  const startDate = new Date(tripDates.start);
  const endDate = new Date(tripDates.end);
  const currentDayNumber = tripDates.current_day || 1;

  // Calculate the current day date based on the start date and current day number
  const currentDayDate = new Date(startDate);
  currentDayDate.setDate(startDate.getDate() + (currentDayNumber - 1));

  // Get current month and year from the start date
  const currentMonth = startDate.getMonth();
  const currentYear = startDate.getFullYear();

  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content calendar-modal';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close-modal-btn';
  closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
  closeButton.setAttribute('aria-label', 'Close modal');

  // Create calendar view
  const calendarView = document.createElement('div');
  calendarView.className = 'calendar-view';

  // Create month and year header
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar header with navigation
  const calendarHeader = document.createElement('div');
  calendarHeader.className = 'calendar-header';
  calendarHeader.innerHTML = `
    <div class="calendar-nav">
      <button class="calendar-nav-btn prev-month" aria-label="Previous Month">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <h2 class="calendar-title">${monthNames[currentMonth]} ${currentYear}</h2>
      <button class="calendar-nav-btn next-month" aria-label="Next Month">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
    <div class="trip-info">
      <div class="trip-date-range">
        <i class="fa-solid fa-calendar-alt"></i>
        ${tripDates.start} - ${tripDates.end}
      </div>
      <div class="trip-duration">
        <i class="fa-solid fa-clock"></i>
        ${tripDates.duration} Days
      </div>
    </div>
  `;

  // Create calendar container
  const calendarContainer = document.createElement('div');
  calendarContainer.className = 'calendar-container';

  // Create weekday headers
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdayRow = document.createElement('div');
  weekdayRow.className = 'calendar-row weekdays';

  weekdayNames.forEach(weekday => {
    const weekdayCell = document.createElement('div');
    weekdayCell.className = 'calendar-cell weekday';
    weekdayCell.textContent = weekday;
    weekdayRow.appendChild(weekdayCell);
  });

  calendarContainer.appendChild(weekdayRow);

  // Function to generate calendar grid for a given month and year
  function generateCalendarGrid(month, year) {
    // Clear existing grid except the weekday headers
    const existingRows = calendarContainer.querySelectorAll('.calendar-row:not(.weekdays)');
    existingRows.forEach(row => row.remove());

    // Get first day of month and number of days in month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of the week the first day falls on (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Create calendar grid
    let dayCounter = 1;
    let currentRow = document.createElement('div');
    currentRow.className = 'calendar-row';

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-cell empty';
      currentRow.appendChild(emptyCell);
    }

    // Fill in the days of the month
    while (dayCounter <= daysInMonth) {
      // If we've filled a row (7 days), start a new row
      if (currentRow.children.length === 7) {
        calendarContainer.appendChild(currentRow);
        currentRow = document.createElement('div');
        currentRow.className = 'calendar-row';
      }

      // Create cell for current day
      const dayCell = document.createElement('div');
      dayCell.className = 'calendar-cell';

      // Add day number
      const dayNumber = document.createElement('span');
      dayNumber.className = 'day-number';
      dayNumber.textContent = dayCounter;
      dayCell.appendChild(dayNumber);

      // Check if this day is part of the trip
      const currentDate = new Date(year, month, dayCounter);

      // Check if the day is within the trip dates
      if (currentDate >= startDate && currentDate <= endDate) {
        dayCell.classList.add('trip-day');

        // Calculate which day of the trip this is (1-based)
        const tripDayNumber = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
        dayCell.setAttribute('data-trip-day', tripDayNumber);

        // Add trip day indicator
        const tripDayIndicator = document.createElement('span');
        tripDayIndicator.className = 'trip-day-indicator';
        tripDayIndicator.textContent = `Day ${tripDayNumber}`;
        dayCell.appendChild(tripDayIndicator);

        // Add attribute for day information
        const indexInTripDays = tripDayNumber - 1;
        if (planData.days && planData.days[indexInTripDays]) {
          const dayInfo = planData.days[indexInTripDays];
          dayCell.setAttribute('data-location', dayInfo.location.city);

          // Create an enhanced tooltip with more details
          const tooltip = document.createElement('div');
          tooltip.className = 'day-tooltip';

          // Get activities for the day
          let activitiesHtml = "<div class='tooltip-section tooltip-activities'><h4>Activities</h4>";
          if (dayInfo.activities && dayInfo.activities.length > 0) {
            dayInfo.activities.forEach(activity => {
              activitiesHtml += `<div class="tooltip-item"><i class="fa-solid fa-map-marker-alt"></i> ${activity.title}</div>`;
            });
          } else {
            activitiesHtml += `<div class="tooltip-item tooltip-none">No activities scheduled</div>`;
          }
          activitiesHtml += "</div>";

          // Get meals for the day
          let mealsHtml = "<div class='tooltip-section tooltip-meals'><h4>Meals</h4>";
          if (dayInfo.meals && dayInfo.meals.length > 0) {
            dayInfo.meals.forEach(meal => {
              mealsHtml += `<div class="tooltip-item"><i class="fa-solid fa-utensils"></i> ${meal.type}: ${meal.restaurant}</div>`;
            });
          } else {
            mealsHtml += `<div class="tooltip-item tooltip-none">No meals scheduled</div>`;
          }
          mealsHtml += "</div>";

          tooltip.innerHTML = `
            <div class="tooltip-header">
              <strong>Day ${tripDayNumber}</strong>
              <div class="tooltip-date">${dayInfo.date}</div>
            </div>
            <div class="tooltip-location"><i class="fa-solid fa-location-dot"></i> ${dayInfo.location.city}, ${dayInfo.location.country}</div>
            <div class="tooltip-weather"><i class="fa-solid ${dayInfo.weather.icon}"></i> ${dayInfo.weather.condition}, ${dayInfo.weather.temperature}</div>
            ${activitiesHtml}
            ${mealsHtml}
            <div class="tooltip-cta">Click to view details</div>
          `;

          dayCell.appendChild(tooltip);

          // Add hover listener to show tooltip
          dayCell.addEventListener('mouseenter', () => {
            // Hide all other tooltips first
            document.querySelectorAll('.day-tooltip').forEach(tip => {
              tip.style.display = 'none';
            });
            tooltip.style.display = 'block';
          });

          dayCell.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
          });
        }

        // Add click event to navigate to that day
        dayCell.addEventListener('click', () => {
          if (window.appState && typeof window.appState.currentDay !== 'undefined') {
            window.appState.currentDay = tripDayNumber;

            // Dispatch day changed event
            document.dispatchEvent(new CustomEvent('dayChanged', {
              detail: { dayNumber: tripDayNumber }
            }));

            // Close the modal
            close();
          }
        });
      }

      // Check if this is the current day of the trip
      if (currentDate.toDateString() === currentDayDate.toDateString()) {
        dayCell.classList.add('current-day');
      }

      // Check if this is today's actual date
      const today = new Date();
      if (currentDate.toDateString() === today.toDateString()) {
        dayCell.classList.add('today');
      }

      // Add the day cell to the current row
      currentRow.appendChild(dayCell);
      dayCounter++;
    }

    // Add empty cells for days after the end of the month to complete the last row
    while (currentRow.children.length < 7) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-cell empty';
      currentRow.appendChild(emptyCell);
    }

    // Add the last row
    calendarContainer.appendChild(currentRow);

    // Update the month/year header
    const calendarTitle = modalContent.querySelector('.calendar-title');
    if (calendarTitle) {
      calendarTitle.textContent = `${monthNames[month]} ${year}`;
    }
  }

  // Add legend and jump to today button
  const calendarFooter = document.createElement('div');
  calendarFooter.className = 'calendar-footer';

  // Create legend
  const calendarLegend = document.createElement('div');
  calendarLegend.className = 'calendar-legend';
  calendarLegend.innerHTML = `
    <div class="legend-item">
      <div class="legend-color trip-day"></div>
      <span>Trip Days</span>
    </div>
    <div class="legend-item">
      <div class="legend-color current-day"></div>
      <span>Current Trip Day</span>
    </div>
    <div class="legend-item">
      <div class="legend-color today"></div>
      <span>Today</span>
    </div>
  `;

  // Create jump to today button
  const jumpToTodayBtn = document.createElement('button');
  jumpToTodayBtn.className = 'btn btn-outline jump-today-btn';
  jumpToTodayBtn.innerHTML = '<i class="fa-solid fa-calendar-day"></i> Jump to Current Day';
  jumpToTodayBtn.addEventListener('click', () => {
    // Jump to the month of the current day
    if (viewMonth !== currentMonth || viewYear !== currentYear) {
      viewMonth = currentMonth;
      viewYear = currentYear;
      generateCalendarGrid(viewMonth, viewYear);
    }

    // Scroll to make the current day visible and highlight it with animation
    setTimeout(() => {
      const currentDayCell = calendarContainer.querySelector('.current-day');
      if (currentDayCell) {
        currentDayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
        currentDayCell.classList.add('highlight-animation');
        setTimeout(() => {
          currentDayCell.classList.remove('highlight-animation');
        }, 2000);
      }
    }, 100);
  });

  calendarFooter.appendChild(calendarLegend);
  calendarFooter.appendChild(jumpToTodayBtn);

  // Add CSS for the calendar
  const style = document.createElement('style');
  style.textContent = `
    .calendar-modal {
      max-width: 900px;
      width: 90%;
      padding: var(--spacing-6);
    }

    .calendar-header {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-6);
    }

    .calendar-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .calendar-title {
      margin: 0;
      text-align: center;
      flex-grow: 1;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .calendar-nav-btn {
      background: none;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .calendar-nav-btn:hover {
      background-color: var(--color-gray-100);
      transform: scale(1.05);
    }

    .dark .calendar-nav-btn:hover {
      background-color: var(--color-gray-700);
    }

    .trip-info {
      display: flex;
      gap: var(--spacing-6);
      justify-content: center;
      color: var(--color-gray-600);
      font-weight: 500;
    }

    .dark .trip-info {
      color: var(--color-gray-300);
    }

    .trip-info i {
      margin-right: var(--spacing-2);
    }

    .calendar-container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-6);
      max-height: 500px;
      overflow-y: auto;
      padding-right: var(--spacing-2);
      border-radius: var(--border-radius);
      border: 1px solid var(--color-border);
      padding: var(--spacing-4);
    }

    .calendar-row {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--spacing-2);
    }

    .calendar-cell {
      height: 80px;
      border-radius: var(--border-radius);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      position: relative;
      background-color: var(--color-background);
      border: 1px solid var(--color-border);
      padding: var(--spacing-2);
      overflow: hidden;
    }

    .dark .calendar-cell {
      background-color: var(--color-gray-800);
    }

    .day-number {
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: auto;
    }

    .trip-day-indicator {
      font-size: 0.7rem;
      background-color: rgba(var(--color-primary-rgb), 0.7);
      color: white;
      padding: 2px 4px;
      border-radius: 4px;
      position: absolute;
      bottom: 4px;
      left: 4px;
    }

    .weekday {
      height: 40px;
      font-weight: 600;
      background-color: var(--color-gray-100);
      border: none;
      position: sticky;
      top: 0;
      z-index: 2;
      padding: 0;
      align-items: center;
      justify-content: center;
    }

    .dark .weekday {
      background-color: var(--color-gray-700);
      color: var(--color-gray-300);
    }

    .empty {
      background-color: var(--color-gray-50);
      border: none;
    }

    .dark .empty {
      background-color: var(--color-gray-900);
    }

    .trip-day {
      background-color: var(--color-primary-light);
      color: var(--color-gray-800);
      cursor: pointer;
      transition: all var(--transition-fast);
      position: relative;
      overflow: visible;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .trip-day::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .trip-day:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      z-index: 5;
    }

    .trip-day:hover::before {
      opacity: 1;
    }

    .dark .trip-day {
      background-color: var(--color-primary-dark);
      color: var(--color-white);
    }

    .dark .trip-day::before {
      background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
    }

    .current-day {
      border: 3px solid var(--color-accent);
      transform: scale(1.05);
      z-index: 3;
    }

    .today {
      box-shadow: inset 0 0 0 2px var(--color-success);
    }

    .highlight-animation {
      animation: pulse 1.5s ease;
    }

    @keyframes pulse {
      0% { transform: scale(1.05); }
      50% { transform: scale(1.15); box-shadow: 0 0 15px var(--color-accent); }
      100% { transform: scale(1.05); }
    }

    .day-tooltip {
      display: none;
      position: absolute;
      top: -220px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--color-gray-900);
      color: var(--color-white);
      padding: var(--spacing-3);
      border-radius: var(--border-radius);
      width: 250px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10;
      pointer-events: none;
      text-align: left;
      max-height: 300px;
      overflow-y: auto;
    }

    .tooltip-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-2);
      border-bottom: 1px solid var(--color-gray-700);
      padding-bottom: var(--spacing-2);
    }

    .tooltip-header strong {
      font-size: 1.1rem;
    }

    .tooltip-date {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .tooltip-location, .tooltip-weather {
      margin-bottom: var(--spacing-2);
      font-size: 0.9rem;
    }

    .tooltip-section {
      margin-top: var(--spacing-3);
      margin-bottom: var(--spacing-2);
    }

    .tooltip-section h4 {
      margin: 0 0 var(--spacing-2) 0;
      font-size: 0.9rem;
      color: var(--color-primary-light);
      border-bottom: 1px dashed var(--color-gray-700);
      padding-bottom: 2px;
    }

    .tooltip-item {
      margin-bottom: var(--spacing-1);
      font-size: 0.85rem;
      padding-left: var(--spacing-2);
    }

    .tooltip-none {
      font-style: italic;
      opacity: 0.7;
    }

    .tooltip-location i, .tooltip-weather i, .tooltip-item i {
      margin-right: var(--spacing-2);
      width: 14px;
      text-align: center;
    }

    .tooltip-cta {
      margin-top: var(--spacing-3);
      font-size: 0.8rem;
      color: var(--color-primary-light);
      text-align: center;
      font-style: italic;
      padding-top: var(--spacing-2);
      border-top: 1px solid var(--color-gray-700);
    }

    .day-tooltip::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid var(--color-gray-900);
    }

    .calendar-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--color-border);
      padding-top: var(--spacing-4);
    }

    .calendar-legend {
      display: flex;
      gap: var(--spacing-6);
      flex-wrap: wrap;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: var(--border-radius);
    }

    .legend-color.trip-day {
      background-color: var(--color-primary-light);
    }

    .dark .legend-color.trip-day {
      background-color: var(--color-primary-dark);
    }

    .legend-color.current-day {
      border: 3px solid var(--color-accent);
    }

    .legend-color.today {
      box-shadow: inset 0 0 0 2px var(--color-success);
    }

    .jump-today-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      transition: all var(--transition-fast);
      padding: var(--spacing-2) var(--spacing-4);
    }

    .jump-today-btn:hover {
      background-color: var(--color-primary);
      color: white;
    }

    @media (max-width: 768px) {
      .calendar-modal {
        padding: var(--spacing-4);
      }

      .calendar-cell {
        height: 60px;
        font-size: 0.875rem;
        padding: var(--spacing-1);
      }

      .day-number {
        font-size: 0.9rem;
      }

      .trip-day-indicator {
        font-size: 0.6rem;
        padding: 1px 3px;
      }

      .trip-info {
        flex-direction: column;
        gap: var(--spacing-2);
        align-items: center;
      }

      .day-tooltip {
        width: 220px;
        top: -160px;
        font-size: 0.8rem;
        max-height: 200px;
      }

      .calendar-footer {
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .calendar-legend {
        justify-content: center;
      }

      .jump-today-btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .calendar-cell {
        height: 50px;
        font-size: 0.75rem;
      }

      .weekday {
        font-size: 0.7rem;
        height: 30px;
      }

      .day-number {
        font-size: 0.8rem;
      }

      .trip-day-indicator {
        display: none;
      }

      .day-tooltip {
        width: 180px;
        top: -140px;
        left: 0;
        transform: none;
      }

      .tooltip-header strong {
        font-size: 0.9rem;
      }

      .day-tooltip::after {
        left: 20px;
        transform: none;
      }

      .legend-item {
        font-size: 0.8rem;
      }

      .legend-color {
        width: 16px;
        height: 16px;
      }
    }
  `;

  document.head.appendChild(style);

  // Add elements to the DOM
  calendarView.appendChild(calendarHeader);
  calendarView.appendChild(calendarContainer);
  calendarView.appendChild(calendarFooter);

  modalContent.appendChild(closeButton);
  modalContent.appendChild(calendarView);
  modalOverlay.appendChild(modalContent);

  // Generate the initial calendar
  generateCalendarGrid(currentMonth, currentYear);

  // Set up event listeners for month navigation
  const prevMonthBtn = modalContent.querySelector('.prev-month');
  const nextMonthBtn = modalContent.querySelector('.next-month');

  // Variables to track current view
  let viewMonth = currentMonth;
  let viewYear = currentYear;

  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      generateCalendarGrid(viewMonth, viewYear);
    });

    nextMonthBtn.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      generateCalendarGrid(viewMonth, viewYear);
    });
  }

  // Function to show modal
  function show() {
    // Append modal to body
    document.body.appendChild(modalOverlay);

    // Show modal with animation
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 10);

    // Add close event listener
    closeButton.addEventListener('click', close);

    // Close modal when clicking outside content
    modalOverlay.addEventListener('click', event => {
      if (event.target === modalOverlay) {
        close();
      }
    });

    // Add keyboard event listeners for navigation
    document.addEventListener('keydown', handleKeyDown);
  }

  // Function to handle keyboard navigation
  function handleKeyDown(event) {
    switch(event.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        if (event.ctrlKey || event.metaKey) {
          // Previous month with Ctrl+Left
          prevMonthBtn.click();
        }
        break;
      case 'ArrowRight':
        if (event.ctrlKey || event.metaKey) {
          // Next month with Ctrl+Right
          nextMonthBtn.click();
        }
        break;
      case 'Home':
        // Jump to today
        jumpToTodayBtn.click();
        break;
    }
  }

  // Function to close modal
  function close() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      modalOverlay.remove();
      // Remove keyboard event listeners
      document.removeEventListener('keydown', handleKeyDown);
    }, 300);
  }

  // Return modal structure and handlers
  return {
    modalElement: modalOverlay,
    show,
    close
  };
}

/**
 * Create universal change modal for lodging, restaurants, or transport
 * @param {string} type - Type of content to display ('lodging', 'restaurant', or 'transport')
 * @param {Array} options - Array of options to display
 * @param {Function} onSelect - Callback function when an option is selected
 * @returns {Object} - Modal HTML structure and handlers
 */
export function createUniversalChangeModal(type, options, onSelect) {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content universal-change-modal';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close-modal-btn';
  closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
  closeButton.setAttribute('aria-label', 'Close modal');

  // Determine modal title and layout based on type
  let title = '';
  let layoutClass = '';

  switch(type) {
    case 'lodging':
      title = 'Change Hotel';
      layoutClass = 'lodging-grid';
      break;
    case 'restaurant':
      title = 'Change Restaurant';
      layoutClass = 'restaurant-scroll';
      break;
    case 'transport':
      title = 'Change Transport';
      layoutClass = 'transport-list';
      break;
    default:
      title = 'Change Selection';
      layoutClass = 'default-grid';
  }

  // Create modal header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'universal-modal-header';
  modalHeader.innerHTML = `<h2>${title}</h2>`;

  // Create options container
  const optionsContainer = document.createElement('div');
  optionsContainer.className = `universal-options-container ${layoutClass}`;

  // Generate option cards based on type
  if (options && options.length > 0) {
    options.forEach((option, index) => {
      const card = document.createElement('div');
      card.className = 'universal-option-card';
      card.setAttribute('data-option-id', option.id);

      // Create card content based on type
      let cardContent = '';

      if (type === 'lodging') {
        cardContent = `
          <div class="option-image">
            <img src="${option.image}" alt="${option.name}">
            ${option.rating ? `<div class="option-rating"><i class="fa-solid fa-star"></i> ${option.rating.score}</div>` : ''}
          </div>
          <div class="option-details">
            <h3>${option.name}</h3>
            <p class="option-location"><i class="fa-solid fa-map-marker-alt"></i> ${option.location}</p>
            <div class="option-amenities">
              ${option.amenities.slice(0, 3).map(amenity => `<span><i class="fa-solid ${amenity.icon}"></i> ${amenity.name}</span>`).join('')}
            </div>
            <div class="option-price-container">
              <span class="option-price">$${option.price}</span>
              <span>per night</span>
            </div>
          </div>
          <button class="select-option-btn">Select</button>
        `;
      } else if (type === 'restaurant') {
        cardContent = `
          <div class="option-image">
            <img src="${option.image}" alt="${option.name}">
          </div>
          <div class="option-details">
            <h3>${option.name}</h3>
            <p class="option-type">${option.type}</p>
            <p class="option-location"><i class="fa-solid fa-map-marker-alt"></i> ${option.location}</p>
            <div class="option-tags">
              ${option.tags.map(tag => `<span><i class="fa-solid ${tag.icon}"></i> ${tag.description}</span>`).join('')}
            </div>
            <div class="option-price-container">
              <span class="option-price">$${option.price}</span>
              <span>per person</span>
            </div>
          </div>
          <button class="select-option-btn">Select</button>
        `;
      } else if (type === 'transport') {
        cardContent = `
          <div class="transport-option-icon">
            <i class="fa-solid ${option.icon}"></i>
          </div>
          <div class="option-details">
            <h3>${option.provider}</h3>
            <p>${option.description}</p>
            <div class="option-details-list">
              ${option.details.map(detail => `<div><span>${detail.label}:</span> ${detail.value}</div>`).join('')}
            </div>
            <div class="option-price-container">
              <span class="option-price">$${option.price}</span>
              <span>per trip</span>
            </div>
          </div>
          <button class="select-option-btn">Select</button>
        `;
      }

      card.innerHTML = cardContent;
      optionsContainer.appendChild(card);

      // Add click event to select button
      const selectBtn = card.querySelector('.select-option-btn');
      if (selectBtn) {
        selectBtn.addEventListener('click', () => {
          if (typeof onSelect === 'function') {
            onSelect(option);
          }
          close();
        });
      }
    });
  } else {
    // No options available
    optionsContainer.innerHTML = `
      <div class="no-options-message">
        <i class="fa-solid fa-exclamation-circle"></i>
        <p>No alternative options available at this time.</p>
      </div>
    `;
  }

  // Create action buttons
  const actionButtons = document.createElement('div');
  actionButtons.className = 'universal-modal-actions';
  actionButtons.innerHTML = `
    <button class="btn btn-outline" id="cancel-change-btn">Cancel</button>
  `;

  // Add styles for universal change modal
  const style = document.createElement('style');
  style.textContent = `
    .universal-change-modal {
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      padding: var(--spacing-6);
    }

    .universal-modal-header {
      margin-bottom: var(--spacing-6);
      text-align: center;
    }

    .universal-modal-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .universal-options-container {
      margin-bottom: var(--spacing-6);
    }

    /* Grid layout for lodging */
    .lodging-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-4);
    }

    /* Horizontal scroll for restaurants */
    .restaurant-scroll {
      display: flex;
      gap: var(--spacing-4);
      overflow-x: auto;
      padding-bottom: var(--spacing-4);
      scroll-snap-type: x mandatory;
    }

    .restaurant-scroll .universal-option-card {
      min-width: 300px;
      scroll-snap-align: start;
    }

    /* List view for transport */
    .transport-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .universal-option-card {
      background-color: var(--color-white);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      transition: all var(--transition-normal);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .dark .universal-option-card {
      background-color: var(--color-gray-200);
    }

    .universal-option-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .option-image {
      position: relative;
      height: 160px;
    }

    .option-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .option-rating {
      position: absolute;
      top: var(--spacing-3);
      right: var(--spacing-3);
      background-color: var(--color-primary);
      color: white;
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--border-radius);
      font-weight: 600;
      font-size: 0.875rem;
    }

    .option-details {
      padding: var(--spacing-4);
      flex: 1;
    }

    .option-details h3 {
      margin-top: 0;
      margin-bottom: var(--spacing-2);
      font-size: 1.25rem;
    }

    .option-location, .option-type {
      color: var(--color-gray-600);
      margin-bottom: var(--spacing-3);
      font-size: 0.875rem;
    }

    .dark .option-location, .dark .option-type {
      color: var(--color-gray-400);
    }

    .option-amenities, .option-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-3);
    }

    .option-amenities span, .option-tags span {
      font-size: 0.75rem;
      background-color: var(--color-gray-100);
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--border-radius-full);
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-1);
    }

    .dark .option-amenities span, .dark .option-tags span {
      background-color: var(--color-gray-300);
    }

    .option-price-container {
      display: flex;
      align-items: baseline;
      gap: var(--spacing-1);
    }

    .option-price {
      font-weight: 600;
      font-size: 1.25rem;
      color: var(--color-primary);
    }

    .option-price-container span:last-child {
      color: var(--color-gray-500);
      font-size: 0.875rem;
    }

    .transport-option-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: var(--color-primary);
      padding: var(--spacing-4);
    }

    .transport-list .universal-option-card {
      flex-direction: row;
      align-items: center;
    }

    .option-details-list {
      margin-bottom: var(--spacing-3);
      font-size: 0.875rem;
    }

    .option-details-list div {
      margin-bottom: var(--spacing-1);
    }

    .option-details-list span {
      font-weight: 500;
    }

    .select-option-btn {
      background-color: var(--color-primary);
      color: white;
      border: none;
      padding: var(--spacing-3);
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .select-option-btn:hover {
      background-color: var(--color-primary-dark);
    }

    .universal-modal-actions {
      display: flex;
      justify-content: center;
      gap: var(--spacing-4);
    }

    .no-options-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8);
      text-align: center;
      color: var(--color-gray-500);
    }

    .no-options-message i {
      font-size: 3rem;
      margin-bottom: var(--spacing-4);
    }

    @media (max-width: 768px) {
      .lodging-grid {
        grid-template-columns: 1fr;
      }

      .transport-list .universal-option-card {
        flex-direction: column;
      }

      .transport-option-icon {
        padding: var(--spacing-2);
      }
    }
  `;

  document.head.appendChild(style);

  // Append elements to modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(optionsContainer);
  modalContent.appendChild(actionButtons);
  modalOverlay.appendChild(modalContent);

  // Add cancel button click event
  const cancelBtn = modalContent.querySelector('#cancel-change-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', close);
  }

  // Function to show modal
  function show() {
    // Append modal to body
    document.body.appendChild(modalOverlay);

    // Show modal with animation
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 10);

    // Add close event listener
    closeButton.addEventListener('click', close);

    // Close modal when clicking outside content
    modalOverlay.addEventListener('click', event => {
      if (event.target === modalOverlay) {
        close();
      }
    });
  }

  // Function to close modal
  function close() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      modalOverlay.remove();
    }, 300);
  }

  // Return modal structure and handlers
  return {
    modalElement: modalOverlay,
    show,
    close
  };
}