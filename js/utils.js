/**
 * Utility functions for DOM manipulation and common operations
 */

/**
 * Query selector shorthand
 * @param {string} selector - CSS selector
 * @param {Element|Document} context - Context to search within, defaults to document
 * @returns {Element|null} - First matching element or null
 */
export function qs(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query selector all shorthand
 * @param {string} selector - CSS selector
 * @param {Element|Document} context - Context to search within, defaults to document
 * @returns {NodeList} - All matching elements
 */
export function qsa(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * Add event listener with support for multiple events
 * @param {Element|Window|Document} element - Target element
 * @param {string|string[]} eventNames - Event name or array of event names
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 */
export function on(element, eventNames, handler, options = {}) {
  const events = Array.isArray(eventNames) ? eventNames : [eventNames];
  events.forEach(event => {
    element.addEventListener(event, handler, options);
  });
}

/**
 * Remove event listener with support for multiple events
 * @param {Element|Window|Document} element - Target element
 * @param {string|string[]} eventNames - Event name or array of event names
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 */
export function off(element, eventNames, handler, options = {}) {
  const events = Array.isArray(eventNames) ? eventNames : [eventNames];
  events.forEach(event => {
    element.removeEventListener(event, handler, options);
  });
}

/**
 * Creates an element with attributes and children
 * @param {string} tagName - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|string|Element} children - Child nodes
 * @returns {Element} - Created element
 */
export function createElement(tagName, attributes = {}, children = []) {
  const element = document.createElement(tagName);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Add children
  if (children) {
    if (Array.isArray(children)) {
      children.forEach(child => {
        appendToElement(element, child);
      });
    } else {
      appendToElement(element, children);
    }
  }
  
  return element;
}

/**
 * Helper function to append a child to an element
 * @param {Element} parent - Parent element
 * @param {string|Element} child - Child to append
 */
function appendToElement(parent, child) {
  if (typeof child === 'string' || typeof child === 'number') {
    parent.appendChild(document.createTextNode(child));
  } else if (child instanceof Node) {
    parent.appendChild(child);
  }
}

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 200) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} - Unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Loads HTML components into specified elements
 * @param {string} elementId - ID of element to load component into
 * @param {string} componentUrl - URL of the component file
 * @returns {Promise<void>}
 */
export async function loadComponent(elementId, componentUrl) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found for component loading`);
    return;
  }
  
  try {
    console.log(`Loading component from: ${componentUrl}`);
    const response = await fetch(componentUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch component: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    element.innerHTML = html;
    
    // Execute any scripts in the loaded component
    const componentScripts = element.querySelectorAll('script');
    componentScripts.forEach(script => {
      const newScript = document.createElement('script');
      
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      
      document.body.appendChild(newScript);
    });
    
    console.log(`Successfully loaded component into #${elementId}`);
  } catch (error) {
    console.error(`Error loading component ${componentUrl}:`, error);
    element.innerHTML = `
      <div class="p-4 text-red-600 dark:text-red-400">
        Failed to load component. Please refresh the page.
      </div>
    `;
  }
}