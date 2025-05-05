import { apiGet } from '../core/api.js';
import { loadPartial } from '../core/loader.js';
import { initUI } from '../ui.js';

document.addEventListener('DOMContentLoaded', async function() {
  try {
    console.log('City page initialized');

    // Initialize UI components
    initUI();

    // Load header and footer
    await loadPartial('../partials/header.html', 'header-placeholder');
    await loadPartial('../partials/footer.html', 'footer-placeholder');

    // Get city ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cityId = urlParams.get('id');

    if (!cityId) {
      showError('City not found. Please select a valid destination.');
      return;
    }

    // Fetch city data from JSON
    const allCities = await apiGet('../assets/data/cities.json');
    const city = allCities.find(c => c.id === cityId);

    if (!city) {
      showError('City not found. Please select a valid destination.');
      return;
    }

    // Populate the page with city data
    populateCityData(city);

    // Populate city pass card section
    populateCityPassCard(city);

    // Initialize duration option selection
    initDurationOptions();

    // Hide loading state and show content
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('city-content').classList.remove('hidden');

  } catch (error) {
    console.error('Error loading city data:', error);
    showError('Failed to load city data. Please try again later.');
  }
});

/**
 * Shows an error message on the page
 * @param {string} message - Error message to display
 */
function showError(message) {
  const loadingState = document.getElementById('loading-state');
  loadingState.innerHTML = `
    <div class="text-center">
      <p class="text-red-600 dark:text-red-400 text-xl">${message}</p>
      <a href="/pages/destinations.html" class="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">
        Back to Destinations
      </a>
    </div>
  `;
}

/**
 * Populates all sections of the page with city data
 * @param {Object} city - City data object
 */
function populateCityData(city) {
  // Set page title
  document.title = `${city.name} - Morocco Travel`;

  // Hero section
  document.getElementById('hero-image').src = city.heroImage;
  document.getElementById('hero-image').alt = `${city.name} panorama`;
  document.getElementById('city-name').textContent = city.name;
  document.getElementById('city-short-description').textContent = city.shortDescription;

  // Quick facts
  document.getElementById('best-time').textContent = city.quickFacts.bestTimeToVisit;
  document.getElementById('budget').textContent = city.quickFacts.averageBudget;
  document.getElementById('recommended-stay').textContent = city.quickFacts.recommendedStay;

  // About section
  document.getElementById('about-city-name').textContent = city.name;
  document.getElementById('about-description').textContent = city.about;

  // Highlights
  const highlightsContainer = document.getElementById('highlights-container');
  highlightsContainer.innerHTML = '';

  city.highlights.forEach(highlight => {
    const highlightEl = document.createElement('div');
    highlightEl.className = 'flex items-start space-x-3';
    highlightEl.innerHTML = `
      <i class="fa-solid fa-${highlight.icon} text-2xl text-orange-600 dark:text-orange-500"></i>
      <div>
        <h3 class="font-semibold dark:text-gray-100">${highlight.title}</h3>
        <p class="text-gray-600 dark:text-gray-300">${highlight.description}</p>
      </div>
    `;
    highlightsContainer.appendChild(highlightEl);
  });

  // Gallery images
  const galleryContainer = document.getElementById('gallery-container');
  galleryContainer.innerHTML = '';

  city.galleryImages.forEach(imgUrl => {
    const imgEl = document.createElement('img');
    imgEl.className = 'w-full h-48 object-cover rounded-lg';
    imgEl.src = imgUrl;
    imgEl.alt = `${city.name} gallery image`;
    galleryContainer.appendChild(imgEl);
  });

  // Itinerary
  const itineraryContainer = document.getElementById('itinerary-container');
  itineraryContainer.innerHTML = '';

  city.itinerary.forEach(day => {
    const dayEl = document.createElement('div');
    dayEl.className = 'bg-white dark:bg-dark-bg-accent p-6 rounded-lg shadow-lg';

    // Create list items for activities
    const activitiesHTML = day.activities.map(activity =>
      `<li>• ${activity}</li>`
    ).join('');

    dayEl.innerHTML = `
      <div class="flex items-center mb-4">
        <span class="text-3xl font-bold text-orange-600 dark:text-orange-500 mr-4">${day.day}</span>
        <h3 class="text-xl font-semibold dark:text-gray-100">${day.title}</h3>
      </div>
      <ul class="space-y-3 text-gray-600 dark:text-gray-300">
        ${activitiesHTML}
      </ul>
    `;

    itineraryContainer.appendChild(dayEl);
  });

  // Video
  document.getElementById('city-video').src = city.videoUrl;

  // Map
  document.getElementById('map-city-name').textContent = city.name;
  document.getElementById('city-map').src = city.mapEmbedUrl;

  // Local guides
  document.getElementById('guide-city-name').textContent = city.name;

  const guidesContainer = document.getElementById('guides-container');
  guidesContainer.innerHTML = '';

  city.localGuides.forEach(guide => {
    const guideEl = document.createElement('div');
    guideEl.className = 'bg-white dark:bg-dark-bg-accent p-4 rounded-lg text-center';

    // Create stars for rating
    let starsHTML = '';
    const fullStars = Math.floor(guide.rating);
    const hasHalfStar = guide.rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fa-solid fa-star"></i>';
    }

    if (hasHalfStar) {
      starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }

    guideEl.innerHTML = `
      <img src="${guide.avatar}" alt="${guide.name}" class="w-24 h-24 rounded-full mx-auto mb-4"/>
      <h3 class="font-semibold dark:text-gray-100">${guide.name}</h3>
      <p class="text-gray-600 dark:text-gray-300">${guide.profession}</p>
      <div class="flex justify-center mt-2 text-orange-400 dark:text-orange-500">
        ${starsHTML}
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${guide.rating} (${guide.reviewCount} reviews)</p>
    `;

    guidesContainer.appendChild(guideEl);
  });
}

