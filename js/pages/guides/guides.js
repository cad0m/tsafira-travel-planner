/**
 * Guides Manager
 * Handles the guides listing, filtering, and data loading
 */
import { apiGet } from '/tsafira-travel-planner/../core/api.js';

export class GuidesManager {
  constructor() {
    this.guides = [];
    this.city = '';
    this.activeFilter = 'all';
    this.guidesList = document.getElementById('guides-list');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.cityElements = {
      title: document.getElementById('city-title'),
      name: document.getElementById('city-name'),
      inlineName: document.getElementById('city-name-inline'),
      ctaName: document.getElementById('cta-city-name')
    };
  }

  /**
   * Initialize the guides manager
   * @returns {Promise} Promise that resolves when guides are loaded
   */
  async init() {
    try {
      console.log('Initializing guides manager...');

      // Load guides data
      const guidesData = await this.loadGuides();

      // Set up filter buttons
      this.setupFilters();

      // Update city name in various places
      this.updateCityNames();

      console.log(`Initialized guides for ${this.city}`);
      return guidesData;
    } catch (error) {
      console.error('Error initializing guides manager:', error);
      this.showError('Failed to load guides. Please try again later.');
      throw error;
    }
  }

  /**
   * Load guides data from API or JSON file
   */
  async loadGuides() {
    try {
      console.log('Loading guides data...');
      // Load from the guides.json file in the assets directory
      const jsonUrl = '/tsafira-travel-planner/../../assets/data/guides.json';
      console.log('Attempting to load guides from:', jsonUrl);
      const data = await apiGet(jsonUrl);

      // Check if data has the expected structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format received');
      }

      // Extract city and guides data
      this.city = data.city || 'Unknown City';
      this.guides = Array.isArray(data.guides) ? data.guides : [];

      if (this.guides.length === 0) {
        console.warn(`No guides found for ${this.city}`);
      }

      // Render guides
      this.renderGuides();

      return { city: this.city, guides: this.guides };
    } catch (error) {
      console.error('Error loading guides:', error);
      throw error;
    }
  }

  /**
   * Update city names throughout the page
   */
  updateCityNames() {
    // Update document title
    document.title = `Local Expert Guides in ${this.city} | Tsafira`;

    // Update city name in the heading
    if (this.cityElements.title) {
      this.cityElements.title.innerHTML = `Local Expert Guides in <span id="city-name">${this.city}</span>`;
    }

    // Update standalone city name elements
    if (this.cityElements.name) {
      this.cityElements.name.textContent = this.city;
    }

    if (this.cityElements.inlineName) {
      this.cityElements.inlineName.textContent = this.city;
    }

    if (this.cityElements.ctaName) {
      this.cityElements.ctaName.textContent = this.city;
    }

    // Find any other elements that might contain the city name
    document.querySelectorAll('[data-city-name]').forEach(element => {
      element.textContent = this.city;
    });
  }

  /**
   * Set up filter buttons
   */
  setupFilters() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active filter
        this.activeFilter = button.dataset.filter;

        // Update active button styles
        this.filterButtons.forEach(btn => {
          if (btn.dataset.filter === this.activeFilter) {
            btn.classList.add('active');
            btn.classList.remove('bg-gray-100', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-300');
            btn.classList.add('bg-orange-600', 'text-white');
          } else {
            btn.classList.remove('active');
            btn.classList.remove('bg-orange-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-300');
          }
        });

        // Rerender guides with filter
        this.renderGuides();
      });
    });
  }

  /**
   * Render guides list based on active filter
   */
  renderGuides() {
    // Clear guides list
    this.guidesList.innerHTML = '';

    // Filter guides based on active filter
    const filteredGuides = this.activeFilter === 'all'
      ? this.guides
      : this.guides.filter(guide => guide.category === this.activeFilter);

    // Show message if no guides found
    if (filteredGuides.length === 0) {
      this.guidesList.innerHTML = `
        <div class="no-guides col-span-2 text-center py-10">
          <p class="text-gray-600 dark:text-gray-400 mb-4">No guides found for the selected category in ${this.city}.</p>
          <button data-filter="all" class="reset-filter px-4 py-2 bg-orange-600 text-white rounded-full">Show all guides</button>
        </div>
      `;

      document.querySelector('.reset-filter').addEventListener('click', () => {
        // Reset filter to 'all'
        this.activeFilter = 'all';

        // Update active button styles
        this.filterButtons.forEach(btn => {
          if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
            btn.classList.remove('bg-gray-100', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-300');
            btn.classList.add('bg-orange-600', 'text-white');
          } else {
            btn.classList.remove('active');
            btn.classList.remove('bg-orange-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-300');
          }
        });

        // Rerender guides
        this.renderGuides();
      });

      return;
    }

    // Add guides count
    const countElement = document.createElement('div');
    countElement.className = 'guides-count col-span-2 mb-4 text-gray-600 dark:text-gray-400';
    countElement.textContent = `Showing ${filteredGuides.length} guides in ${this.city}`;
    this.guidesList.appendChild(countElement);

    // Render each guide card
    filteredGuides.forEach((guide, index) => {
      const guideCard = this.createGuideCard(guide, index);
      this.guidesList.appendChild(guideCard);
    });
  }

  /**
   * Create a guide card element as a beautiful invitation
   * @param {Object} guide Guide data
   * @param {Number} index Guide index for animation delay
   * @returns {HTMLElement} Guide card element
   */
  createGuideCard(guide, index) {
    const card = document.createElement('div');
    card.className = 'guide-card';
    card.dataset.guideId = guide.id;
    card.style.animationDelay = `${index * 0.1}s`;

    // Get a specialty icon for the invitation seal
    const specialtyIcon = guide.specialties && guide.specialties.length > 0
      ? guide.specialties[0].icon
      : 'fa-user';

    card.innerHTML = `
      <div class="guide-card-inner">
        <div class="rating-badge">
          <i class="fa-solid fa-star"></i> ${guide.rating.toFixed(1)}
        </div>

        <div class="guide-card-header">
          <img
            src="${guide.profile_image}"
            alt="Guide ${guide.name}"
            class="guide-profile-image"
          />
          <div class="guide-info">
            <h3 class="guide-name">${guide.name}</h3>
            <p class="guide-specialization">${guide.specialization}</p>
            <div class="guide-languages">
              ${guide.languages.map(lang => `
                <span class="guide-language">${lang}</span>
              `).join('')}
            </div>
          </div>
        </div>

        <p class="guide-description">
          ${guide.description}
        </p>

        <div class="guide-meta">
          <div class="guide-stats">
            <span class="guide-stat">
              <i class="fa-solid fa-clock"></i>${guide.experience_years} Years
            </span>
            <span class="guide-stat">
              <i class="fa-solid fa-users"></i>${guide.review_count}+ Reviews
            </span>
          </div>
          <button class="guide-action">
            Send Invitation <i class="fa-solid fa-envelope-open-text"></i>
          </button>
        </div>

        <div class="invitation-seal">
          <i class="fa-solid ${specialtyIcon}"></i>
        </div>
      </div>
    `;

    return card;
  }

  /**
   * Show error message
   * @param {String} message Error message
   */
  showError(message) {
    this.guidesList.innerHTML = `
      <div class="col-span-2 text-center py-10">
        <p class="text-red-500 mb-4">${message}</p>
        <button class="px-4 py-2 bg-orange-600 text-white rounded-full" id="retry-button">
          Retry
        </button>
      </div>
    `;

    document.getElementById('retry-button').addEventListener('click', () => {
      this.init();
    });
  }

  /**
   * Get the city name
   * @returns {String} City name
   */
  getCity() {
    return this.city;
  }

  /**
   * Get a guide by ID
   * @param {String} id Guide ID
   * @returns {Object|null} Guide object or null if not found
   */
  getGuideById(id) {
    return this.guides.find(guide => guide.id === id) || null;
  }
}
