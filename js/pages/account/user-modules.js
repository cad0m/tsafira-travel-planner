/**
 * User Modules
 * Contains ProfileManager and NotificationsManager functionality
 */

/**
 * Profile Manager
 * Handles the profile section functionality
 */
export class ProfileManager {
  constructor() {
    this.profileSection = document.getElementById('profile');
    this.profileForm = null;
    this.saveButton = null;
    this.profileData = null;
  }

  /**
   * Initialize the profile manager
   * @param {Object} userData - User data object
   */
  init(userData) {
    this.profileData = userData;

    // Get references to form elements
    this.saveButton = document.querySelector('.primary-button');

    // Initialize form with user data
    this.populateFormWithUserData();

    // Check if we have saved profile data in localStorage
    this.loadProfileFromLocalStorage();

    // Set up form submission
    this.setupEventListeners();
  }

  /**
   * Populate the form with user data
   */
  populateFormWithUserData() {
    if (!this.profileData) return;

    // Set basic profile info
    const firstNameInput = this.profileSection.querySelector('input[type="text"]');
    const lastNameInput = this.profileSection.querySelector('input[type="text"]:nth-of-type(2)');
    const emailInput = this.profileSection.querySelector('input[type="email"]');
    const phoneInput = this.profileSection.querySelector('input[type="tel"]');

    // Split name if needed
    if (this.profileData.name) {
      const nameParts = this.profileData.name.split(' ');
      if (firstNameInput && nameParts.length > 0) {
        firstNameInput.value = nameParts[0];
      }
      if (lastNameInput && nameParts.length > 1) {
        lastNameInput.value = nameParts.slice(1).join(' ');
      }
    }

    // Set email and phone
    if (emailInput && this.profileData.email) {
      emailInput.value = this.profileData.email;
    }

    if (phoneInput && this.profileData.phone) {
      phoneInput.value = this.profileData.phone;
    }

    // Set preferences if available
    const currencySelect = this.profileSection.querySelector('select:nth-of-type(1)');
    const languageSelect = this.profileSection.querySelector('select:nth-of-type(2)');
    const timezoneSelect = this.profileSection.querySelector('select:nth-of-type(3)');

    if (this.profileData.preferences) {
      if (currencySelect && this.profileData.preferences.currency) {
        this.selectOptionByValue(currencySelect, this.profileData.preferences.currency);
      }

      if (languageSelect && this.profileData.preferences.language) {
        this.selectOptionByValue(languageSelect, this.profileData.preferences.language);
      }

      if (timezoneSelect && this.profileData.preferences.timezone) {
        this.selectOptionByValue(timezoneSelect, this.profileData.preferences.timezone);
      }

      // Set notification preferences
      if (this.profileData.preferences.notifications) {
        const checkboxes = this.profileSection.querySelectorAll('.custom-checkbox');
        if (checkboxes.length >= 3) {
          checkboxes[0].checked = this.profileData.preferences.notifications.emailMessages;
          checkboxes[1].checked = this.profileData.preferences.notifications.tripUpdates;
          checkboxes[2].checked = this.profileData.preferences.notifications.marketingEmails;
        }
      }
    }
  }

