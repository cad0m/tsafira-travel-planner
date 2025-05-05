document.addEventListener('DOMContentLoaded', async () => {
  // First, load the partials
  loadPartial('../../partials/header.html', 'header-placeholder');
  loadPartial('../../partials/footer.html', 'footer-placeholder');

  // Load city data
  const cityData = await loadCityData();

  if (cityData) {
    // Initialize components
    initializeHero(cityData);
    initializeFeatures(cityData);
    initializeDurations(cityData);
    initializeSavings(cityData);
    initializeBenefits(cityData);
    initializeUsageSteps(cityData);
    initializeFAQs(cityData);
    initializeItineraries(cityData);
    initializeContactMethods(cityData);
    initializePurchaseBar(cityData);
    initializeSocialProof();
  } else {
    console.error('Failed to load city data');
  }
});

// Load city data from JSON file based on URL parameter
async function loadCityData() {
  try {
    // Get city from URL parameter (e.g., ?city=marrakech)
    const urlParams = new URLSearchParams(window.location.search);
    let cityName = urlParams.get('city');

    // Default to marrakech if no city parameter is provided
    if (!cityName) {
      cityName = 'marrakech';
      console.log('No city parameter found, defaulting to marrakech');
    }

    // Update page title with city name
    document.title = `${cityName.charAt(0).toUpperCase() + cityName.slice(1)} City Pass - Tsafira`;

    // Load the JSON file for the specified city
    // const response = await fetch(`./data/cities/${cityName.toLowerCase()}.json`);
    const response = await fetch(`../../assets/data/cities/${cityName.toLowerCase()}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading city data:', error);
    // Fallback to demo data for development
    return createDemoData();
  }
}

// Create demo data for local development
function createDemoData() {
  return {
    city: {
      name: "Marrakech",
      title: "Marrakech City Pass",
      subtitle: "Your all-in-one ticket for a magical Moroccan adventure",
      heroImage: "https://images.unsplash.com/photo-1530022277152-bc056656a6f5"
    },
    features: [
      {
        name: "Museums & Attractions",
        icon: "landmark",
        description: "Access to 15+ top museums and cultural sites"
      },
      {
        name: "Public Transport",
        icon: "bus",
        description: "Unlimited rides on city buses and trams"
      },
      {
        name: "Guided Tours",
        icon: "map-marked-alt",
        description: "3 guided walking tours included"
      },
      {
        name: "Traditional Hammam",
        icon: "hot-tub",
        description: "One complimentary hammam experience"
      },
      {
        name: "Garden Access",
        icon: "tree",
        description: "Entry to Majorelle Garden and other famous gardens"
      },
      {
        name: "Shopping Discounts",
        icon: "tags",
        description: "10-15% off at participating souk merchants"
      }
    ],
    durations: [
      {
        id: "2day",
        name: "2-Day Pass",
        price: 349,
        description: "Perfect for weekend trips",
        popular: false
      },
      {
        id: "4day",
        name: "4-Day Pass",
        price: 549,
        description: "Our most popular option",
        popular: true
      },
      {
        id: "7day",
        name: "7-Day Pass",
        price: 849,
        description: "Best value for longer stays",
        popular: false
      }
    ],
    attractions: [
      { name: "Bahia Palace", price: 70 },
      { name: "Majorelle Garden", price: 150 },
      { name: "Saadian Tombs", price: 70 },
      { name: "Koutoubia Mosque", price: 0 },
      { name: "El Badi Palace", price: 70 },
      { name: "Marrakech Museum", price: 50 },
      { name: "Traditional Hammam", price: 350 },
      { name: "Menara Gardens", price: 30 },
      { name: "Day Trip to Atlas Mountains", price: 500 },
      { name: "Guided Souks Tour", price: 200 }
    ],
    benefits: [
      {
        title: "Skip-the-Line Access",
        icon: "clock",
        description: "Save time with priority entry at most attractions."
      },
      {
        title: "Unlimited Public Transport",
        icon: "bus",
        description: "Hop on and off buses and trams as much as you want."
      },
      {
        title: "Guided Walking Tours",
        icon: "walking",
        description: "Join any of our daily walking tours led by expert guides."
      },
      {
        title: "Mobile Pass Option",
        icon: "mobile-alt",
        description: "Keep your pass on your smartphone - no need to print."
      },
      {
        title: "Exclusive Discounts",
        icon: "percentage",
        description: "Special discounts at participating restaurants and shops."
      }
    ],
    usageSteps: [
      {
        title: "Purchase & Download",
        description: "Buy your pass online and instantly download the PDF to your device or access it through our mobile app for easy access."
      },
      {
        title: "Activation",
        description: "Your pass activates automatically the first time you use it at any attraction or on public transport. The countdown begins at that moment."
      },
      {
        title: "Show & Scan",
        description: "Present your pass (digital or printed) at each attraction entrance or to bus drivers. They'll scan the QR code for validation."
      },
      {
        title: "Enjoy!",
        description: "Make the most of your pass by visiting as many attractions as you can during your chosen duration. No additional payments needed!"
      }
    ],
    faqs: [
      {
        question: "When does my pass expire?",
        answer: "Your pass is valid for consecutive days from first use."
      },
      {
        question: "Can I visit attractions multiple times?",
        answer: "Most attractions allow one-time entry with the pass."
      },
      {
        question: "What happens if I don't use all the days?",
        answer: "Unused days are not refundable."
      },
      {
        question: "Can I share my pass with friends?",
        answer: "No, each pass is valid for one person only."
      },
      {
        question: "Is there a mobile app for the pass?",
        answer: "Yes, you can download our app to store your pass digitally."
      }
    ],
    itineraries: [
      {
        title: "Historic Medina Experience",
        thumbnail: "https://images.unsplash.com/photo-1539020140153-e8c51d934144",
        description: "Explore the ancient heart of Marrakech",
        url: "/itineraries/historic-medina"
      },
      {
        title: "Gardens & Palaces",
        thumbnail: "https://images.unsplash.com/photo-1565689478170-6624de957899",
        description: "Discover beautiful green spaces and royal residences",
        url: "/itineraries/gardens-palaces"
      },
      {
        title: "Complete Marrakech",
        thumbnail: "https://images.unsplash.com/photo-1562874724-bc010262804c",
        description: "Perfect 4-day introduction to Marrakech",
        url: "/itineraries/complete-marrakech"
      }
    ],
    contactMethods: [
      {
        type: "chat",
        icon: "comments",
        title: "Live Chat",
        description: "Get instant answers from our team",
        value: "#chat"
      },
      {
        type: "email",
        icon: "envelope",
        title: "Email Support",
        description: "We usually respond within 24 hours",
        value: "support@tsafira.com"
      },
      {
        type: "phone",
        icon: "phone",
        title: "Call Us",
        description: "Available 9am-6pm (GMT+1)",
        value: "+212 522 123 456"
      }
    ]
  };
}

// Initialize hero section
function initializeHero(data) {
  const hero = document.getElementById('hero-banner');
  if (hero) {
    // Fix the image path - handle both absolute and relative paths
    let heroImagePath = data.city.heroImage;

    // If the path starts with "../../../assets/" (new format)
    if (heroImagePath.startsWith('../../../assets/')) {
      // Path is already correct for the new structure
      heroImagePath = heroImagePath;
    }
    // If the path starts with "../" (relative path going up one directory)
    else if (heroImagePath.startsWith('../')) {
      // For paths like "../image/hero/tangier.png", we need to use "../../assets/image/hero/tangier.png"
      heroImagePath = '../../assets' + heroImagePath.substring(2);
    }
    // If the path starts with "./" (relative path in current directory)
    else if (heroImagePath.startsWith('./')) {
      heroImagePath = heroImagePath.substring(2);
    }
    // If the path starts with "/" (root-relative path)
    else if (heroImagePath.startsWith('/')) {
      heroImagePath = heroImagePath.substring(1);
    }

    // Set the background image with the corrected path
    hero.style.backgroundImage = `url(${heroImagePath})`;

    // For debugging
    console.log('Hero image path:', heroImagePath);

    const cityTitle = document.getElementById('city-title');
    if (cityTitle) cityTitle.textContent = data.city.title;

    const citySubtitle = document.getElementById('city-subtitle');
    if (citySubtitle) citySubtitle.textContent = data.city.subtitle;
  }
}

// Initialize features grid and city card image
function initializeFeatures(data) {
  // Initialize features grid
  const grid = document.getElementById('features-grid');
  if (grid && data.features) {
    // Define feature icons with fallbacks
    const featureIcons = {
      'Museums & Attractions': 'landmark',
      'Public Transport': 'bus',
      'Guided Tours': 'map-marked-alt',
      'Traditional Hammam': 'hot-tub',
      'Garden Access': 'tree',
      'Shopping Discounts': 'tags'
    };

    // Create feature cards with animation delay
    grid.innerHTML = data.features.map((feature, index) => {
      // Get icon or use fallback
      const icon = feature.icon || featureIcons[feature.name] || 'star';

      // Calculate animation delay
      const delay = index * 0.1;

      return `
        <div class="feature-card" style="animation-delay: ${delay}s;" data-aos="fade-up">
          <i class="fas fa-${icon}"></i>
          <h3>${feature.name}</h3>
          <p>${feature.description}</p>
        </div>
      `;
    }).join('');

    // Add intersection observer to animate cards when they come into view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      // Observe all feature cards
      document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
      });
    }
  }

  // Initialize city card image with flip functionality
  const cityCardImage = document.getElementById('city-card-image');
  if (cityCardImage) {
    // Get city name from URL parameter or data
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('city') || (data.city ? data.city.name.toLowerCase() : 'marrakech');

    // Clear any existing content
    cityCardImage.innerHTML = '';

    // Create front face
    const frontFace = document.createElement('div');
    frontFace.className = 'city-card-face city-card-front';

    // Create back face
    const backFace = document.createElement('div');
    backFace.className = 'city-card-face city-card-back';

    // Create front image
    const frontImg = document.createElement('img');
    frontImg.src = `../../assets/image/${cityName}.png`;
    frontImg.alt = `${cityName.charAt(0).toUpperCase() + cityName.slice(1)} City Pass`;
    frontImg.className = 'city-card-img';

    // For debugging
    console.log('Front image path:', frontImg.src);

    // Create back image (same for all cards)
    const backImg = document.createElement('img');
    backImg.src = '../../assets/image/back.png';
    backImg.alt = 'City Pass Back';
    backImg.className = 'city-card-img';

    // For debugging
    console.log('Back image path:', backImg.src);

    // Add flip instructions
    const instructions = document.createElement('div');
    instructions.className = 'flip-instructions';
    instructions.innerHTML = '<i class="fas fa-sync-alt"></i> Click to flip card';

    // Add loading animation
    frontImg.style.opacity = '0';
    frontImg.style.transform = 'translateY(20px)';
    backImg.style.opacity = '0';

    // Add elements to DOM
    frontFace.appendChild(frontImg);
    backFace.appendChild(backImg);
    cityCardImage.appendChild(frontFace);
    cityCardImage.appendChild(backFace);
    cityCardImage.appendChild(instructions);

    // Animate in after images load
    frontImg.onload = function() {
      setTimeout(() => {
        frontImg.style.opacity = '1';
        frontImg.style.transform = 'translateY(0)';
      }, 300);
    };

    backImg.onload = function() {
      setTimeout(() => {
        backImg.style.opacity = '1';
      }, 300);
    };

    // Add 3D tilt effect on mouse move (only when not flipped)
    cityCardImage.addEventListener('mousemove', function(e) {
      if (this.classList.contains('flipped')) return;

      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX; // -1 to 1
      const deltaY = (y - centerY) / centerY; // -1 to 1

      // Apply rotation based on mouse position
      this.style.transform = `rotateY(${-deltaX * 10}deg) rotateX(${deltaY * 10}deg)`;
    });

    // Reset rotation when mouse leaves
    cityCardImage.addEventListener('mouseleave', function() {
      if (!this.classList.contains('flipped')) {
        this.style.transform = 'rotateY(-15deg) rotateX(5deg)';
      }
    });

    // Add click event to flip the card
    cityCardImage.addEventListener('click', function() {
      this.classList.toggle('flipped');

      // Reset any mouse-based transforms when flipped
      if (this.classList.contains('flipped')) {
        this.style.transform = 'rotateY(165deg)';
      } else {
        this.style.transform = 'rotateY(-15deg) rotateX(5deg)';
      }
    });
  }
}

// Initialize duration selection
function initializeDurations(data) {
  const container = document.getElementById('duration-cards');
  if (container && data.durations) {
    container.innerHTML = data.durations.map(duration => `
      <div class="duration-card ${duration.popular ? 'popular' : ''}" data-id="${duration.id}" data-price="${duration.price}" data-name="${duration.name}">
        ${duration.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
        <h3 class="text-xl font-bold mb-2">${duration.name}</h3>
        <p class="text-3xl font-bold mb-4">€${duration.price}</p>
        <p class="text-text-muted mb-4">${duration.description}</p>
        <button class="select-duration-btn bg-primary text-white px-6 py-2 rounded-full">Select</button>
      </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.duration-card').forEach(card => {
      card.addEventListener('click', () => selectDuration(card.dataset.id, card.dataset.name, card.dataset.price));
    });

    // Select the "popular" option by default
    const popularCard = container.querySelector('.duration-card.popular');
    if (popularCard) {
      selectDuration(popularCard.dataset.id, popularCard.dataset.name, popularCard.dataset.price);
    }
  }
}

