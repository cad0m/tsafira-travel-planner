import { apiGet } from './api.js';

// Supported currencies and symbols
const SUPPORTED_CURRENCIES = ['MAD', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
const CURRENCY_SYMBOLS = { MAD: 'MAD', USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$', JPY: '¥' };
let EXCHANGE_RATES = { MAD: 1, USD: 10.2, EUR: 11.1, GBP: 12.5, CAD: 7.4, AUD: 7.3, JPY: 0.07 };

document.addEventListener("DOMContentLoaded", function() {
  // ========== CONSTANTS & ELEMENTS ==========
  
  // Get step elements
  const stepContainers = [
    document.getElementById("step-1-content"),
    document.getElementById("step-2-content"),
    document.getElementById("step-3-content")
  ];
  
  // Get progress indicators
  const progressSteps = [
    document.getElementById("step-1-indicator"),
    document.getElementById("step-2-indicator"),
    document.getElementById("step-3-indicator")
  ];
  
  // Get progress lines
  const progressLines = document.querySelectorAll(".progress-line");
  
  // Get navigation buttons
  const nextButtons = [
    document.getElementById("next-btn-1"),
    document.getElementById("next-btn-2"),
    document.getElementById("generate-btn")
  ];
  
  const backButtons = [
    document.getElementById("back-btn-2"),
    document.getElementById("back-btn-3")
  ];
  
  const saveButtons = [
    document.getElementById("save-progress-btn-1"),
    document.getElementById("save-progress-btn-2"),
    document.getElementById("save-progress-btn-3"),
    document.getElementById("save-exit-btn")
  ];
  
  const editButtons = [
    document.getElementById("edit-basics-btn"),
    document.getElementById("edit-preferences-btn")
  ];
  
  const processingOverlay = document.getElementById("processing-overlay");
  const processingStatus = document.getElementById("processing-status");
  const errorRegion = document.getElementById("error-region");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  
  // Current step tracker (0-based index)
  let currentStep = 0;
  
  // ========== DARK MODE ==========
  
  // Check for saved theme preference or use system preference
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    } else {
      // Use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
      }
    }
  }
  
  // Toggle theme with animation
  function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
      // Transition to light mode
      themeIcon.style.transform = 'rotate(360deg) scale(0.5)';
      
      setTimeout(() => {
        document.documentElement.classList.remove('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
        
        setTimeout(() => {
          themeIcon.style.transform = 'rotate(0) scale(1)';
        }, 50);
      }, 150);
    } else {
      // Transition to dark mode
      themeIcon.style.transform = 'rotate(360deg) scale(0.5)';
      
      setTimeout(() => {
        document.documentElement.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
        
        setTimeout(() => {
          themeIcon.style.transform = 'rotate(0) scale(1)';
        }, 50);
      }, 150);
    }
  }
  
  // Add theme toggle event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Initialize theme
  initializeTheme();
  
  // ========== WIZARD NAVIGATION FUNCTIONS ==========
  
  // Initialize the wizard
  function initWizard() {
    try {
      // Start with clearing error region
      if (errorRegion) errorRegion.textContent = '';
      
      // Reset wizard to initial state - important!
      resetWizardState();
      
      // Add event listeners to navigation buttons
      setupNavigationButtons();
      
      // Enhance the budget slider
      setupBudgetSlider();
      
      // Setup form validation
      setupValidation();
      
      // Setup interest sliders
      setupInterestSliders();
      
      // Setup popular departures
      setupPopularDepartures();
      
      // Setup flexible dates toggle
      setupFlexibleDates();
      
      // Reset all preference checkboxes to unchecked
      resetPreferenceCheckboxes();
      
      // Try to load saved progress - AFTER all UI setup
      const hasSavedData = loadSavedProgress();
      
      // Check URL parameters to see if we should go directly to step 3
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step');
      
      if (stepParam === '3') {
        // If we have step=3 in URL, go directly to step 3
        currentStep = 2; // Index 2 is step 3
        showStep(2);
        
        // Make sure we have terms checkbox checked to enable the generate button
        const termsCheckbox = document.getElementById("terms");
        if (termsCheckbox) {
          termsCheckbox.checked = true;
          // Hide any warning message
          const termsWarning = document.getElementById("terms-warning");
          if (termsWarning) termsWarning.classList.add("hidden");
        }
        
        // Update summary
        updateSummary();
      } else {
        // Default behavior - always start at step 1
        currentStep = 0;
        showStep(0);
      }
      
      // Update button states
      updateButtonStates();
    } catch (error) {
      console.error("Error initializing wizard:", error);
      // Fallback to step 1 in case of error
      showStep(0);
    }
  }
  
  // Reset all preference checkboxes to unchecked (FIX FOR BUG #1)
  function resetPreferenceCheckboxes() {
    const checkboxes = document.querySelectorAll('input[name="culture"], input[name="nature"], input[name="luxury"], input[name="sightseeing"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
      
      // Also hide any interest slider containers
      const card = checkbox.closest('.preference-card');
      if (card) {
        const sliderContainer = card.querySelector('.interest-slider-container');
        if (sliderContainer) {
          sliderContainer.classList.add('hidden');
        }
      }
    });
  }
  
  // Reset wizard visual state
  function resetWizardState() {
    // Hide all steps except the first
    stepContainers.forEach((container, index) => {
      if (container) {
        container.style.display = index === 0 ? "block" : "none";
        container.classList.remove("fade-in", "fade-out");
      }
    });
    
    // Reset progress indicators
    progressSteps.forEach((step, index) => {
      if (step) {
        if (index === 0) {
          step.classList.add("active-step");
          step.classList.remove("bg-gray-200", "dark:bg-gray-700");
        } else {
          step.classList.remove("active-step");
          step.classList.add("bg-gray-200", "dark:bg-gray-700");
        }
      }
    });
    
    // Reset progress lines
    if (progressLines) {
      progressLines.forEach(line => {
        line.classList.remove("active");
      });
    }
    
    // Reset current step
    currentStep = 0;
  }
  
  // Setup navigation button event listeners
  function setupNavigationButtons() {
    // Next buttons
    nextButtons.forEach((button, index) => {
      if (button) {
        button.addEventListener("click", () => {
          if (validateCurrentStep()) {
            if (index === 2) { // Generate button
              showProcessing();
            } else {
              moveNext();
            }
          }
        });
        
        // Add subtle hover animation
        button.addEventListener("mouseenter", () => {
          button.querySelector('i')?.classList.add('animate-pulse');
        });
        
        button.addEventListener("mouseleave", () => {
          button.querySelector('i')?.classList.remove('animate-pulse');
        });
      }
    });
    
    // Back buttons
    backButtons.forEach(button => {
      if (button) {
        button.addEventListener("click", moveBack);
      }
    });
    
    // Edit buttons
    if (editButtons[0]) {
      editButtons[0].addEventListener("click", () => showStep(0));
    }
    
    if (editButtons[1]) {
      editButtons[1].addEventListener("click", () => showStep(1));
    }
    
    // Save buttons
    saveButtons.forEach(button => {
      if (button) {
        button.addEventListener("click", saveProgress);
      }
    });
  }
  
  // Show specific step and update progress indicators
  function showStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= stepContainers.length) {
      console.error("Invalid step index:", stepIndex);
      return;
    }
    
    // Determine direction for animations
    const isForward = stepIndex > currentStep;
    
    // Hide all steps with fade-out animation
    stepContainers.forEach((container, index) => {
      if (container) {
        if (index === currentStep && index !== stepIndex) {
          container.classList.add("fade-out");
          
          setTimeout(() => {
            container.style.display = "none";
            container.classList.remove("fade-out");
          }, 150);
        } else if (index !== stepIndex) {
          container.style.display = "none";
        }
      }
    });
    
    // Show the target step with fade-in animation
    if (stepContainers[stepIndex]) {
      stepContainers[stepIndex].style.display = "block";
      stepContainers[stepIndex].classList.add("fade-in");
      
      setTimeout(() => {
        stepContainers[stepIndex].classList.remove("fade-in");
      }, 200);
    }
    
    // Update progress indicators with animation
    progressSteps.forEach((step, index) => {
      if (step) {
        if (index <= stepIndex) {
          step.classList.add("active-step");
          step.classList.remove("bg-gray-200", "dark:bg-gray-700");
        } else {
          step.classList.remove("active-step");
          step.classList.add("bg-gray-200", "dark:bg-gray-700");
        }
      }
    });
    
    // Animate progress lines for forward movement
    if (isForward && progressLines) {
      // Only animate the line between the previous and current step
      const lineIndex = Math.max(0, stepIndex - 1);
      if (progressLines[lineIndex]) {
        progressLines[lineIndex].classList.add("active");
      }
    }
    
    // Update current step tracker
    currentStep = stepIndex;
    
    // Update summary if moving to review step
    if (stepIndex === 2) {
      updateSummary();
    }
    
    // Update button states based on validation
    updateButtonStates();
    
    // Scroll to top smoothly when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Move to next step
  function moveNext() {
    if (currentStep < stepContainers.length - 1 && validateCurrentStep()) {
      showStep(currentStep + 1);
    }
  }
  
  // Move to previous step
  function moveBack() {
    if (currentStep > 0) {
      showStep(currentStep - 1);
    }
  }
  
  // ========== DATA PERSISTENCE FUNCTIONS ==========
  
  // Save progress to localStorage
  function saveProgress() {
    try {
      const formData = collectFormData();
      
      // Save to localStorage
      localStorage.setItem("tripWizardState", JSON.stringify(formData));
      
      // Show confirmation with animation
      const button = saveButtons[currentStep];
      if (button) {
        const originalText = button.textContent;
        button.innerHTML = '<i class="fas fa-check mr-2"></i>Saved!';
        
        // Pulse animation
        button.classList.add('text-green-600', 'dark:text-green-400');
        
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('text-green-600', 'dark:text-green-400');
        }, 2000);
      } else {
        // Fallback if button not found
        showToast("Your progress has been saved successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      showToast("There was an error saving your progress. Please try again.", true);
    }
  }
  
  // Display toast notification
  function showToast(message, isError = false) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform translate-y-20 opacity-0 transition-all duration-300';
      document.body.appendChild(toast);
    }
    
    // Set toast style based on type
    if (isError) {
      toast.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform translate-y-20 opacity-0 transition-all duration-300 bg-red-500 text-white';
    } else {
      toast.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform translate-y-20 opacity-0 transition-all duration-300 bg-green-500 text-white';
    }
    
    // Set message
    toast.textContent = message;
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 10);
    
    // Animate out after delay
    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      
      // Remove element after animation
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
  
  // Collect all form data into a single object
  function collectFormData() {
    return {
      step: currentStep,
      budget: document.getElementById("budget-input")?.value || "5000",
      currency: document.getElementById("currency-select")?.value || "MAD",
      startDate: document.getElementById("start-date")?.value || "",
      endDate: document.getElementById("end-date")?.value || "",
      flexibleDates: document.getElementById("flexible-dates")?.checked || false,
      departure: document.getElementById("departure-input")?.value || "",
      preferences: {
        culture: document.querySelector('input[name="culture"]')?.checked || false,
        nature: document.querySelector('input[name="nature"]')?.checked || false,
        luxury: document.querySelector('input[name="luxury"]')?.checked || false,
        sightseeing: document.querySelector('input[name="sightseeing"]')?.checked || false
      },
      interestLevels: getInterestLevels(),
      dietary: document.getElementById("dietary")?.value || "No specific requirements",
      accessibility: document.getElementById("accessibility")?.value || "No specific requirements",
      specialRequests: document.getElementById("special-requests")?.value || "",
      emailCopy: document.getElementById("email-copy")?.checked || false,
      termsAgreed: document.getElementById("terms")?.checked || false
    };
  }
  
  // Get interest levels for each selected preference
  function getInterestLevels() {
    const levels = {};
    const preferenceCards = document.querySelectorAll(".preference-card");
    
    preferenceCards.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        const name = checkbox.name;
        const slider = card.querySelector('.interest-slider');
        if (slider) {
          levels[name] = slider.value;
        }
      }
    });
    
    return levels;
  }
  
  // Load saved progress from localStorage
  function loadSavedProgress() {
    const savedData = localStorage.getItem("tripWizardState");
    if (!savedData) return false;
    
    try {
      const formData = JSON.parse(savedData);
      
      // Validate that we have real data before proceeding
      if (!formData || typeof formData !== 'object') return false;
      
      // Restore basic fields
      const budgetInput = document.getElementById("budget-input");
      const budgetSlider = document.getElementById("budget-slider");
      
      if (budgetInput && formData.budget) budgetInput.value = formData.budget;
      if (budgetSlider && formData.budget) budgetSlider.value = formData.budget;
      
      if (formData.currency) {
        const select = document.getElementById("currency-select");
        select.value = formData.currency;
        // Sync UI: trigger currency change logic
        select.dispatchEvent(new Event('change'));
      }
      if (formData.startDate) document.getElementById("start-date").value = formData.startDate;
      if (formData.endDate) document.getElementById("end-date").value = formData.endDate;
      if (formData.flexibleDates !== undefined) document.getElementById("flexible-dates").checked = formData.flexibleDates;
      if (formData.departure) document.getElementById("departure-input").value = formData.departure;
      
      // Restore preferences
      if (formData.preferences) {
        const preferenceInputs = {
          culture: document.querySelector('input[name="culture"]'),
          nature: document.querySelector('input[name="nature"]'),
          luxury: document.querySelector('input[name="luxury"]'),
          sightseeing: document.querySelector('input[name="sightseeing"]')
        };
        
        for (const [key, value] of Object.entries(formData.preferences)) {
          if (preferenceInputs[key]) {
            preferenceInputs[key].checked = value;
            
            // Show/hide interest slider
            const card = preferenceInputs[key].closest('.preference-card');
            if (card) {
              const sliderContainer = card.querySelector('.interest-slider-container');
              if (sliderContainer) {
                sliderContainer.style.display = value ? 'block' : 'none';
              }
            }
          }
        }
      }
      
      // Restore interest levels if saved
      if (formData.interestLevels) {
        for (const [prefName, level] of Object.entries(formData.interestLevels)) {
          const prefInput = document.querySelector(`input[name="${prefName}"]`);
          if (prefInput) {
            const card = prefInput.closest('.preference-card');
            if (card) {
              const slider = card.querySelector('.interest-slider');
              const valueDisplay = card.querySelector('.interest-value');
              if (slider && valueDisplay) {
                slider.value = level;
                // Use interest labels based on level
                const interestLabels = {
                  0: "Very Low",
                  25: "Low",
                  50: "Medium",
                  75: "High",
                  100: "Very High"
                };
                // Find closest key
                const closestKey = Object.keys(interestLabels)
                  .map(Number)
                  .reduce((a, b) => {
                    return Math.abs(b - level) < Math.abs(a - level) ? b : a;
                  });
                valueDisplay.textContent = interestLabels[closestKey];
              }
            }
          }
        }
      }
      
      // Restore additional preferences
      if (formData.dietary) document.getElementById("dietary").value = formData.dietary;
      if (formData.accessibility) document.getElementById("accessibility").value = formData.accessibility;
      if (formData.specialRequests) document.getElementById("special-requests").value = formData.specialRequests;
      if (formData.emailCopy !== undefined) document.getElementById("email-copy").checked = formData.emailCopy;
      if (formData.termsAgreed !== undefined) document.getElementById("terms").checked = formData.termsAgreed;
      
      // Update budget slider display
      setupBudgetSlider();
      
      // Update flexible dates display
      setupFlexibleDates();
      
      // Note: We'll override the step value later in initWizard to always start at step 1
      
      return true;
    } catch (error) {
      console.error("Error loading saved data:", error);
      // Clear potentially corrupted data
      localStorage.removeItem("tripWizardState");
      return false;
    }
  }
  
  // ========== UI COMPONENT FUNCTIONS ==========
  
  // Show processing overlay and redirect
  function showProcessing() {
    // Check terms agreement
    if (!document.getElementById("terms").checked) {
      document.getElementById("terms-warning").classList.remove("hidden");
      document.getElementById("error-region").textContent = "Please agree to the terms to continue.";
      // Shake the terms checkbox
      const termsContainer = document.getElementById("terms").parentElement;
      if (termsContainer) {
        termsContainer.classList.add("shake");
        setTimeout(() => {
          termsContainer.classList.remove("shake");
        }, 500);
      }
      return;
    }
    
    // Save current form data to localStorage
    try {
      const formData = collectFormData();
      
      // Make sure to capture the email-copy checkbox value
      formData.emailCopy = document.getElementById("email-copy")?.checked || false;
      
      // Save the updated form data
      localStorage.setItem("tripWizardState", JSON.stringify(formData));
      console.log("Trip details saved to localStorage before generating itinerary");
    } catch (error) {
      console.error("Error saving data before generating itinerary:", error);
      // Continue with processing even if save fails
    }
    
    // Show processing overlay
    processingOverlay.classList.remove("hidden");
    processingOverlay.style.opacity = "0";
    
    setTimeout(() => {
      processingOverlay.style.opacity = "1";
    }, 10);
    
    // Simulate processing steps with status updates
    const statuses = [
      "Finding the best accommodations...",
      "Selecting cultural experiences...",
      "Determining optimal travel routes...",
      "Creating your personalized itinerary..."
    ];
    
    let statusIndex = 0;
    
    const statusInterval = setInterval(() => {
      if (statusIndex < statuses.length) {
        // Fade out
        processingStatus.style.opacity = "0";
        processingStatus.style.transform = "translateY(-10px)";
        
        setTimeout(() => {
          processingStatus.textContent = statuses[statusIndex];
          // Fade in
          processingStatus.style.opacity = "1";
          processingStatus.style.transform = "translateY(0)";
          statusIndex++;
        }, 300);
      } else {
        clearInterval(statusInterval);
        // In a real application, this would redirect to the results page
        setTimeout(() => {
          processingOverlay.style.opacity = "0";
          setTimeout(() => {
            processingOverlay.classList.add("hidden");
            showToast("Your itinerary has been created! In a real application, you would be redirected to view it now.");
          }, 300);
        }, 2000);
      }
    }, 1800);
  }
  
  // Convert currency value using dynamic exchange rates
  function convertCurrency(value, fromCurrency, toCurrency) {
    const fromRate = EXCHANGE_RATES[fromCurrency];
    const toRate = EXCHANGE_RATES[toCurrency];
    if (!fromRate || !toRate) {
      throw new Error(`Exchange rate not available for ${fromCurrency} or ${toCurrency}`);
    }
    const valueInMAD = value * fromRate;
    const converted = valueInMAD / toRate;
    // Round to two decimal places
    return Math.round((converted + Number.EPSILON) * 100) / 100;
  }
  
  // Format currency with thousand separators and proper symbol
  function formatCurrency(value, currency = "MAD") {
    if (value === null || value === undefined || isNaN(value)) return "";
    const symbol = CURRENCY_SYMBOLS[currency] || currency + " ";
    const formattedNumber = Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    if (currency === "MAD") {
      return `${formattedNumber} ${symbol}`;
    }
    return `${symbol}${formattedNumber}`;
  }
  
  // Setup flexible dates toggle (FIX FOR BUG #3)
  function setupFlexibleDates() {
    const checkbox = document.getElementById("flexible-dates");
    
    if (!checkbox) return;
    
    // Create explanation element if it doesn't exist
    const parent = checkbox.closest("div");
    let explanationElement = document.getElementById("flexible-dates-explanation");
    
    if (!explanationElement) {
      const explanation = document.createElement("div");
      explanation.id = "flexible-dates-explanation";
      explanation.className = "mt-2 text-sm text-gray-500 dark:text-gray-400 hidden";
      explanation.innerHTML = 'We\'ll check availability for dates 3 days before and after your selected range.';
      parent.appendChild(explanation);
      explanationElement = explanation;
    }
    
    // Handle toggle - ONLY show/hide explanation text, no interest slider
    checkbox.addEventListener("change", function() {
      if (this.checked) {
        explanationElement.classList.remove("hidden");
        explanationElement.classList.add("slide-enter");
      } else {
        explanationElement.classList.add("slide-exit");
        setTimeout(() => {
          explanationElement.classList.add("hidden");
          explanationElement.classList.remove("slide-exit");
        }, 200);
      }
    });
    
    // Initialize state
    if (checkbox.checked) {
      explanationElement.classList.remove("hidden");
    } else {
      explanationElement.classList.add("hidden");
    }
  }
  
  // Setup budget slider and interactive elements (FIX FOR BUG #2)
  // Setup budget slider and interactive elements
  function setupBudgetSlider() {
    const budgetSlider = document.getElementById("budget-slider");
    const budgetInput = document.getElementById("budget-input");
    const currencySelect = document.getElementById("currency-select");
    const tooltip = document.querySelector(".currency-tooltip");
    
    if (!budgetSlider || !budgetInput || !currencySelect || !tooltip) return;
    
    // Create or find prefix element for number input to show currency symbol
    let prefixEl = document.getElementById('budget-prefix');
    if (!prefixEl) {
      prefixEl = document.createElement('span');
      prefixEl.id = 'budget-prefix';
      prefixEl.className = 'ml-2 text-lg font-semibold dark:text-gray-100';
      budgetInput.parentElement.appendChild(prefixEl);
    }
    
    // Add refresh button to update exchange rates
    let refreshBtn = document.getElementById("refresh-exchange-btn");
    if (!refreshBtn) {
      refreshBtn = document.createElement("button");
      refreshBtn.id = "refresh-exchange-btn";
      refreshBtn.type = "button";
      refreshBtn.className = "ml-2 px-2 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded";
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
      currencySelect.parentElement.appendChild(refreshBtn);
    }
    
    // Function to fetch latest exchange rates - modified to avoid localStorage issues
    async function fetchExchangeRates() {
      const icon = refreshBtn.querySelector("i");
      icon.classList.add("fa-spin");
      refreshBtn.disabled = true;
      
      try {
        // Skip localStorage check and always fetch fresh data
        try {
          console.log("Fetching exchange rates from API...");
          
          // Use direct API call instead of window.apiFetch
          const response = await fetch("https://open.er-api.com/v6/latest/MAD");
          
          if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
          }
          
          const apiData = await response.json();
          
          if (apiData && apiData.rates) {
            // Format data for our use
            const exchangeData = {
              base: "MAD",
              last_updated: new Date().toISOString(),
              rates: {}
            };
            
            // Process rates correctly
            SUPPORTED_CURRENCIES.forEach(curr => {
              if (curr === "MAD") {
                exchangeData.rates.MAD = 1;
              } else if (apiData.rates[curr] !== undefined) {
                // Store rates as MAD per unit currency
                exchangeData.rates[curr] = apiData.rates[curr];
              }
            });
            
            // Use the fresh data - don't try to cache it
            updateExchangeRates(exchangeData);
            showToast("Exchange rates updated");
          } else {
            throw new Error("Invalid API response format");
          }
        } catch (apiError) {
          console.error("API fetch failed:", apiError);
          
          // If API call fails, use fallback static values
          showToast("Using fallback exchange rates", true);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        showToast("Using fallback exchange rates", true);
      } finally {
        icon.classList.remove("fa-spin");
        refreshBtn.disabled = false;
      }
    }
  
    // Helper function to update exchange rates from data - with debug logging
    function updateExchangeRates(data) {
      if (data && data.rates) {
        console.log("Updating exchange rates with:", data.rates);
        
        SUPPORTED_CURRENCIES.forEach(curr => {
          if (data.rates[curr] !== undefined) {
            EXCHANGE_RATES[curr] = data.rates[curr];
            console.log(`Updated ${curr} rate: 1 MAD = ${EXCHANGE_RATES[curr]} ${curr}`);
          }
        });
        
        // Log the complete exchange rates for debugging
        console.log("Current EXCHANGE_RATES:", JSON.stringify(EXCHANGE_RATES));
        
        // Re-trigger currency change event to update slider
        currencySelect.dispatchEvent(new Event("change"));
      }
    }
      
    // Attach refresh handler
    refreshBtn.addEventListener("click", fetchExchangeRates);
  
    // Reference slider container and static min/max labels container
    const sliderContainer = budgetSlider.parentElement;
    const minMaxContainer = sliderContainer.nextElementSibling;
    const minMaxSpans = minMaxContainer ? Array.from(minMaxContainer.querySelectorAll('span')) : [];
    
    // Function to update static min/max labels
    function updateMinMaxLabels(minValue, maxValue, currency) {
      if (minMaxSpans.length >= 2) {
        minMaxSpans[0].textContent = formatCurrency(minValue, currency);
        minMaxSpans[1].textContent = formatCurrency(maxValue, currency);
      }
    }
  
    // Create slider ticks if they don't exist
    if (!document.querySelector('.slider-ticks') && sliderContainer) {
      // Create ticks container
      const ticksContainer = document.createElement('div');
      ticksContainer.className = 'slider-ticks';
      
      // Create labels container
      const labelsContainer = document.createElement('div');
      labelsContainer.className = 'slider-labels';
      
      // Add ticks and labels
      const min = parseInt(budgetSlider.min);
      const max = parseInt(budgetSlider.max);
      const step = (max - min) / 10;
      
      for (let i = 0; i <= 10; i++) {
        // Create tick
        const tick = document.createElement('div');
        tick.className = i % 2 === 0 ? 'slider-tick major' : 'slider-tick';
        ticksContainer.appendChild(tick);
        
        // Create label (only for major ticks)
        if (i % 2 === 0) {
          const label = document.createElement('div');
          label.className = 'slider-label';
          label.textContent = formatCurrency(min + (i * step), currencySelect.value);
          labelsContainer.appendChild(label);
        } else {
          const spacer = document.createElement('div');
          spacer.className = 'slider-label invisible';
          labelsContainer.appendChild(spacer);
        }
      }
      
      // Add ticks and labels to slider container
      sliderContainer.appendChild(ticksContainer);
      sliderContainer.appendChild(labelsContainer);
    }
    
    let currentCurrency = currencySelect.value;
    // Initialize static min/max labels for the budget slider
    updateMinMaxLabels(budgetSlider.min, budgetSlider.max, currentCurrency);
    
    let isDragging = false;
    
    // Function to convert between currencies - fixed conversion logic
    function convertCurrency(value, fromCurrency, toCurrency) {
      if (isNaN(value)) return 0;
      if (fromCurrency === toCurrency) return value;
      
      // All rates are stored as: 1 MAD = X foreign currency
      // So to convert from a foreign currency to MAD, we divide by the rate
      // To convert from MAD to a foreign currency, we multiply by the rate
      
      // First convert to MAD if not already MAD
      let valueInMAD;
      if (fromCurrency === 'MAD') {
        valueInMAD = value;
      } else {
        // Convert from foreign currency to MAD
        valueInMAD = value / EXCHANGE_RATES[fromCurrency];
      }
      
      // Then convert from MAD to target currency if not MAD
      if (toCurrency === 'MAD') {
        return Math.round(valueInMAD * 100) / 100;
      } else {
        // Convert from MAD to foreign currency
        const result = valueInMAD * EXCHANGE_RATES[toCurrency];
        return toCurrency === 'JPY' ? Math.round(result) : Math.round(result * 100) / 100;
      }
    }
    
    // Format currency for display - improved formatting
    function formatCurrency(value, currency) {
      if (isNaN(value)) value = 0;
      
      // Use appropriate formatting for each currency
      const symbol = CURRENCY_SYMBOLS[currency] || currency;
      const isPrefix = currency !== 'MAD'; // MAD usually displayed after the amount
      
      // Format numbers with appropriate decimals and thousands separators
      let formattedValue;
      if (currency === 'JPY') {
        // JPY doesn't use decimals
        formattedValue = Math.round(value).toLocaleString();
      } else {
        // Use 2 decimal places for other currencies
        formattedValue = value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
      
      return isPrefix 
        ? `${symbol}${formattedValue}`
        : `${formattedValue} ${symbol}`;
    }
    
    // Update slider ticks and labels when currency changes
    function updateSliderTicksAndLabels() {
      const tickLabels = document.querySelectorAll('.budget-section .slider-label:not(.invisible)');
      if (!tickLabels.length) return;
      
      const min = parseInt(budgetSlider.min);
      const max = parseInt(budgetSlider.max);
      const step = (max - min) / 10;
      
      tickLabels.forEach((label, index) => {
        const value = min + (index * 2 * step); // only major ticks have labels (every 2nd tick)
        label.textContent = formatCurrency(value, currentCurrency);
      });
    }
    
    // Update input values, currency prefix, and tooltip position - with debug info
    function updateSliderValues(value, currency = currentCurrency) {
      if (!budgetSlider || !budgetInput) return;
      
      // Log input for debugging
      console.log(`updateSliderValues: ${value} ${currency}`);
      
      // Update number input and prefix
      budgetInput.value = value;
      if (prefixEl) prefixEl.textContent = CURRENCY_SYMBOLS[currency] || currency;
      
      // Prepare tooltip display: show actual currency and approximate MAD value
      const valueInMAD = convertCurrency(value, currency, "MAD");
      console.log(`Converted ${value} ${currency} to ${valueInMAD} MAD`);
      
      if (currency === "MAD") {
        tooltip.textContent = formatCurrency(value, "MAD");
      } else {
        const actual = formatCurrency(value, currency);
        const approx = formatCurrency(valueInMAD, "MAD");
        tooltip.textContent = `${actual} ≈ ${approx}`;
      }
      
      // Calculate position (percentage)
      const percentage = (value - budgetSlider.min) / (budgetSlider.max - budgetSlider.min);
      const sliderWidth = budgetSlider.offsetWidth;
      const tooltipWidth = tooltip.offsetWidth;
      
      // Adjust position to center tooltip and ensure it stays within bounds
      const leftPosition = Math.max(0, Math.min(percentage * sliderWidth - (tooltipWidth / 2), sliderWidth - tooltipWidth));
      tooltip.style.left = leftPosition + "px";
      
      // Update summary if on review step
      if (typeof currentStep !== 'undefined' && currentStep === 2) {
        if (typeof updateSummary === 'function') {
          updateSummary();
        }
      }
    }
    
    // Show tooltip on slider interaction
    budgetSlider.addEventListener("mousedown", () => {
      isDragging = true;
      tooltip.classList.add("visible");
      updateSliderValues(budgetSlider.value);
    });
    
    budgetSlider.addEventListener("touchstart", () => {
      isDragging = true;
      tooltip.classList.add("visible");
      updateSliderValues(budgetSlider.value);
    });
    
    // Update slider values when slider is moved
    budgetSlider.addEventListener("input", () => {
      updateSliderValues(budgetSlider.value);
    });
    
    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        setTimeout(() => {
          tooltip.classList.remove("visible");
        }, 1000);
      }
    });
    
    document.addEventListener("touchend", () => {
      if (isDragging) {
        isDragging = false;
        setTimeout(() => {
          tooltip.classList.remove("visible");
        }, 1000);
      }
    });
    
    // Sync number input with slider on every input event
    budgetInput.addEventListener("input", () => {
      let value = parseFloat(budgetInput.value);
      
      // Update currency prefix on manual input
      if (prefixEl) prefixEl.textContent = CURRENCY_SYMBOLS[currentCurrency] || currentCurrency;
      
      // Ensure value is a number but don't clamp to min/max
      if (isNaN(value)) value = parseFloat(budgetSlider.min);
      
      // Update slider position (within its range)
      const sliderMin = parseFloat(budgetSlider.min);
      const sliderMax = parseFloat(budgetSlider.max);
      
      // Only move slider within its bounds, but allow input value outside bounds
      const sliderValue = Math.max(sliderMin, Math.min(value, sliderMax));
      budgetSlider.value = sliderValue;
      
      // Show converted value in tooltip
      tooltip.classList.add("visible");
      
      const valueInMAD = convertCurrency(value, currentCurrency, "MAD");
      if (currentCurrency !== "MAD") {
        tooltip.textContent = `${formatCurrency(value, currentCurrency)} ≈ ${formatCurrency(valueInMAD, "MAD")}`;
      } else {
        tooltip.textContent = formatCurrency(value, currentCurrency);
      }
      
      // Auto-hide tooltip after delay
      clearTimeout(window.tooltipTimer);
      window.tooltipTimer = setTimeout(() => {
        tooltip.classList.remove("visible");
      }, 2000);
    });
    
    // Handle currency conversion - with detailed logging
    currencySelect.addEventListener("change", () => {
      const oldCurrency = currentCurrency;
      const newCurrency = currencySelect.value;
      console.log(`[Wizard] Currency changed: ${oldCurrency} -> ${newCurrency}`);
      
      // Update prefix for new currency selection
      if (prefixEl) prefixEl.textContent = CURRENCY_SYMBOLS[newCurrency] || newCurrency;
      
      const currentValue = parseFloat(budgetInput.value) || 0;
      console.log(`Current value: ${currentValue} ${oldCurrency}`);
      
      // Convert current value to MAD first
      const valueInMAD = convertCurrency(currentValue, oldCurrency, "MAD");
      console.log(`Value in MAD: ${valueInMAD}`);
      
      // Then convert from MAD to new currency
      const convertedValue = convertCurrency(valueInMAD, "MAD", newCurrency);
      console.log(`Converted to ${newCurrency}: ${convertedValue}`);
      
      // Update slider min/max based on the fixed MAD values
      const minMAD = 500; // Fixed minimum in MAD
      const maxMAD = 10000; // Fixed maximum in MAD
      
      const minInNewCurrency = convertCurrency(minMAD, "MAD", newCurrency);
      const maxInNewCurrency = convertCurrency(maxMAD, "MAD", newCurrency);
      console.log(`Slider range: ${minInNewCurrency} - ${maxInNewCurrency} ${newCurrency}`);
      
      // Update slider min/max attributes
      budgetSlider.min = minInNewCurrency;
      budgetSlider.max = maxInNewCurrency;
      
      // Update static min/max labels to reflect new currency
      updateMinMaxLabels(minInNewCurrency, maxInNewCurrency, newCurrency);
      
      // Update current values with correct precision
      // Use parseFloat to avoid scientific notation in the display
      budgetInput.value = parseFloat(convertedValue.toFixed(2));
      budgetSlider.value = Math.max(minInNewCurrency, Math.min(convertedValue, maxInNewCurrency));
      
      // Update current currency reference
      currentCurrency = newCurrency;
      
      // Update all displays
      updateSliderValues(convertedValue, newCurrency);
      updateSliderTicksAndLabels();
      
      // Briefly show tooltip with updated value
      tooltip.classList.add("visible");
      clearTimeout(window.tooltipTimer);
      window.tooltipTimer = setTimeout(() => {
        tooltip.classList.remove("visible");
      }, 2000);
    });
    
    // Function to display toast messages
    function showToast(message, isError = false) {
      // Create toast if it doesn't exist
      let toast = document.getElementById('toast-notification');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg transition-opacity duration-300 opacity-0';
        document.body.appendChild(toast);
      }
      
      // Set message and style based on type
      toast.textContent = message;
      toast.className = isError 
        ? 'fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg transition-opacity duration-300 bg-red-500 text-white opacity-0'
        : 'fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg transition-opacity duration-300 bg-green-500 text-white opacity-0';
      
      // Show toast
      setTimeout(() => {
        toast.classList.replace('opacity-0', 'opacity-100');
      }, 10);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        toast.classList.replace('opacity-100', 'opacity-0');
      }, 3000);
    }
    
    // Initial update
    updateSliderValues(budgetSlider.value);
    updateSliderTicksAndLabels();
    
    // Load initial exchange rates now that event listeners are in place
    fetchExchangeRates();
  }
  
  // Setup interest sliders
  function setupInterestSliders() {
    const preferenceCards = document.querySelectorAll(".preference-card");
    // Interest level labels mapped to values
    const interestLabels = {
      0: "Very Low",
      25: "Low",
      50: "Medium",
      75: "High",
      100: "Very High"
    };
    
    preferenceCards.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      const sliderContainer = card.querySelector('.interest-slider-container');
      
      if (!checkbox || !sliderContainer) return;
      
      // Show/hide slider container based on checkbox
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          sliderContainer.classList.remove('hidden');
          // Force display block in case CSS transition isn't working
          sliderContainer.style.display = 'block';
          sliderContainer.style.opacity = '1';
          sliderContainer.style.maxHeight = '100px';
        } else {
          sliderContainer.classList.add('hidden');
          // Reset display after transition
          setTimeout(() => {
            if (!this.checked) {
              sliderContainer.style.display = 'none';
            }
          }, 300);
        }
        
        // Update summary if on review step
        if (currentStep === 2) {
          updateSummary();
        }
      });
      
      // Update value display when slider changes
      const slider = sliderContainer.querySelector('.interest-slider');
      const valueDisplay = sliderContainer.querySelector('.interest-value');
      
      if (slider && valueDisplay) {
        // Set initial text label
        const initialValue = parseInt(slider.value);
        valueDisplay.textContent = interestLabels[getClosestKey(initialValue, interestLabels)];
        
        // Modify slider to have step values for the labels
        slider.setAttribute('step', '25');
        
        slider.addEventListener('input', function() {
          const value = parseInt(this.value);
          const label = interestLabels[getClosestKey(value, interestLabels)];
          valueDisplay.textContent = label;
          
          // Update summary if on review step
          if (currentStep === 2) {
            updateSummary();
          }
        });
      }
      
      // Initialize slider state - make sure it's visible if checkbox is checked
      if (checkbox.checked) {
        sliderContainer.classList.remove('hidden');
        sliderContainer.style.display = 'block';
        sliderContainer.style.opacity = '1';
        sliderContainer.style.maxHeight = '100px';
      }
    });
    
    // Helper function to find the closest key in an object
    function getClosestKey(value, object) {
      const keys = Object.keys(object).map(Number);
      return keys.reduce((a, b) => {
        return Math.abs(b - value) < Math.abs(a - value) ? b : a;
      });
    }
  }
  
  // Setup popular departure selection buttons
  function setupPopularDepartures() {
    const popularButtons = document.querySelectorAll('.popular-departure');
    const departureInput = document.getElementById("departure-input");
    
    if (!popularButtons.length || !departureInput) return;
    
    popularButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        // Prevent default behavior
        event.preventDefault();
        event.stopPropagation();
        
        // Set the airport value with a typing effect
        const airportText = this.textContent.trim();
        typeText(departureInput, airportText);
        
        // Remove any error styling
        departureInput.classList.remove('error');
        const errorEl = document.getElementById('departure-error');
        if (errorEl) errorEl.classList.add('hidden');
        
        // Update button states
        updateButtonStates();
        
        return false;
      });
    });
  }
  
  // Type text effect for inputs
  function typeText(inputElement, text, speed = 30) {
    inputElement.value = '';
    let i = 0;
    
    function type() {
      if (i < text.length) {
        inputElement.value += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }
  
  // ========== FORM VALIDATION FUNCTIONS ==========
  
  // Setup validation for form inputs
  function setupValidation() {
    // Get form fields for validation
    const budgetSlider = document.getElementById("budget-slider");
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const departureInput = document.getElementById("departure-input");
    const termsCheckbox = document.getElementById("terms");
    
    // Add input event listeners to form fields
    [budgetSlider, startDateInput, endDateInput, departureInput].forEach(input => {
      if (input) {
        input.addEventListener("input", function() {
          // Remove error styling on input
          this.classList.remove("error");
          
          // Hide error message
          const errorEl = document.getElementById(`${this.id}-error`);
          if (errorEl) errorEl.classList.add('hidden');
          
          // Hide date range error when either date changes
          if (this.id === 'start-date' || this.id === 'end-date') {
            const rangeError = document.getElementById('date-range-error');
            if (rangeError) rangeError.classList.add('hidden');
          }
          
          updateButtonStates();
        });
      }
    });
    
    // Terms checkbox listener
    if (termsCheckbox) {
      termsCheckbox.addEventListener("change", function() {
        const warningMessage = document.getElementById('terms-warning');
        if (warningMessage) {
          warningMessage.classList.toggle('hidden', this.checked);
        }
        updateButtonStates();
      });
    }
  }
  
  // Validate form fields for the current step
  function validateCurrentStep() {
    let isValid = true;
    const errorMessages = [];
    
    // Skip validation during initialization
    if (document.readyState !== 'complete') return true;
    
    switch(currentStep) {
      case 0:
        // Step 1: Budget, Dates, Departure
        const startDateInput = document.getElementById("start-date");
        const endDateInput = document.getElementById("end-date");
        const departureInput = document.getElementById("departure-input");
        const rangeError = document.getElementById('date-range-error');
        
        // Validate start date
        if (startDateInput && !startDateInput.value) {
          startDateInput.classList.add('error');
          const errorEl = document.getElementById('start-date-error');
          if (errorEl) errorEl.classList.remove('hidden');
          errorMessages.push("Please select a check-in date.");
          isValid = false;
          
          // Add shake animation
          startDateInput.parentElement.classList.add('shake');
          setTimeout(() => {
            startDateInput.parentElement.classList.remove('shake');
          }, 500);
        }
        
        // Validate end date
        if (endDateInput && !endDateInput.value) {
          endDateInput.classList.add('error');
          const errorEl = document.getElementById('end-date-error');
          if (errorEl) errorEl.classList.remove('hidden');
          errorMessages.push("Please select a check-out date.");
          isValid = false;
          
          // Add shake animation
          endDateInput.parentElement.classList.add('shake');
          setTimeout(() => {
            endDateInput.parentElement.classList.remove('shake');
          }, 500);
        }
        
        // Validate date range
        if (startDateInput && endDateInput && startDateInput.value && endDateInput.value) {
          const startDate = new Date(startDateInput.value);
          const endDate = new Date(endDateInput.value);
          
          if (startDate >= endDate) {
            startDateInput.classList.add('error');
            endDateInput.classList.add('error');
            if (rangeError) rangeError.classList.remove('hidden');
            errorMessages.push("Check-out date must be after check-in date.");
            isValid = false;
            
            // Add shake animation to both date inputs
            startDateInput.parentElement.classList.add('shake');
            endDateInput.parentElement.classList.add('shake');
            setTimeout(() => {
              startDateInput.parentElement.classList.remove('shake');
              endDateInput.parentElement.classList.remove('shake');
            }, 500);
          }
        }
        
        // Validate departure
        if (departureInput && !departureInput.value.trim()) {
          departureInput.classList.add('error');
          const errorEl = document.getElementById('departure-error');
          if (errorEl) errorEl.classList.remove('hidden');
          errorMessages.push("Please enter your departure location.");
          isValid = false;
          
          // Add shake animation
          departureInput.parentElement.classList.add('shake');
          setTimeout(() => {
            departureInput.parentElement.classList.remove('shake');
          }, 500);
        }
        break;
        
      case 1:
        // Step 2: Always valid
        isValid = true;
        break;
        
      case 2:
        // Step 3: Terms agreement
        const termsCheckbox = document.getElementById("terms");
        
        const termsWarning = document.getElementById('terms-warning');
        
        if (termsCheckbox && !termsCheckbox.checked) {
          if (termsWarning) termsWarning.classList.remove('hidden');
          errorMessages.push("Please agree to the terms to continue.");
          isValid = false;
          
          // Add shake animation
          termsCheckbox.parentElement.classList.add('shake');
          setTimeout(() => {
            termsCheckbox.parentElement.classList.remove('shake');
          }, 500);
        }
        break;
    }
    
    // Announce errors to screen readers
    if (errorRegion) {
      if (errorMessages.length > 0) {
        errorRegion.textContent = errorMessages.join(' ');
      } else {
        errorRegion.textContent = '';
      }
    }
    
    return isValid;
  }
  
  // Update next/generate button states based on validation
  function updateButtonStates() {
    const nextButton = nextButtons[currentStep];
    
    if (nextButton) {
      const isValid = validateCurrentStep();
      nextButton.disabled = !isValid;
      
      // Add subtle pulse animation when button becomes enabled
      if (isValid && nextButton.disabled) {
        nextButton.disabled = false;
        nextButton.classList.add('animate-pulse');
        setTimeout(() => {
          nextButton.classList.remove('animate-pulse');
        }, 500);
      } else if (!isValid) {
        nextButton.disabled = true;
      }
    }
  }
  
  // ========== SUMMARY FUNCTIONS ==========
  
  // Update trip summary for review step
  function updateSummary() {
    if (currentStep !== 2) return;
    
    try {
      // Update budget summary
      const budgetValue = document.getElementById("budget-input")?.value || "0";
      const currencyValue = document.getElementById("currency-select")?.value || "MAD";
      const budgetSummary = document.getElementById("summary-budget");
      if (budgetSummary) budgetSummary.textContent = formatCurrency(budgetValue, currencyValue);
      
      // Update dates summary
      const startDate = document.getElementById("start-date")?.value;
      const endDate = document.getElementById("end-date")?.value;
      const datesSummary = document.getElementById("summary-dates");
      const durationSummary = document.getElementById("summary-duration");
      
      if (datesSummary && durationSummary) {
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const options = { year: 'numeric', month: 'short', day: 'numeric' };
          
          datesSummary.textContent = 
            start.toLocaleDateString('en-US', options) + " - " + 
            end.toLocaleDateString('en-US', options);
          
          // Calculate duration
          const durationDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
          durationSummary.textContent = 
            durationDays + (durationDays === 1 ? " Day" : " Days");
          
          // Add flex dates note if checked
          const isFlexible = document.getElementById("flexible-dates")?.checked;
          if (isFlexible) {
            datesSummary.innerHTML += ' <span class="text-orange-600 dark:text-orange-500 text-sm transition-colors duration-200">(±3 days flexible)</span>';
          }
        } else {
          datesSummary.textContent = "Not selected yet";
          durationSummary.textContent = "Not calculated yet";
        }
      }
      
      // Update departure summary
      const departure = document.getElementById("departure-input")?.value;
      const departureSummary = document.getElementById("summary-departure");
      if (departureSummary) {
        departureSummary.textContent = departure ? departure : "Not selected yet";
      }
      
      // Update preferences summary
      const preferencesSummary = document.getElementById("preferences-summary");
      if (preferencesSummary) {
        preferencesSummary.innerHTML = '';
        
        const preferences = [
          { name: "culture", icon: "landmark", label: "Cultural Experiences" },
          { name: "nature", icon: "mountain", label: "Natural Wonders" },
          { name: "luxury", icon: "star", label: "Luxury Experiences" },
          { name: "sightseeing", icon: "camera", label: "Sightseeing" }
        ];
        
        let hasSelectedPreferences = false;
        
        preferences.forEach(pref => {
          const checkbox = document.querySelector(`input[name="${pref.name}"]`);
          if (checkbox && checkbox.checked) {
            hasSelectedPreferences = true;
            
            // Find the interest level
            const card = checkbox.closest('.preference-card');
            let interestLevel = "50";
            
            if (card) {
              const slider = card.querySelector('.interest-slider');
              if (slider) {
                interestLevel = slider.value;
              }
            }
            
            // Create preference item
            const prefItem = document.createElement('div');
            prefItem.className = 'flex items-center gap-4 mb-4';
            
            // Determine interest text and color
            let interestText, interestColor;
            const interestLabels = {
              0: "Very Low",
              25: "Low",
              50: "Medium",
              75: "High",
              100: "Very High"
            };
            
            // Find closest key
            const closestKey = Object.keys(interestLabels)
              .map(Number)
              .reduce((a, b) => {
                return Math.abs(b - interestLevel) < Math.abs(a - interestLevel) ? b : a;
              });
            
            interestText = interestLabels[closestKey];
            
            if (interestLevel < 25) {
              interestColor = "text-blue-500 dark:text-blue-400";
            } else if (interestLevel < 50) {
              interestColor = "text-blue-500 dark:text-blue-400";
            } else if (interestLevel < 75) {
              interestColor = "text-green-500 dark:text-green-400";
            } else {
              interestColor = "text-orange-500 dark:text-orange-400";
            }
            
            prefItem.innerHTML = `
              <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-full transition-colors duration-200">
                <i class="text-orange-600 dark:text-orange-500 fas fa-${pref.icon} transition-colors duration-200"></i>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900 dark:text-white transition-colors duration-200">${pref.label}</p>
                <div class="flex items-center mt-1">
                  <div class="bg-gray-200 dark:bg-gray-600 h-2 flex-1 rounded-full overflow-hidden transition-colors duration-200">
                    <div class="bg-orange-500 h-full rounded-full transition-colors duration-200" style="width: ${interestLevel}%"></div>
                  </div>
                  <span class="ml-2 text-sm ${interestColor} transition-colors duration-200">${interestText}</span>
                </div>
              </div>
            `;
            
            preferencesSummary.appendChild(prefItem);
          }
        });
        
        // If no preferences selected
        if (!hasSelectedPreferences) {
          preferencesSummary.innerHTML = '<p class="text-gray-500 dark:text-gray-400 transition-colors duration-200">No preferences selected</p>';
        }
      }
      
      // Update additional requirements
      const dietary = document.getElementById("dietary")?.value;
      const accessibility = document.getElementById("accessibility")?.value;
      const specialRequests = document.getElementById("special-requests")?.value;
      const additionalSummary = document.getElementById("summary-additional");
      
      if (additionalSummary) {
        let additionalText = [];
        if (dietary && dietary !== "No specific requirements") additionalText.push(dietary + " diet");
        if (accessibility && accessibility !== "No specific requirements") additionalText.push(accessibility);
        
        if (additionalText.length > 0) {
          additionalSummary.innerHTML = additionalText.join(", ");
          
          // Add special requests note if there are any
          if (specialRequests) {
            additionalSummary.innerHTML += ' <button class="text-orange-600 dark:text-orange-500 ml-2 hover:text-orange-700 dark:hover:text-orange-400 transition-colors duration-150" title="' + specialRequests.replace(/"/g, '&quot;') + '">(+ special requests)</button>';
          }
        } else {
          additionalSummary.textContent = "No specific requirements selected";
        }
      }
    } catch (error) {
      console.error("Error updating summary:", error);
    }
  }
  
  // Initialize the wizard when the page is loaded
  initWizard();
});