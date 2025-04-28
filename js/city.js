import { apiGet } from '/js/api.js';
import { loadPartial } from '/js/loader.js';
import { initUI } from '/js/ui.js';

document.addEventListener('DOMContentLoaded', async function() {
  try {
    console.log('City page initialized');
    
    // Initialize UI components
    initUI();
    
    // Load header and footer
    await loadPartial('/partials/header.html', 'header-placeholder');
    await loadPartial('/partials/footer.html', 'footer-placeholder');
    
    // Get city ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cityId = urlParams.get('id');
    
    if (!cityId) {
      showError('City not found. Please select a valid destination.');
      return;
    }
    
    // Fetch city data from JSON
    const allCities = await apiGet('/data/cities.json');
    const city = allCities.find(c => c.id === cityId);
    
    if (!city) {
      showError('City not found. Please select a valid destination.');
      return;
    }
    
    // Populate the page with city data
    populateCityData(city);
    
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