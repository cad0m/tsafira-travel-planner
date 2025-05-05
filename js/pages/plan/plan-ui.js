/**
 * UI Module
 * Handles UI rendering and updates
 */

import { $, $$, showToast, createCarousel, showModal } from './dom-utils.js';
import { saveCurrentDay, saveCurrentTab, saveDarkModePreference } from './storage-utils.js';
import { createVideoModal, createCalendarModal } from './modals.js';
import { ensureCurrentDataIsUsed, updateAppStateWithCurrentPlan } from './plan-state-manager.js';
import { syncAppStateWithCache } from './data-manager.js';

/**
 * Setup tab navigation
 * @param {string} initialTab - Initial active tab
 */
export function setupTabNavigation(initialTab) {
  const tabButtons = $$('.tab-button');
  const tabPanes = $$('.tab-pane');

  // Set initial active tab
  const activeTabButton = $(`.tab-button[data-tab="${initialTab}"]`);
  const activeTabPane = document.getElementById(initialTab);

  if (activeTabButton && activeTabPane) {
    // Remove active class from all tab buttons and panes
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));

    // Add active class to initial tab button and pane
    activeTabButton.classList.add('active');
    activeTabPane.classList.add('active');
  }

  // Add click event listeners to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');

      // Remove active class from all tab buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      // Add active class to clicked tab button and corresponding pane
      button.classList.add('active');
      document.getElementById(tabId)?.classList.add('active');

      // Save current tab to local storage
      saveCurrentTab(tabId);

      // Ensure we're using the current plan data
      ensureCurrentDataIsUsed();

      // Update appState with current plan data
      if (window.appState) {
        updateAppStateWithCurrentPlan(window.appState);
      }

      // Re-render current day data for the active tab to ensure consistency
      if (window.appState && window.appState.planData && window.appState.planData.days) {
        const currentDayIndex = window.appState.currentDay - 1;
        if (currentDayIndex >= 0 && currentDayIndex < window.appState.planData.days.length) {
          const currentDay = window.appState.planData.days[currentDayIndex];
          // Re-render specific tab content based on the active tab
          switch (tabId) {
            case 'day-by-day':
              // Use enhanced day detail rendering if available
              if (typeof window.renderEnhancedDayDetail === 'function') {
                window.renderEnhancedDayDetail(currentDay);
              } else {
                renderDayDetail(currentDay);
              }
              break;
            case 'lodging':
              renderLodgingDay(currentDay);
              break;
            case 'meals':
              renderMealDay(currentDay, window.appState.planData.regional_info);
              break;
            case 'transport':
              renderTransportDay(currentDay, window.appState.planData.regional_info);
              break;
          }
        }
      }

      // Dispatch custom event for tab change
      document.dispatchEvent(new CustomEvent('tabChanged', { detail: { tabId } }));
    });
  });

  // Setup calendar view button
  const calendarViewBtn = document.getElementById('calendar-view-btn');
  if (calendarViewBtn) {
    calendarViewBtn.addEventListener('click', () => {
      const modal = createCalendarModal();
      modal.show();
    });
  }
}

/**
 * Setup dark mode toggle
 * @param {boolean} initialState - Initial dark mode state
 */
export function setupDarkModeToggle(initialState) {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const html = document.documentElement;

  // Set initial state
  if (initialState) {
    html.classList.add('dark');
    if (darkModeToggle) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  } else {
    html.classList.remove('dark');
    if (darkModeToggle) {
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }

  // Add click event listener
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      const isDarkMode = html.classList.toggle('dark');

      // Update icon
      if (isDarkMode) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }

      // Save preference
      saveDarkModePreference(isDarkMode);
    });
  }
}

/**
 * Setup day selector
 * @param {Array} days - Array of day objects
 * @param {number} currentDay - Current day number
 */
export function setupDaySelector(days, currentDay) {
  if (!days || !Array.isArray(days) || days.length === 0) {
    console.warn('No days data available for day selector');
    return;
  }

  // For each tab that should have day selectors
  const tabsWithDaySelectors = ['day-by-day', 'lodging', 'meals', 'transport'];

  // Add day selectors to each relevant tab if they don't exist
  tabsWithDaySelectors.forEach(tabId => {
    const tabPane = document.getElementById(tabId);
    if (!tabPane) return;

    // Find existing day selector or create one
    let daySelector = tabPane.querySelector('.day-selector');

    if (!daySelector) {
      // If no day selector exists for this tab, create one
      daySelector = document.createElement('div');
      daySelector.className = 'day-selector';

      // Find container to insert into
      const container = tabPane.querySelector('.container');
      if (container) {
        // Insert after day-navigation if it exists, otherwise as first child
        const dayNavigation = container.querySelector('.day-navigation');
        if (dayNavigation) {
          container.insertBefore(daySelector, dayNavigation.nextSibling);
        } else {
          container.insertBefore(daySelector, container.firstChild);
        }
      }
    }

    if (daySelector) {
  daySelector.innerHTML = '';

  // Create day buttons
  days.forEach(day => {
    const button = document.createElement('button');
    button.className = 'day-button';
    button.setAttribute('data-day', day.day_number);
    button.textContent = `Day ${day.day_number}`;

    // Add active class to current day
    if (day.day_number === currentDay) {
      button.classList.add('active');
    }

    // Add click event listener
    button.addEventListener('click', () => {
      // Update current day
      const dayNumber = parseInt(button.getAttribute('data-day'), 10);
      updateCurrentDay(dayNumber, days);
    });

    daySelector.appendChild(button);
      });
    }
  });

  // Setup day navigation buttons
  setupDayNavigation(days, currentDay);
}

/**
 * Setup day navigation buttons
 * @param {Array} days - Array of day objects
 * @param {number} currentDay - Current day number
 */
function setupDayNavigation(days, currentDay) {
  if (!days || !Array.isArray(days) || days.length === 0) {
    console.warn('No days data available for day navigation');
    return;
  }

  // Get all previous/next day buttons from all tabs
  const prevDayButtons = $$('.day-navigation button:first-child');
  const nextDayButtons = $$('.day-navigation button:last-child');

  // Clear any existing event listeners by cloning and replacing elements
  prevDayButtons.forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });

  nextDayButtons.forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });

  // Get the fresh buttons after replacement
  const freshPrevButtons = $$('.day-navigation button:first-child');
  const freshNextButtons = $$('.day-navigation button:last-child');

  // Add click event listeners to previous day buttons
  freshPrevButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (window.appState && window.appState.currentDay > 1) {
        const newDay = window.appState.currentDay - 1;
        // Call updateCurrentDay with the new day number
        updateCurrentDay(newDay, days);
      }
    });
  });

  // Add click event listeners to next day buttons
  freshNextButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (window.appState && window.appState.currentDay < days.length) {
        const newDay = window.appState.currentDay + 1;
        // Call updateCurrentDay with the new day number
        updateCurrentDay(newDay, days);
      }
    });
  });

  // Update button states
  updateDayNavigationState(days, currentDay);
}

