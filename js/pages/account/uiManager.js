/**
 * UI Manager
 * Manages UI updates based on user data
 */

import userDataManager from '/tsafira-travel-planner/userData.js';

class UIManager {
  constructor() {
    this.initialized = false;
    this.activeSection = 'profile';
    this.currentRole = 'traveler';
  }

  /**
   * Initialize the UI manager
   */
  async initialize() {
    if (this.initialized) return;

    try {
      console.log('Initializing UI manager');

      // Load user data
      await userDataManager.loadUserData();

      // Initialize UI components
      this.initializeUserProfile();
      this.initializeItineraries();
      this.initializeNotifications();
      this.initializeGuideDashboard();

      // Set up event listeners
      this.setupEventListeners();

      // Set up itinerary filters explicitly after DOM is fully populated
      this.setupItineraryFilters();

      // Set up calendar view toggle explicitly
      this.setupCalendarViewToggle();

      // Set initial role
      const userData = userDataManager.getUserProfile();
      if (userData && userData.role) {
        this.setUserRole(userData.role);
      }

      // Add direct click handlers to filter buttons for better reliability
      this.addDirectFilterHandlers();

      this.initialized = true;
      console.log('UI manager initialized successfully');
    } catch (error) {
      console.error('Error initializing UI:', error);
    }
  }

  /**
   * Add direct click handlers to filter buttons
   * This is a fallback to ensure filters work even if the regular event listeners fail
   */
  addDirectFilterHandlers() {
    console.log('Adding direct filter handlers');

    // Status filters
    document.querySelectorAll('.itinerary-filters .filter-group:first-child .filter-option').forEach(filter => {
      filter.onclick = () => {
        console.log('Direct filter handler clicked:', filter.textContent);
        const status = filter.dataset.filter || 'all';

        // Remove active class from all filters in this group
        filter.parentElement.querySelectorAll('.filter-option').forEach(f => {
          f.classList.remove('active');
        });

        // Add active class to clicked filter
        filter.classList.add('active');

        // Filter the cards
        const itineraryCards = document.querySelectorAll('.itinerary-card');
        itineraryCards.forEach(card => {
          if (status === 'all') {
            card.style.display = '';
          } else {
            const cardStatus = this.getCardStatusCategory(card.dataset.status);
            card.style.display = status === cardStatus ? '' : 'none';
          }
        });

        // Show toast
        userDataManager.showToast('info', 'Filtered', `Showing ${status} itineraries`);
      };
    });

    // Calendar view toggle
    const calendarViewToggle = document.getElementById('calendar-view-toggle');
    if (calendarViewToggle) {
      calendarViewToggle.onclick = () => {
        console.log('Direct calendar view toggle clicked');
        const itineraryGrid = document.querySelector('.itinerary-grid');
        const calendarView = document.getElementById('itinerary-calendar-view');

        if (itineraryGrid && calendarView) {
          itineraryGrid.style.display = 'none';
          calendarView.style.display = 'block';
          calendarViewToggle.parentElement.style.display = 'none';

          this.generateItineraryCalendar();
          userDataManager.showToast('info', 'View Changed', 'Switched to calendar view');
        }
      };
    }

    // List view toggle
    const listViewToggle = document.getElementById('list-view-toggle');
    if (listViewToggle) {
      listViewToggle.onclick = () => {
        console.log('Direct list view toggle clicked');
        const itineraryGrid = document.querySelector('.itinerary-grid');
        const calendarView = document.getElementById('itinerary-calendar-view');

        if (itineraryGrid && calendarView) {
          calendarView.style.display = 'none';
          itineraryGrid.style.display = 'grid';

          if (calendarViewToggle) {
            calendarViewToggle.parentElement.style.display = 'block';
          }

          userDataManager.showToast('info', 'View Changed', 'Switched to list view');
        }
      };
    }
  }