// Initialize savings calculator
function initializeSavings(data) {
  const container = document.getElementById('attractions-list');
  if (container && data.attractions) {
    // Divide attractions into two columns
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

    data.attractions.forEach(attraction => {
      html += `
        <div class="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg hover:bg-bg-accent transition-colors group">
          <label class="flex items-center cursor-pointer flex-1">
            <input type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded mr-3 attraction-checkbox" data-price="${attraction.price}" data-name="${attraction.name}">
            <span class="font-medium group-hover:text-primary transition-colors">${attraction.name}</span>
          </label>
          <span class="font-bold text-white px-3 py-1 bg-primary rounded-full">€${attraction.price}</span>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;

    // Set up the selected pass display
    const defaultDuration = data.durations.find(d => d.popular) || data.durations[0];
    if (defaultDuration) {
      const passDisplay = document.getElementById('selected-pass-display');
      const passPrice = document.getElementById('selected-pass-price');
      const previewPassPrice = document.getElementById('pass-price');

      if (passDisplay) passDisplay.textContent = defaultDuration.name;
      if (passPrice) passPrice.textContent = `€${defaultDuration.price}`;
      if (previewPassPrice) previewPassPrice.textContent = `€${defaultDuration.price}`;
    }

    // Set up tab navigation
    setupTabNavigation();

    // Set up select/clear all buttons
    setupSelectionButtons();

    // Add change handlers
    container.querySelectorAll('.attraction-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        updateSavings();
        animateBadge();
      });
    });

    // Initial calculation
    updateSavings();
  }
}

// Set up tab navigation
function setupTabNavigation() {
  const tabAttractions = document.getElementById('tab-attractions');
  const tabResults = document.getElementById('tab-results');
  const contentAttractions = document.getElementById('content-attractions');
  const contentResults = document.getElementById('content-results');
  const viewResultsBtn = document.getElementById('view-results-btn');
  const backToAttractionsBtn = document.getElementById('back-to-attractions-btn');

  if (tabAttractions && tabResults && contentAttractions && contentResults) {
    // Tab click handlers
    tabAttractions.addEventListener('click', function() {
      switchTab('attractions');
    });

    tabResults.addEventListener('click', function() {
      switchTab('results');
    });

    // Button handlers
    if (viewResultsBtn) {
      viewResultsBtn.addEventListener('click', function() {
        switchTab('results');
      });
    }

    if (backToAttractionsBtn) {
      backToAttractionsBtn.addEventListener('click', function() {
        switchTab('attractions');
      });
    }
  }
}

// Switch between tabs
function switchTab(tabName) {
  const tabs = document.querySelectorAll('.savings-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.id === `tab-${tabName}`);
  });

  panes.forEach(pane => {
    pane.classList.toggle('active', pane.id === `content-${tabName}`);
  });

  // If switching to results, animate the savings counter
  if (tabName === 'results') {
    const savingsCounter = document.getElementById('savings-amount');
    if (savingsCounter) {
      savingsCounter.classList.add('animate');
      setTimeout(() => {
        savingsCounter.classList.remove('animate');
      }, 1000);
    }
  }
}

// Set up select/clear all buttons
function setupSelectionButtons() {
  const selectAllBtn = document.getElementById('select-all-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', function() {
      document.querySelectorAll('.attraction-checkbox').forEach(checkbox => {
        checkbox.checked = true;
      });
      updateSavings();
      animateBadge();
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function() {
      document.querySelectorAll('.attraction-checkbox').forEach(checkbox => {
        checkbox.checked = false;
      });
      updateSavings();
      animateBadge();
    });
  }
}

// Animate the attractions badge
function animateBadge() {
  const badge = document.getElementById('attractions-badge');
  if (badge) {
    badge.classList.add('pulse');
    setTimeout(() => {
      badge.classList.remove('pulse');
    }, 500);
  }
}

// Initialize benefits with modern card design
function initializeBenefits(data) {
  const container = document.getElementById('benefits-container');
  if (container && data.benefits) {
    // Define additional features for each benefit type
    const benefitFeatures = {
      'Skip-the-Line Access': [
        'Priority entry at all major attractions',
        'Dedicated fast-track lanes where available',
        'No waiting in long ticket queues'
      ],
      'Unlimited Public Transport': [
        'All city buses and trams included',
        'Unlimited rides during pass validity',
        'Access to tourist routes and regular lines'
      ],
      'Guided Walking Tours': [
        'Expert local guides with insider knowledge',
        'Multiple daily departures',
        'Available in several languages'
      ],
      'Mobile Pass Option': [
        'Digital pass on your smartphone',
        'Works offline - no internet needed',
        'Easy to access and show at attractions'
      ],
      'Exclusive Discounts': [
        'Special rates at partner restaurants',
        'Shopping discounts at select stores',
        'Deals on additional experiences'
      ]
    };

    // Define subtitles for each benefit type
    const benefitSubtitles = {
      'Skip-the-Line Access': 'Save valuable vacation time',
      'Unlimited Public Transport': 'Explore the city with ease',
      'Guided Walking Tours': 'Discover hidden gems',
      'Mobile Pass Option': 'Convenient digital access',
      'Exclusive Discounts': 'Extra savings throughout the city'
    };

    container.innerHTML = data.benefits.map((benefit, index) => {
      // Get features for this benefit type or use default
      const features = benefitFeatures[benefit.title] || [
        'Available with all pass options',
        'No additional fees required',
        'Easy to use during your visit'
      ];

      // Get subtitle for this benefit type or use default
      const subtitle = benefitSubtitles[benefit.title] || 'Included with your city pass';

      return `
        <div class="benefit-card" style="--benefit-index: ${index}">
          <div class="benefit-header">
            <div class="benefit-icon-wrapper">
              <i class="fas fa-${benefit.icon} benefit-icon"></i>
            </div>
            <div class="benefit-title-wrapper">
              <h3 class="benefit-title">${benefit.title}</h3>
              <p class="benefit-subtitle">${subtitle}</p>
            </div>
          </div>
          <div class="benefit-content">
            <p class="benefit-description">${benefit.description}</p>
            <ul class="benefit-features">
              ${features.map(feature => `
                <li class="benefit-feature">
                  <i class="fas fa-check-circle"></i>
                  <span>${feature}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
    }).join('');

    // Add intersection observer to trigger animations when benefits come into view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Reset the animation by removing and adding the element
            const benefitCard = entry.target;
            benefitCard.style.animation = 'none';
            benefitCard.offsetHeight; // Trigger reflow
            benefitCard.style.animation = null;

            // Stop observing after animation is triggered
            observer.unobserve(benefitCard);
          }
        });
      }, { threshold: 0.2 });

      // Observe all benefit cards
      document.querySelectorAll('.benefit-card').forEach(card => {
        observer.observe(card);
      });
    }
  }
}

// Initialize usage steps with improved design
function initializeUsageSteps(data) {
  const container = document.getElementById('usage-steps');
  if (container && data.usageSteps) {
    // Define icons for each step
    const stepIcons = [
      'shopping-cart',  // Purchase & Download
      'play-circle',    // Activation
      'qrcode',         // Show & Scan
      'smile-beam'      // Enjoy!
    ];

    container.innerHTML = data.usageSteps.map((step, index) => `
      <div class="step-item" style="--step-index: ${index}">
        <div class="step-number">${index + 1}</div>
        <div class="step-icon">
          <i class="fas fa-${stepIcons[index] || 'check-circle'}"></i>
        </div>
        <h3 class="step-title">Step ${index + 1}: ${step.title}</h3>
        <p class="step-description">${step.description}</p>
      </div>
    `).join('');

    // Add intersection observer to trigger animations when steps come into view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Reset the animation by removing and adding the element
            const stepItem = entry.target;
            stepItem.style.animation = 'none';
            stepItem.offsetHeight; // Trigger reflow
            stepItem.style.animation = null;

            // Stop observing after animation is triggered
            observer.unobserve(stepItem);
          }
        });
      }, { threshold: 0.2 });

      // Observe all step items
      document.querySelectorAll('.step-item').forEach(item => {
        observer.observe(item);
      });
    }
  }
}

// Initialize FAQs
function initializeFAQs(data) {
  const container = document.getElementById('faq-container');
  if (container && data.faqs) {
    container.innerHTML = data.faqs.map(faq => `
      <details class="mb-4 bg-bg-alt rounded-lg overflow-hidden">
        <summary class="cursor-pointer p-4 font-semibold">
          ${faq.question}
        </summary>
        <div class="p-4 bg-bg-accent">
          <p>${faq.answer}</p>
        </div>
      </details>
    `).join('');
  }
}

// Initialize itineraries
function initializeItineraries(data) {
  const container = document.getElementById('itinerary-cards');
  if (container && data.itineraries) {
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${data.itineraries.map(itinerary => {
          // Fix the image path - handle both absolute and relative paths
          let thumbnailPath = itinerary.thumbnail;

          // If the path starts with "/" (root-relative path)
          if (thumbnailPath.startsWith('/')) {
            // For paths like "/images/itinerary-xyz.jpg", we need to use "../../assets/images/itinerary-xyz.jpg"
            thumbnailPath = '../../assets' + thumbnailPath;
          }
          // If the path starts with "../../../assets/" (new format)
          else if (thumbnailPath.startsWith('../../../assets/')) {
            // Path is already correct for the new structure
            thumbnailPath = thumbnailPath;
          }
          // If the path starts with "../" (relative path going up one directory)
          else if (thumbnailPath.startsWith('../')) {
            // For paths like "../images/itinerary-xyz.jpg", we need to use "../../assets/images/itinerary-xyz.jpg"
            thumbnailPath = '../../assets' + thumbnailPath.substring(2);
          }
          // If the path starts with "./" (relative path in current directory)
          else if (thumbnailPath.startsWith('./')) {
            thumbnailPath = thumbnailPath.substring(2);
          }
          // If the path starts with "/" (root-relative path)
          else if (thumbnailPath.startsWith('/')) {
            // Remove the leading slash
            thumbnailPath = thumbnailPath.substring(1);
          }

          // For debugging
          console.log('Itinerary thumbnail path:', thumbnailPath);

          return `
            <div class="itinerary-card bg-bg-alt rounded-lg overflow-hidden">
              <div class="h-48 overflow-hidden">
                <img src="${thumbnailPath}" alt="${itinerary.title}" class="w-full h-full object-cover">
              </div>
              <div class="p-4">
                <h3 class="text-xl font-bold mb-2">${itinerary.title}</h3>
                <p class="text-text-muted mb-4">${itinerary.description}</p>
                <a href="${itinerary.url}" class="text-primary hover:underline">View Itinerary →</a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

// Initialize contact methods with improved design
function initializeContactMethods(data) {
  const container = document.getElementById('contact-methods');
  if (container && data.contactMethods) {
    // Define additional icons for the contact buttons
    const buttonIcons = {
      'chat': 'comment-dots',
      'email': 'paper-plane',
      'phone': 'phone-alt'
    };

    // Define button text for each contact method
    const buttonText = {
      'chat': 'Start Chat',
      'email': 'Send Email',
      'phone': 'Call Now'
    };

    container.innerHTML = data.contactMethods.map((method, index) => `
      <div class="contact-method" style="--contact-index: ${index}">
        <div class="contact-icon-wrapper">
          <i class="fas fa-${method.icon} contact-icon"></i>
        </div>
        <h3 class="contact-title">${method.title}</h3>
        <p class="contact-description">${method.description}</p>
        <a href="${method.type === 'email' ? 'mailto:' : method.type === 'phone' ? 'tel:' : './contact.html'}${method.type === 'chat' ? '' : method.value}"
           class="contact-value">
          ${buttonText[method.type] || 'Contact Us'}
          <i class="fas fa-${buttonIcons[method.type] || 'arrow-right'} ml-2"></i>
        </a>
      </div>
    `).join('');

    // Add intersection observer to trigger animations when contact methods come into view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Reset the animation by removing and adding the element
            const contactItem = entry.target;
            contactItem.style.animation = 'none';
            contactItem.offsetHeight; // Trigger reflow
            contactItem.style.animation = null;

            // Stop observing after animation is triggered
            observer.unobserve(contactItem);
          }
        });
      }, { threshold: 0.2 });

      // Observe all contact method items
      document.querySelectorAll('.contact-method').forEach(item => {
        observer.observe(item);
      });
    }
  }
}

