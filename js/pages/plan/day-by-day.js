/**
 * Enhanced Day-by-Day Tab UI Module
 * Provides improved UI/UX for the day-by-day tab
 */

/**
 * Setup enhanced day selector
 * @param {Array} days - Array of day objects
 * @param {number} currentDay - Current day number
 */
export function setupEnhancedDaySelector(days, currentDay) {
  if (!days || !Array.isArray(days) || days.length === 0) {
    console.warn('No days data available for day selector');
    return;
  }

  // Get day selector in day-by-day tab
  const daySelector = document.querySelector('#day-by-day .day-selector');
  if (!daySelector) return;

  daySelector.innerHTML = '';

  // Create enhanced day buttons
  days.forEach(day => {
    const button = document.createElement('button');
    button.className = 'day-button';
    button.setAttribute('data-day', day.day_number);

    // Extract date from the full date string (e.g., "March 15, 2025" -> "Mar 15")
    const dateObj = new Date(day.date);
    const shortDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    button.innerHTML = `
      <span class="day-number">Day ${day.day_number}</span>
      <span class="day-date">${shortDate}</span>
    `;

    // Add active class to current day
    if (day.day_number === currentDay) {
      button.classList.add('active');
    }

    // Add click event listener
    button.addEventListener('click', () => {
      // Update current day
      const dayNumber = parseInt(button.getAttribute('data-day'), 10);

      // Find the updateCurrentDay function in the global scope
      if (typeof window.updateCurrentDay === 'function') {
        window.updateCurrentDay(dayNumber, days);
      } else {
        // Dispatch a custom event as fallback
        document.dispatchEvent(new CustomEvent('daySelected', {
          detail: { dayNumber, days }
        }));
      }

      // Update active class
      document.querySelectorAll('.day-button').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });

    daySelector.appendChild(button);
  });
}

/**
 * Render enhanced timeline
 * @param {Object} day - Day object
 */
