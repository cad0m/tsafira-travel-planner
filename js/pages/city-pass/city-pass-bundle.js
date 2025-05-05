/**
 * Consolidated City Pass JavaScript
 * Optimized version with streamlined code
 */

document.addEventListener('DOMContentLoaded', function() {
  initCityPass();
});

/**
 * Initialize the entire City Pass page
 */
function initCityPass() {
  try {
    // First, load the partials
    loadPartial('/tsafira-travel-planner/../partials/header.html', 'header-placeholder');
    loadPartial('/tsafira-travel-planner/../partials/footer.html', 'footer-placeholder');

    // Show loading indicator
    showLoadingMessage();

    // Set default background immediately
    const heroSection = document.querySelector('#hero-section');
    if (heroSection) {
      heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://www.kanaga-at.com/wp-content/uploads/2021/07/marocco_chefchaouen.jpg')`;
    }

    // Load city data for carousel
    loadCityCardsData()
      .then(cityCardsData => {
        // Initialize the city cards carousel
        initCityCardsCarousel(cityCardsData);

        // Continue with other page data
        return fetchData();
      })
      .then(data => {
        hideLoadingMessage();
        renderHero(data.hero);
        initBenefits(data.benefits);
        initChart(data.savings);
        initPurchaseOptions(data.purchase);
        renderFaq(data.faq);
        setupScrollProgress();
        setupSmoothScrolling();
      })
      .catch(error => {
        console.error('Error initializing page:', error);
        hideLoadingMessage();
        showErrorMessage('Failed to load page content. Please refresh the page.');
      });
  } catch (error) {
    hideLoadingMessage();
    showErrorMessage('Something went wrong. Please refresh the page.');
  }
}

/**
 * Load city data from JSON files in the cities folder
 */
async function loadCityCardsData() {
  try {
    console.log('Loading city cards data...');
    // Get list of available city JSON files
    const cityFiles = ['marrakech', 'casablanca', 'tangier', 'fez', 'agadir', 'rabat']; // Default list of cities
    const cityData = [];

    // Load data for each city
    for (const cityName of cityFiles) {
      try {
        console.log(`Fetching data for ${cityName}...`);
        const url = `../../assets/data/cities/${cityName}.json`;
        console.log('Fetch URL:', url);
        const response = await fetch(url);
        console.log(`Response for ${cityName}:`, response.status, response.ok);
        if (response.ok) {
          const data = await response.json();
          console.log(`Data loaded for ${cityName}:`, data.city ? data.city.name : 'No city data');
          cityData.push({
            name: cityName,
            data: data
          });
        } else {
          console.warn(`Failed to load data for ${cityName}: HTTP ${response.status}`);
        }
      } catch (error) {
        console.warn(`Error loading data for ${cityName}:`, error);
      }
    }

    console.log('City data loaded:', cityData.length, 'cities');
    return cityData;
  } catch (error) {
    console.error('Error loading city data:', error);
    return []; // Return empty array if loading fails
  }
}

/**
 * Initialize the city cards carousel with data from JSON files
 */
