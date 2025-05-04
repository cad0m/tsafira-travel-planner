/**
 * Content Modules
 * Contains ItinerariesManager and GuideDashboardManager functionality
 */

/**
 * Itineraries Manager
 * Handles the itineraries section functionality
 */
export class ItinerariesManager {
  constructor() {
    this.itinerariesSection = document.getElementById('itineraries');
    this.itinerariesGrid = this.itinerariesSection.querySelector('.itinerary-grid');
    this.itineraries = [];
  }

  /**
   * Initialize the itineraries manager
   * @param {Array} itineraries - Array of itinerary objects
   */
  init(itineraries) {
    this.itineraries = itineraries || [];
    this.renderItineraries();
    this.setupEventListeners();
  }

  /**
   * Render the itineraries in the grid
   */
  renderItineraries() {
    if (!this.itinerariesGrid) return;

    // Clear existing itineraries
    this.itinerariesGrid.innerHTML = '';

    if (this.itineraries.length === 0) {
      this.renderEmptyState();
      return;
    }

    // Add each itinerary card
    this.itineraries.forEach(itinerary => {
      const itineraryCard = this.createItineraryCard(itinerary);
      this.itinerariesGrid.appendChild(itineraryCard);
    });
  }

  /**
   * Create an itinerary card element
   * @param {Object} itinerary - Itinerary data object
   * @returns {HTMLElement} The created card element
   */
  createItineraryCard(itinerary) {
    const card = document.createElement('div');
    card.className = 'itinerary-card';
    card.dataset.id = itinerary.id;

    // Get the status class
    let statusClass = 'status-pending';
    if (itinerary.status === 'confirmed') {
      statusClass = 'status-accepted';
    } else if (itinerary.status === 'cancelled') {
      statusClass = 'status-declined';
    }

    // Format the status text
    const statusText = itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1);

    // Format dates
    let formattedDates = '';
    if (itinerary.startDate && itinerary.endDate) {
      // Format dates in a readable format
      const startDate = new Date(itinerary.startDate);
      const endDate = new Date(itinerary.endDate);

      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      formattedDates = `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`;
    } else if (itinerary.dates) {
      // Use dates if already formatted
      formattedDates = itinerary.dates;
    }

    card.innerHTML = `
      <div class="itinerary-image">
        <img src="${itinerary.image}" alt="${itinerary.title}">
      </div>
      <div class="itinerary-details">
        <div class="itinerary-header">
          <h3>${itinerary.title}</h3>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <p class="itinerary-dates">
          <i class="far fa-calendar"></i>
          ${formattedDates}
        </p>
        <div class="itinerary-actions">
          <button class="action-button view-button">
            <i class="far fa-eye"></i> View
          </button>
          <button class="action-button edit-button">
            <i class="far fa-edit"></i> Edit
          </button>
          <button class="action-button delete-button">
            <i class="far fa-trash-alt"></i> Delete
          </button>
        </div>
      </div>
    `;