  /**
   * Initialize user profile section
   */
  initializeUserProfile() {
    const userData = userDataManager.getUserProfile();
    if (!userData) return;

    // Update profile photo and name in sidebar
    const profilePhoto = document.querySelectorAll('.profile-photo, .profile-image');
    profilePhoto.forEach(photo => {
      photo.src = userData.avatarUrl;
      photo.alt = userData.name;
    });

    document.querySelector('.profile-name').textContent = userData.name;
    document.querySelector('.profile-email').innerHTML = `
      <i class="fas fa-envelope"></i>
      ${userData.email.trim()}
    `;

    // Update form fields
    const nameParts = userData.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    document.getElementById('first-name').value = firstName;
    document.getElementById('last-name').value = lastName;
    document.getElementById('email').value = userData.email.trim();
    document.getElementById('phone').value = userData.phone;

    // Update preferences
    if (userData.preferences) {
      document.getElementById('currency').value = userData.preferences.currency;
      document.getElementById('language').value = userData.preferences.language;
      document.getElementById('timezone').value = userData.preferences.timezone;
    }

    // Update notification settings
    if (userData.notifications) {
      const checkboxes = document.querySelectorAll('.checkbox-group .custom-checkbox');
      checkboxes[0].checked = userData.notifications.email;
      checkboxes[1].checked = userData.notifications.trip_updates;
      checkboxes[3].checked = userData.notifications.marketing;
    }

    // Set role selector
    document.getElementById('role-selector').value = userData.role;
  }