/**
 * Update day navigation button states
 * @param {Array} days - Array of day objects
 * @param {number} currentDay - Current day number
 */
function updateDayNavigationState(days, currentDay) {
  if (!days || !Array.isArray(days) || days.length === 0) {
    return;
  }

  const prevDayButtons = $$('.day-navigation button:first-child');
  const nextDayButtons = $$('.day-navigation button:last-child');

  // Disable previous day buttons if on first day
  prevDayButtons.forEach(button => {
    if (currentDay === 1) {
      button.setAttribute('disabled', 'disabled');
      button.classList.add('disabled');
    } else {
      button.removeAttribute('disabled');
      button.classList.remove('disabled');
    }
  });

  // Disable next day buttons if on last day
  nextDayButtons.forEach(button => {
    if (currentDay === days.length) {
      button.setAttribute('disabled', 'disabled');
      button.classList.add('disabled');
    } else {
      button.removeAttribute('disabled');
      button.classList.remove('disabled');
    }
  });
}

/**
 * Update current day
 * @param {number} dayNumber - New day number
 * @param {Array} days - Array of day objects
 */
function updateCurrentDay(dayNumber, days) {
  if (!days || !Array.isArray(days) || days.length === 0) {
    console.warn('No days data available for updating current day');
    return;
  }

  // Ensure dayNumber is valid
  if (dayNumber < 1) dayNumber = 1;
  if (dayNumber > days.length) dayNumber = days.length;

  // Get the day index (0-based)
  const dayIndex = dayNumber - 1;

  // Update all day buttons in all tabs
  $$('.day-button').forEach(button => {
    const buttonDay = parseInt(button.getAttribute('data-day'), 10);
    if (buttonDay === dayNumber) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  // Update day navigation state
  updateDayNavigationState(days, dayNumber);

  // Save current day
  saveCurrentDay(dayNumber);

  // Ensure we're using the current plan data before rendering
  ensureCurrentDataIsUsed();

  // Update global state if available
  if (window.appState) {
    window.appState.currentDay = dayNumber;
    updateAppStateWithCurrentPlan(window.appState);
  }

  // Update day data for all tabs
  if (dayIndex >= 0 && dayIndex < days.length) {
    const currentDay = days[dayIndex];

    // Update the tab content based on which tab is currently active
    const activeTab = $('.tab-button.active');
    if (activeTab) {
      const activeTabId = activeTab.getAttribute('data-tab');

      // Update the active tab content
      switch (activeTabId) {
        case 'day-by-day':
          // Use enhanced day detail rendering if available
          if (typeof window.renderEnhancedDayDetail === 'function') {
            window.renderEnhancedDayDetail(currentDay);
          } else {
            renderDayDetail(currentDay);
          }
          break;
        case 'lodging':
          renderLodgingDay(currentDay);
          break;
        case 'meals':
          renderMealDay(currentDay, window.appState?.planData?.regional_info);
          break;
        case 'transport':
          renderTransportDay(currentDay, window.appState?.planData?.regional_info);
          break;
      }

      // Pre-load other tabs' data in the background
      if (activeTabId !== 'day-by-day' && typeof window.renderEnhancedDayDetail === 'function') {
        setTimeout(() => window.renderEnhancedDayDetail(currentDay), 50);
      } else if (activeTabId !== 'day-by-day') {
        setTimeout(() => renderDayDetail(currentDay), 50);
      }

      if (activeTabId !== 'lodging') {
        setTimeout(() => renderLodgingDay(currentDay), 100);
      }
      if (activeTabId !== 'meals') {
        setTimeout(() => renderMealDay(currentDay, window.appState?.planData?.regional_info), 150);
      }
      if (activeTabId !== 'transport') {
        setTimeout(() => renderTransportDay(currentDay, window.appState?.planData?.regional_info), 200);
      }
    } else {
      // Fallback - update all tabs if no active tab is found
      if (typeof window.renderEnhancedDayDetail === 'function') {
        window.renderEnhancedDayDetail(currentDay);
      } else {
        renderDayDetail(currentDay);
      }
      renderLodgingDay(currentDay);
      renderMealDay(currentDay, window.appState?.planData?.regional_info);
      renderTransportDay(currentDay, window.appState?.planData?.regional_info);
    }

    // Dispatch custom event for day change
    document.dispatchEvent(new CustomEvent('dayChanged', { detail: { dayNumber, day: currentDay } }));
  }
}

// Make updateCurrentDay available globally
window.updateCurrentDay = updateCurrentDay;

/**
 * Render budget summary
 * @param {Object} budget - Budget object
 */
export function renderBudgetSummary(budget) {
  if (!budget) {
    console.warn('No budget data available');
    return;
  }

  // Update total budget
  const totalBudgetElement = $('#total-budget');
  if (totalBudgetElement) {
    totalBudgetElement.textContent = `$${budget.total_allocated.toLocaleString()}`;
  }

  // Update spent budget
  const budgetSpentElement = $('#budget-spent');
  if (budgetSpentElement) {
    budgetSpentElement.textContent = `$${budget.spent_to_date.toLocaleString()}`;
  }

  // Update remaining budget
  const remainingBudgetElement = $('#remaining-budget');
  if (remainingBudgetElement) {
    remainingBudgetElement.textContent = `$${budget.remaining.toLocaleString()} remaining`;
  }

  // Update progress bar
  const progressBar = $('.budget-progress-bar');
  if (progressBar) {
    const progressPercentage = (budget.spent_to_date / budget.total_allocated) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    // Add appropriate class based on percentage
    if (progressPercentage > 80) {
      progressBar.classList.add('danger');
      progressBar.classList.remove('warning', 'good');
    } else if (progressPercentage > 60) {
      progressBar.classList.add('warning');
      progressBar.classList.remove('danger', 'good');
    } else {
      progressBar.classList.add('good');
      progressBar.classList.remove('danger', 'warning');
    }
  }

  // Render budget categories
  const categoriesContainer = $('.budget-categories');
  if (categoriesContainer && budget.expenses_by_category) {
    categoriesContainer.innerHTML = '';

    budget.expenses_by_category.forEach(category => {
      const percentage = (category.spent / category.allocated) * 100;
      let progressClass = 'low';

      if (percentage > 80) {
        progressClass = 'high';
      } else if (percentage > 60) {
        progressClass = 'medium';
      }

      const categoryElement = document.createElement('div');
      categoryElement.className = 'budget-category';
      categoryElement.innerHTML = `
        <div class="budget-category-title">${category.name}</div>
        <div class="budget-category-value">
          <span>Spent</span>
          <span class="amount">$${category.spent.toLocaleString()}</span>
        </div>
        <div class="category-progress">
          <div class="category-progress-bar ${progressClass}" style="width: ${percentage}%"></div>
        </div>
      `;

      categoriesContainer.appendChild(categoryElement);
    });
  }
}

/**
 * Render weather summary
 * @param {Array} days - Array of day objects
 */
export function renderWeatherSummary(days) {
  if (!days || !Array.isArray(days) || days.length === 0) {
    console.warn('No days data available for weather summary');
    return;
  }

  // Update current weather (today)
  const currentDay = days[0];
  if (currentDay && currentDay.weather) {
    const currentTempElement = $('.current-temp');
    if (currentTempElement) {
      currentTempElement.textContent = currentDay.weather.temperature;
    }

    const currentConditionElement = $('.current-condition');
    if (currentConditionElement) {
      currentConditionElement.textContent = currentDay.weather.condition;
    }

    const weatherIconElement = $('.weather-icon i');
    if (weatherIconElement) {
      weatherIconElement.className = `fa-solid ${currentDay.weather.icon}`;
    }

    // Update weather details
    const humidityElement = $('#humidity');
    if (humidityElement) {
      humidityElement.textContent = currentDay.weather.humidity;
    }

    const windElement = $('#wind');
    if (windElement) {
      windElement.textContent = currentDay.weather.wind;
    }

    const sunriseElement = $('#sunrise');
    if (sunriseElement) {
      sunriseElement.textContent = currentDay.weather.sunrise;
    }
  }

  // Render weather days (starting from tomorrow)
  const weatherDaysContainer = $('.weather-days');
  if (weatherDaysContainer) {
    weatherDaysContainer.innerHTML = '';

    // Skip today (index 0) and start from tomorrow (index 1)
    // Make sure we have days available
    if (days.length < 2) {
      weatherDaysContainer.innerHTML = `
        <div class="empty-state weather-empty-state">
          <i class="fa-solid fa-cloud-sun"></i>
          <p>No future weather forecast available</p>
        </div>
      `;
      return;
    }

    // Get the days to show (tomorrow and the next 2 days)
    const daysToShow = days.slice(1, 4);

    // Add appropriate class based on number of days
    if (daysToShow.length === 1) {
      weatherDaysContainer.classList.add('one-day');
    } else if (daysToShow.length === 2) {
      weatherDaysContainer.classList.add('two-days');
    } else {
      weatherDaysContainer.classList.remove('one-day', 'two-days');
    }

    daysToShow.forEach((day, index) => {
      const dayElement = document.createElement('div');
      dayElement.className = 'weather-day';

      // First card is "Tomorrow", the rest are "Day X"
      const dayLabel = index === 0 ? 'Tomorrow' : `Day ${day.day_number}`;

      dayElement.innerHTML = `
        <div class="weather-day-label">${dayLabel}</div>
        <div class="weather-date">${day.date}</div>
        <div class="weather-location">${day.location.city}</div>
        <div class="weather-info">
          <i class="fa-solid ${day.weather.icon}"></i>
          <div class="weather-temp">${day.weather.temperature}</div>
        </div>
        <div class="weather-meta">
          <div class="weather-meta-item">
            <i class="fa-solid fa-droplet"></i>
            <span>${day.weather.humidity}</span>
          </div>
          <div class="weather-meta-item">
            <i class="fa-solid fa-wind"></i>
            <span>${day.weather.wind}</span>
          </div>
        </div>
      `;

      weatherDaysContainer.appendChild(dayElement);
    });
  }
}

/**
 * Render day detail
 * @param {Object} day - Day object
 */
export function renderDayDetail(day) {
  if (!day) {
    console.warn('No day data available for day detail');
    return;
  }

  // Update day title
  const dayTitle = $('#day-by-day .day-title');
  if (dayTitle) {
    dayTitle.innerHTML = `
      <h2>Day ${day.day_number} - ${day.date}</h2>
      <p>${day.location.city}, ${day.location.country}</p>
    `;
  }

  // Render timeline
  renderTimeline(day);

  // Render day summary
  renderDaySummary(day);
}

/**
 * Render timeline
 * @param {Object} day - Day object
 */
function renderTimeline(day) {
  if (!day) return;

  const timelineContainer = $('.timeline');
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
        iconColor: item.iconType || 'blue'
      });
    });
  }

  // Add meal items
  if (day.meals && day.meals.length > 0) {
    day.meals.forEach(item => {
      // Extract the start time for sorting
      const timeMatch = item.time ? item.time.match(/(\d+:\d+)\s*(AM|PM)/) : null;
      const timeForSort = timeMatch ? timeMatch[0] : '12:00 AM';

      allItems.push({
        ...item,
        itemType: 'meal',
        timeForSort,
        title: `${item.type} at ${item.restaurant}`,
        description: item.details,
        icon: item.timeIcon || 'fa-utensils',
        iconColor: 'orange'
      });
    });
  }

  // Add activity items
  if (day.activities && day.activities.length > 0) {
    day.activities.forEach(item => {
      // Extract the start time for sorting
      const timeMatch = item.time ? item.time.match(/(\d+:\d+)\s*(AM|PM)/) : null;
      const timeForSort = timeMatch ? timeMatch[0] : '12:00 PM';

      allItems.push({
        ...item,
        itemType: 'activity',
        timeForSort,
        icon: 'fa-map-marker-alt',
        iconColor: 'green'
      });
    });
  }

  // Sort all items by time
  allItems.sort((a, b) => {
    // First try to sort by sequence if available
    if (a.sequence !== undefined && b.sequence !== undefined) {
      return a.sequence - b.sequence;
    }

    // Otherwise sort by time
    const timeA = a.timeForSort || '';
    const timeB = b.timeForSort || '';
    return timeA.localeCompare(timeB);
  });

  // Create timeline events
  allItems.forEach(item => {
    const timelineEvent = document.createElement('div');
    timelineEvent.className = 'timeline-event';

    // Determine icon color class based on item type
    let colorClass;
    switch(item.iconColor) {
      case 'blue':
        colorClass = 'accent';
        break;
      case 'green':
        colorClass = 'success';
        break;
      case 'orange':
      default:
        colorClass = 'primary';
    }

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
      </div>
    `;
  }
}

/**
 * Render day summary
 * @param {Object} day - Day object
 */
function renderDaySummary(day) {
  if (!day) return;

  const summaryContainer = $('.day-summary');
  if (!summaryContainer) return;

  summaryContainer.innerHTML = '';

  // Create budget summary
  const budgetSummary = document.createElement('div');
  budgetSummary.innerHTML = `
    <h3><i class="fa-solid fa-wallet"></i> Daily Budget</h3>
    <div class="summary-item">
      <i class="fa-solid fa-money-bill"></i>
      <span>Allocated: $${day.budget.daily_allocated}</span>
    </div>
    <div class="summary-item">
      <i class="fa-solid fa-credit-card"></i>
      <span>Spent: $${day.budget.daily_spent}</span>
    </div>
    <div class="summary-item">
      <i class="fa-solid fa-piggy-bank"></i>
      <span>Remaining: $${day.budget.daily_allocated - day.budget.daily_spent}</span>
    </div>
  `;
  summaryContainer.appendChild(budgetSummary);

  // Create weather summary
  const weatherSummary = document.createElement('div');
  weatherSummary.innerHTML = `
    <h3><i class="fa-solid ${day.weather.icon}"></i> Weather</h3>
    <div class="summary-item">
      <i class="fa-solid fa-temperature-half"></i>
      <span>Temperature: ${day.weather.temperature}</span>
    </div>
    <div class="summary-item">
      <i class="fa-solid fa-droplet"></i>
      <span>Humidity: ${day.weather.humidity}</span>
    </div>
    <div class="summary-item">
      <i class="fa-solid fa-wind"></i>
      <span>Wind: ${day.weather.wind}</span>
    </div>
  `;
  summaryContainer.appendChild(weatherSummary);

  // Create notes section if notes exist
  if (day.notes) {
    const notesSection = document.createElement('div');
    notesSection.className = 'day-notes';
    notesSection.innerHTML = `
      <h4><i class="fa-solid fa-note-sticky"></i> Notes</h4>
      <p>${day.notes}</p>
    `;
    summaryContainer.appendChild(notesSection);
  }
}

/**
 * Render lodging day
 * @param {Object} day - Day object
 */
export function renderLodgingDay(day) {
  if (!day) return;

  // Get lodging section and container
  const lodgingSection = document.getElementById('lodging');
  if (!lodgingSection) return;

  const container = lodgingSection.querySelector('.container');
  if (!container) return;

  // Find the elements we want to keep (navigation, day selector, and title)
  const dayNavigation = container.querySelector('.day-navigation');
  const daySelector = container.querySelector('.day-selector');

  // Update day title
  const dayTitle = container.querySelector('.day-title');
  if (dayTitle) {
    dayTitle.innerHTML = `
      <h2>Day ${day.day_number} - ${day.date}</h2>
      <p>Lodging in ${day.location.city}</p>
    `;
  }

  // Find the lodging details section (we'll either update or replace this)
  let lodgingDetails = container.querySelector('.lodging-details');

  // Skip if no lodging data
  if (!day.lodging) {
    // If there's an existing lodging details section, remove it
    if (lodgingDetails) {
      lodgingDetails.remove();
    }

    // Check if we already have an empty state
    if (!container.querySelector('.empty-state')) {
      // Add empty state message
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
            <i class="fa-solid fa-bed"></i>
            <h3>No lodging information available for this day</h3>
      `;

      // Add empty state after day title
      if (dayTitle && dayTitle.nextSibling) {
        container.insertBefore(emptyState, dayTitle.nextSibling);
      } else {
        container.appendChild(emptyState);
    }
    }

    return;
  } else {
    // If there's an empty state, remove it
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }
  }

  // Update lodging banner (outside the container)
  const lodgingBanner = lodgingSection.querySelector('.lodging-banner');
  if (lodgingBanner) {
    lodgingBanner.innerHTML = `
      <img src="${day.lodging.image}" alt="${day.lodging.name}">
      <div class="lodging-banner-content">
        <div class="lodging-info">
          <h2>${day.lodging.name}</h2>
          <div class="location"><i class="fa-solid fa-location-dot"></i> ${day.lodging.location}</div>
        </div>
        <div class="lodging-rating">
          <div class="stars">
            ${Array(day.lodging.rating.stars).fill('<i class="fa-solid fa-star"></i>').join('')}
          </div>
          <div class="rating-score">
            <span>${day.lodging.rating.score}</span>
            <span>${day.lodging.rating.description}</span>
          </div>
        </div>
      </div>
    `;
  }

  // If lodging details doesn't exist yet, create it
  if (!lodgingDetails) {
    lodgingDetails = document.createElement('div');
    lodgingDetails.className = 'lodging-details';

    // Add after day title
    if (dayTitle && dayTitle.nextSibling) {
      container.insertBefore(lodgingDetails, dayTitle.nextSibling);
    } else {
      container.appendChild(lodgingDetails);
    }
  }

  // Update lodging details content
  lodgingDetails.innerHTML = `
    <div class="lodging-main">
      <div class="lodging-meta">
      <div class="meta-item">
        <i class="fa-regular fa-calendar"></i>
        <div>
          <div class="meta-label">Check-in</div>
          <div class="meta-value">${day.lodging.check_in}</div>
        </div>
      </div>
      <div class="meta-item">
        <i class="fa-regular fa-calendar-check"></i>
        <div>
          <div class="meta-label">Check-out</div>
          <div class="meta-value">${day.lodging.check_out}</div>
        </div>
      </div>
      <div class="meta-item">
        <i class="fa-solid fa-bed"></i>
        <div>
          <div class="meta-label">Room</div>
          <div class="meta-value">${day.lodging.room_details.type}</div>
        </div>
      </div>
      <div class="meta-item">
        <i class="fa-solid fa-users"></i>
        <div>
          <div class="meta-label">Guests</div>
          <div class="meta-value">${day.lodging.room_details.guests}</div>
        </div>
      </div>
      </div>

      <div class="lodging-amenities">
        <h3>Key Amenities</h3>
        <div class="amenities-grid">
          ${day.lodging.amenities.map(amenity => `
            <div class="amenity-item">
        <i class="fa-solid ${amenity.icon}"></i>
        <span>${amenity.name}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn-link">View All Amenities</button>
      </div>

      <div class="lodging-location">
        <h3>Location & Surroundings</h3>
        <p>Located in the heart of ${day.location.city}'s medina, ${day.lodging.name} offers easy access to the city's main attractions while providing a peaceful oasis within its historic walls.</p>
        <div class="location-points">
          ${day.lodging.location_details && day.lodging.location_details.points ?
            day.lodging.location_details.points.map(point => `
              <div class="location-point">
        <i class="fa-solid ${point.icon}"></i>
        <span>${point.text}</span>
              </div>
            `).join('') : ''}
        </div>
      </div>
    </div>

    <div class="lodging-cost">
      <div class="cost-details">
        <h3>Cost Details</h3>
        <div class="cost-breakdown">
      <div class="cost-item">
        <span>${day.lodging.costs.nights} nights × $${day.lodging.costs.nightly}</span>
        <span>$${(day.lodging.costs.nightly * day.lodging.costs.nights).toLocaleString()}</span>
      </div>
      <div class="cost-item">
        <span>Taxes & fees</span>
        <span>$${day.lodging.costs.taxes.toLocaleString()}</span>
      </div>
      <div class="cost-total">
        <span>Total</span>
        <span>$${day.lodging.costs.total.toLocaleString()}</span>
          </div>
        </div>
        <button class="btn btn-primary btn-block">Change Stay</button>
        <p class="cancelation-policy">${day.lodging.cancellation}</p>
      </div>
      </div>
    `;
}

/**
 * Render meal day
 * @param {Object} day - Day object
 * @param {Object} regionalInfo - Regional info object
 */
export function renderMealDay(day, regionalInfo) {
  if (!day) return;

  // Get meals section and container
  const mealsSection = document.getElementById('meals');
  if (!mealsSection) return;

  const container = mealsSection.querySelector('.container');
  if (!container) return;

  // Update day title
  const dayTitle = container.querySelector('.day-title');
  if (dayTitle) {
    dayTitle.innerHTML = `
      <h2>Day ${day.day_number} - ${day.date}</h2>
      <p>${day.location.city}, ${day.location.country}</p>
    `;
  }

  // Update meal budget
  const mealsHeader = mealsSection.querySelector('.meals-banner-content');
  if (mealsHeader) {
    const mealBudget = mealsHeader.querySelector('.meal-budget span');
  if (mealBudget && day.budget && day.budget.breakdown) {
    mealBudget.textContent = `$${day.budget.breakdown.meals} meal budget for today`;
  }
  }

  // Get or create meals list
  let mealsList = container.querySelector('.meals-list');
  if (!mealsList) {
    mealsList = document.createElement('div');
    mealsList.className = 'meals-list';

    // Insert after day title
    if (dayTitle && dayTitle.nextSibling) {
      container.insertBefore(mealsList, dayTitle.nextSibling);
    } else {
      container.appendChild(mealsList);
    }
  }

  // Clear existing content
  mealsList.innerHTML = '';

  // Skip if no meals data
  if (!day.meals || day.meals.length === 0) {
    mealsList.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-utensils"></i>
        <h3>No meal information available for this day</h3>
      </div>
    `;
  } else {
    // Sort meals by sequence
    const sortedMeals = [...day.meals].sort((a, b) => a.sequence - b.sequence);

    sortedMeals.forEach(meal => {
      const mealCard = document.createElement('div');
      mealCard.className = 'meal-card';
      mealCard.setAttribute('data-meal-id', meal.id);

      // Determine reservation status
      let reservationStatus = '';
      if (meal.reservation) {
        if (meal.reservation.status === 'confirmed') {
          reservationStatus = `<span class="reservation-confirmed">Reservation confirmed for ${meal.reservation.time}</span>`;
        } else if (meal.reservation.status.includes('recommended')) {
          reservationStatus = `<span class="reservation-recommended">${meal.reservation.status}</span>`;
        }
      }

      // Create meal tags
      let tagsHtml = '';
      if (meal.tags && meal.tags.length > 0) {
        tagsHtml = meal.tags.map(tag => `
          <i class="fa-solid ${tag.icon}" title="${tag.description}"></i>
        `).join('');
      }

      mealCard.innerHTML = `
        <div class="meal-time">
          <i class="fa-solid ${meal.timeIcon || 'fa-clock'}"></i>
          <span>${meal.time}</span>
        </div>
        ${meal.reservation && meal.reservation.status === 'confirmed' ?
          `<span class="reservation-badge"><i class="fa-solid fa-check-circle"></i> Reserved</span>` : ''}
        <div class="meal-image">
          <img src="${meal.image || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fa5cc0ff55-9d433c5d9399d12d1412.png'}" alt="${meal.restaurant}">
          ${meal.location && meal.location.distance_from_lodging ?
            `<div class="meal-distance"><i class="fa-solid fa-location-dot"></i> ${meal.location.distance_from_lodging}</div>` : ''}
          <div class="meal-image-overlay">
            <i class="fa-solid fa-magnifying-glass-plus"></i>
            <span>View Larger</span>
          </div>
        </div>
        <div class="meal-content">
          <div class="meal-details">
            <div class="meal-type">
              <i class="fa-solid ${meal.type === 'Breakfast' ? 'fa-mug-saucer' :
                                  meal.type === 'Lunch' ? 'fa-plate-wheat' :
                                  meal.type === 'Dinner' ? 'fa-utensils' : 'fa-bowl-food'}"></i>
              ${meal.type}
            </div>
            <h3 class="meal-name">${meal.restaurant}</h3>
            <div class="meal-rating">
              ${Array(Math.floor(meal.rating || 4)).fill('<i class="fa-solid fa-star"></i>').join('')}
              ${meal.rating && meal.rating % 1 >= 0.5 ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
              ${Array(5 - Math.ceil(meal.rating || 4)).fill('<i class="fa-regular fa-star"></i>').join('')}
              <span class="rating-count">${meal.reviewCount || '120'}+ reviews</span>
            </div>
            <div class="meal-description">${meal.details}</div>
            ${meal.location && meal.location.address ?
              `<div class="meal-address"><i class="fa-solid fa-map-marker-alt"></i> ${meal.location.address}</div>` : ''}
            <div class="meal-highlights">
              <h4>Highlights</h4>
              <ul>
                <li><i class="fa-solid fa-utensils"></i> ${meal.cuisine || 'Authentic ' + day.location.country + ' cuisine'}</li>
                <li><i class="fa-solid fa-clock"></i> ${meal.duration || 'Approx. 1.5 hours'}</li>
                <li><i class="fa-solid fa-user-group"></i> ${meal.atmosphere || 'Casual dining experience'}</li>
              </ul>
            </div>
            <div class="meal-footer">
              <div class="meal-tags">
                ${tagsHtml}
              </div>
              <div class="meal-price">$${meal.price}</div>
            </div>
          </div>
          <div class="meal-card-actions">
            <button class="btn change-btn">
              <i class="fa-solid fa-exchange-alt"></i> Change
            </button>
          </div>
        </div>
      `;

      mealsList.appendChild(mealCard);
    });
  }

  // Immediately add event listeners to change buttons
  try {
    // Import module directly
    import('../components/meals-editor.js').then(module => {
      if (typeof module.addChangeButtonsToMealCards === 'function') {
        module.addChangeButtonsToMealCards();
      }
    }).catch(error => {
      console.error('Error importing meals-editor module:', error);
    });
  } catch (error) {
    console.error('Error setting up meal change buttons:', error);
  }

  // Get or create meals summary
  let mealsSummary = container.querySelector('.meals-summary');
  if (!mealsSummary) {
    mealsSummary = document.createElement('div');
    mealsSummary.className = 'meals-summary';
    container.appendChild(mealsSummary);
  }

  // Update or create summary box
  let summaryBox = mealsSummary.querySelector('.summary-box');
  if (!summaryBox) {
    summaryBox = document.createElement('div');
    summaryBox.className = 'summary-box';
    summaryBox.innerHTML = '<h3>Daily Meal Cost Summary</h3>';
    mealsSummary.appendChild(summaryBox);
  }

  // Update summary items
  let summaryItems = summaryBox.querySelector('.summary-items');
  if (!summaryItems) {
    summaryItems = document.createElement('div');
    summaryItems.className = 'summary-items';
    summaryBox.appendChild(summaryItems);
  }

  // Clear existing summary items
  summaryItems.innerHTML = '';

  let totalMealCost = 0;

  if (day.meals && day.meals.length > 0) {
    // Sort meals by type to group them logically (breakfast, lunch, dinner)
    const mealTypeOrder = { 'Breakfast': 1, 'Lunch': 2, 'Dinner': 3 };
    const sortedMeals = [...day.meals].sort((a, b) => {
      return (mealTypeOrder[a.type] || 99) - (mealTypeOrder[b.type] || 99);
    });

    sortedMeals.forEach(meal => {
      const summaryItem = document.createElement('div');
      summaryItem.className = 'summary-item';

      // Determine icon based on meal type
      let mealIcon = 'fa-utensils';
      if (meal.type === 'Breakfast') mealIcon = 'fa-mug-saucer';
      else if (meal.type === 'Lunch') mealIcon = 'fa-plate-wheat';
      else if (meal.type === 'Dinner') mealIcon = 'fa-utensils';

      summaryItem.innerHTML = `
        <span><i class="fa-solid ${mealIcon}"></i> ${meal.type} at ${meal.restaurant}</span>
        <span>$${meal.price}</span>
      `;
      summaryItems.appendChild(summaryItem);

      totalMealCost += meal.price;
    });

    // Calculate budget status
    const budgetAmount = day.budget && day.budget.breakdown ? day.budget.breakdown.meals : 0;
    const budgetStatus = budgetAmount > 0 ? budgetAmount - totalMealCost : 0;
    const isOverBudget = budgetStatus < 0;

    // Add budget status
    if (budgetAmount > 0) {
      const budgetStatusItem = document.createElement('div');
      budgetStatusItem.className = 'summary-budget-status';
      budgetStatusItem.innerHTML = `
        <span>Daily Budget</span>
        <span>$${budgetAmount}</span>
      `;
      summaryItems.appendChild(budgetStatusItem);
    }

    const summaryTotal = document.createElement('div');
    summaryTotal.className = 'summary-total';
    summaryTotal.innerHTML = `
      <span>Total</span>
      <span>$${totalMealCost}</span>
    `;
    summaryItems.appendChild(summaryTotal);

    // Add budget status message if applicable
    if (budgetAmount > 0) {
      const statusMessage = document.createElement('div');
      statusMessage.className = `budget-status ${isOverBudget ? 'over-budget' : 'under-budget'}`;
      statusMessage.innerHTML = isOverBudget
        ? `<i class="fa-solid fa-triangle-exclamation"></i> $${Math.abs(budgetStatus)} over budget`
        : `<i class="fa-solid fa-check-circle"></i> $${budgetStatus} under budget`;
      summaryItems.appendChild(statusMessage);
    }
  } else {
    summaryItems.innerHTML = `
      <div class="summary-item empty-meals">
        <i class="fa-solid fa-calendar-xmark"></i>
        <span>No meals scheduled for this day</span>
        <span>$0</span>
      </div>
    `;
  }

  // Add any missing summary elements
  if (!summaryBox.querySelector('.summary-note')) {
    const summaryNote = document.createElement('p');
    summaryNote.className = 'summary-note';
    summaryNote.textContent = '*Gratuities and additional beverages not included';
    summaryBox.appendChild(summaryNote);
  }

  if (!summaryBox.querySelector('.btn-primary')) {
    const changeButton = document.createElement('button');
    changeButton.className = 'btn btn-primary btn-block meal-change-btn';
    changeButton.innerHTML = '<i class="fa-solid fa-utensils"></i> Customize Meals';
    summaryBox.appendChild(changeButton);
  }

  // Render dining tips carousel if available
  if (regionalInfo && regionalInfo.dining_tips && regionalInfo.dining_tips.length > 0) {
    // Get or create dining tips container
    let diningTips = mealsSummary.querySelector('.dining-tips');
    if (!diningTips) {
      diningTips = document.createElement('div');
      diningTips.className = 'dining-tips';
      diningTips.innerHTML = `<h3><i class="fa-solid fa-lightbulb"></i> ${day.location.country} Dining Tips</h3>`;
      mealsSummary.appendChild(diningTips);
    } else {
      // Keep only the heading
      diningTips.innerHTML = `<h3><i class="fa-solid fa-lightbulb"></i> ${day.location.country} Dining Tips</h3>`;
    }

    // Create carousel container
    const carouselContainer = document.createElement('div');
    carouselContainer.id = 'dining-carousel';
    carouselContainer.className = 'carousel-container relative';

    // Create slides container
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'carousel-slides';
    carouselContainer.appendChild(slidesContainer);

    // Create slides
    regionalInfo.dining_tips.forEach((tip, index) => {
      const slide = document.createElement('div');
      slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;

      // Determine appropriate icon if not provided
      const iconClass = tip.icon || getIconForTipTitle(tip.title);

      slide.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <h4>${tip.title}</h4>
        <p>${tip.description}</p>
      `;
      slidesContainer.appendChild(slide);
    });

    // Add navigation arrows
    carouselContainer.innerHTML += `
      <button class="nav-arrow prev" aria-label="Previous slide">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button class="nav-arrow next" aria-label="Next slide">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
      <div class="carousel-dots"></div>
    `;

    // Helper function to determine appropriate icon based on tip title
    function getIconForTipTitle(title) {
      const titleLower = title.toLowerCase();
      if (titleLower.includes('dining') || titleLower.includes('eat')) return 'fa-utensils';
      if (titleLower.includes('tea') || titleLower.includes('drink')) return 'fa-mug-hot';
      if (titleLower.includes('etiquette') || titleLower.includes('custom')) return 'fa-hands';
      if (titleLower.includes('time')) return 'fa-clock';
      if (titleLower.includes('tip')) return 'fa-lightbulb';
      return 'fa-info-circle';
    }

    // Add carousel to DOM
    diningTips.appendChild(carouselContainer);

    // Initialize carousel
    try {
      const carousel = createCarousel('dining-carousel', null, {
        autoPlay: true,
        interval: 5000
      });

      // Add event listeners to nav arrows
      carouselContainer.querySelector('.nav-arrow.prev').addEventListener('click', () => {
        carousel.prev();
      });

      carouselContainer.querySelector('.nav-arrow.next').addEventListener('click', () => {
        carousel.next();
      });
    } catch (error) {
      console.error('Error initializing dining tips carousel:', error);
    }
  }
}

/**
 * Render transport day
 * @param {Object} day - Day object
 * @param {Object} regionalInfo - Regional info object
 */
export function renderTransportDay(day, regionalInfo) {
  if (!day) return;

  // Get transport section and container
  const transportSection = document.getElementById('transport');
  if (!transportSection) return;

  const container = transportSection.querySelector('.container');
  if (!container) return;

  // Update day title
  const dayTitle = container.querySelector('.day-title');
  if (dayTitle) {
    dayTitle.innerHTML = `
      <h2>Day ${day.day_number} - ${day.date}</h2>
      <p>Transport in ${day.location.city}</p>
    `;
  }

  // Get or create journey map container if it doesn't exist
  let journeyMapContainer = container.querySelector('.journey-map-container');
  if (!journeyMapContainer) {
    // Skip journey map creation - it's complex and should be part of initial HTML

    // Instead, let's just make sure the transport-cards div exists
    if (!container.querySelector('.transport-cards')) {
      const transportCards = document.createElement('div');
      transportCards.className = 'transport-cards';

      // Insert after day title
      if (dayTitle && dayTitle.nextSibling) {
        container.insertBefore(transportCards, dayTitle.nextSibling);
      } else {
        container.appendChild(transportCards);
      }
    }
  }

  // Get transport cards container
  const transportContainer = container.querySelector('.transport-cards');
  if (!transportContainer) return;

  // Clear existing content
  transportContainer.innerHTML = '';

  // Skip if no transport data
  if (!day.transport || day.transport.length === 0) {
    transportContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-route"></i>
        <h3>No transportation scheduled for this day</h3>
      </div>
    `;
  } else {
    // Sort transport by sequence
    const sortedTransport = [...day.transport].sort((a, b) => a.sequence - b.sequence);

    sortedTransport.forEach(transport => {
      const transportCard = document.createElement('div');
      transportCard.className = 'transport-card';
      transportCard.setAttribute('data-transport-id', transport.id);

      // Determine icon color
      const iconColor = transport.iconType === 'blue' ? 'accent' :
                       transport.iconType === 'green' ? 'success' : 'primary';

      // Format details
      let detailsHtml = '';
      if (transport.details && transport.details.length > 0) {
        detailsHtml = `
          <div class="transport-details">
            ${transport.details.map(detail => `
              <div class="detail-item">
                <span class="detail-label">${detail.label}:</span>
                <span class="detail-value">${detail.value}</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      transportCard.innerHTML = `
        <div class="transport-icon" style="background-color: var(--color-${iconColor})">
          <i class="fa-solid ${transport.icon}"></i>
        </div>
        <div class="transport-content">
          <div class="transport-header">
            <h3 class="transport-title">${transport.type} ${transport.from ? 'from ' + transport.from : ''} ${transport.to ? 'to ' + transport.to : ''}</h3>
            <div class="transport-time">
              ${transport.departureTime} - ${transport.arrivalTime} (${transport.duration})
            </div>
          </div>
          <div class="transport-info">
            <div class="transport-provider">${transport.provider} ${transport.class ? '- ' + transport.class : ''}</div>
            <div class="transport-description">${transport.description || ''}</div>
            ${detailsHtml}
          </div>
          <div class="transport-footer">
            <div class="transport-status ${transport.status}">${transport.status}</div>
            <div class="transport-price">$${transport.price}</div>
          </div>
        </div>
        <div class="transport-card-actions">
          <button class="btn btn-outline change-btn">
            <i class="fa-solid fa-exchange-alt"></i> Change Transport
          </button>
        </div>
      `;

      transportContainer.appendChild(transportCard);
    });
  }

  // Immediately add event listeners to change buttons
  try {
    // Import module directly
    import('../components/transport-editor.js').then(module => {
      if (typeof module.addChangeButtonsToTransportCards === 'function') {
        module.addChangeButtonsToTransportCards();
      }
    }).catch(error => {
      console.error('Error importing transport-editor module:', error);
    });
  } catch (error) {
    console.error('Error setting up transport change buttons:', error);
  }

  // Get or create transport summary
  let transportSummary = container.querySelector('.transport-summary');
  if (!transportSummary) {
    transportSummary = document.createElement('div');
    transportSummary.className = 'transport-summary';
    container.appendChild(transportSummary);
  }

  // Update or create summary box
  let summaryBox = transportSummary.querySelector('.summary-box');
  if (!summaryBox) {
    summaryBox = document.createElement('div');
    summaryBox.className = 'summary-box';
    summaryBox.innerHTML = '<h3>Transport Cost Summary</h3>';
    transportSummary.appendChild(summaryBox);
  }

  // Update summary items
  let summaryItems = summaryBox.querySelector('.summary-items');
  if (!summaryItems) {
    summaryItems = document.createElement('div');
    summaryItems.className = 'summary-items';
    summaryBox.appendChild(summaryItems);
  }

  // Clear existing summary items
    summaryItems.innerHTML = '';

    let totalTransportCost = 0;

    if (day.transport && day.transport.length > 0) {
      day.transport.forEach(transport => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
          <span>${transport.type} ${transport.from ? 'from ' + transport.from : ''} ${transport.to ? 'to ' + transport.to : ''}</span>
          <span>$${transport.price}</span>
        `;
        summaryItems.appendChild(summaryItem);

        totalTransportCost += transport.price;
      });

      const summaryTotal = document.createElement('div');
      summaryTotal.className = 'summary-total';
      summaryTotal.innerHTML = `
        <span>Total</span>
        <span>$${totalTransportCost}</span>
      `;
      summaryItems.appendChild(summaryTotal);
    } else {
      summaryItems.innerHTML = `
        <div class="summary-item">
          <span>No transport scheduled for this day</span>
          <span>$0</span>
        </div>
      `;
    }

  // Add missing note if needed
  if (!summaryBox.querySelector('.summary-note')) {
    const summaryNote = document.createElement('p');
    summaryNote.className = 'summary-note';
    summaryNote.textContent = '*Additional luggage fees and tips not included';
    summaryBox.appendChild(summaryNote);
  }

  // Render transport tips carousel if available
  if (regionalInfo && regionalInfo.transport_tips && regionalInfo.transport_tips.length > 0) {
    // Get or create transport tips container
    let transportTips = transportSummary.querySelector('.transport-tips');
    if (!transportTips) {
      transportTips = document.createElement('div');
      transportTips.className = 'transport-tips';
      transportTips.innerHTML = '<h3>Transport Notes</h3>';
      transportSummary.appendChild(transportTips);
    } else {
      // Keep only the heading
      transportTips.innerHTML = '<h3>Transport Notes</h3>';
    }

    // Create carousel container
    const carouselContainer = document.createElement('div');
    carouselContainer.id = 'transport-carousel';
    carouselContainer.className = 'carousel-container relative';

    // Create slides container
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'carousel-slides';
    carouselContainer.appendChild(slidesContainer);

    // Create slides
    regionalInfo.transport_tips.forEach((tip, index) => {
      const slide = document.createElement('div');
      slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
      slide.innerHTML = `
        <i class="fa-solid ${tip.icon}"></i>
        <h4>${tip.title}</h4>
        <p>${tip.description}</p>
      `;
      slidesContainer.appendChild(slide);
    });

    // Add navigation arrows
    carouselContainer.innerHTML += `
      <button class="nav-arrow prev" aria-label="Previous slide">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button class="nav-arrow next" aria-label="Next slide">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
      <div class="carousel-dots"></div>
    `;

    // Add carousel to DOM
    transportTips.appendChild(carouselContainer);

    // Initialize carousel
    try {
      const carousel = createCarousel('transport-carousel', null, {
        autoPlay: true,
        interval: 5000
      });

      // Add event listeners to nav arrows
      carouselContainer.querySelector('.nav-arrow.prev').addEventListener('click', () => {
        carousel.prev();
      });

      carouselContainer.querySelector('.nav-arrow.next').addEventListener('click', () => {
        carousel.next();
      });
    } catch (error) {
      console.error('Error initializing transport tips carousel:', error);
    }
  }
}

/**
 * Render recommendations
 * @param {Array} activities - Array of activity objects
 */
export function renderRecommendations(activities) {
  if (!activities || !Array.isArray(activities) || activities.length === 0) return;

  const recommendationsContainer = $('.recommendations-grid');
  if (!recommendationsContainer) return;

  recommendationsContainer.innerHTML = '';

  // Only show up to 3 recommendations
  const activitiesToShow = activities.slice(0, 3);

  activitiesToShow.forEach(activity => {
    const recommendationCard = document.createElement('div');
    recommendationCard.className = 'recommendation-card';

    recommendationCard.innerHTML = `
      <div class="recommendation-image">
        <img src="${activity.image}" alt="${activity.title}">
      </div>
      <div class="recommendation-content">
        <h3 class="recommendation-title">${activity.title}</h3>
        <p class="recommendation-description">${activity.description}</p>
        <div class="recommendation-footer">
          <div class="recommendation-price">$${activity.price}</div>
          <button class="recommendation-button">Add to Plan</button>
        </div>
      </div>
    `;

    recommendationsContainer.appendChild(recommendationCard);
  });

  // Add click event listeners to recommendation buttons
  $$('.recommendation-button').forEach(button => {
    button.addEventListener('click', () => {
      showToast('Activity added to your plan!');
    });
  });
}

/**
 * Render videos
 * @param {Array} videos - Array of video objects
 */
export function renderVideos(videos) {
  if (!videos || !Array.isArray(videos) || videos.length === 0) {
    console.warn('No videos data available');
    return;
  }

  const videosContainer = $('.videos-grid');
  if (!videosContainer) {
    console.warn('Videos container not found');
    return;
  }

  // Clear any existing content
  videosContainer.innerHTML = '';

  // Process and display each video
  videos.forEach(video => {
    if (!video.thumbnail || !video.title) {
      console.warn('Invalid video data:', video);
      return;
    }

    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.setAttribute('data-video-id', video.id || '');

    videoCard.innerHTML = `
      <div class="video-thumbnail">
        <img src="${video.thumbnail}" alt="${video.title}">
        <div class="video-overlay">
          <i class="fa-solid fa-play video-play-icon"></i>
        </div>
        <div class="video-title">
          <div>${video.title}</div>
          <div>${video.duration || ''}</div>
        </div>
      </div>
    `;

    videosContainer.appendChild(videoCard);
  });

  // Add click event listeners to video cards
  $$('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      try {
        const videoId = card.getAttribute('data-video-id');
        // Create a basic modal if createVideoModal isn't available
        if (typeof createVideoModal === 'function') {
          const modal = createVideoModal(videoId);
          modal.show();
        } else {
          showModal(`
            <div class="video-modal-content">
              <h3>Video Preview</h3>
              <p>Video ID: ${videoId}</p>
              <p>This is a placeholder for the actual video player.</p>
            </div>
          `, { title: 'Video Preview' });
        }
      } catch (error) {
        console.error('Error showing video modal:', error);
        showToast('Failed to load video. Please try again later.', 'error');
      }
    });
  });

  // Make videos section visible
  const videosSection = document.getElementById('videos');
  if (videosSection) {
    videosSection.style.display = 'block';
  }
}

/**
 * Setup feedback form
 */
export function setupFeedbackForm() {
  const ratingStars = $$('.rating i');
  const feedbackTextarea = $('.feedback-input textarea');
  const submitButton = document.getElementById('submit-feedback');
  const feedbackMessage = document.getElementById('feedback-message');
  const expandButton = $('.expand-btn');
  let currentRating = 0;

  if (!ratingStars.length || !feedbackTextarea || !submitButton || !feedbackMessage || !expandButton) return;

  // Handle star rating hover
  ratingStars.forEach(star => {
    const rating = parseInt(star.getAttribute('data-rating'), 10);

    // Hover effect
    star.addEventListener('mouseenter', () => {
      ratingStars.forEach(s => {
        const starRating = parseInt(s.getAttribute('data-rating'), 10);
        if (starRating <= rating) {
          s.classList.remove('fa-regular');
          s.classList.add('fa-solid');
          s.classList.add('hover');
        } else {
          s.classList.remove('fa-solid');
          s.classList.add('fa-regular');
          s.classList.remove('hover');
        }
      });
    });

    // Click effect
    star.addEventListener('click', () => {
      currentRating = rating; // Store selected rating
      ratingStars.forEach(s => {
        const starRating = parseInt(s.getAttribute('data-rating'), 10);
        s.classList.remove('active');

        if (starRating <= rating) {
          s.classList.remove('fa-regular');
          s.classList.add('fa-solid');
          s.classList.add('active');
        } else {
          s.classList.remove('fa-solid');
          s.classList.add('fa-regular');
        }
      });
    });
  });

  // Reset stars when mouse leaves rating container
  $('.rating')?.addEventListener('mouseleave', () => {
    ratingStars.forEach(star => {
      const starRating = parseInt(star.getAttribute('data-rating'), 10);

      if (starRating <= currentRating) {
        // Keep selected stars solid
        star.classList.add('fa-solid');
        star.classList.remove('fa-regular');
        star.classList.add('active');
      } else if (!star.classList.contains('active')) {
        star.classList.remove('fa-solid');
        star.classList.add('fa-regular');
        star.classList.remove('hover');
      }
    });
  });

  // Handle expand button click
  expandButton.addEventListener('click', () => {
    if (feedbackTextarea.style.height === '200px') {
      feedbackTextarea.style.height = '100px';
      expandButton.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    } else {
      feedbackTextarea.style.height = '200px';
      expandButton.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
    }
  });

  // Handle submit button click
  submitButton.addEventListener('click', () => {
    // Check if rating is selected using our stored rating
    if (currentRating === 0) {
      feedbackMessage.className = 'feedback-message error';
      feedbackMessage.textContent = 'Please select a rating';
      feedbackMessage.style.display = 'block';
      return;
    }

    // Submit feedback (in a real app, this would send data to a server)
    feedbackMessage.className = 'feedback-message success';
    feedbackMessage.textContent = 'Thank you for your feedback!';
    feedbackMessage.style.display = 'block';

    // Reset form
    ratingStars.forEach(star => {
      star.classList.remove('fa-solid', 'active');
      star.classList.add('fa-regular');
    });

    // Reset stored rating
    currentRating = 0;
    feedbackTextarea.value = '';

    // Hide message after 3 seconds
    setTimeout(() => {
      feedbackMessage.style.display = 'none';
    }, 3000);
  });
}