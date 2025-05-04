/**
 * Modal Manager
 * Handles the guide detail modal functionality
 */
export class ModalManager {
  constructor() {
    this.modal = document.getElementById('guide-detail-modal');
    this.modalContent = document.getElementById('modal-content');
    this.isOpen = false;
    this.currentGuide = null;
    this.cityName = '';
  }

  /**
   * Initialize the modal manager
   */
  init() {
    console.log('Initializing modal manager...');

    // Set up global event listener for modal interactions
    document.addEventListener('click', (event) => {
      // Close modal when clicking outside the modal content
      if (this.isOpen && event.target === this.modal) {
        this.closeModal();
      }

      // Close modal when clicking close button
      if (event.target.closest('.modal-close-btn')) {
        this.closeModal();
      }
    });

    // Set up keyboard events
    document.addEventListener('keydown', (event) => {
      if (this.isOpen && event.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  /**
   * Set the city name
   * @param {String} cityName City name
   */
  setCity(cityName) {
    this.cityName = cityName;
  }

  /**
   * Open the modal with guide details
   * @param {Object} guide Guide data
   */
  openModal(guide) {
    if (!guide) return;

    this.currentGuide = guide;

    // Generate modal content
    const content = this.generateModalContent(guide);

    // Update modal content
    if (this.modalContent) {
      this.modalContent.innerHTML = content;
    }

    // Show modal
    if (this.modal) {
      // Make sure modal is visible but transparent for animation
      this.modal.classList.remove('hidden');
      this.modal.classList.add('flex');

      // Prevent body scrolling
      document.body.style.overflow = 'hidden';

      // Animate in
      setTimeout(() => {
        this.modal.classList.add('opacity-100');
        if (this.modalContent) {
          this.modalContent.classList.remove('scale-95', 'opacity-0');
          this.modalContent.classList.add('scale-100', 'opacity-100');
        }
        this.isOpen = true;
      }, 10);
    }
  }

  /**
   * Close the modal
   */
  closeModal() {
    if (!this.isOpen || !this.modal) return;

    // Animate out
    this.modal.classList.remove('opacity-100');

    if (this.modalContent) {
      this.modalContent.classList.remove('scale-100', 'opacity-100');
      this.modalContent.classList.add('scale-95', 'opacity-0');
    }

    // Hide modal after animation
    setTimeout(() => {
      this.modal.classList.add('hidden');
      this.modal.classList.remove('flex');
      document.body.style.overflow = '';
      this.isOpen = false;
    }, 300);
  }

  /**
   * Generate modal content HTML
   * @param {Object} guide Guide data
   * @returns {String} Modal content HTML
   */
  generateModalContent(guide) {
    const cityInfo = this.cityName ? this.cityName : 'Local Area';

    return `
      <div class="modal-header" style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80');">
        <button class="modal-close-btn">
          <i class="fa-solid fa-times"></i>
        </button>

        <div class="modal-profile">
          <img
            src="${guide.profile_image}"
            alt="${guide.name}"
            class="modal-profile-image"
          >
          <div class="modal-profile-info">
            <h2 class="modal-profile-name">${guide.name}</h2>
            <p class="modal-profile-title">${guide.specialization} • ${cityInfo}</p>
          </div>
        </div>
      </div>

      <div class="modal-content">
        <div class="modal-section">
          <h3 class="modal-section-title">
            <i class="fa-solid fa-user"></i> About Me
          </h3>
          <p class="modal-about">${guide.about}</p>
        </div>

        <div class="modal-section">
          <h3 class="modal-section-title">
            <i class="fa-solid fa-star"></i> My Specialties
          </h3>
          <div class="modal-specialties">
            ${guide.specialties.map(specialty => `
              <div class="modal-specialty">
                <i class="fa-solid ${specialty.icon}"></i>
                <span class="modal-specialty-name">${specialty.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="modal-section">
          <h3 class="modal-section-title">
            <i class="fa-solid fa-language"></i> Languages
          </h3>
          <div class="flex flex-wrap gap-2 mt-2">
            ${guide.languages.map(lang => `
              <span class="guide-language">${lang}</span>
            `).join('')}
          </div>
        </div>

        <div class="modal-section">
          <h3 class="modal-section-title">
            <i class="fa-solid fa-address-card"></i> Contact Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <i class="fa-solid fa-envelope text-orange-600 w-5 mr-3"></i>
              <span class="text-gray-700 dark:text-gray-300">contact@tsafira.com</span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <i class="fa-solid fa-phone text-orange-600 w-5 mr-3"></i>
              <span class="text-gray-700 dark:text-gray-300">+212 123 456 789</span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-action-btn modal-action-primary">
            <i class="fa-solid fa-envelope-open-text"></i> Send Invitation
          </button>
          <button class="modal-action-btn modal-action-secondary">
            <i class="fa-solid fa-message"></i> Send Message
          </button>
        </div>
      </div>
    `;
  }
}
