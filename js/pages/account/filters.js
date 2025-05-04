/**
 * Filters and View Toggle Functionality
 * This file contains the code for filtering itineraries and toggling between list and calendar views
 */

import userDataManager from './userData.js';

/**
 * Initialize all filter and view toggle functionality
 */
export function initializeFiltersAndToggles() {
  console.log('Initializing filters and toggles');

  // Set up status filters
  setupStatusFilters();

  // Set up sort filters
  setupSortFilters();

  // Set up calendar view toggle
  setupCalendarViewToggle();
}

/**
 * Set up status filters
 */
function setupStatusFilters() {
  console.log('Setting up status filters');

  // Get all filter buttons
  const filterAll = document.getElementById('filter-all');
  const filterUpcoming = document.getElementById('filter-upcoming');
  const filterPast = document.getElementById('filter-past');
  const filterDrafts = document.getElementById('filter-drafts');

  // Check if elements exist
  if (!filterAll || !filterUpcoming || !filterPast || !filterDrafts) {
    console.error('Status filter elements not found');
    return;
  }

  // Add click handlers
  filterAll.onclick = () => applyStatusFilter('all');
  filterUpcoming.onclick = () => applyStatusFilter('upcoming');
  filterPast.onclick = () => applyStatusFilter('past');
  filterDrafts.onclick = () => applyStatusFilter('drafts');

  console.log('Status filter handlers added');
}

/**
 * Apply status filter
 * @param {string} status - The status to filter by
 */
function applyStatusFilter(status) {
  console.log('Applying status filter:', status);

  // Update active class
  const statusFilters = document.querySelectorAll('#status-filters .filter-option');
  statusFilters.forEach(filter => {
    filter.classList.remove('active');
    if (filter.dataset.filter === status) {
      filter.classList.add('active');
    }
  });

  // Get all itinerary cards
  const itineraryCards = document.querySelectorAll('.itinerary-card');
  console.log('Found itinerary cards:', itineraryCards.length);

  // Filter cards
  itineraryCards.forEach(card => {
    if (status === 'all') {
      card.style.display = '';
    } else {
      const cardStatus = getCardStatusCategory(card.dataset.status);
      console.log('Card status:', card.dataset.status, 'Category:', cardStatus, 'Filter:', status);
      card.style.display = status === cardStatus ? '' : 'none';
    }
  });

  // Show empty state if no visible cards
  const visibleCards = Array.from(itineraryCards).filter(card => card.style.display !== 'none');
  const emptyState = document.querySelector('.empty-itineraries');

  if (emptyState) {
    emptyState.style.display = visibleCards.length === 0 ? 'block' : 'none';
  }

  // Show toast notification
  userDataManager.showToast('info', 'Filtered', `Showing ${status} itineraries`);
}

/**
 * Get the status category for an itinerary
 * @param {string} status - The itinerary status
 * @returns {string} The status category (upcoming, past, drafts)
 */
function getCardStatusCategory(status) {
  if (status === 'confirmed' || status === 'pending') {
    return 'upcoming';
  } else if (status === 'draft') {
    return 'drafts';
  } else {
    return 'past';
  }
}

/**
 * Set up sort filters
 */
function setupSortFilters() {
  console.log('Setting up sort filters');

  // Get all sort buttons
  const sortDate = document.getElementById('sort-date');
  const sortDuration = document.getElementById('sort-duration');
  const sortDestination = document.getElementById('sort-destination');

  // Check if elements exist
  if (!sortDate || !sortDuration || !sortDestination) {
    console.error('Sort filter elements not found');
    return;
  }

  // Add click handlers
  sortDate.onclick = () => applySortFilter('date');
  sortDuration.onclick = () => applySortFilter('duration');
  sortDestination.onclick = () => applySortFilter('destination');

  console.log('Sort filter handlers added');
}

/**
 * Apply sort filter
 * @param {string} sortBy - The property to sort by
 */
