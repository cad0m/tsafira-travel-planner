/**
 * Effects Module
 * Handles visual effects and animations
 */

import { $, $$ } from './dom-utils.js';

// Constants for animations
const ANIMATION = {
  DURATION: {
    FAST: 300,
    NORMAL: 500,
    SLOW: 800
  },
  TIMING: {
    LINEAR: 'linear',
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  }
};

/**
 * Initialize effects
 */
export function initializeEffects() {
  // Add CSS variables for budget card colors
  addBudgetCardStyles();

  // Setup scroll animations
  setupScrollAnimations();

  // Setup budget progress animation
  setupBudgetProgressAnimation();

  // Setup card hover animations
  setupCardHoverAnimations();

  // Setup empty state styles
  addEmptyStateStyles();
}

/**
 * Setup scroll animations
 */
function setupScrollAnimations() {
  // Animate elements when they come into view
  const animatedElements = document.querySelectorAll(
    '.timeline-event, .meal-card, .transport-card, .recommendation-card, .video-card'
  );

  // Check if IntersectionObserver is available
  if ('IntersectionObserver' in window) {
    // Create intersection observer
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe elements
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(element => {
      element.classList.add('fade-in');
    });
  }
}

/**
 * Setup budget progress bar animation
 */
function setupBudgetProgressAnimation() {
  const progressBar = $('.budget-progress-bar');

  if (progressBar) {
    // Get budget data
    const totalBudgetEl = $('#total-budget');
    const spentBudgetEl = $('#budget-spent');

    if (!totalBudgetEl || !spentBudgetEl) return;

    const totalBudget = parseFloat(
      totalBudgetEl.textContent.replace('$', '').replace(',', '')
    );

    const spentBudget = parseFloat(
      spentBudgetEl.textContent.replace('$', '').replace(',', '')
    );

    // Calculate percentage
    const percentage = (spentBudget / totalBudget) * 100;

    // Animate progress bar
    setTimeout(() => {
      progressBar.style.width = `${percentage}%`;

      // Add pulse animation
      progressBar.classList.add('pulse');

      // Remove pulse animation after it completes
      setTimeout(() => {
        progressBar.classList.remove('pulse');
      }, 600);
    }, 500);
  }
}

/**
 * Setup card hover animations
 */
function setupCardHoverAnimations() {
  // Timeline cards
  $$('.timeline-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = 'var(--shadow-lg)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow)';
    });
  });

  // Recommendation cards
  $$('.recommendation-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = 'var(--shadow-lg)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow)';
    });
  });

  // Video cards
  $$('.video-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.video-play-icon')?.classList.add('pulse');
    });

    card.addEventListener('mouseleave', () => {
      card.querySelector('.video-play-icon')?.classList.remove('pulse');
    });
  });
}

/**
 * Add budget card styles
 */
function addBudgetCardStyles() {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --budget-card-bg-light: white;
      --budget-card-bg-dark: #1E293B;
      --budget-category-bg-light: #F9FAFB;
      --budget-category-bg-dark: #334155;
      --budget-category-hover-light: #F3F4F6;
      --budget-category-hover-dark: #475569;
      --budget-progress-bg-light: #E5E7EB;
      --budget-progress-bg-dark: #475569;
      --budget-text-dark-light: #374151;
      --budget-text-light-dark: #F1F5F9;
      --budget-text-muted-light: #6B7280;
      --budget-text-muted-dark: #94A3B8;
      --budget-danger: #EF4444;
      --budget-warning: #F59E0B;
      --budget-accent: #3B82F6;
      --budget-success: #22C55E;

      --color-success-50: #ECFDF5;
      --color-success-200: #A7F3D0;
      --color-success-700: #047857;

      --color-error-50: #FEF2F2;
      --color-error-200: #FECACA;
      --color-error-500: #EF4444;
      --color-error-700: #B91C1C;
    }

    .pulse {
      animation: pulse 0.6s ease-in-out;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    .fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Add empty state styles
 */
function addEmptyStateStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8);
      background-color: var(--color-gray-50);
      border-radius: var(--border-radius-lg);
      border: 1px dashed var(--color-gray-300);
      text-align: center;
    }

    .dark .empty-state {
      background-color: var(--color-gray-200);
      border-color: var(--color-gray-400);
    }

    .empty-state i {
      font-size: 3rem;
      color: var(--color-gray-400);
      margin-bottom: var(--spacing-4);
    }

    .dark .empty-state i {
      color: var(--color-gray-500);
    }

    .empty-state h3 {
      font-size: 1.25rem;
      color: var(--color-gray-600);
    }

    .dark .empty-state h3 {
      color: var(--color-gray-400);
    }

    .disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
}