export function renderEnhancedTimeline(day) {
  if (!day) return;

  const timelineContainer = document.querySelector('#day-by-day .timeline');
  if (!timelineContainer) return;

  timelineContainer.innerHTML = '';

  // Combine all items into a single array
  const allItems = [];

  // Add transport items
  if (day.transport && day.transport.length > 0) {
    day.transport.forEach(item => {
      allItems.push({
        ...item,
        itemType: 'transport',
        time: item.departureTime,
        timeForSort: item.departureTime,
        title: `${item.type} ${item.from ? 'from ' + item.from : ''} ${item.to ? 'to ' + item.to : ''}`,
        description: item.details ? item.details.map(d => `${d.label}: ${d.value}`).join(', ') : '',
        icon: item.icon || 'fa-car',
        iconColor: 'blue'
      });
    });
  }

  // Add activities
  if (day.activities && day.activities.length > 0) {
    day.activities.forEach(item => {
      allItems.push({
        ...item,
        itemType: 'activity',
        timeForSort: item.time,
        icon: item.icon || 'fa-map-marker-alt',
        iconColor: 'primary'
      });
    });
  }

  // Add meals
  if (day.meals && day.meals.length > 0) {
    day.meals.forEach(item => {
      allItems.push({
        ...item,
        itemType: 'meal',
        timeForSort: item.time,
        icon: item.icon || 'fa-utensils',
        iconColor: 'secondary'
      });
    });
  }

  // Sort items by time
  allItems.sort((a, b) => {
    // Convert time strings to comparable values
    const timeA = a.timeForSort ? a.timeForSort.replace(':', '') : '0000';
    const timeB = b.timeForSort ? b.timeForSort.replace(':', '') : '0000';
    return timeA - timeB;
  });

  // Render timeline events with staggered animation
  allItems.forEach((item, index) => {
    const timelineEvent = document.createElement('div');
    timelineEvent.className = 'timeline-event';
    timelineEvent.style.animationDelay = `${index * 0.1}s`;
    timelineEvent.classList.add('fade-in');

    // Determine icon color class based on item type
    let colorClass = 'primary';
    if (item.itemType === 'transport') colorClass = 'blue';
    if (item.itemType === 'meal') colorClass = 'secondary';
    if (item.itemType === 'activity') colorClass = 'primary';
    if (item.iconColor) colorClass = item.iconColor;

    // Format time display
    const timeDisplay = item.time || item.departureTime || '';

    // Create timeline content
    timelineEvent.innerHTML = `
      <div class="timeline-icon" style="background-color: var(--color-${colorClass})">
        <i class="fa-solid ${item.icon}"></i>
      </div>
      <div class="timeline-time">${timeDisplay}</div>
      <div class="timeline-card">
        <div class="timeline-header">
          <h4>${item.title}</h4>
          <div class="tag">${item.category || item.type || ''}</div>
        </div>
        <p>${item.description}</p>
      </div>
    `;

    timelineContainer.appendChild(timelineEvent);
  });

  // Add empty state if no items
  if (allItems.length === 0) {
    timelineContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-calendar-day"></i>
        <h3>No activities scheduled for this day</h3>
        <p>Enjoy some free time to explore on your own!</p>
      </div>
    `;
  }
}

/**
 * Render enhanced day summary
 * @param {Object} day - Day object
 */
export function renderEnhancedDaySummary(day) {
  if (!day) return;

  const summaryContainer = document.querySelector('#day-by-day .summary-items');
  if (!summaryContainer) return;

  summaryContainer.innerHTML = '';

  // Add location summary
  if (day.location) {
    const locationItem = document.createElement('div');
    locationItem.className = 'summary-item';
    locationItem.innerHTML = `
      <i class="fa-solid fa-location-dot"></i>
      <div class="summary-item-content">
        <div class="summary-item-title">Location</div>
        <div class="summary-item-description">${day.location.city}, ${day.location.country}</div>
      </div>
    `;
    summaryContainer.appendChild(locationItem);
  }

  // Add accommodation summary
  if (day.accommodation) {
    const accommodationItem = document.createElement('div');
    accommodationItem.className = 'summary-item';
    accommodationItem.innerHTML = `
      <i class="fa-solid fa-bed"></i>
      <div class="summary-item-content">
        <div class="summary-item-title">Accommodation</div>
        <div class="summary-item-description">${day.accommodation.name}</div>
      </div>
    `;
    summaryContainer.appendChild(accommodationItem);
  }

  // Add meals summary
  if (day.meals && day.meals.length > 0) {
    const mealsItem = document.createElement('div');
    mealsItem.className = 'summary-item';

    const mealsList = day.meals.map(meal => `${meal.type}: ${meal.name}`).join('<br>');

    mealsItem.innerHTML = `
      <i class="fa-solid fa-utensils"></i>
      <div class="summary-item-content">
        <div class="summary-item-title">Meals</div>
        <div class="summary-item-description">${mealsList}</div>
      </div>
    `;
    summaryContainer.appendChild(mealsItem);
  }

  // Add transport summary
  if (day.transport && day.transport.length > 0) {
    const transportItem = document.createElement('div');
    transportItem.className = 'summary-item';

    const transportList = day.transport.map(transport =>
      `${transport.type} ${transport.from ? 'from ' + transport.from : ''} ${transport.to ? 'to ' + transport.to : ''}`
    ).join('<br>');

    transportItem.innerHTML = `
      <i class="fa-solid fa-car"></i>
      <div class="summary-item-content">
        <div class="summary-item-title">Transport</div>
        <div class="summary-item-description">${transportList}</div>
      </div>
    `;
    summaryContainer.appendChild(transportItem);
  }

  // Add activities count
  if (day.activities && day.activities.length > 0) {
    const activitiesItem = document.createElement('div');
    activitiesItem.className = 'summary-item';
    activitiesItem.innerHTML = `
      <i class="fa-solid fa-map-marker-alt"></i>
      <div class="summary-item-content">
        <div class="summary-item-title">Activities</div>
        <div class="summary-item-description">${day.activities.length} activities planned</div>
      </div>
    `;
    summaryContainer.appendChild(activitiesItem);
  }

  // Add day notes
  const dayNotesContainer = document.querySelector('#day-by-day .day-notes-content');
  if (dayNotesContainer) {
    if (day.notes) {
      dayNotesContainer.innerHTML = `<p>${day.notes}</p>`;
    } else {
      dayNotesContainer.innerHTML = `<p>No special notes for this day.</p>`;
    }
  }

  // Add toggle functionality for day notes
  const dayNotesToggle = document.querySelector('#day-by-day .day-notes');
  if (dayNotesToggle) {
    dayNotesToggle.addEventListener('click', () => {
      dayNotesToggle.classList.toggle('expanded');
    });
  }
}

/**
 * Render enhanced day detail
 * @param {Object} day - Day object
 */
export function renderEnhancedDayDetail(day) {
  if (!day) {
    console.warn('No day data available for day detail');
    return;
  }

  // Update day title
  const dayTitle = document.querySelector('#day-by-day .day-title');
  if (dayTitle) {
    dayTitle.innerHTML = `
      <h2>Day ${day.day_number} - ${day.date}</h2>
      <p>${day.location.city}, ${day.location.country}</p>
    `;
  }

  // Render enhanced timeline
  renderEnhancedTimeline(day);

  // Render enhanced day summary
  renderEnhancedDaySummary(day);
}

// Make enhanced functions available globally
window.renderEnhancedDayDetail = renderEnhancedDayDetail;
window.setupEnhancedDaySelector = setupEnhancedDaySelector;
window.initializeDayByDayEnhancements = initializeDayByDayEnhancements;

/**
 * Initialize day-by-day tab enhancements
 */
export function initializeDayByDayEnhancements() {
  // Add scroll animation to day selector
  const daySelector = document.querySelector('#day-by-day .day-selector');
  if (daySelector) {
    // Smooth scroll to active day button
    const activeButton = daySelector.querySelector('.day-button.active');
    if (activeButton) {
      setTimeout(() => {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 300);
    }
  }

  // Add toggle functionality for day notes
  const dayNotesToggle = document.querySelector('#day-by-day .day-notes');
  if (dayNotesToggle) {
    dayNotesToggle.addEventListener('click', () => {
      dayNotesToggle.classList.toggle('expanded');
    });
  }
}