// Initialize sticky purchase bar
function initializePurchaseBar(data) {
  const bar = document.getElementById('purchase-bar');
  if (bar) {
    // Set initial values
    const defaultDuration = data.durations.find(d => d.popular) || data.durations[0];
    if (defaultDuration) {
      document.getElementById('sticky-duration').textContent = defaultDuration.name;
      document.getElementById('sticky-price').textContent = `€${defaultDuration.price}`;
    }

    // Show/hide on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > lastScroll && currentScroll > 300) {
        bar.classList.add('visible');
      } else if (currentScroll < lastScroll || currentScroll < 200) {
        bar.classList.remove('visible');
      }

      lastScroll = currentScroll;
    });

    // Add purchase button handler
    const purchaseButton = bar.querySelector('button');
    if (purchaseButton) {
      purchaseButton.addEventListener('click', () => {
        const selectedDuration = document.querySelector('.duration-card.active');
        if (selectedDuration) {
          alert(`Processing purchase for ${selectedDuration.dataset.name} at €${selectedDuration.dataset.price}`);
          // Here you would redirect to checkout or open a modal
        } else {
          alert('Please select a duration first');
        }
      });
    }
  }
}

// Initialize social proof & urgency section
function initializeSocialProof() {
  // Set recent buyers
  const recentBuyersCount = document.getElementById('recent-buyers-count');
  if (recentBuyersCount) {
    // Random number between 30 and 60
    const randomBuyers = Math.floor(Math.random() * 31) + 30;
    recentBuyersCount.textContent = randomBuyers;
  }

  // Set countdown timer
  startCountdown();
}