function applySortFilter(sortBy) {
  console.log('Applying sort filter:', sortBy);

  // Update active class
  const sortFilters = document.querySelectorAll('#sort-filters .filter-option');
  sortFilters.forEach(filter => {
    filter.classList.remove('active');
    if (filter.dataset.sort === sortBy) {
      filter.classList.add('active');
    }
  });

  // Get itinerary grid and cards
  const itineraryGrid = document.querySelector('.itinerary-grid');
  const itineraryCards = Array.from(document.querySelectorAll('.itinerary-card'));

  if (!itineraryGrid || itineraryCards.length === 0) {
    console.error('Itinerary grid or cards not found');
    return;
  }

  // Sort the cards
  itineraryCards.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = a.dataset.date || '';
      const dateB = b.dataset.date || '';
      return dateA.localeCompare(dateB);
    } else if (sortBy === 'duration') {
      const durationA = a.querySelector('.itinerary-dates')?.textContent.match(/\((\d+) days\)/) || [0, 0];
      const durationB = b.querySelector('.itinerary-dates')?.textContent.match(/\((\d+) days\)/) || [0, 0];
      return parseInt(durationB[1]) - parseInt(durationA[1]);
    } else if (sortBy === 'destination') {
      const locationA = a.dataset.location || '';
      const locationB = b.dataset.location || '';
      return locationA.localeCompare(locationB);
    }
    return 0;
  });

  // Remove all cards from the grid
  itineraryCards.forEach(card => {
    card.remove();
  });

  // Add sorted cards back to the grid
  itineraryCards.forEach(card => {
    itineraryGrid.appendChild(card);
  });

  // Show toast notification
  userDataManager.showToast('info', 'Sorted', `Itineraries sorted by ${sortBy}`);
}

/**
 * Set up calendar view toggle
 */
function setupCalendarViewToggle() {
  console.log('Setting up calendar view toggle');

  // Get elements
  const calendarViewToggle = document.getElementById('calendar-view-toggle');
  const listViewToggle = document.getElementById('list-view-toggle');

  // Check if elements exist
  if (!calendarViewToggle || !listViewToggle) {
    console.error('View toggle elements not found');
    return;
  }

  // Add click handlers
  calendarViewToggle.onclick = showCalendarView;
  listViewToggle.onclick = showListView;

  console.log('View toggle handlers added');
}

/**
 * Show calendar view
 */
function showCalendarView() {
  console.log('Showing calendar view');

  // Get elements
  const itineraryGrid = document.querySelector('.itinerary-grid');
  const calendarView = document.getElementById('itinerary-calendar-view');
  const calendarViewToggle = document.getElementById('calendar-view-toggle');

  // Check if elements exist
  if (!itineraryGrid || !calendarView || !calendarViewToggle) {
    console.error('Calendar view elements not found');
    return;
  }

  // Hide grid, show calendar
  itineraryGrid.style.display = 'none';
  calendarView.style.display = 'block';
  calendarViewToggle.parentElement.style.display = 'none';

  // Set current month in selector
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Update month selector
  document.querySelectorAll('.month-option').forEach(option => {
    option.classList.remove('active');
    if (parseInt(option.dataset.month) === currentMonth) {
      option.classList.add('active');
    }
  });

  // Update year display
  const yearDisplay = document.getElementById('calendar-year-display');
  if (yearDisplay) {
    yearDisplay.textContent = currentYear;
  }

  // Generate calendar
  generateItineraryCalendar();

  // Apply dark mode to calendar if needed
  const isDarkMode = document.body.classList.contains('dark-mode') ||
                     document.documentElement.classList.contains('dark');
  if (isDarkMode) {
    // Apply dark mode to calendar elements
    const calendarElements = document.querySelectorAll(
      '.calendar-container, .calendar-day, .calendar-day-header, ' +
      '.month-option, .calendar-nav-btn, .calendar-title, .calendar-year-display'
    );

    calendarElements.forEach(el => el.classList.add('dark-mode'));
  }

  // Show toast notification
  userDataManager.showToast('info', 'View Changed', 'Switched to calendar view');
}

