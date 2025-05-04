/**
 * User Data Manager
 * Loads and manages user data from userData.json
 * Provides a template-based approach for dynamic user data
 */

class UserDataManager {
  constructor() {
    this.userData = null;
    this.loaded = false;
    this.eventListeners = {};
    this.userId = this.getUserIdFromUrl() || 'default';
  }

  /**
   * Get user ID from URL if available
   * @returns {string|null} User ID from URL or null
   */
  getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId');
  }

  /**
   * Load user data from JSON file
   * @param {string} userId - Optional user ID to load specific user data
   */
  async loadUserData(userId = null) {
    try {
      console.log('Loading user data...');

      // Use provided userId or the one from constructor
      const targetUserId = userId || this.userId;
      console.log('Target user ID:', targetUserId);

      // Construct the URL with userId if provided
      const url = targetUserId !== 'default'
        ? `../../../assets/data/userData.json?userId=${targetUserId}`
        : '../../../assets/data/userData.json';
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load user data: ${response.status}`);
      }

      this.userData = await response.json();

      // Store the user ID for future reference
      this.userId = targetUserId;

      console.log('User data loaded successfully:', this.userData);
      this.loaded = true;
      this.emitEvent('dataLoaded', this.userData);
      return this.userData;
    } catch (error) {
      console.error('Error loading user data:', error);
      this.showToast('error', 'Error', 'Failed to load user data. Please refresh the page.');
      throw error;
    }
  }

  /**
   * Get user profile data
   * @returns {Object|null} User profile data or null if not loaded
   */
  getUserProfile() {
    return this.userData?.userData || null;
  }

  /**
   * Get user itineraries
   * @returns {Array} User itineraries or empty array if not loaded
   */
  getItineraries() {
    return this.userData?.itineraries || [];
  }

  /**
   * Get user notifications
   * @returns {Array} User notifications or empty array if not loaded
   */
  getNotifications() {
    return this.userData?.notifications || [];
  }

  /**
   * Get guide statistics
   * @returns {Object|null} Guide statistics or null if not loaded
   */
  getGuideStats() {
    return this.userData?.guideStats || null;
  }

  /**
   * Get guide requests
   * @returns {Array} Guide requests or empty array if not loaded
   */
  getGuideRequests() {
    return this.userData?.guideRequests || [];
  }

  /**
   * Get saved places
   * @returns {Array} Saved places or empty array if not loaded
   */
  getSavedPlaces() {
    return this.userData?.savedPlaces || [];
  }

  /**
   * Update user profile data
   * @param {Object} profileData - Updated profile data
   */
  updateUserProfile(profileData) {
    if (!this.userData) return;

    this.userData.userData = {
      ...this.userData.userData,
      ...profileData
    };

    this.emitEvent('profileUpdated', this.userData.userData);
  }

  /**
   * Update user itinerary
   * @param {string} itineraryId - ID of the itinerary to update
   * @param {Object} itineraryData - Updated itinerary data
   * @returns {boolean} True if successful, false otherwise
   */
  updateItinerary(itineraryId, itineraryData) {
    if (!this.userData || !this.userData.itineraries) return false;

    const index = this.userData.itineraries.findIndex(item => item.id === itineraryId);
    if (index === -1) return false;

    this.userData.itineraries[index] = {
      ...this.userData.itineraries[index],
      ...itineraryData
    };

    this.emitEvent('itineraryUpdated', this.userData.itineraries[index]);
    return true;
  }

  /**
   * Add new itinerary
   * @param {Object} itineraryData - New itinerary data
   * @returns {Object} The newly added itinerary
   */
  addItinerary(itineraryData) {
    if (!this.userData) return null;

    if (!this.userData.itineraries) {
      this.userData.itineraries = [];
    }

    // Generate a unique ID if not provided
    const newItinerary = {
      id: itineraryData.id || `trip-${Date.now()}`,
      ...itineraryData
    };

    this.userData.itineraries.push(newItinerary);
    this.emitEvent('itineraryAdded', newItinerary);

    return newItinerary;
  }

  /**
   * Delete itinerary
   * @param {string} itineraryId - ID of the itinerary to delete
   * @returns {boolean} True if successful, false otherwise
   */
  deleteItinerary(itineraryId) {
    if (!this.userData || !this.userData.itineraries) return false;

    const index = this.userData.itineraries.findIndex(item => item.id === itineraryId);
    if (index === -1) return false;

    const deletedItinerary = this.userData.itineraries[index];
    this.userData.itineraries.splice(index, 1);

    this.emitEvent('itineraryDeleted', deletedItinerary);
    return true;
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - ID of the notification to mark as read
   * @returns {boolean} True if successful, false otherwise
   */
  markNotificationAsRead(notificationId) {
    if (!this.userData || !this.userData.notifications) return false;

    const notification = this.userData.notifications.find(item => item.id === notificationId);
    if (!notification) return false;

    notification.read = true;
    this.emitEvent('notificationRead', notification);

    return true;
  }

  /**
   * Mark all notifications as read
   * @returns {number} Number of notifications marked as read
   */
  markAllNotificationsAsRead() {
    if (!this.userData || !this.userData.notifications) return 0;

    let count = 0;
    this.userData.notifications.forEach(notification => {
      if (!notification.read) {
        notification.read = true;
        count++;
      }
    });

    if (count > 0) {
      this.emitEvent('allNotificationsRead', count);
    }

    return count;
  }

  /**
   * Delete notification
   * @param {string} notificationId - ID of the notification to delete
   * @returns {boolean} True if successful, false otherwise
   */
  deleteNotification(notificationId) {
    if (!this.userData || !this.userData.notifications) return false;

    const index = this.userData.notifications.findIndex(item => item.id === notificationId);
    if (index === -1) return false;

    const deletedNotification = this.userData.notifications[index];
    this.userData.notifications.splice(index, 1);

    this.emitEvent('notificationDeleted', deletedNotification);
    return true;
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @param {boolean} includeYear - Whether to include year
   * @returns {string} Formatted date
   */
  formatDate(dateString, includeYear = true) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options = {
      month: 'short',
      day: 'numeric'
    };

    if (includeYear) {
      options.year = 'numeric';
    }

    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Calculate duration between two dates
   * @param {string} startDate - Start date string
   * @param {string} endDate - End date string
   * @returns {string} Duration string
   */
  calculateDuration(startDate, endDate) {
    if (!startDate || !endDate) return '';

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} days`;
  }

  /**
   * Format relative time for notifications
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Relative time string
   */
  formatRelativeTime(timestamp) {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return this.formatDate(timestamp);
    }
  }

  /**
   * Format currency amount
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount, currency = 'USD') {
    if (amount === undefined || amount === null) return '';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Show toast notification
   * @param {string} type - Toast type (success, error, info, warning)
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   */
  showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;

    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div>${message}</div>
      </div>
      <button class="toast-close">
        <i class="fas fa-times"></i>
      </button>
    `;

    document.body.appendChild(toast);

    // Add event listener to close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 400);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.classList.add('fade-out');
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 400);
      }
    }, 5000);
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   */
  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   */
  removeEventListener(event, callback) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
  }

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emitEvent(event, data) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event].forEach(callback => callback(data));
  }
}

// Create and export singleton instance
const userDataManager = new UserDataManager();
export default userDataManager;