function initCityCardsCarousel(cityCardsData) {
  console.log('Initializing city cards carousel with data:', cityCardsData);
  if (!cityCardsData || !cityCardsData.length) {
    console.warn('No city data available for carousel');
    return;
  }

  const carouselStage = document.getElementById('carousel-stage');
  const carouselPagination = document.getElementById('carousel-pagination');

  console.log('Carousel elements:', {
    carouselStage: carouselStage ? 'Found' : 'Not found',
    carouselPagination: carouselPagination ? 'Found' : 'Not found'
  });

  if (!carouselStage || !carouselPagination) {
    console.error('Carousel elements not found, cannot initialize carousel');
    return;
  }

  // Clear existing content
  carouselStage.innerHTML = '';
  carouselPagination.innerHTML = '';

  // Create cards for each city
  cityCardsData.forEach((city, index) => {
    const cityInfo = city.data.city;
    const popularDuration = city.data.durations.find(d => d.popular) || city.data.durations[0];

    // Create card element
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.setAttribute('data-index', index);

    // Fix image path if needed
    let imagePath = cityInfo.heroImage;
    console.log(`Original image path for ${cityInfo.name}:`, imagePath);

    if (imagePath.startsWith('/tsafira-travel-planner/../../assets/')) {
      // Path is already correct for the new structure
      imagePath = cityInfo.heroImage;
    } else if (imagePath.startsWith('/tsafira-travel-planner/')) {
      // Legacy path format
      imagePath = '/tsafira-travel-planner/../assets' + imagePath.substring(2);
    } else if (imagePath.startsWith('/tsafira-travel-planner/../')) {
      // Another possible format
      imagePath = imagePath;
    }

    // Log the image path for debugging
    console.log(`City card image path for ${cityInfo.name}:`, imagePath);

    // Create card content
    card.innerHTML = `
      <div class="card-image-container">
        <img src="${imagePath}" alt="${cityInfo.name} City Pass" class="card-image">
      </div>

      <div class="pass-badge">${popularDuration ? popularDuration.name.replace('Pass', '').trim() : '72h Pass'/tsafira-travel-planner/div>

      <div class="card-overlay">
        <div class="city-label">
          <div class="label-line"></div>
          <span class="text-orange-300 text-sm">Morocco</span>
        </div>
        <h3 class="text-2xl md:text-3xl font-bold">${cityInfo.name}</h3>
        <p class="text-sm md:text-base mt-2 text-gray-200">
          ${cityInfo.subtitle}
        </p>

        <div class="features-list">
          ${city.data.features.slice(0, 2).map(feature => `
            <div class="feature-item">
              <svg class="feature-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>${feature.name}</span>
            </div>
          `).join('')}
        </div>

        <a href="../../pages/city-card.html?city=${city.name.toLowerCase()}" class="view-button">
          View Pass
          <svg class="button-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
      </div>
    `;

    // Add card to carousel
    carouselStage.appendChild(card);

    // Create pagination dot
    const dot = document.createElement('button');
    dot.className = 'pagination-dot' + (index === 0 ? ' active' : '');
    dot.setAttribute('data-index', index);
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

    // Add dot to pagination
    carouselPagination.appendChild(dot);
  });

  // Initialize carousel functionality
  initCarouselControls();

  // Set first card as active
  const firstCard = carouselStage.querySelector('.carousel-card');
  console.log('First card found:', firstCard ? 'Yes' : 'No');

  if (firstCard) {
    console.log('Setting first card as active');
    firstCard.classList.add('active');

    // Make sure the first pagination dot is also active
    const firstDot = carouselPagination.querySelector('.pagination-dot');
    if (firstDot) {
      firstDot.classList.add('active');
    }

    // Update adjacent cards
    updateAdjacentCards(0);

    // Log the state of all cards after initialization
    const allCards = carouselStage.querySelectorAll('.carousel-card');
    allCards.forEach((card, index) => {
      console.log(`Card ${index} state after initialization:`, card.className);
    });
  } else {
    console.error('No cards found in the carousel stage');
  }
}

/**
 * Fetch data from JSON file or use fallback data
 */
function fetchData() {
  return new Promise((resolve) => {
    // Fallback data to use if fetch fails
    const fallbackData = {
      hero: {
        title: "Discover the Ultimate City Pass",
        subtitle: "Unlock unlimited museums, transport & tours—one simple pass.",
        buttonText: "Buy Your Pass",
        backgroundImage: "https://www.kanaga-at.com/wp-content/uploads/2021/07/marocco_chefchaouen.jpg"
      },
      benefits: {
        title: "Top Benefits",
        items: [
          {
            icon: "ticket",
            title: "Skip-the-Line Access",
            description: "No waiting in long queues—get priority entry to all major attractions."
          },
          {
            icon: "train",
            title: "Unlimited Transport",
            description: "Free access to all public transportation within the city during pass validity."
          },
          {
            icon: "map-location-dot",
            title: "20+ Attractions",
            description: "Entry to over 20 top museums, landmarks, and guided tours included."
          },
          {
            icon: "money-bill-wave",
            title: "Significant Savings",
            description: "Save up to 40% compared to purchasing individual tickets."
          }
        ]
      },
      savings: {
        title: "See Your Savings",
        description: "Compare the City Pass price against buying individual tickets.",
        regularPrice: 240,
        passPrice: 149,
        currency: "€"
      },
      purchase: {
        title: "Choose Your Duration",
        subtitle: "Select the pass that fits your trip duration",
        options: [
          {
            id: "2-day",
            duration: "2-Day Pass",
            price: 79,
            priceDetails: "€39.50 per day",
            popular: false,
            features: ["Access to all attractions", "Unlimited public transport", "1 guided tour included"]
          },
          {
            id: "4-day",
            duration: "4-Day Pass",
            price: 149,
            priceDetails: "€37.25 per day",
            popular: true,
            features: ["Access to all attractions", "Unlimited public transport", "2 guided tours included", "1 premium attraction"]
          },
          {
            id: "7-day",
            duration: "7-Day Pass",
            price: 199,
            priceDetails: "€28.43 per day",
            popular: false,
            features: ["Access to all attractions", "Unlimited public transport", "3 guided tours included", "2 premium attractions", "Airport transfers"]
          }
        ],
        buttonText: "Proceed to Purchase"
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "How does the City Pass work?",
            answer: "The City Pass is activated on first use and remains valid for the consecutive days of your chosen duration. Simply show your digital pass (on your phone) or printed pass at each attraction or transport entrance for free entry."
          },
          {
            question: "Are all attractions included in the pass?",
            answer: "The City Pass includes entry to over 20 major attractions, museums, and landmarks. Some special exhibitions or limited-time events may require an additional fee. Check the full list of included attractions in our digital guide."
          },
          {
            question: "Do I need to make reservations for attractions?",
            answer: "Most attractions offer direct entry with your City Pass. However, some popular sites may require reservations during peak season. Your digital guide will indicate which attractions recommend reservations."
          },
          {
            question: "Can I use public transportation with the City Pass?",
            answer: "Yes! Your City Pass includes unlimited use of all public transportation within the city zone, including buses, trams, metro, and local trains for the duration of your pass."
          },
          {
            question: "How do I receive my City Pass?",
            answer: "After purchase, you'll receive your digital City Pass via email. You can either use it on your smartphone through our mobile app or print it at home. Physical cards can also be picked up at our welcome centers in the city."
          }
        ]
      }
    };

    // Try to load the JSON file
    fetch('/tsafira-travel-planner/../assets/data/city-pass-data.json')
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
        return response.json();
      })
      .then(data => resolve(data))
      .catch(() => resolve(fallbackData)); // Use fallback data on error
  });
}

