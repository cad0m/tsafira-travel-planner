/**
 * Enhanced Meal Card Module
 * Adds advanced functionality to meal cards
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeMealCardEnhancements();
});

/**
 * Initialize meal card enhancements
 */
function initializeMealCardEnhancements() {
  // Add event listeners for tab changes to ensure enhancements are applied
  document.addEventListener('tabChanged', (event) => {
    if (event.detail && event.detail.tabId === 'meals') {
      enhanceMealCards();
    }
  });

  // Add event listeners for day changes to ensure enhancements are applied
  document.addEventListener('dayChanged', () => {
    setTimeout(enhanceMealCards, 100);
  });

  // Initial enhancement
  enhanceMealCards();
}

/**
 * Enhance meal cards with advanced features
 */
function enhanceMealCards() {
  const mealCards = document.querySelectorAll('.meal-card');

  if (!mealCards.length) return;

  mealCards.forEach((card, index) => {
    // Set animation order as a CSS variable
    card.style.setProperty('--animation-order', index);

    // Add hover effects for meal tags
    setupMealTagTooltips(card);

    // Add animation for meal cards
    animateMealCardEntry(card);

    // Add interactive elements
    addInteractiveElements(card);
  });
}

/**
 * Setup tooltips for meal tags
 * @param {HTMLElement} card - Meal card element
 */
function setupMealTagTooltips(card) {
  const tagIcons = card.querySelectorAll('.meal-tags i');

  tagIcons.forEach(icon => {
    // Get the title attribute which contains the description
    const description = icon.getAttribute('title');

    if (description) {
      // Create tooltip element if it doesn't exist
      if (!icon.querySelector('.tag-tooltip')) {
        const tooltip = document.createElement('span');
        tooltip.className = 'tag-tooltip';
        tooltip.textContent = description;
        tooltip.style.cssText = `
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          z-index: 10;
          pointer-events: none;
          margin-bottom: 5px;
        `;

        // Add arrow
        const arrow = document.createElement('span');
        arrow.style.cssText = `
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
        `;

        tooltip.appendChild(arrow);
        icon.style.position = 'relative';
        icon.appendChild(tooltip);

        // Show tooltip on hover
        icon.addEventListener('mouseenter', () => {
          tooltip.style.opacity = '1';
          tooltip.style.visibility = 'visible';
        });

        // Hide tooltip on mouse leave
        icon.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0';
          tooltip.style.visibility = 'hidden';
        });
      }
    }
  });
}

/**
 * Animate meal card entry
 * @param {HTMLElement} card - Meal card element
 */
function animateMealCardEntry(card) {
  // Reset any existing animations
  card.style.animation = 'none';

  // Get all cards to stagger the animation
  const allCards = Array.from(document.querySelectorAll('.meal-card'));
  const index = allCards.indexOf(card);

  // Create keyframe animation for entry
  const keyframes = `
    @keyframes mealCardEntry${index} {
      0% {
        opacity: 0;
        transform: translateY(30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  // Add keyframes to document if they don't exist
  if (!document.getElementById(`mealCardEntry${index}`)) {
    const style = document.createElement('style');
    style.id = `mealCardEntry${index}`;
    style.textContent = keyframes;
    document.head.appendChild(style);
  }

  // Apply animation with delay based on index
  setTimeout(() => {
    card.style.opacity = '0';
    card.style.animation = `mealCardEntry${index} 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards`;
    card.style.animationDelay = `${index * 0.1}s`;
  }, 50);
}

/**
 * Add interactive elements to meal card
 * @param {HTMLElement} card - Meal card element
 */
function addInteractiveElements(card) {
  // Add image zoom effect on click
  const mealImage = card.querySelector('.meal-image');

  if (mealImage) {
    mealImage.style.cursor = 'pointer';

    // Remove existing event listeners
    const newMealImage = mealImage.cloneNode(true);
    mealImage.parentNode.replaceChild(newMealImage, mealImage);

    // Add click event to show larger image
    newMealImage.addEventListener('click', (e) => {
      e.preventDefault();

      const img = newMealImage.querySelector('img');
      if (!img) return;

      // Create modal for larger image view
      const modal = document.createElement('div');
      modal.className = 'meal-image-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;

      // Create image element
      const modalImg = document.createElement('img');
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
      `;

      // Create close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 40px;
        cursor: pointer;
        outline: none;
      `;

      // Add elements to modal
      modal.appendChild(modalImg);
      modal.appendChild(closeBtn);
      document.body.appendChild(modal);

      // Show modal with animation
      setTimeout(() => {
        modal.style.opacity = '1';
        modalImg.style.transform = 'scale(1)';
      }, 10);

      // Close modal on click
      modal.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
      });

      // Prevent propagation on image click
      modalImg.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }

  // Add hover effect for restaurant name
  const restaurantName = card.querySelector('.meal-name');
  if (restaurantName) {
    restaurantName.style.transition = 'color 0.3s ease';
    restaurantName.addEventListener('mouseenter', () => {
      restaurantName.style.color = 'var(--color-primary)';
    });
    restaurantName.addEventListener('mouseleave', () => {
      restaurantName.style.color = '';
    });
  }
}

// Export functions for use in other modules
export {
  initializeMealCardEnhancements,
  enhanceMealCards
};