  /**
   * Initialize itineraries section
   */
  initializeItineraries() {
    console.log('Initializing itineraries section');
    const itineraries = userDataManager.getItineraries();
    const itineraryGrid = document.querySelector('#itineraries .itinerary-grid');
    const emptyItineraries = document.querySelector('.empty-itineraries');

    if (!itineraries || itineraries.length === 0) {
      console.log('No itineraries found, showing empty state');
      // Show empty state
      if (emptyItineraries) {
        emptyItineraries.style.display = 'block';
      }

      // Clear grid
      if (itineraryGrid) {
        itineraryGrid.innerHTML = '';
      }

      return;
    }

    // Hide empty state
    if (emptyItineraries) {
      emptyItineraries.style.display = 'none';
    }

    // Clear existing content
    itineraryGrid.innerHTML = '';

    console.log(`Adding ${itineraries.length} itinerary cards`);

    // Add itinerary cards
    itineraries.forEach(itinerary => {
      const startDate = userDataManager.formatDate(itinerary.startDate, false);
      const endDate = userDataManager.formatDate(itinerary.endDate);
      const duration = userDataManager.calculateDuration(itinerary.startDate, itinerary.endDate);

      const statusClass = itinerary.status === 'confirmed' ? 'status-confirmed' :
                          itinerary.status === 'pending' ? 'status-pending' :
                          itinerary.status === 'draft' ? 'status-draft' : 'status-declined';

      const statusIcon = itinerary.status === 'confirmed' ? 'check-circle' :
                         itinerary.status === 'pending' ? 'clock' :
                         itinerary.status === 'draft' ? 'pencil-alt' : 'times-circle';

      const statusText = itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1);

      // Create the card element
      const card = document.createElement('div');
      card.className = 'itinerary-card';

      // Set data attributes for filtering and sorting
      card.dataset.id = itinerary.id;
      card.dataset.status = itinerary.status;
      card.dataset.location = itinerary.location;
      card.dataset.date = itinerary.startDate;
      card.dataset.title = itinerary.title;

      // Log the data attributes for debugging
      console.log('Card data attributes:', {
        id: card.dataset.id,
        status: card.dataset.status,
        location: card.dataset.location,
        date: card.dataset.date
      });

      card.innerHTML = `
        <div class="itinerary-image">
          <img src="${itinerary.image}" alt="${itinerary.location}">
          <div class="itinerary-location">
            <i class="fas fa-map-marker-alt"></i>
            ${itinerary.location}
          </div>
        </div>
        <div class="itinerary-details">
          <div class="itinerary-header">
            <h3>${itinerary.title}</h3>
            <div class="status-badge ${statusClass}">
              <i class="fas fa-${statusIcon}"></i>
              ${statusText}
            </div>
          </div>
          <div class="itinerary-dates">
            <i class="far fa-calendar-alt"></i>
            ${startDate} - ${endDate} (${duration})
          </div>
          <p class="itinerary-description">
            ${itinerary.description}
          </p>
          <div class="itinerary-actions">
            <button class="action-button view-button focus-visible" data-id="${itinerary.id}">
              <i class="far fa-eye"></i> View
            </button>
            <button class="action-button edit-button focus-visible" data-id="${itinerary.id}">
              <i class="far fa-edit"></i> Edit
            </button>
            <button class="action-button delete-button focus-visible" data-id="${itinerary.id}">
              <i class="far fa-trash-alt"></i> Delete
            </button>
          </div>
        </div>
      `;

      itineraryGrid.appendChild(card);
    });
  }

  /**
   * Initialize notifications section
   */
  initializeNotifications() {
    const notifications = userDataManager.getNotifications();
    const notificationContainer = document.querySelector('#notifications .notifications-container');
    const emptyNotifications = document.querySelector('.empty-notifications');

    if (!notifications || notifications.length === 0) {
      // Show empty state
      if (emptyNotifications) {
        emptyNotifications.style.display = 'block';
      }

      // Clear container
      if (notificationContainer) {
        notificationContainer.innerHTML = '';
      }

      return;
    }

    // Hide empty state
    if (emptyNotifications) {
      emptyNotifications.style.display = 'none';
    }

    // Clear existing content
    notificationContainer.innerHTML = '';

    // Update notification badge
    const unreadCount = notifications.filter(notif => !notif.read).length;
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    }

    // Add notification items
    notifications.forEach(notification => {
      const relativeTime = userDataManager.formatRelativeTime(notification.timestamp);

      // Determine notification type and icon
      let iconType = notification.type || '';
      let iconClass = '';

      if (notification.type === 'success' || notification.title.toLowerCase().includes('payment')) {
        iconType = 'success';
        iconClass = 'check-circle';
      } else if (notification.type === 'alert' || notification.title.toLowerCase().includes('update') ||
                notification.title.toLowerCase().includes('change')) {
        iconType = 'alert';
        iconClass = 'exclamation-triangle';
      } else if (notification.title.toLowerCase().includes('request')) {
        iconType = '';
        iconClass = 'comment-alt';
      } else if (notification.title.toLowerCase().includes('discount') ||
                notification.title.toLowerCase().includes('special')) {
        iconType = 'info';
        iconClass = 'tag';
      } else {
        iconType = 'message';
        iconClass = 'envelope';
      }

      const item = document.createElement('div');
      item.className = `notification-item${notification.read ? '' : ' unread'}`;
      if (notification.priority) {
        item.className += ' priority';
      }
      item.dataset.id = notification.id;
      item.dataset.type = iconType; // Add type as data attribute for filtering

      item.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon ${iconType}">
            <i class="fas fa-${iconClass}"></i>
          </div>
          <div class="notification-text">
            <div class="notification-title">
              ${!notification.read ? '<span class="unread-indicator"></span>' : ''}
              ${notification.title}
            </div>
            <div class="notification-message">
              ${notification.message}
            </div>
            <div class="notification-meta">
              <div class="notification-time">
                <i class="far fa-clock"></i>
                ${relativeTime}
              </div>
              <div class="notification-actions">
                <button class="notification-action focus-visible">
                  <i class="fas fa-${iconType === 'success' ? 'receipt' : iconType === 'message' ? 'reply' : 'eye'}"></i>
                </button>
                <button class="notification-action dismiss focus-visible">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      notificationContainer.appendChild(item);
    });
  }

  /**
   * Initialize guide dashboard
   */
  initializeGuideDashboard() {
    const stats = userDataManager.getGuideStats();
    const requests = userDataManager.getGuideRequests();

    if (!stats) return;

    // Update stats cards
    const statsGrid = document.querySelector('#guide .stats-grid');

    // Clear existing content and add new stats
    statsGrid.innerHTML = '';

    // Bookings stat
    const bookingsCard = this.createStatCard(
      'bookings',
      'Total Bookings',
      stats.bookings.total,
      stats.bookings.trend,
      `${stats.bookings.trend === 'up' ? '+' : ''}${Math.floor(Math.random() * 20)}% from last month`
    );
    statsGrid.appendChild(bookingsCard);

    // Earnings stat
    const earningsCard = this.createStatCard(
      'earnings',
      'Total Earnings',
      userDataManager.formatCurrency(stats.earnings.total),
      stats.earnings.trend,
      `${stats.earnings.trend === 'up' ? '+' : ''}${Math.floor(Math.random() * 20)}% from last month`
    );
    statsGrid.appendChild(earningsCard);

    // Rating stat
    const ratingCard = this.createStatCard(
      'rating',
      'Average Rating',
      stats.rating.average,
      stats.rating.trend,
      `${stats.rating.trend === 'up' ? '+' : ''}0.${Math.floor(Math.random() * 5)} from last month`
    );
    statsGrid.appendChild(ratingCard);

    // Views stat
    const viewsCard = this.createStatCard(
      'views',
      'Profile Views',
      stats.views.total,
      stats.views.trend,
      `${stats.views.trend === 'up' ? '+' : ''}${Math.floor(Math.random() * 30)}% from last month`
    );
    statsGrid.appendChild(viewsCard);

    // Update guide requests
    if (requests && requests.length > 0) {
      const requestsContainer = document.querySelector('#guide .guide-requests');
      requestsContainer.innerHTML = '';

      requests.forEach(request => {
        const requestItem = document.createElement('div');
        requestItem.className = 'guide-request-item';
        requestItem.dataset.id = request.id;

        requestItem.innerHTML = `
          <div class="request-content">
            <img src="${request.traveler.avatar}" alt="${request.traveler.name}" class="request-user-avatar">
            <div class="request-details">
              <h3 class="request-title">${request.tripTitle}</h3>
              <div class="request-info">
                <div class="request-info-item">
                  <i class="far fa-calendar-alt"></i>
                  <span>${userDataManager.formatDate(request.date)}</span>
                </div>
                <div class="request-info-item">
                  <i class="far fa-clock"></i>
                  <span>${request.duration}</span>
                </div>
                <div class="request-info-item">
                  <i class="fas fa-dollar-sign"></i>
                  <span>${userDataManager.formatCurrency(request.amount)}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="request-actions">
            <button class="action-button view-button focus-visible" data-id="${request.id}">
              <i class="far fa-eye"></i> View
            </button>
            <button class="action-button accept-button focus-visible" data-id="${request.id}">
              <i class="fas fa-check"></i> Accept
            </button>
            <button class="action-button decline-button focus-visible" data-id="${request.id}">
              <i class="fas fa-times"></i> Decline
            </button>
          </div>
        `;

        requestsContainer.appendChild(requestItem);
      });
    }
  }

  /**
   * Create a stat card for the guide dashboard
   */
  createStatCard(type, title, value, trend, subtext) {
    const card = document.createElement('div');
    card.className = 'stat-card';

    // Generate random chart data
    const chartBars = [];
    for (let i = 0; i < 7; i++) {
      const height = 30 + Math.floor(Math.random() * 70);
      const left = i * 14;
      const isActive = i === 5 || i === 6; // Make one of the last bars active
      chartBars.push(`<div class="chart-bar${isActive ? ' active' : ''}" style="height: ${height}%; left: ${left}%"></div>`);
    }

    card.innerHTML = `
      <div class="stat-icon ${type}">
        <i class="fas fa-${
          type === 'bookings' ? 'calendar-check' :
          type === 'earnings' ? 'dollar-sign' :
          type === 'rating' ? 'star' : 'eye'
        }"></i>
      </div>
      <div class="stat-title">${title}</div>
      <div class="stat-value">${value}</div>
      <div class="stat-chart">
        ${chartBars.join('')}
      </div>
      <div class="stat-subtext trend-${trend}">
        <div class="trend-icon">
          <i class="fas fa-arrow-${trend === 'up' ? 'up' : trend === 'down' ? 'down' : 'right'}"></i>
        </div>
        <span>${subtext}</span>
      </div>
    `;

    return card;
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        if (section) {
          this.switchSection(section);
        }
      });
    });

    // Role switcher
    const switchRoleBtn = document.getElementById('switch-role-btn');
    if (switchRoleBtn) {
      switchRoleBtn.addEventListener('click', () => {
        const roleSelector = document.getElementById('role-selector');
        if (roleSelector) {
          this.setUserRole(roleSelector.value);
        }
      });
    }

    // Save changes button
    const saveButton = document.querySelector('.section-header .primary-button');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        userDataManager.showToast('success', 'Success!', 'Your changes have been saved successfully.');
      });
    }

    // Mark all as read button
    const markAllReadBtn = document.querySelector('#notifications .text-button');
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', () => {
        // Update the data
        const count = userDataManager.markAllNotificationsAsRead();

        if (count > 0) {
          // Update UI
          const unreadItems = document.querySelectorAll('.notification-item.unread');
          unreadItems.forEach(item => {
            item.classList.remove('unread');

            // Remove unread indicator
            const indicator = item.querySelector('.unread-indicator');
            if (indicator) {
              indicator.remove();
            }
          });

          // Update badge
          const badge = document.querySelector('.notification-badge');
          if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
          }

          userDataManager.showToast('success', 'Success!', `${count} notification${count !== 1 ? 's' : ''} marked as read.`);
        } else {
          userDataManager.showToast('info', 'Info', 'No unread notifications to mark as read.');
        }
      });
    }

    // Setup notification action buttons
    this.setupNotificationActions();

    // Setup notification filters
    this.setupNotificationFilters();

    // Setup itinerary filters
    this.setupItineraryFilters();

    // Filter options (generic)
    const filterOptions = document.querySelectorAll('.filter-option, .category-option, .request-tab, .date-option');
    filterOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove active class from siblings
        const siblings = option.parentElement.querySelectorAll('.filter-option, .category-option, .request-tab, .date-option');
        siblings.forEach(sibling => {
          sibling.classList.remove('active');
        });

        // Add active class to clicked option
        option.classList.add('active');
      });
    });
  }

  /**
   * Setup notification action buttons
   */
  setupNotificationActions() {
    // Add event delegation for notification actions
    const notificationList = document.querySelector('.notification-list');
    if (notificationList) {
      notificationList.addEventListener('click', (event) => {
        // Check if clicked element is a notification action button
        const actionButton = event.target.closest('.notification-action');
        if (!actionButton) return;

        // Get the notification item
        const notificationItem = actionButton.closest('.notification-item');
        if (!notificationItem) return;

        // Get notification ID
        const notificationId = notificationItem.dataset.id;
        if (!notificationId) {
          console.error('Notification ID not found');
          return;
        }

        // Check if it's a dismiss button
        if (actionButton.classList.contains('dismiss')) {
          // Add fade-out animation
          notificationItem.classList.add('fade-out');

          // Remove the notification after animation completes
          setTimeout(() => {
            // Delete from data
            const success = userDataManager.deleteNotification(notificationId);

            if (success) {
              // Remove from UI
              notificationItem.remove();

              // Update the notification count
              this.updateNotificationCount();

              // Check if there are any notifications left
              const remainingNotifications = document.querySelectorAll('.notification-item');
              if (remainingNotifications.length === 0) {
                // Show empty state
                const emptyState = document.querySelector('.empty-notifications');
                if (emptyState) {
                  emptyState.style.display = 'block';
                }
              }

              // Show toast
              userDataManager.showToast('info', 'Notification Dismissed', 'The notification has been removed.');
            }
          }, 300);
        } else {
          // Mark as read if unread
          if (notificationItem.classList.contains('unread')) {
            // Update data
            const success = userDataManager.markNotificationAsRead(notificationId);

            if (success) {
              // Update UI
              notificationItem.classList.remove('unread');

              // Remove unread indicator
              const indicator = notificationItem.querySelector('.unread-indicator');
              if (indicator) {
                indicator.remove();
              }

              // Update the notification count
              this.updateNotificationCount();
            }
          }

          // Show appropriate action based on icon
          const icon = actionButton.querySelector('i');
          if (icon) {
            if (icon.classList.contains('fa-reply')) {
              userDataManager.showToast('info', 'Reply', 'Replying to message...');
            } else if (icon.classList.contains('fa-eye')) {
              userDataManager.showToast('info', 'View Details', 'Viewing notification details...');
            } else if (icon.classList.contains('fa-receipt')) {
              userDataManager.showToast('info', 'View Receipt', 'Opening payment receipt...');
            } else if (icon.classList.contains('fa-user-edit')) {
              // Switch to profile section
              this.switchSection('profile');
              userDataManager.showToast('info', 'Edit Profile', 'Redirecting to profile section...');
            }
          }
        }
      });
    }
  }

  /**
   * Update notification count
   */
  updateNotificationCount() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    const badge = document.querySelector('.notification-badge');

    if (badge) {
      const count = unreadItems.length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  /**
   * Setup notification filters
   */
  setupNotificationFilters() {
    const categoryOptions = document.querySelectorAll('.notification-category-filter .category-option');

    categoryOptions.forEach(option => {
      option.addEventListener('click', () => {
        const filter = option.dataset.filter || 'all';
        const notificationItems = document.querySelectorAll('.notification-item');

        notificationItems.forEach(item => {
          if (filter === 'all') {
            item.style.display = '';
          } else {
            // Determine the notification type
            let type = '';

            if (item.querySelector('.notification-icon.success')) {
              type = 'system'/tsafira-travel-planner// Payment notifications go to system
            } else if (item.querySelector('.notification-icon.alert')) {
              type = 'trips';
            } else if (item.querySelector('.notification-icon.message')) {
              type = 'messages';
            } else if (item.querySelector('.notification-icon')) {
              type = 'messages'/tsafira-travel-planner// Default for other icons
            } else {
              type = 'system';
            }

            item.style.display = type === filter ? '' : 'none';
          }
        });

        // Show empty state if no visible notifications
        const visibleItems = Array.from(notificationItems).filter(item => item.style.display !== 'none');
        const emptyState = document.querySelector('.empty-notifications');

        if (emptyState) {
          emptyState.style.display = visibleItems.length === 0 ? 'block' : 'none';
        }
      });
    });
  }

  /**
   * Get the status category for an itinerary
   * @param {string} status - The itinerary status
   * @returns {string} The status category (upcoming, past, drafts)
   */
  getCardStatusCategory(status) {
    if (status === 'confirmed' || status === 'pending') {
      return 'upcoming';
    } else if (status === 'draft') {
      return 'drafts';
    } else {
      return 'past';
    }
  }

  /**
   * Setup itinerary filters
   */
  setupItineraryFilters() {
    console.log('Setting up itinerary filters');

    // Status filter
    const statusFilters = document.querySelectorAll('.itinerary-filters .filter-group:first-child .filter-option');
    console.log('Found status filters:', statusFilters.length);

    statusFilters.forEach(filter => {
      // Add direct click handler
      filter.onclick = (event) => {
        console.log('Filter clicked:', filter.dataset.filter);
        const status = filter.dataset.filter || 'all';
        const itineraryCards = document.querySelectorAll('.itinerary-card');
        console.log('Found itinerary cards:', itineraryCards.length);

        // First, remove active class from all filters and add to the clicked one
        statusFilters.forEach(f => {
          f.classList.remove('active');
          console.log('Removed active class from:', f.textContent);
        });

        filter.classList.add('active');
        console.log('Added active class to:', filter.textContent);

        itineraryCards.forEach(card => {
          if (status === 'all') {
            card.style.display = '';
          } else {
            // Get the status directly from the card's data attribute
            const cardStatus = this.getCardStatusCategory(card.dataset.status);
            console.log('Card status:', card.dataset.status, 'Category:', cardStatus, 'Filter:', status);

            card.style.display = status === cardStatus ? '' : 'none';
          }
        });

        // Show empty state if no visible itineraries
        const visibleCards = Array.from(itineraryCards).filter(card => card.style.display !== 'none');
        const emptyState = document.querySelector('.empty-itineraries');

        if (emptyState) {
          emptyState.style.display = visibleCards.length === 0 ? 'block' : 'none';
        }

        // Show toast notification
        userDataManager.showToast('info', 'Filtered', `Showing ${status} itineraries`);

        // Prevent default behavior and stop propagation
        event.preventDefault();
        event.stopPropagation();
      };
    });

    // Sort filter
    const sortFilters = document.querySelectorAll('.itinerary-filters .filter-group:last-child .filter-option');
    console.log('Found sort filters:', sortFilters.length);

    sortFilters.forEach(filter => {
      // Add direct click handler
      filter.onclick = (event) => {
        console.log('Sort clicked:', filter.dataset.sort);
        const sortBy = filter.dataset.sort || 'date';
        const itineraryGrid = document.querySelector('.itinerary-grid');
        const itineraryCards = Array.from(document.querySelectorAll('.itinerary-card'));
        console.log('Found itinerary grid:', itineraryGrid ? 'yes' : 'no', 'Cards:', itineraryCards.length);

        // First, remove active class from all sort filters and add to the clicked one
        sortFilters.forEach(f => {
          f.classList.remove('active');
          console.log('Removed active class from sort filter:', f.textContent);
        });

        filter.classList.add('active');
        console.log('Added active class to sort filter:', filter.textContent);

        if (itineraryGrid && itineraryCards.length > 0) {
          // Sort the cards
          itineraryCards.sort((a, b) => {
            if (sortBy === 'date') {
              // Use the data attribute for sorting
              const dateA = a.dataset.date || '';
              const dateB = b.dataset.date || '';
              return dateA.localeCompare(dateB);
            } else if (sortBy === 'duration') {
              // Extract duration from the cards
              const durationA = a.querySelector('.itinerary-dates')?.textContent.match(/\((\d+) days\)/) || [0, 0];
              const durationB = b.querySelector('.itinerary-dates')?.textContent.match(/\((\d+) days\)/) || [0, 0];
              return parseInt(durationB[1]) - parseInt(durationA[1]);
            } else if (sortBy === 'destination') {
              // Use the data attribute for sorting
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

        // Prevent default behavior and stop propagation
        event.preventDefault();
        event.stopPropagation();
      };
    });

    // Add direct event listeners to action buttons for better reliability
    document.querySelectorAll('.itinerary-card .action-button').forEach(button => {
      button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent card click

        const itineraryCard = button.closest('.itinerary-card');
        if (!itineraryCard) return;

        const itineraryId = button.dataset.id;
        const itineraryTitle = itineraryCard.querySelector('h3')?.textContent || 'Itinerary';

        if (button.classList.contains('view-button')) {
          userDataManager.showToast('info', 'View Itinerary', `Viewing details for ${itineraryTitle}`);
        } else if (button.classList.contains('edit-button')) {
          userDataManager.showToast('info', 'Edit Itinerary', `Editing ${itineraryTitle}`);
        } else if (button.classList.contains('delete-button')) {
          // Add confirmation dialog
          if (confirm(`Are you sure you want to delete "${itineraryTitle}"?`)) {
            // Delete from data
            const success = userDataManager.deleteItinerary(itineraryId);

            if (success) {
              // Remove from the UI with animation
              itineraryCard.classList.add('fade-out');
              setTimeout(() => {
                itineraryCard.remove();

                // Check if there are any cards left
                const itineraryGrid = document.querySelector('.itinerary-grid');
                const remainingCards = itineraryGrid.querySelectorAll('.itinerary-card');
                if (remainingCards.length === 0) {
                  // Show empty state
                  const emptyState = document.querySelector('.empty-itineraries');
                  if (emptyState) {
                    emptyState.style.display = 'block';
                  }
                }

                userDataManager.showToast('success', 'Deleted', `${itineraryTitle} has been deleted.`);
              }, 300);
            } else {
              userDataManager.showToast('error', 'Error', `Failed to delete ${itineraryTitle}.`);
            }
          }
        }
      });
    });

    // Add event listeners for itinerary cards
    document.querySelectorAll('.itinerary-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('h3')?.textContent || 'Itinerary';
        userDataManager.showToast('info', 'View Itinerary', `Viewing details for ${title}`);
      });
    });

    // Setup calendar view toggle
    this.setupCalendarViewToggle();
  }

  /**
   * Setup calendar view toggle
   */
  setupCalendarViewToggle() {
    console.log('Setting up calendar view toggle');
    const calendarViewToggle = document.getElementById('calendar-view-toggle');
    const listViewToggle = document.getElementById('list-view-toggle');
    const itineraryGrid = document.querySelector('.itinerary-grid');
    const calendarView = document.getElementById('itinerary-calendar-view');

    console.log('Calendar toggle elements found:', {
      calendarViewToggle: calendarViewToggle ? 'yes' : 'no',
      listViewToggle: listViewToggle ? 'yes' : 'no',
      itineraryGrid: itineraryGrid ? 'yes' : 'no',
      calendarView: calendarView ? 'yes' : 'no'
    });

    if (calendarViewToggle && listViewToggle && itineraryGrid && calendarView) {
      // Switch to calendar view - use direct onclick handler
      calendarViewToggle.onclick = (event) => {
        console.log('Calendar view toggle clicked');
        // Hide grid view, show calendar view
        itineraryGrid.style.display = 'none';
        calendarView.style.display = 'block';
        calendarViewToggle.parentElement.style.display = 'none';

        // Generate calendar with itineraries
        this.generateItineraryCalendar();

        // Show toast notification
        userDataManager.showToast('info', 'View Changed', 'Switched to calendar view');

        // Prevent default behavior and stop propagation
        event.preventDefault();
        event.stopPropagation();
      };

      // Switch back to list view - use direct onclick handler
      listViewToggle.onclick = (event) => {
        console.log('List view toggle clicked');
        // Hide calendar view, show grid view
        calendarView.style.display = 'none';
        itineraryGrid.style.display = 'grid';
        calendarViewToggle.parentElement.style.display = 'block';

        // Show toast notification
        userDataManager.showToast('info', 'View Changed', 'Switched to list view');

        // Prevent default behavior and stop propagation
        event.preventDefault();
        event.stopPropagation();
      };

      console.log('Calendar view toggle setup complete');
    } else {
      console.error('Could not set up calendar view toggle - missing elements');
    }
  }

  /**
   * Generate calendar with itineraries
   */
  generateItineraryCalendar() {
    console.log('Generating itinerary calendar');
    const calendarGrid = document.querySelector('#itinerary-calendar-view .calendar-grid');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const itineraries = userDataManager.getItineraries();

    console.log('Calendar elements found:', {
      calendarGrid: calendarGrid ? 'yes' : 'no',
      monthYearDisplay: monthYearDisplay ? 'yes' : 'no',
      itineraries: itineraries.length
    });

    if (!calendarGrid || !monthYearDisplay) {
      console.error('Missing calendar elements');
      return;
    }

    // Clear existing calendar days (except headers)
    const headers = Array.from(calendarGrid.querySelectorAll('.calendar-day-header'));
    console.log('Found calendar headers:', headers.length);
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
    console.log('Set month/year display to:', monthYearDisplay.textContent);

    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    console.log('Calendar parameters:', { firstDay, lastDate });

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
          console.log('Found event for day', day, ':', itinerary.title);

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
  }



  /**
   * Switch active section
   * @param {string} section - Section ID
   */
  switchSection(section) {
    // Update active section
    this.activeSection = section;

    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });

    // Update content sections
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(content => {
      content.classList.toggle('active', content.id === section);
    });
  }

  /**
   * Set user role
   * @param {string} role - User role (traveler or guide)
   */
  setUserRole(role) {
    this.currentRole = role;
    document.body.classList.remove('role-traveler', 'role-guide');
    document.body.classList.add(`role-${role}`);

    // Update role selector
    const roleSelector = document.getElementById('role-selector');
    if (roleSelector) {
      roleSelector.value = role;
    }

    // Show toast notification
    userDataManager.showToast('info', 'Role Changed', `You are now viewing the ${role} dashboard.`);
  }
}

// Create and export singleton instance
const uiManager = new UIManager();
export default uiManager;