/**
 * Load a partial HTML file
 */
function loadPartial(url, placeholderId) {
  const placeholderElement = document.getElementById(placeholderId);
  if (!placeholderElement) return;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load partial: ${response.status}`);
      return response.text();
    })
    .then(html => {
      placeholderElement.innerHTML = html;
    })
    .catch(() => {
      placeholderElement.innerHTML = `<div class="p-4 text-center">Failed to load content</div>`;
    });
}

/**
 * Show loading message
 */
function showLoadingMessage() {
  if (document.getElementById('loading-message')) return;

  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-message';
  loadingDiv.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 z-50';
  loadingDiv.innerHTML = `
    <div class="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">Loading city pass information...</p>
    </div>
  `;

  document.body.appendChild(loadingDiv);
}

/**
 * Hide loading message
 */
function hideLoadingMessage() {
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) loadingMessage.remove();
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  const mainContainer = document.querySelector('main[data-page]');
  if (!mainContainer) return;

  mainContainer.innerHTML = `
    <div class="py-16 text-center">
      <h2 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">${message}</p>
      <button class="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-full" onclick="location.reload()">
        Refresh Page
      </button>
    </div>
  `;
}

/**
 * Render the enhanced hero section with parallax and animations
 */
function renderHero(heroData) {
  if (!heroData) return;

  const heroSection = document.querySelector('#hero-section');
  if (!heroSection) return;

  // Get hero elements
  const bgLayer = heroSection.querySelector('.hero-bg-layer');
  const titleElement = heroSection.querySelector('#hero-title');
  const subtitleElement = heroSection.querySelector('#hero-subtitle');
  const ctaElement = heroSection.querySelector('#hero-cta');

  // Set background image on the background layer
  if (bgLayer) {
    console.log('Hero background image path:', heroData.backgroundImage);
    bgLayer.style.backgroundImage = `url(${heroData.backgroundImage})`;
  }

  // Update content if needed (but preserve HTML structure)
  if (titleElement) {
    // Keep the HTML structure with the gradient span
    const currentHTML = titleElement.innerHTML;
    const cityPassIndex = currentHTML.indexOf('<span class="text-gradient');

    if (cityPassIndex !== -1) {
      // Extract the "City Pass" part with its styling
      const cityPassPart = currentHTML.substring(cityPassIndex);
      // Replace the title text but keep the styled "City Pass" part
      titleElement.innerHTML = heroData.title.replace(/City Pass/i, '') + ' ' + cityPassPart;
    } else {
      // Fallback if the span is not found
      titleElement.innerHTML = heroData.title;
    }
  }

  if (subtitleElement) subtitleElement.textContent = heroData.subtitle;
  if (ctaElement && ctaElement.querySelector('span')) {
    ctaElement.querySelector('span').textContent = heroData.buttonText;
  }

  // Initialize parallax effect
  initParallaxEffect();

  // Initialize mouse movement effect for hero section
  initHeroMouseEffect();
}

/**
 * Initialize parallax scrolling effect for hero section
 */
function initParallaxEffect() {
  const heroSection = document.querySelector('#hero-section');
  const bgLayer = document.querySelector('.hero-bg-layer');

  if (!heroSection || !bgLayer) return;

  // Function to update parallax effect based on scroll position
  function updateParallax() {
    const scrollPosition = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    // Only apply effect when hero section is visible
    if (scrollPosition <= heroHeight) {
      // Calculate parallax amount (move slower than scroll)
      const parallaxOffset = scrollPosition * 0.4;

      // Apply transform to create parallax effect
      bgLayer.style.transform = `translateY(${parallaxOffset}px) scale(1.1)`;

      // Adjust opacity for fade-out effect
      const opacity = 1 - (scrollPosition / heroHeight) * 1.5;
      heroSection.style.opacity = Math.max(opacity, 0);
    }
  }

  // Add scroll event listener
  window.addEventListener('scroll', updateParallax);

  // Initial update
  updateParallax();
}

/**
 * Initialize mouse movement effect for hero section
 */
function initHeroMouseEffect() {
  const heroSection = document.querySelector('#hero-section');
  const bgLayer = document.querySelector('.hero-bg-layer');
  const contentContainer = document.querySelector('.hero-content-container');

  if (!heroSection || !bgLayer || !contentContainer) return;

  // Function to handle mouse movement
  function handleMouseMove(e) {
    // Get mouse position relative to hero section
    const rect = heroSection.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate movement percentage (-0.5 to 0.5)
    const moveX = (mouseX / rect.width - 0.5) * 2;
    const moveY = (mouseY / rect.height - 0.5) * 2;

    // Apply subtle movement to background (parallax effect)
    bgLayer.style.transform = `translateX(${moveX * -15}px) translateY(${moveY * -15}px) scale(1.1)`;

    // Apply subtle counter-movement to content (creates depth)
    contentContainer.style.transform = `translateX(${moveX * 10}px) translateY(${moveY * 10}px)`;
  }

  // Add mouse move event listener
  heroSection.addEventListener('mousemove', handleMouseMove);

  // Reset on mouse leave
  heroSection.addEventListener('mouseleave', () => {
    bgLayer.style.transform = 'translateX(0) translateY(0) scale(1.1)';
    contentContainer.style.transform = 'translateX(0) translateY(0)';
  });
}

/**
 * Initialize benefits section
 */
function initBenefits(benefitsData) {
  if (!benefitsData || !benefitsData.items || !benefitsData.items.length) return;

  // Set title
  const titleElement = document.querySelector('#benefits-title');
  if (titleElement) titleElement.textContent = benefitsData.title;

  // Get container
  const benefitsContainer = document.querySelector('#benefits-container');
  if (!benefitsContainer) return;

  // Clear container
  benefitsContainer.innerHTML = '';

  // Add visible benefits (first 3)
  const visibleBenefits = benefitsData.items.slice(0, Math.min(3, benefitsData.items.length));
  visibleBenefits.forEach(benefit => {
    benefitsContainer.appendChild(createBenefitCard(benefit));
  });

  // Add hidden benefits if there are more than 3
  if (benefitsData.items.length > 3) {
    const hiddenBenefits = benefitsData.items.slice(3);
    const benefitsSection = document.querySelector('#benefits-section');

    if (benefitsSection) {
      // Create container for hidden benefits
      const hiddenContainer = document.createElement('div');
      hiddenContainer.id = 'hidden-benefits';
      hiddenContainer.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 hidden overflow-hidden transition-all duration-500 ease-in-out';
      hiddenContainer.setAttribute('aria-hidden', 'true');

      // Add hidden benefits to container
      hiddenBenefits.forEach(benefit => {
        hiddenContainer.appendChild(createBenefitCard(benefit));
      });

      // Add hidden container to section
      benefitsSection.appendChild(hiddenContainer);

      // Add "Show more" button
      const showMoreContainer = document.createElement('div');
      showMoreContainer.className = 'flex justify-center mt-8';

      const showMoreButton = document.createElement('button');
      showMoreButton.id = 'show-more-benefits';
      showMoreButton.className = 'flex items-center space-x-2 text-primary hover:text-primary-hover dark:text-primary-dark dark:hover:text-primary-hover font-medium';
      showMoreButton.setAttribute('aria-expanded', 'false');
      showMoreButton.setAttribute('aria-controls', 'hidden-benefits');
      showMoreButton.innerHTML = `
        <span id="show-more-text">+ Show all benefits</span>
        <i class="fas fa-chevron-down transition-transform duration-300"></i>
      `;

      // Add click event
      showMoreButton.addEventListener('click', function() {
        const hiddenBenefits = document.querySelector('#hidden-benefits');
        const showMoreText = document.querySelector('#show-more-text');
        const chevron = this.querySelector('i');

        if (!hiddenBenefits) return;

        const isHidden = hiddenBenefits.classList.contains('hidden');

        if (isHidden) {
          // Show hidden benefits
          hiddenBenefits.classList.remove('hidden');

          // Get height for animation
          const targetHeight = hiddenBenefits.scrollHeight;
          hiddenBenefits.style.maxHeight = '0';
          hiddenBenefits.style.opacity = '0';

          setTimeout(() => {
            hiddenBenefits.style.maxHeight = `${targetHeight}px`;
            hiddenBenefits.style.opacity = '1';
            showMoreText.textContent = '- Show fewer benefits';
            chevron.classList.add('rotate-180');
            showMoreButton.setAttribute('aria-expanded', 'true');
            hiddenBenefits.setAttribute('aria-hidden', 'false');
          }, 10);
        } else {
          // Hide benefits
          hiddenBenefits.style.maxHeight = '0';
          hiddenBenefits.style.opacity = '0';

          showMoreText.textContent = '+ Show all benefits';
          chevron.classList.remove('rotate-180');
          showMoreButton.setAttribute('aria-expanded', 'false');
          hiddenBenefits.setAttribute('aria-hidden', 'true');

          setTimeout(() => {
            hiddenBenefits.classList.add('hidden');
          }, 500);
        }
      });

      showMoreContainer.appendChild(showMoreButton);
      benefitsSection.appendChild(showMoreContainer);
    }
  }
}

/**
 * Create a benefit card
 */
function createBenefitCard(benefit) {
  const card = document.createElement('div');
  card.className = 'bg-white dark:bg-dark-bg p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center relative overflow-hidden group';

  // Generate a random position for the decorative circle
  const randomX = Math.floor(Math.random() * 100) - 50;
  const randomY = Math.floor(Math.random() * 100) - 50;

  card.innerHTML = `
    <!-- Decorative background elements -->
    <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 dark:bg-primary/10 rounded-full transition-transform duration-500 ease-out group-hover:scale-150"></div>
    <div class="absolute ${randomX > 0 ? 'left' : 'right'}-${Math.abs(randomX)}% ${randomY > 0 ? 'top' : 'bottom'}-${Math.abs(randomY)}% w-16 h-16 bg-primary/5 dark:bg-primary/10 rounded-full transition-transform duration-500 ease-out group-hover:scale-125"></div>

    <!-- Icon with animated background -->
    <div class="relative mb-6">
      <div class="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full blur-md transform scale-110 animate-pulse"></div>
      <div class="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 flex items-center justify-center">
        <i class="fas fa-${benefit.icon} text-2xl text-primary dark:text-primary-dark"></i>
      </div>
    </div>

    <!-- Content -->
    <h3 class="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100 relative z-10">${benefit.title}</h3>
    <p class="text-gray-600 dark:text-gray-300 relative z-10">${benefit.description}</p>
  `;

  return card;
}

/**
 * Initialize chart section
 */
function initChart(savingsData) {
  if (!savingsData) return;

  // Set title and description
  const titleElement = document.querySelector('#savings-title');
  const descriptionElement = document.querySelector('#savings-description');

  if (titleElement) titleElement.textContent = savingsData.title;
  if (descriptionElement) descriptionElement.textContent = savingsData.description;

  // Get price elements
  const regularPriceElement = document.querySelector('#regular-price-value');
  const passPriceElement = document.querySelector('#pass-price-value');
  const savingsAmountElement = document.querySelector('#savings-amount');
  const savingsPercentageElement = document.querySelector('#savings-percentage');
  const passPriceCircle = document.querySelector('#pass-price-circle');

  // Calculate values
  const regularPrice = savingsData.regularPrice;
  const passPrice = savingsData.passPrice;
  const currency = savingsData.currency || '€';
  const savingsAmount = regularPrice - passPrice;
  const savingsPercentage = Math.round((savingsAmount / regularPrice) * 100);

  // Update text values
  if (regularPriceElement) regularPriceElement.textContent = `${currency}${regularPrice}`;
  if (passPriceElement) passPriceElement.textContent = `${currency}${passPrice}`;
  if (savingsAmountElement) savingsAmountElement.textContent = `${currency}${savingsAmount}`;
  if (savingsPercentageElement) savingsPercentageElement.textContent = `${savingsPercentage}%`;

  // Animate circular progress bar
  if (passPriceCircle) {
    // Calculate the percentage of the pass price compared to regular price
    const passPercentage = (passPrice / regularPrice) * 100;

    // Calculate the circumference of the circle
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    // Calculate the dash offset based on the percentage
    const dashOffset = circumference - (passPercentage / 100) * circumference;

    // Set initial state
    passPriceCircle.style.strokeDasharray = circumference;
    passPriceCircle.style.strokeDashoffset = circumference;

    // Force browser to process style changes
    void passPriceCircle.offsetHeight;

    // Animate the circle
    setTimeout(() => {
      passPriceCircle.style.strokeDashoffset = dashOffset;
    }, 500);

    // Add a highlight animation to the savings amount and percentage
    setTimeout(() => {
      if (savingsAmountElement) {
        savingsAmountElement.classList.add('animate-pulse');
        setTimeout(() => savingsAmountElement.classList.remove('animate-pulse'), 2000);
      }

      if (savingsPercentageElement) {
        savingsPercentageElement.classList.add('animate-pulse');
        setTimeout(() => savingsPercentageElement.classList.remove('animate-pulse'), 2000);
      }
    }, 1500);
  }

  // Add hover effects to the comparison cards
  const individualCard = document.querySelector('#savings-section .flex-col.lg\\:flex-row > div:first-child');
  const cityPassCard = document.querySelector('#savings-section .flex-col.lg\\:flex-row > div:last-child');

  if (individualCard && cityPassCard) {
    // Add hover effect to highlight the savings when hovering over the cards
    individualCard.addEventListener('mouseenter', () => {
      if (savingsAmountElement) savingsAmountElement.classList.add('scale-110', 'text-green-500');
      if (savingsPercentageElement) savingsPercentageElement.classList.add('scale-110', 'text-green-500');
    });

    individualCard.addEventListener('mouseleave', () => {
      if (savingsAmountElement) savingsAmountElement.classList.remove('scale-110', 'text-green-500');
      if (savingsPercentageElement) savingsPercentageElement.classList.remove('scale-110', 'text-green-500');
    });

    cityPassCard.addEventListener('mouseenter', () => {
      if (savingsAmountElement) savingsAmountElement.classList.add('scale-110', 'text-green-500');
      if (savingsPercentageElement) savingsPercentageElement.classList.add('scale-110', 'text-green-500');
    });

    cityPassCard.addEventListener('mouseleave', () => {
      if (savingsAmountElement) savingsAmountElement.classList.remove('scale-110', 'text-green-500');
      if (savingsPercentageElement) savingsPercentageElement.classList.remove('scale-110', 'text-green-500');
    });
  }
}

// Track selected option
let selectedOption = null;

/**
 * Initialize purchase options
 */
function initPurchaseOptions(purchaseData) {
  if (!purchaseData || !purchaseData.options || !purchaseData.options.length) return;

  // Set title and subtitle
  const titleElement = document.querySelector('#purchase-title');
  const subtitleElement = document.querySelector('#purchase-subtitle');

  if (titleElement) titleElement.textContent = purchaseData.title;
  if (subtitleElement) subtitleElement.textContent = purchaseData.subtitle;

  // Set button text
  const proceedButton = document.querySelector('#proceed-button');
  if (proceedButton) {
    proceedButton.textContent = purchaseData.buttonText;
    proceedButton.disabled = true;
    proceedButton.addEventListener('click', handleProceedClick);
  }

  // Get all option elements
  const optionElements = document.querySelectorAll('.duration-option');

  // Update each option with data
  optionElements.forEach((optionElement, index) => {
    if (index < purchaseData.options.length) {
      const option = purchaseData.options[index];

      // Get elements
      const durationElement = optionElement.querySelector('.duration-title');
      const priceElement = optionElement.querySelector('.duration-price');
      const priceDetailsElement = optionElement.querySelector('.duration-price-details');
      const featuresList = optionElement.querySelector('.duration-features');
      const popularBadge = optionElement.querySelector('.popular-badge');

      // Update content
      if (durationElement) durationElement.textContent = option.duration;
      if (priceElement) priceElement.textContent = `€${option.price}`;
      if (priceDetailsElement) priceDetailsElement.textContent = option.priceDetails;

      // Update features list
      if (featuresList && option.features && option.features.length) {
        featuresList.innerHTML = '';

        option.features.forEach(feature => {
          const listItem = document.createElement('li');
          listItem.className = 'flex items-start space-x-2 mb-2';
          listItem.innerHTML = `
            <i class="fas fa-check text-green-500 mt-1"></i>
            <span>${feature}</span>
          `;
          featuresList.appendChild(listItem);
        });
      }

      // Show/hide popular badge
      if (popularBadge) {
        popularBadge.classList.toggle('hidden', !option.popular);
      }

      // Set option ID
      optionElement.setAttribute('data-option-id', option.id);

      // Add click event
      optionElement.addEventListener('click', function() {
        // Deselect all options
        const allOptions = document.querySelectorAll('.duration-option');
        allOptions.forEach(option => {
          option.classList.remove('border-primary', 'dark:border-primary-dark');
          option.classList.add('border-gray-200', 'dark:border-dark-border');
          option.setAttribute('aria-checked', 'false');
        });

        // Select the clicked option
        this.classList.remove('border-gray-200', 'dark:border-dark-border');
        this.classList.add('border-primary', 'dark:border-primary-dark');
        this.setAttribute('aria-checked', 'true');

        // Store selected option ID
        selectedOption = this.getAttribute('data-option-id');

        // Enable proceed button
        if (proceedButton) {
          proceedButton.disabled = false;
        }
      });
    }
  });
}

/**
 * Handle proceed button click
 */
function handleProceedClick() {
  if (!selectedOption) {
    alert('Please select a duration option');
    return;
  }

  alert(`You selected the ${selectedOption} option. Proceeding to checkout...`);
}

/**
 * Render FAQ section
 */
function renderFaq(faqData) {
  if (!faqData || !faqData.items || !faqData.items.length) return;

  // Set title
  const titleElement = document.querySelector('#faq-title');
  if (titleElement) titleElement.textContent = faqData.title;

  // Get container
  const faqContainer = document.querySelector('#faq-accordion');
  if (!faqContainer) return;

  // Clear container
  faqContainer.innerHTML = '';

  // Add FAQ items
  faqData.items.forEach((item, index) => {
    const details = document.createElement('details');
    details.id = `faq-${index}`;
    details.className = 'bg-white dark:bg-dark-bg-accent rounded-lg shadow-sm mb-4 group';
    details.setAttribute('data-faq-item', '');

    const summary = document.createElement('summary');
    summary.className = 'p-4 font-medium flex items-center justify-between cursor-pointer list-none';
    summary.innerHTML = `
      <span>${item.question}</span>
      <span class="text-primary transition-transform duration-300 group-open:rotate-180">
        <i class="fas fa-chevron-down"></i>
      </span>
    `;

    const content = document.createElement('div');
    content.className = 'p-4 pt-0 text-gray-600 dark:text-gray-300';
    content.textContent = item.answer;

    details.appendChild(summary);
    details.appendChild(content);
    faqContainer.appendChild(details);

    // Add click event to toggle aria-expanded attribute
    summary.addEventListener('click', function() {
      setTimeout(() => {
        this.setAttribute('aria-expanded', details.open ? 'true' : 'false');
      }, 0);
    });
  });
}

/**
 * Set up scroll progress indicator
 */
function setupScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', function() {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

/**
 * Set up enhanced smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Add a slight delay for visual appeal
        setTimeout(() => {
          // Scroll to element with offset for header
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }, 100);

        // If this is the "Explore Cities" button in the hero section
        if (this.textContent.trim() === 'Explore Cities') {
          // Add a subtle highlight animation to the target section
          targetElement.classList.add('highlight-section');

          // Remove the highlight class after animation completes
          setTimeout(() => {
            targetElement.classList.remove('highlight-section');
          }, 2000);
        }
      }
    });
  });

  // Add scroll indicator click handler
  const scrollIndicator = document.querySelector('#hero-section .animate-bounce');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.querySelector('#city-pass-carousel-section');
      if (nextSection) {
        window.scrollTo({
          top: nextSection.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });

    // Make the scroll indicator clickable
    scrollIndicator.style.cursor = 'pointer';
  }
}

/**
 * Initialize carousel controls
 */
// Variable to store the auto-rotation interval
let carouselAutoRotateInterval;

function initCarouselControls() {
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  const paginationDots = document.querySelectorAll('.pagination-dot');

  // Start auto-rotation
  startCarouselAutoRotation();

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      navigateCarousel('prev');
      resetCarouselAutoRotation(); // Reset auto-rotation timer after manual navigation
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      navigateCarousel('next');
      resetCarouselAutoRotation(); // Reset auto-rotation timer after manual navigation
    });
  }

  paginationDots.forEach(dot => {
    dot.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      navigateCarousel('dot', index);
      resetCarouselAutoRotation(); // Reset auto-rotation timer after manual navigation
    });
  });

  // Add keyboard navigation
  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
      navigateCarousel('prev');
      resetCarouselAutoRotation(); // Reset auto-rotation timer after manual navigation
    } else if (event.key === 'ArrowRight') {
      navigateCarousel('next');
      resetCarouselAutoRotation(); // Reset auto-rotation timer after manual navigation
    }
  });

  // Add swipe support for touch devices
  const carouselStage = document.getElementById('carousel-stage');
  if (carouselStage) {
    let touchStartX = 0;
    let touchEndX = 0;

    carouselStage.addEventListener('touchstart', function(event) {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    carouselStage.addEventListener('touchend', function(event) {
      touchEndX = event.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 50; // Minimum distance for swipe
      if (touchEndX < touchStartX - threshold) {
        // Swipe left
        navigateCarousel('next');
        resetCarouselAutoRotation(); // Reset auto-rotation timer after manual navigation
      } else if (touchEndX > touchStartX + threshold) {
        // Swipe right
        navigateCarousel('prev');
        resetCarouselAutoRotation(); // Reset auto-rotation timer after manual navigation
      }
    }
  }
}

/**
 * Start auto-rotation of the carousel
 */
function startCarouselAutoRotation() {
  // Clear any existing interval
  if (carouselAutoRotateInterval) {
    clearInterval(carouselAutoRotateInterval);
  }

  // Set up auto-rotation (every 5 seconds)
  carouselAutoRotateInterval = setInterval(() => {
    navigateCarousel('next');
  }, 5000);

  console.log('Carousel auto-rotation started');
}

/**
 * Reset the auto-rotation timer (call this after manual navigation)
 */
function resetCarouselAutoRotation() {
  // Clear the existing interval
  if (carouselAutoRotateInterval) {
    clearInterval(carouselAutoRotateInterval);
  }

  // Start a new interval
  startCarouselAutoRotation();
}

/**
 * Navigate the carousel
 */
function navigateCarousel(direction, targetIndex) {
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.pagination-dot');

  if (!cards.length) return;

  // Find current active card
  let currentIndex = 0;
  cards.forEach((card, index) => {
    if (card.classList.contains('active')) {
      currentIndex = index;
    }
  });

  // Calculate new index
  let newIndex = currentIndex;

  if (direction === 'prev') {
    newIndex = (currentIndex - 1 + cards.length) % cards.length;
  } else if (direction === 'next') {
    newIndex = (currentIndex + 1) % cards.length;
  } else if (direction === 'dot' && targetIndex !== undefined) {
    newIndex = targetIndex;
  }

  // Update active card
  cards.forEach(card => card.classList.remove('active', 'prev', 'next'));
  dots.forEach(dot => dot.classList.remove('active'));

  cards[newIndex].classList.add('active');
  dots[newIndex].classList.add('active');

  // Update adjacent cards
  updateAdjacentCards(newIndex);
}

/**
 * Update adjacent cards (prev and next)
 */
function updateAdjacentCards(activeIndex) {
  console.log('Updating adjacent cards for active index:', activeIndex);
  const cards = document.querySelectorAll('.carousel-card');
  console.log('Found cards:', cards.length);

  if (!cards.length) {
    console.error('No carousel cards found');
    return;
  }

  const totalCards = cards.length;
  const prevIndex = (activeIndex - 1 + totalCards) % totalCards;
  const nextIndex = (activeIndex + 1) % totalCards;

  console.log('Card indices:', { prevIndex, activeIndex, nextIndex });

  // Remove all prev/next classes first
  cards.forEach((card, index) => {
    card.classList.remove('prev', 'next');
    console.log(`Card ${index} classes after removal:`, card.className);
  });

  // Add prev/next classes
  cards[prevIndex].classList.add('prev');
  console.log(`Added 'prev' class to card ${prevIndex}:`, cards[prevIndex].className);

  cards[nextIndex].classList.add('next');
  console.log(`Added 'next' class to card ${nextIndex}:`, cards[nextIndex].className);

  // Log the final state of all cards
  cards.forEach((card, index) => {
    console.log(`Final state of card ${index}:`, card.className);
  });
}