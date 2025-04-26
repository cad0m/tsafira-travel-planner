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
    
    // Current step tracker (0-based index)
    let currentStep = 0;
    
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
        
        // Setup interest levels
        setupInterestLevels();
        
        // Setup popular departures
        setupPopularDepartures();
        
        // Try to load saved progress - AFTER all UI setup
        const hasSavedData = loadSavedProgress();
        
        // Always show step 1 if no saved data, regardless of what may have been set
        if (!hasSavedData) {
          showStep(0);
        }
        
        // Update button states initially
        updateButtonStates();
        
        // Update summary
        updateSummary();
      } catch (error) {
        console.error("Error initializing wizard:", error);
        // Fallback to step 1 in case of error
        showStep(0);
      }
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
            step.classList.remove("bg-gray-200");
          } else {
            step.classList.remove("active-step");
            step.classList.add("bg-gray-200");
          }
        }
      });
      
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
      
      // Hide all steps with fade-out animation
      stepContainers.forEach((container, index) => {
        if (container) {
          if (index === currentStep && index !== stepIndex) {
            container.classList.add("fade-out");
            
            setTimeout(() => {
              container.style.display = "none";
              container.classList.remove("fade-out");
            }, 300);
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
        }, 300);
      }
      
      // Update progress indicators
      progressSteps.forEach((step, index) => {
        if (step) {
          if (index <= stepIndex) {
            step.classList.add("active-step");
            step.classList.remove("bg-gray-200");
          } else {
            step.classList.remove("active-step");
            step.classList.add("bg-gray-200");
          }
        }
      });
      
      // Update current step tracker
      currentStep = stepIndex;
      
      // Update summary if moving to review step
      if (stepIndex === 2) {
        updateSummary();
      }
      
      // Update button states based on validation
      updateButtonStates();
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
        
        // Show confirmation
        alert("Your progress has been saved successfully!");
      } catch (error) {
        console.error("Error saving data:", error);
        alert("There was an error saving your progress. Please try again.");
      }
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
          const activeBtn = card.querySelector('.interest-level-btn.active');
          if (activeBtn) {
            levels[name] = activeBtn.getAttribute('data-level') || activeBtn.textContent;
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
        
        if (formData.currency) document.getElementById("currency-select").value = formData.currency;
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
              
              // Show/hide interest levels
              const card = preferenceInputs[key].closest('.preference-card');
              if (card) {
                const interestLevel = card.querySelector('.mt-4');
                if (interestLevel) {
                  interestLevel.style.display = value ? 'block' : 'none';
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
                const buttons = card.querySelectorAll('.interest-level-btn');
                buttons.forEach(btn => {
                  btn.classList.remove('active');
                  if (btn.getAttribute('data-level') === level || btn.textContent === level) {
                    btn.classList.add('active');
                  }
                });
                
                // Update display text
                const valueDisplay = card.querySelector('.font-medium');
                if (valueDisplay) valueDisplay.textContent = level;
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
        
        // Show the saved step (only if it's valid)
        const targetStep = typeof formData.step === 'number' && formData.step >= 0 && formData.step < stepContainers.length 
          ? formData.step 
          : 0;
        
        showStep(targetStep);
        
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
      if (!document.getElementById("terms").checked) {
        document.getElementById("terms-warning").classList.remove("hidden");
        document.getElementById("error-region").textContent = "Please agree to the terms to continue.";
        return;
      }
      
      processingOverlay.classList.remove("hidden");
      
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
          processingStatus.textContent = statuses[statusIndex];
          statusIndex++;
        } else {
          clearInterval(statusInterval);
          // In a real application, this would redirect to the results page
          setTimeout(() => {
            processingOverlay.classList.add("hidden");
            alert("Your itinerary has been created! In a real application, you would be redirected to view it now.");
          }, 2000);
        }
      }, 1500);
    }
    
    // Setup budget slider and interactive elements
    function setupBudgetSlider() {
      const budgetSlider = document.getElementById("budget-slider");
      const budgetInput = document.getElementById("budget-input");
      const currencySelect = document.getElementById("currency-select");
      
      if (!budgetSlider || !budgetInput || !currencySelect) return;
      
      // Create or get tooltip container
      let tooltipContainer = budgetSlider.parentElement.querySelector(".relative");
      let valueTooltip;
      
      if (!tooltipContainer) {
        tooltipContainer = document.createElement("div");
        tooltipContainer.className = "relative";
        
        valueTooltip = document.createElement("div");
        valueTooltip.className = "absolute bg-orange-600 text-white px-2 py-1 rounded text-sm transform -translate-x-1/2 -translate-y-8 opacity-0 transition-opacity";
        valueTooltip.textContent = formatCurrency(budgetSlider.value, currencySelect.value);
        valueTooltip.style.left = "0px";
        
        tooltipContainer.appendChild(valueTooltip);
        
        // Insert tooltip container before the slider
        budgetSlider.parentNode.insertBefore(tooltipContainer, budgetSlider);
      } else {
        valueTooltip = tooltipContainer.querySelector("div");
      }
      
      // Create or get min/max labels container
      let labelsContainer = budgetSlider.nextElementSibling;
      if (!labelsContainer || !labelsContainer.classList.contains('flex')) {
        labelsContainer = document.createElement("div");
        labelsContainer.className = "flex justify-between text-sm text-gray-500 mt-1";
        
        // Create min label
        const minLabel = document.createElement("span");
        minLabel.textContent = formatCurrency(budgetSlider.min, currencySelect.value);
        
        // Create max label
        const maxLabel = document.createElement("span");
        maxLabel.textContent = formatCurrency(budgetSlider.max, currencySelect.value);
        
        // Add labels to container
        labelsContainer.appendChild(minLabel);
        labelsContainer.appendChild(maxLabel);
        
        // Insert after the slider
        budgetSlider.parentNode.insertBefore(labelsContainer, budgetSlider.nextSibling);
      }
      
      // Update input values and tooltip position
      function updateSliderValues() {
        if (!budgetSlider || !budgetInput) return;
        
        const value = budgetSlider.value;
        budgetInput.value = value;
        
        if (valueTooltip) {
          valueTooltip.textContent = formatCurrency(value, currencySelect.value);
          
          // Calculate position (percentage)
          const percentage = (value - budgetSlider.min) / (budgetSlider.max - budgetSlider.min);
          const sliderWidth = budgetSlider.offsetWidth;
          valueTooltip.style.left = (percentage * sliderWidth) + "px";
        }
        
        // Update min/max labels if they exist
        if (labelsContainer) {
          const labels = labelsContainer.querySelectorAll("span");
          if (labels.length >= 2) {
            labels[0].textContent = formatCurrency(budgetSlider.min, currencySelect.value);
            labels[1].textContent = formatCurrency(budgetSlider.max, currencySelect.value);
          }
        }
        
        // Update summary if on review step
        if (currentStep === 2) {
          updateSummary();
        }
      }
      
      // Show tooltip on slider interaction
      budgetSlider.addEventListener("input", () => {
        if (valueTooltip) {
          valueTooltip.classList.add("opacity-100");
        }
        updateSliderValues();
      });
      
      budgetSlider.addEventListener("change", () => {
        // Hide tooltip after a delay
        setTimeout(() => {
          if (valueTooltip) {
            valueTooltip.classList.remove("opacity-100");
          }
        }, 1000);
      });
      
      // Sync number input with slider
      budgetInput.addEventListener("input", () => {
        let value = parseInt(budgetInput.value);
        
        // Ensure value is within range
        if (isNaN(value)) value = budgetSlider.min;
        if (value < budgetSlider.min) value = budgetSlider.min;
        if (value > budgetSlider.max) value = budgetSlider.max;
        
        budgetSlider.value = value;
        updateSliderValues();
      });
      
      // Handle currency conversion
      currencySelect.addEventListener("change", () => {
        updateSliderValues();
      });
      
      // Initial update
      updateSliderValues();
    }
    
    // Format currency with thousand separators and currency symbol
    function formatCurrency(value, currency = "MAD") {
      // Add thousand separators
      const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
      // Add currency symbol or code
      switch (currency) {
        case "USD":
          return "$" + formattedValue;
        case "EUR":
          return "€" + formattedValue;
        default:
          return formattedValue + " MAD";
      }
    }
    
    // Setup interest level selectors for preferences
    function setupInterestLevels() {
      const preferenceCards = document.querySelectorAll(".preference-card");
      
      preferenceCards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        
        // Check if interest level already exists
        if (card.querySelector('.interest-level-display')) return;
        
        // Create interest level display
        const interestLevel = document.createElement('div');
        interestLevel.className = 'mt-4 pt-4 border-t border-gray-100';
        
        // Create level selector
        const levelSelector = document.createElement('div');
        levelSelector.className = 'flex justify-center gap-2 mt-2 flex-wrap';
        
        const levels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
        
        levels.forEach(level => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `interest-level-btn ${level === 'Medium' ? 'active' : ''}`;
          btn.textContent = level;
          btn.setAttribute('data-level', level);
          
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Only activate if the preference is checked
            if (checkbox.checked) {
              // Update active state
              levelSelector.querySelectorAll('button').forEach(b => {
                b.classList.remove('active');
              });
              this.classList.add('active');
              
              // Update interest value text
              interestValue.textContent = level;
              
              // Update summary if on review step
              if (currentStep === 2) {
                updateSummary();
              }
            }
            
            return false;
          });
          
          levelSelector.appendChild(btn);
        });
        
        // Create interest display
        const interestDisplay = document.createElement('div');
        interestDisplay.className = 'text-center text-sm text-gray-600 mb-2';
        
        const interestLabel = document.createElement('span');
        interestLabel.textContent = 'Interest Level: ';
        
        const interestValue = document.createElement('span');
        interestValue.className = 'font-medium';
        interestValue.textContent = 'Medium';
        
        interestDisplay.appendChild(interestLabel);
        interestDisplay.appendChild(interestValue);
        
        interestLevel.appendChild(interestDisplay);
        interestLevel.appendChild(levelSelector);
        
        // Add to card (initially hidden)
        interestLevel.style.display = checkbox.checked ? 'block' : 'none';
        card.appendChild(interestLevel);
        
        // Show/hide interest level selector based on checkbox
        checkbox.addEventListener('change', function() {
          interestLevel.style.display = this.checked ? 'block' : 'none';
          
          // Update summary if on review step
          if (currentStep === 2) {
            updateSummary();
          }
        });
      });
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
          
          // Set the airport value
          departureInput.value = this.textContent.trim();
          
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
          }
          
          // Validate end date
          if (endDateInput && !endDateInput.value) {
            endDateInput.classList.add('error');
            const errorEl = document.getElementById('end-date-error');
            if (errorEl) errorEl.classList.remove('hidden');
            errorMessages.push("Please select a check-out date.");
            isValid = false;
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
            }
          }
          
          // Validate departure
          if (departureInput && !departureInput.value.trim()) {
            departureInput.classList.add('error');
            const errorEl = document.getElementById('departure-error');
            if (errorEl) errorEl.classList.remove('hidden');
            errorMessages.push("Please enter your departure location.");
            isValid = false;
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
            let interestLevel = "Medium";
            
            if (card) {
              const activeBtn = card.querySelector('.interest-level-btn.active');
              if (activeBtn) {
                interestLevel = activeBtn.getAttribute('data-level') || activeBtn.textContent;
              }
            }
            
            // Create preference item
            const prefItem = document.createElement('div');
            prefItem.className = 'flex items-center gap-4';
            prefItem.innerHTML = `
              <i class="text-orange-600 fas fa-${pref.icon}"></i>
              <div>
                <p class="font-semibold">${pref.label}</p>
                <p class="text-gray-600">${interestLevel} Interest</p>
              </div>
            `;
            
            preferencesSummary.appendChild(prefItem);
          }
        });
        
        // If no preferences selected
        if (!hasSelectedPreferences) {
          preferencesSummary.innerHTML = '<p class="text-gray-500">No preferences selected</p>';
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
        
        additionalSummary.textContent = 
          additionalText.length > 0 
            ? additionalText.join(", ") + (specialRequests ? " (+ special requests)" : "")
            : "No specific requirements selected";
      }
    } catch (error) {
      console.error("Error updating summary:", error);
    }
  }
  
  // Clear all saved data and reset the form
  function clearSavedData() {
    try {
      localStorage.removeItem("tripWizardState");
      
      // Clear form fields
      if (document.getElementById("budget-input")) document.getElementById("budget-input").value = "5000";
      if (document.getElementById("budget-slider")) document.getElementById("budget-slider").value = "5000";
      if (document.getElementById("currency-select")) document.getElementById("currency-select").value = "MAD";
      if (document.getElementById("start-date")) document.getElementById("start-date").value = "";
      if (document.getElementById("end-date")) document.getElementById("end-date").value = "";
      if (document.getElementById("flexible-dates")) document.getElementById("flexible-dates").checked = false;
      if (document.getElementById("departure-input")) document.getElementById("departure-input").value = "";
      
      // Clear preferences
      const preferenceInputs = document.querySelectorAll('input[type="checkbox"]');
      preferenceInputs.forEach(input => {
        input.checked = false;
        
        // Hide interest levels
        const card = input.closest('.preference-card');
        if (card) {
          const interestLevel = card.querySelector('.mt-4');
          if (interestLevel) {
            interestLevel.style.display = 'none';
          }
        }
      });
      
      // Clear additional preferences
      if (document.getElementById("dietary")) document.getElementById("dietary").value = "No specific requirements";
      if (document.getElementById("accessibility")) document.getElementById("accessibility").value = "No specific requirements";
      if (document.getElementById("special-requests")) document.getElementById("special-requests").value = "";
      if (document.getElementById("email-copy")) document.getElementById("email-copy").checked = false;
      if (document.getElementById("terms")) document.getElementById("terms").checked = false;
      
      // Reset wizard state
      resetWizardState();
      
      // Update button states
      updateButtonStates();
      
      return true;
    } catch (error) {
      console.error("Error clearing saved data:", error);
      return false;
    }
  }
  
  // Add reset button functionality (if needed)
  const resetButton = document.getElementById("reset-btn");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all your data and start over?")) {
        clearSavedData();
      }
    });
  }
  
  // Initialize the wizard when the page is loaded
  initWizard();
});