/**
 * Show list view
 */
function showListView() {
  console.log('Showing list view');

  // Get elements
  const itineraryGrid = document.querySelector('.itinerary-grid');
  const calendarView = document.getElementById('itinerary-calendar-view');
  const calendarViewToggle = document.getElementById('calendar-view-toggle');

  // Check if elements exist
  if (!itineraryGrid || !calendarView || !calendarViewToggle) {
    console.error('List view elements not found');
    return;
  }

  // Hide calendar, show grid
  calendarView.style.display = 'none';
  itineraryGrid.style.display = 'grid';
  calendarViewToggle.parentElement.style.display = 'block';

  // Show toast notification
  userDataManager.showToast('info', 'View Changed', 'Switched to list view');
}

/**
 * Generate calendar with itineraries
 */
function generateItineraryCalendar() {
  console.log('Generating itinerary calendar');

  // Get elements
  const calendarGrid = document.querySelector('#itinerary-calendar-view .calendar-grid');
  const monthYearDisplay = document.getElementById('calendar-month-year');
  const itineraries = userDataManager.getItineraries();

  // Check if elements exist
  if (!calendarGrid || !monthYearDisplay) {
    console.error('Calendar elements not found');
    return;
  }

  console.log('Found itineraries:', itineraries.length);

  // Clear existing calendar days (except headers)
  const headers = Array.from(calendarGrid.querySelectorAll('.calendar-day-header'));
  calendarGrid.innerHTML = '';

  // Add headers back
  headers.forEach(header => {
    calendarGrid.appendChild(header);
  });

  // Get current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Update month/year display
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // Get first day of month and total days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Add empty cells for days before first day of month
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarGrid.appendChild(emptyDay);
  }

  // Create calendar days
  for (let day = 1; day <= lastDate; day++) {
    const calendarDay = document.createElement('div');
    calendarDay.className = 'calendar-day';

    // Check if current day
    if (day === currentDate.getDate() && currentMonth === currentDate.getMonth()) {
      calendarDay.classList.add('today');
    }

    // Add day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = day;
    calendarDay.appendChild(dayNumber);

    // Check for itineraries on this day
    const dayEvents = document.createElement('div');
    dayEvents.className = 'calendar-day-events';

    // Format date string for comparison (YYYY-MM-DD)
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Find itineraries that include this date
    let hasEvents = false;

    itineraries.forEach(itinerary => {
      const startDate = new Date(itinerary.startDate);
      const endDate = new Date(itinerary.endDate);
      const currentDayDate = new Date(dateString);

      // Check if current day is within itinerary dates
      if (currentDayDate >= startDate && currentDayDate <= endDate) {
        hasEvents = true;

        // Create event indicator
        const event = document.createElement('div');
        event.className = `calendar-event ${itinerary.status}`;
        event.title = `${itinerary.title} (${itinerary.status})`;

        // Add click event to show details
        event.onclick = (e) => {
          e.stopPropagation();
          userDataManager.showToast('info', 'Itinerary', `${itinerary.title} (${userDataManager.formatDate(itinerary.startDate)} - ${userDataManager.formatDate(itinerary.endDate)})`);
        };

        dayEvents.appendChild(event);
      }
    });

    if (hasEvents) {
      calendarDay.classList.add('has-events');
      calendarDay.appendChild(dayEvents);
    }

    calendarGrid.appendChild(calendarDay);
  }

  console.log('Calendar generation complete');

  // Apply dark mode if needed
  const isDarkMode = document.body.classList.contains('dark-mode') ||
                     document.documentElement.classList.contains('dark');
  if (isDarkMode) {
    // Apply dark mode to calendar elements
    const calendarElements = document.querySelectorAll(
      '.calendar-container, .calendar-day, .calendar-day-header, ' +
      '.month-option, .calendar-nav-btn, .calendar-title, .calendar-year-display'
    );

    calendarElements.forEach(el => el.classList.add('dark-mode'));
  }
}