    return card;
  }

  /**
   * Render an empty state when no itineraries exist
   */
  renderEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <div class="empty-state-icon">
        <i class="fas fa-route"></i>
      </div>
      <h3>No Itineraries Yet</h3>
      <p>Start planning your next adventure!</p>
      <button class="primary-button">
        <i class="fas fa-plus"></i>
        Create New Trip
      </button>
    `;

    this.itinerariesGrid.appendChild(emptyState);

    // Add click handler for the button
    const createButton = emptyState.querySelector('.primary-button');
    createButton.addEventListener('click', this.handleCreateTrip.bind(this));
  }

  /**
   * Set up event listeners for itinerary interactions
   */
  setupEventListeners() {
    // Create trip button in the header
    const createTripButton = this.itinerariesSection.querySelector('.primary-button');
    if (createTripButton) {
      createTripButton.addEventListener('click', this.handleCreateTrip.bind(this));
    }

    // Delegate event handling for card buttons
    this.itinerariesGrid.addEventListener('click', (event) => {
      const target = event.target.closest('button');
      if (!target) return;

      const card = target.closest('.itinerary-card');
      if (!card) return;

      const itineraryId = card.dataset.id;

      if (target.classList.contains('view-button')) {
        this.handleViewItinerary(itineraryId);
      } else if (target.classList.contains('edit-button')) {
        this.handleEditItinerary(itineraryId);
      } else if (target.classList.contains('delete-button')) {
        this.handleDeleteItinerary(itineraryId, card);
      }
    });
  }

  /**
   * Handle creating a new trip
   */
  handleCreateTrip() {
    // In a real app, this would redirect to the trip creation wizard
    console.log('Create new trip clicked');
    window.location.href = '/wizard.html';
  }

  /**
   * Handle viewing an itinerary
   * @param {string} itineraryId - ID of the itinerary to view
   */
  handleViewItinerary(itineraryId) {
    // In a real app, this would redirect to the itinerary view page
    console.log('View itinerary clicked:', itineraryId);
    window.location.href = `/itinerary.html?id=${itineraryId}`;
  }

  /**
   * Handle editing an itinerary
   * @param {string} itineraryId - ID of the itinerary to edit
   */
  handleEditItinerary(itineraryId) {
    // In a real app, this would redirect to the itinerary edit page
    console.log('Edit itinerary clicked:', itineraryId);
    window.location.href = `/wizard.html?edit=${itineraryId}`;
  }

  /**
   * Handle deleting an itinerary
   * @param {string} itineraryId - ID of the itinerary to delete
   * @param {HTMLElement} cardElement - The card element to remove
   */
  handleDeleteItinerary(itineraryId, cardElement) {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      // In a real app, this would send a delete request to the server
      console.log('Delete itinerary clicked:', itineraryId);

      // Remove from UI
      cardElement.classList.add('card-fade-out');
      setTimeout(() => {
        cardElement.remove();

        // Check if we need to show empty state
        if (this.itinerariesGrid.children.length === 0) {
          this.renderEmptyState();
        }
      }, 300);

      // Remove from local data
      this.itineraries = this.itineraries.filter(item => item.id !== itineraryId);
    }
  }
}

/**
 * Guide Dashboard Manager
 * Handles the guide dashboard section functionality
 */
export class GuideDashboardManager {
  constructor() {
    this.dashboardSection = document.getElementById('guide');
    this.statsGrid = this.dashboardSection.querySelector('.stats-grid');
    this.requestsContainer = this.dashboardSection.querySelector('.guide-requests');
    this.requests = [];
    this.stats = {};
  }

  /**
   * Initialize the guide dashboard
   * @param {Array} requests - Array of guide request objects
   * @param {Object} stats - Guide statistics object
   */
  init(requests, stats) {
    this.requests = requests || [];
    this.stats = stats || {};

    this.renderStats();
    this.renderRequests();
    this.setupEventListeners();
  }

  /**
   * Render the stats cards
   */
  renderStats() {
    if (!this.statsGrid) return;

    // Clear existing stats
    this.statsGrid.innerHTML = '';

    // Extract stats from the structure in userData.json
    const bookings = this.stats.bookings || {};
    const earnings = this.stats.earnings || {};
    const rating = this.stats.rating || {};
    const views = this.stats.views || {};

    // Create stats cards
    const totalRequestsCard = this.createStatCard(
      'Total Bookings',
      bookings.total || 0,
      bookings.trend === 'up' ? 'Increasing' : bookings.trend === 'down' ? 'Decreasing' : '',
      bookings.trend === 'up' ? 'positive' : bookings.trend === 'down' ? 'negative' : 'neutral'
    );

    const pendingOffersCard = this.createStatCard(
      'Pending Offers',
      bookings.pending || 0,
      'Awaiting response',
      'neutral'
    );

    const monthlyEarningsCard = this.createStatCard(
      'Monthly Earnings',
      `$${earnings.lastMonth || 0}`,
      earnings.trend === 'up' ? 'Increasing' : earnings.trend === 'down' ? 'Decreasing' : '',
      earnings.trend === 'up' ? 'positive' : earnings.trend === 'down' ? 'negative' : 'neutral'
    );

    // Append cards to the grid
    this.statsGrid.appendChild(totalRequestsCard);
    this.statsGrid.appendChild(pendingOffersCard);
    this.statsGrid.appendChild(monthlyEarningsCard);
  }

  /**
   * Create a stat card element
   * @param {string} title - Card title
   * @param {string|number} value - Stat value
   * @param {string} subtext - Additional text
   * @param {string} trend - Trend direction ('positive', 'negative', or 'neutral')
   * @returns {HTMLElement} The created card element
   */
  createStatCard(title, value, subtext, trend) {
    const card = document.createElement('div');
    card.className = 'stat-card';

    let trendIcon = '';
    let trendClass = '';

    if (trend === 'positive') {
      trendIcon = '<i class="fas fa-arrow-up"></i>';
      trendClass = 'trend-up';
    } else if (trend === 'negative') {
      trendIcon = '<i class="fas fa-arrow-down"></i>';
      trendClass = 'trend-down';
    } else if (trend === 'neutral') {
      trendIcon = '<i class="fas fa-clock"></i>';
      trendClass = 'trend-neutral';
    }

    card.innerHTML = `
      <h3 class="stat-title">${title}</h3>
      <p class="stat-value">${value}</p>
      ${subtext ? `<p class="stat-subtext ${trendClass}">${trendIcon} ${subtext}</p>` : ''}
    `;

    return card;
  }

  /**
   * Render the guide requests
   */
  renderRequests() {
    if (!this.requestsContainer) return;

    // Clear existing requests
    this.requestsContainer.innerHTML = '';

    if (this.requests.length === 0) {
      this.renderEmptyRequests();
      return;
    }

    // Add each request
    this.requests.forEach(request => {
      const requestItem = this.createRequestItem(request);
      this.requestsContainer.appendChild(requestItem);
    });
  }

  /**
   * Create a request item element
   * @param {Object} request - Request data object
   * @returns {HTMLElement} The created request element
   */
  createRequestItem(request) {
    const item = document.createElement('div');
    item.className = 'guide-request-item';
    item.dataset.id = request.id;

    let statusButtons = '';

    if (request.status === 'pending') {
      statusButtons = `
        <button class="action-button accept-button">
          Accept
        </button>
        <button class="action-button decline-button">
          Decline
        </button>
      `;
    } else if (request.status === 'accepted') {
      statusButtons = `<p class="status-badge status-accepted">Accepted</p>`;
    } else if (request.status === 'declined') {
      statusButtons = `<p class="status-badge status-declined">Declined</p>`;
    }

    // Format request details based on the structure in userData.json
    const title = request.tripTitle || request.title || 'Trip Request';
    const details = request.details ||
      `${request.traveler?.name || 'A traveler'} - ${request.date || ''} (${request.duration || ''})${request.amount ? ' - $' + request.amount : ''}`;

    item.innerHTML = `
      <div class="request-details">
        <h3 class="request-title">${title}</h3>
        <p class="request-info">${details}</p>
      </div>
      <div class="request-actions">
        ${statusButtons}
      </div>
    `;

    return item;
  }

  /**
   * Render an empty state for requests
   */
  renderEmptyRequests() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <div class="empty-state-icon">
        <i class="fas fa-inbox"></i>
      </div>
      <h3>No Pending Requests</h3>
      <p>You'll be notified when you receive new guide requests.</p>
    `;

    this.requestsContainer.appendChild(emptyState);
  }

  /**
   * Set up event listeners for dashboard interactions
   */
  setupEventListeners() {
    // Delegate event handling for request items
    this.requestsContainer.addEventListener('click', (event) => {
      const target = event.target;
      if (!target.classList.contains('action-button')) return;

      const requestItem = target.closest('.guide-request-item');
      if (!requestItem) return;

      const requestId = requestItem.dataset.id;

      if (target.classList.contains('accept-button')) {
        this.handleAcceptRequest(requestId, requestItem);
      } else if (target.classList.contains('decline-button')) {
        this.handleDeclineRequest(requestId, requestItem);
      }
    });
  }

  /**
   * Handle accepting a guide request
   * @param {string} requestId - ID of the request to accept
   * @param {HTMLElement} itemElement - The request element
   */
  handleAcceptRequest(requestId, itemElement) {
    // Update the UI
    const actionsContainer = itemElement.querySelector('.request-actions');
    actionsContainer.innerHTML = `<p class="status-badge status-accepted">Accepted</p>`;

    // Update the request in our data
    const request = this.requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'accepted';
    }

    // Update stats
    if (this.stats.pendingOffers > 0) {
      this.stats.pendingOffers--;
      this.renderStats();
    }

    // In a real app, we would send a request to accept on the server
    console.log('Accepted guide request:', requestId);
  }

  /**
   * Handle declining a guide request
   * @param {string} requestId - ID of the request to decline
   * @param {HTMLElement} itemElement - The request element
   */
  handleDeclineRequest(requestId, itemElement) {
    // Update the UI
    const actionsContainer = itemElement.querySelector('.request-actions');
    actionsContainer.innerHTML = `<p class="status-badge status-declined">Declined</p>`;

    // Update the request in our data
    const request = this.requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'declined';
    }

    // Update stats
    if (this.stats.pendingOffers > 0) {
      this.stats.pendingOffers--;
      this.renderStats();
    }

    // In a real app, we would send a request to decline on the server
    console.log('Declined guide request:', requestId);
  }
}

// Export default object with all classes
export default {
  ItinerariesManager,
  GuideDashboardManager
};