// Start countdown timer
function startCountdown() {
  // 24 hours from now
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 24);

  function updateCountdown() {
    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) {
      // Reset countdown when it reaches zero
      endTime.setHours(endTime.getHours() + 24);
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = String(days).padStart(2, '0');
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
  }

  // Update immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// This function has been removed as we're now using the theme functionality from ui.js

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

// Helper function to update savings calculation
function updateSavings() {
  const selectedCheckboxes = document.querySelectorAll('.attraction-checkbox:checked');
  const selectedPrices = Array.from(selectedCheckboxes)
    .map(checkbox => parseFloat(checkbox.dataset.price));

  const totalWithout = selectedPrices.reduce((sum, price) => sum + price, 0);

  // Get the selected pass price
  const selectedCard = document.querySelector('.duration-card.active');
  const passPrice = selectedCard ? parseFloat(selectedCard.dataset.price) : 549; // Default to 4-day price

  // Calculate savings
  const savings = Math.max(0, totalWithout - passPrice);

  // Update all count displays
  const selectedCount = document.getElementById('selected-count');
  const attractionsBadge = document.getElementById('attractions-badge');
  if (selectedCount) {
    selectedCount.textContent = selectedCheckboxes.length;
  }
  if (attractionsBadge) {
    attractionsBadge.textContent = selectedCheckboxes.length;
  }

  // Update total value display
  const totalValue = document.getElementById('total-value');
  if (totalValue) {
    totalValue.textContent = `€${totalWithout}`;
  }

  // Update preview savings
  const previewSavings = document.getElementById('preview-savings');
  if (previewSavings) {
    previewSavings.textContent = `€${savings}`;
  }

  // Update main savings amount with animation
  const savingsAmount = document.getElementById('savings-amount');
  if (savingsAmount) {
    // Update the value
    savingsAmount.textContent = `€${savings}`;
  }

  // Update savings message
  const savingsMessage = document.querySelector('.savings-message');
  if (savingsMessage) {
    if (selectedCheckboxes.length === 0) {
      savingsMessage.textContent = 'Select attractions to calculate your potential savings';
    } else if (savings <= 0) {
      savingsMessage.textContent = 'Add more attractions to start seeing savings';
    } else if (savings < 100) {
      savingsMessage.innerHTML = `<span class="text-green-500 font-medium">Good start!</span> You're saving €${savings} with the pass.`;
    } else if (savings < 200) {
      savingsMessage.innerHTML = `<span class="text-green-500 font-medium">Great choice!</span> You're saving €${savings} with the pass.`;
    } else {
      savingsMessage.innerHTML = `<span class="text-green-500 font-medium">Amazing value!</span> You're saving €${savings} with the pass!`;
    }
  }

  // Update chart bars with animation
  const withPassBar = document.querySelector('.bar.with-pass');
  const withoutPassBar = document.querySelector('.bar.without-pass');

  if (withPassBar && withoutPassBar) {
    // Get the chart container height
    const chartArea = document.querySelector('.chart-area');
    const chartHeight = chartArea ? chartArea.clientHeight - 20 : 200; // Subtract padding

    // Fixed y-axis max value to match the chart labels
    const yAxisMax = 1000; // This matches the y-axis labels in the HTML

    // Calculate bar heights proportionally based on the y-axis scale
    // Use percentage heights for better browser rendering
    const withPassPercentage = passPrice > 0 ? Math.max((passPrice / yAxisMax) * 100, 0.5) : 0;
    const withoutPassPercentage = totalWithout > 0 ? Math.max((totalWithout / yAxisMax) * 100, 0.5) : 0;

    console.log(`Chart height: ${chartHeight}px, Y-axis max: €${yAxisMax}`);
    console.log(`Pass price: €${passPrice}, percentage: ${withPassPercentage}%`);
    console.log(`Without pass: €${totalWithout}, percentage: ${withoutPassPercentage}%`);

    // Apply percentage height with animation
    withPassBar.style.height = `${withPassPercentage}%`;
    withoutPassBar.style.height = `${withoutPassPercentage}%`;

    // Update bar values
    const withPassValue = withPassBar.querySelector('.bar-value');
    const withoutPassValue = withoutPassBar.querySelector('.bar-value');

    if (withPassValue) {
      withPassValue.textContent = `€${passPrice}`;
      withPassValue.style.opacity = passPrice > 0 ? 1 : 0;
    }

    if (withoutPassValue) {
      withoutPassValue.textContent = `€${totalWithout}`;
      withoutPassValue.style.opacity = totalWithout > 0 ? 1 : 0;
    }

    // Add highlight class to the better option
    const isSaving = totalWithout > passPrice;
    withPassBar.classList.toggle('ring-2', isSaving && passPrice > 0);
    withPassBar.classList.toggle('ring-offset-2', isSaving && passPrice > 0);
    withoutPassBar.classList.toggle('ring-2', !isSaving && totalWithout > 0);
    withoutPassBar.classList.toggle('ring-offset-2', !isSaving && totalWithout > 0);

    // Add shadow effect based on height
    withPassBar.style.boxShadow = passPrice > 0 ?
      `0 ${Math.min(withPassPercentage/5, 20)}px 30px rgba(var(--color-primary-rgb), 0.2)` : 'none';
    withoutPassBar.style.boxShadow = totalWithout > 0 ?
      `0 ${Math.min(withoutPassPercentage/5, 20)}px 30px rgba(var(--color-secondary-rgb), 0.2)` : 'none';

    // Add a data attribute to store the actual value for debugging
    withPassBar.setAttribute('data-value', passPrice);
    withPassBar.setAttribute('data-percentage', withPassPercentage);
    withoutPassBar.setAttribute('data-value', totalWithout);
    withoutPassBar.setAttribute('data-percentage', withoutPassPercentage);

    // Add a transition class to make the animation more noticeable
    withPassBar.classList.add('animating');
    withoutPassBar.classList.add('animating');

    // Remove the animation class after the transition completes
    setTimeout(() => {
      withPassBar.classList.remove('animating');
      withoutPassBar.classList.remove('animating');
    }, 1000);
  }

  // Update selected pass displays
  const selectedPassDisplay = document.getElementById('selected-pass-display');
  const selectedPassPrice = document.getElementById('selected-pass-price');
  const passDisplayPrice = document.getElementById('pass-price');

  if (selectedCard) {
    if (selectedPassDisplay) {
      selectedPassDisplay.textContent = selectedCard.dataset.name;
    }
    if (selectedPassPrice) {
      selectedPassPrice.textContent = `€${selectedCard.dataset.price}`;
    }
    if (passDisplayPrice) {
      passDisplayPrice.textContent = `€${selectedCard.dataset.price}`;
    }
  }

  // Update view results button text based on savings
  const viewResultsBtn = document.getElementById('view-results-btn');
  if (viewResultsBtn) {
    if (savings > 0) {
      viewResultsBtn.innerHTML = `<i class="fas fa-chart-pie mr-2"></i> View Your €${savings} Savings`;
    } else {
      viewResultsBtn.innerHTML = `<i class="fas fa-chart-pie mr-2"></i> View Detailed Results`;
    }
  }
}

