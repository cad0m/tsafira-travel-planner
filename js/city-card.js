/**
 * City Card functionality for Tsafira Travel Planner
 * Handles the city card checkbox and duration options
 */

document.addEventListener('DOMContentLoaded', function() {
  // Index page city card functionality
  const quickCityCardCheckbox = document.getElementById('quick-city-card');
  const cityCardOptions = document.getElementById('city-card-options');

  if (quickCityCardCheckbox && cityCardOptions) {
    quickCityCardCheckbox.addEventListener('change', function() {
      if (this.checked) {
        cityCardOptions.classList.remove('hidden');
      } else {
        cityCardOptions.classList.add('hidden');
      }
    });
  }

  // Wizard page city card functionality
  const includeCityCard = document.getElementById('include-city-card');
  const cityCardDurationOptions = document.getElementById('city-card-duration-options');

  if (includeCityCard && cityCardDurationOptions) {
    includeCityCard.addEventListener('change', function() {
      if (this.checked) {
        cityCardDurationOptions.classList.remove('hidden');
      } else {
        cityCardDurationOptions.classList.add('hidden');
      }
    });
  }

  // Budget slider tooltip functionality
  const budgetSlider = document.getElementById('quick-budget');
  const budgetTooltip = document.getElementById('budget-tooltip');
  
  if (budgetSlider && budgetTooltip) {
    // Update tooltip value and position when slider changes
    budgetSlider.addEventListener('input', function() {
      const value = this.value;
      budgetTooltip.textContent = `$${value}`;
      
      // Calculate position (percentage of slider width)
      const percent = (value - this.min) / (this.max - this.min);
      
      // Show tooltip
      budgetTooltip.style.opacity = '1';
    });
    
    // Hide tooltip when user stops interacting with slider
    budgetSlider.addEventListener('mouseup', function() {
      setTimeout(() => {
        budgetTooltip.style.opacity = '0';
      }, 1000);
    });
    
    budgetSlider.addEventListener('mouseover', function() {
      budgetTooltip.style.opacity = '1';
    });
    
    budgetSlider.addEventListener('mouseleave', function() {
      budgetTooltip.style.opacity = '0';
    });
  }

  // Form submission handling
  const quickGenerateBtn = document.getElementById('quick-generate-btn');
  const tripForm = document.getElementById('trip-form');
  
  if (quickGenerateBtn && tripForm) {
    quickGenerateBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get form values
      const budget = document.getElementById('quick-budget').value;
      const departure = document.getElementById('quick-departure').value;
      const startDate = document.getElementById('quick-start-date').value;
      const endDate = document.getElementById('quick-end-date').value;
      
      // Get preferences
      const culture = document.getElementById('quick-culture').checked;
      const nature = document.getElementById('quick-nature').checked;
      const luxury = document.getElementById('quick-luxury').checked;
      const sightseeing = document.getElementById('quick-sightseeing').checked;
      
      // Get city card options
      const includeCityCard = document.getElementById('quick-city-card').checked;
      let cityCardDuration = null;
      
      if (includeCityCard) {
        const durationRadios = document.querySelectorAll('input[name="card-duration"]');
        for (const radio of durationRadios) {
          if (radio.checked) {
            cityCardDuration = radio.value;
            break;
          }
        }
      }
      
      // Create URL parameters for wizard page
      const params = new URLSearchParams();
      params.append('budget', budget);
      if (departure) params.append('departure', departure);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      // Add preferences
      if (culture) params.append('culture', 'true');
      if (nature) params.append('nature', 'true');
      if (luxury) params.append('luxury', 'true');
      if (sightseeing) params.append('sightseeing', 'true');
      
      // Add city card options
      if (includeCityCard) {
        params.append('cityCard', 'true');
        if (cityCardDuration) params.append('cityCardDuration', cityCardDuration);
      }
      
      // Redirect to wizard page with parameters
      window.location.href = `pages/wizard.html?${params.toString()}`;
    });
  }
});