  /**
   * Set up event listeners for form interactions
   */
  setupEventListeners() {
    this.saveButton.addEventListener('click', () => {
      this.saveProfile();
    });

    // Photo upload
    const photoUploadOverlay = document.querySelector('.photo-upload-overlay');
    photoUploadOverlay.addEventListener('click', this.handlePhotoUpload.bind(this));

    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
      button.addEventListener('click', this.togglePasswordVisibility);
    });
  }

  /**
   * Handle profile photo upload
   */
  handlePhotoUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.addEventListener('change', (event) => {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          // Update all profile photos on the page
          const profilePhotos = document.querySelectorAll('.profile-photo, .profile-image');
          profilePhotos.forEach(photo => {
            photo.src = e.target.result;
          });

          // In a real app, we would upload the image to the server here
          console.log('Profile photo updated locally. Would upload to server in real app.');
        };

        reader.readAsDataURL(event.target.files[0]);
      }
    });

    input.click();
  }

  /**
   * Save the profile form data
   */
  saveProfile() {
    try {
      const updatedData = this.getFormData();

      // In a real app, we would send this data to the server
      console.log('Saving profile data:', updatedData);

      // Save to localStorage
      this.saveProfileToLocalStorage(updatedData);

      // Update UI with new data
      this.updateUIWithNewData(updatedData);

      // Show success message
      this.showSaveSuccessMessage();
    } catch (error) {
      console.error('Error saving profile:', error);
      // Error message already shown in getFormData for validation errors
    }
  }

  /**
   * Save profile data to sessionStorage
   * @param {Object} profileData - The profile data to save
   */
  saveProfileToLocalStorage(profileData) {
    try {
      // Get current user data
      const userData = JSON.parse(sessionStorage.getItem('user')) || {};

      // Update with new profile data
      const updatedUserData = {
        ...userData,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        preferences: profileData.preferences
      };

      // Add password if changed
      if (profileData.password) {
        updatedUserData.password = profileData.password;
      }

      // Save back to sessionStorage
      sessionStorage.setItem('user', JSON.stringify(updatedUserData));

      // Use the AccountManager's saveUserDataChanges method to update the full user data
      // First, get a reference to the AccountManager instance
      const accountManager = window.accountManager;

      if (accountManager && typeof accountManager.saveUserDataChanges === 'function') {
        // Create the changes object
        const changes = {
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          preferences: profileData.preferences
        };

        // Add password if changed
        if (profileData.password) {
          changes.password = profileData.password;
        }

        // Save the changes
        accountManager.saveUserDataChanges(changes, 'userData');
      } else {
        // Fallback if AccountManager is not available
        // Update userData.json data in sessionStorage for persistence
        const tsafiraUserData = JSON.parse(sessionStorage.getItem('tsafira-user-data')) || {};
        tsafiraUserData.userData = {
          ...tsafiraUserData.userData,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          preferences: profileData.preferences
        };

        // Add password if changed
        if (profileData.password) {
          tsafiraUserData.userData.password = profileData.password;
        }

        sessionStorage.setItem('tsafira-user-data', JSON.stringify(tsafiraUserData));

        // Mark data as modified
        sessionStorage.setItem('tsafira-data-modified', 'true');
      }

      // Reset password fields
      const passwordInput = this.profileSection.querySelector('.password-input');
      const confirmPasswordInput = this.profileSection.querySelector('.confirm-password-input');
      if (passwordInput) passwordInput.value = '';
      if (confirmPasswordInput) confirmPasswordInput.value = '';

      console.log('Profile data saved to sessionStorage');
    } catch (error) {
      console.error('Error saving profile data to sessionStorage:', error);
    }
  }

  /**
   * Update UI elements with new profile data
   * @param {Object} profileData - The updated profile data
   */
  updateUIWithNewData(profileData) {
    // Update sidebar profile name and email
    const sidebarName = document.querySelector('.sidebar-nav .profile-name');
    const sidebarEmail = document.querySelector('.sidebar-nav .profile-email');

    if (sidebarName && profileData.name) {
      sidebarName.textContent = profileData.name;
    }

    if (sidebarEmail && profileData.email) {
      sidebarEmail.textContent = profileData.email;
    }
  }

  /**
   * Load profile data from sessionStorage if available
   */
  loadProfileFromLocalStorage() {
    try {
      // Try to get data from sessionStorage
      const userData = JSON.parse(sessionStorage.getItem('user'));
      const tsafiraUserData = JSON.parse(sessionStorage.getItem('tsafira-user-data'));

      if (userData || (tsafiraUserData && tsafiraUserData.userData)) {
        // Merge data from both sources, preferring user data
        const sessionStorageData = {
          ...(tsafiraUserData?.userData || {}),
          ...userData
        };

        // Update profileData with sessionStorage values
        this.profileData = {
          ...this.profileData,
          ...sessionStorageData
        };

        // Repopulate form with this data
        this.populateFormWithUserData();
        console.log('Loaded profile data from sessionStorage');
      }
    } catch (error) {
      console.error('Error loading profile data from sessionStorage:', error);
    }
  }

  /**
   * Get the current form data
   * @returns {Object} Form data object
   */
  getFormData() {
    const formData = {};

    // Get form values
    const firstNameInput = this.profileSection.querySelector('input[type="text"]');
    const lastNameInput = this.profileSection.querySelector('input[type="text"]:nth-of-type(2)');
    const emailInput = this.profileSection.querySelector('input[type="email"]');
    const phoneInput = this.profileSection.querySelector('input[type="tel"]');
    const passwordInput = this.profileSection.querySelector('.password-input');
    const confirmPasswordInput = this.profileSection.querySelector('.confirm-password-input');

    formData.name = `${firstNameInput.value} ${lastNameInput.value}`.trim();
    formData.email = emailInput.value;
    formData.phone = phoneInput.value;

    // Handle password change if provided
    if (passwordInput && confirmPasswordInput &&
        passwordInput.value && confirmPasswordInput.value) {

      if (passwordInput.value !== confirmPasswordInput.value) {
        this.showPasswordError('Passwords do not match');
        throw new Error('Passwords do not match');
      }

      if (passwordInput.value.length < 6) {
        this.showPasswordError('Password must be at least 6 characters');
        throw new Error('Password too short');
      }

      formData.password = passwordInput.value;
    }

    // Get preferences
    formData.preferences = {};
    const currencySelect = this.profileSection.querySelector('select:nth-of-type(1)');
    const languageSelect = this.profileSection.querySelector('select:nth-of-type(2)');
    const timezoneSelect = this.profileSection.querySelector('select:nth-of-type(3)');

    formData.preferences.currency = currencySelect.value;
    formData.preferences.language = languageSelect.value;
    formData.preferences.timezone = timezoneSelect.value;

    // Get notification preferences
    const checkboxes = this.profileSection.querySelectorAll('.custom-checkbox');
    formData.preferences.notifications = {
      emailMessages: checkboxes[0].checked,
      tripUpdates: checkboxes[1].checked,
      marketingEmails: checkboxes[2].checked
    };

    return formData;
  }

  /**
   * Show a success message after saving
   */
  showSaveSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'toast-message success';
    message.textContent = 'Profile updated successfully!';

    document.body.appendChild(message);

    // Remove the message after 3 seconds
    setTimeout(() => {
      message.classList.add('fade-out');
      setTimeout(() => {
        message.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Helper method to select an option by value
   * @param {HTMLSelectElement} selectElement - The select element
   * @param {string} value - The value to select
   */
  selectOptionByValue(selectElement, value) {
    for (let i = 0; i < selectElement.options.length; i++) {
      if (selectElement.options[i].text.toLowerCase().includes(value.toLowerCase())) {
        selectElement.selectedIndex = i;
        break;
      }
    }
  }

  /**
   * Toggle password field visibility
   * @param {Event} event - Click event
   */
  togglePasswordVisibility(event) {
    const button = event.currentTarget;
    const input = button.parentElement.querySelector('input');
    const icon = button.querySelector('i');

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }

  /**
   * Show password error message
   * @param {string} message - Error message to display
   */
  showPasswordError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'toast-message error';
    errorMessage.textContent = message;

    document.body.appendChild(errorMessage);

    // Remove the message after 3 seconds
    setTimeout(() => {
      errorMessage.classList.add('fade-out');
      setTimeout(() => {
        errorMessage.remove();
      }, 300);
    }, 3000);
  }
}

/**
 * Notifications Manager
 * Handles the notifications section functionality
 */
export class NotificationsManager {
  constructor() {
    this.notificationsSection = document.getElementById('notifications');
    this.notificationsList = this.notificationsSection.querySelector('.notification-list');
    this.markAllReadButton = this.notificationsSection.querySelector('.text-button');
    this.notifications = [];
  }

  /**
   * Initialize the notifications manager
   * @param {Array} notifications - Array of notification objects
   */
  init(notifications) {
    this.notifications = notifications || [];
    this.renderNotifications();
    this.setupEventListeners();
    this.updateNotificationBadge();
  }

  /**
   * Render the notifications in the list
   */
  renderNotifications() {
    if (!this.notificationsList) return;

    // Clear existing notifications
    this.notificationsList.innerHTML = '';

    if (this.notifications.length === 0) {
      this.renderEmptyState();
      return;
    }

    // Create the notifications container
    const notificationsContainer = document.createElement('div');
    notificationsContainer.className = 'notifications-container';

    // Add each notification
    this.notifications.forEach(notification => {
      const notificationItem = this.createNotificationItem(notification);
      notificationsContainer.appendChild(notificationItem);
    });

    this.notificationsList.appendChild(notificationsContainer);
  }

  /**
   * Create a notification item element
   * @param {Object} notification - Notification data object
   * @returns {HTMLElement} The created notification element
   */
  createNotificationItem(notification) {
    const item = document.createElement('div');
    item.className = `notification-item ${notification.read ? '' : 'unread'}`;
    item.dataset.id = notification.id;

    item.innerHTML = `
      <div class="notification-content">
        <div class="${notification.iconColor}">
          <i class="fas fa-${notification.icon}"></i>
        </div>
        <div class="notification-text">
          <p class="notification-title">${notification.title}</p>
          <p class="notification-message">${notification.message}</p>
          <p class="notification-time">${notification.time}</p>
        </div>
        <button class="notification-dismiss" aria-label="Dismiss notification">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    return item;
  }

  /**
   * Render an empty state when no notifications exist
   */
  renderEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <div class="empty-state-icon">
        <i class="fas fa-bell-slash"></i>
      </div>
      <h3>No Notifications</h3>
      <p>You're all caught up!</p>
    `;

    this.notificationsList.appendChild(emptyState);
  }

  /**
   * Set up event listeners for notification interactions
   */
  setupEventListeners() {
    // Mark all as read button
    this.markAllReadButton.addEventListener('click', this.handleMarkAllRead.bind(this));

    // Delegate event handling for notification items
    this.notificationsList.addEventListener('click', (event) => {
      // Handle dismiss button click
      if (event.target.closest('.notification-dismiss')) {
        const item = event.target.closest('.notification-item');
        if (item) {
          const notificationId = item.dataset.id;
          this.handleDismissNotification(notificationId, item);
        }
      }
      // Handle clicking on the notification itself (mark as read)
      else if (event.target.closest('.notification-item')) {
        const item = event.target.closest('.notification-item');
        if (item && item.classList.contains('unread')) {
          const notificationId = item.dataset.id;
          this.handleMarkAsRead(notificationId, item);
        }
      }
    });
  }

  /**
   * Handle marking all notifications as read
   */
  handleMarkAllRead() {
    const unreadItems = this.notificationsList.querySelectorAll('.notification-item.unread');

    unreadItems.forEach(item => {
      item.classList.remove('unread');
      const notificationId = item.dataset.id;

      // Update the notification in our data
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    });

    // Update the notification badge
    this.updateNotificationBadge();

    // In a real app, we would send a request to mark all as read on the server
    console.log('Marked all notifications as read');
  }

  /**
   * Handle marking a single notification as read
   * @param {string} notificationId - ID of the notification to mark as read
   * @param {HTMLElement} itemElement - The notification element
   */
  handleMarkAsRead(notificationId, itemElement) {
    itemElement.classList.remove('unread');

    // Update the notification in our data
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }

    // Update the notification badge
    this.updateNotificationBadge();

    // In a real app, we would send a request to mark as read on the server
    console.log('Marked notification as read:', notificationId);
  }

  /**
   * Handle dismissing a notification
   * @param {string} notificationId - ID of the notification to dismiss
   * @param {HTMLElement} itemElement - The notification element to remove
   */
  handleDismissNotification(notificationId, itemElement) {
    // Add fade-out animation
    itemElement.classList.add('fade-out');

    // Remove after animation completes
    setTimeout(() => {
      itemElement.remove();

      // Check if we need to show the empty state
      if (this.notificationsList.querySelector('.notifications-container').children.length === 0) {
        this.renderEmptyState();
      }
    }, 300);

    // Remove from our data
    this.notifications = this.notifications.filter(n => n.id !== notificationId);

    // Update the notification badge
    this.updateNotificationBadge();

    // In a real app, we would send a request to dismiss on the server
    console.log('Dismissed notification:', notificationId);
  }

  /**
   * Update the notification badge count
   */
  updateNotificationBadge() {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    const badges = document.querySelectorAll('.notification-badge');

    badges.forEach(badge => {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    });
  }
}

// Export default object with all classes
export default {
  ProfileManager,
  NotificationsManager
};