// Helper function to select duration
function selectDuration(id, name, price) {
  // Update duration cards
  document.querySelectorAll('.duration-card').forEach(card => {
    card.classList.toggle('active', card.dataset.id === id);
  });

  // Update sticky purchase bar
  const stickyDuration = document.getElementById('sticky-duration');
  const stickyPrice = document.getElementById('sticky-price');

  if (stickyDuration) stickyDuration.textContent = name;
  if (stickyPrice) stickyPrice.textContent = `€${price}`;

  // Update all pass displays
  const selectedPassDisplay = document.getElementById('selected-pass-display');
  const selectedPassPrice = document.getElementById('selected-pass-price');
  const passDisplayPrice = document.getElementById('pass-price');

  if (selectedPassDisplay) {
    selectedPassDisplay.textContent = name;

    // Add animation
    selectedPassDisplay.classList.add('animate-pulse');
    setTimeout(() => {
      selectedPassDisplay.classList.remove('animate-pulse');
    }, 500);
  }

  if (selectedPassPrice) {
    selectedPassPrice.textContent = `€${price}`;
  }

  if (passDisplayPrice) {
    passDisplayPrice.textContent = `€${price}`;

    // Add animation
    passDisplayPrice.classList.add('animate-pulse');
    setTimeout(() => {
      passDisplayPrice.classList.remove('animate-pulse');
    }, 500);
  }

  // Update savings calculation
  updateSavings();

  // Show a notification that the pass has changed
  showPassChangeNotification(name, price);
}

// Show a notification when the pass changes
function showPassChangeNotification(name, price) {
  // Check if notification container exists, create if not
  let notificationContainer = document.querySelector('.notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container fixed bottom-4 right-4 z-50';
    document.body.appendChild(notificationContainer);
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-l-4 border-primary mb-3 transform translate-x-full opacity-0 transition-all duration-500 flex items-center';
  notification.innerHTML = `
    <div class="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-3">
      <i class="fas fa-ticket-alt text-primary"></i>
    </div>
    <div>
      <div class="font-bold">Pass Changed</div>
      <div class="text-sm text-text-muted">Selected ${name} for €${price}</div>
    </div>
    <button class="ml-4 text-text-muted hover:text-primary">
      <i class="fas fa-times"></i>
    </button>
  `;

  // Add to container
  notificationContainer.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full', 'opacity-0');
  }, 10);

  // Add close button handler
  const closeButton = notification.querySelector('button');
  closeButton.addEventListener('click', () => {
    notification.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      notification.remove();
    }, 500);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 500);
    }
  }, 5000);
}