/**
 * Populate the city pass card section with data
 * @param {Object} cityData - The city data object
 */
function populateCityPassCard(cityData) {
  const cityPassSection = document.getElementById('city-pass-card');
  const cityName = cityData.name;
  const cityId = cityData.id;

  // Function to check if an image exists
  function imageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // Check if the city card image exists
  imageExists(`../assets/image/${cityId}.png`).then(exists => {
    if (!exists) {
      // If the city doesn't have a card image, hide the entire section
      console.log(`No city card available for ${cityName}, hiding section`);
      cityPassSection.style.display = 'none';
      return;
    }

    // City card exists, show the section and populate it
    cityPassSection.style.display = 'block';

    // Set city name in all places
    document.getElementById('city-card-name').textContent = cityName;
    document.getElementById('city-card-title').textContent = cityName;

    // Set the front card image
    const frontCardImage = document.getElementById('city-card-front-image');
    frontCardImage.src = `../assets/image/${cityId}.png`;
    frontCardImage.alt = `${cityName} City Card`;

    // Set city card link to the city-pass page for this city
    document.getElementById('city-card-link').href = `./city-card.html?city=${cityId}`;

    // Generate attraction tags based on highlights (limited to just 3 for overview)
    const attractionsContainer = document.getElementById('city-card-attractions');
    attractionsContainer.innerHTML = ''; // Clear existing content

    if (cityData.highlights) {
      // Use highlights to create attraction tags (just top 3)
      cityData.highlights.slice(0, 3).forEach(highlight => {
        const tag = document.createElement('span');
        tag.className = 'attraction-tag';
        tag.innerHTML = `<i class="fas fa-${highlight.icon} mr-1"></i> ${highlight.title}`;
        attractionsContainer.appendChild(tag);
      });
    }

    // Add a "more" tag to indicate there are more attractions
    const moreTag = document.createElement('span');
    moreTag.className = 'attraction-tag more-tag';
    moreTag.innerHTML = `<i class="fas fa-ellipsis-h mr-1"></i> And more...`;
    attractionsContainer.appendChild(moreTag);

    // Add 3D card flip effect interaction
    const cardContainer = document.querySelector('.city-card-3d-container');
    if (cardContainer) {
      // Preload the back image to ensure smooth flip
      const backImage = new Image();
      backImage.src = '../assets/image/back.png';

      // Add click event to flip the card
      cardContainer.addEventListener('click', function() {
        this.classList.toggle('flipped');

        // Add a subtle floating animation after flip
        if (this.classList.contains('flipped')) {
          this.style.animation = 'float 3s ease-in-out infinite';
        } else {
          this.style.animation = '';
        }
      });

      // Add touch events for mobile
      cardContainer.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.classList.toggle('flipped');

        // Add a subtle floating animation after flip
        if (this.classList.contains('flipped')) {
          this.style.animation = 'float 3s ease-in-out infinite';
        } else {
          this.style.animation = '';
        }
      });
    }
  });
}

/**
 * Initialize duration option selection functionality
 * (Simplified version for the overview card)
 */
function initDurationOptions() {
  // Add click event to the "more" tag to navigate to the full details page
  const moreTag = document.querySelector('.more-tag');
  const cityCardLink = document.getElementById('city-card-link');

  if (moreTag && cityCardLink) {
    moreTag.addEventListener('click', function() {
      // Navigate to the same URL as the main CTA button
      window.location.href = cityCardLink.href;
    });
  }
}