# Tsafira Travel Planner

A modern web application for planning personalized travel experiences in Morocco. This application allows users to explore destinations, create custom itineraries, and book authentic experiences with local guides.

## Project Structure

The application is built with Vanilla JavaScript and follows a modular architecture:

```
tsafira-travel-planner/
│
├── js/ - JavaScript modules 
│   ├── index.js - Main entry point that re-exports all modules
│   ├── ui.js - UI components (theme and mobile menu)
│   ├── api.js - API utilities
│   ├── auth.js - Authentication functionality
│   ├── config.js - Configuration and constants
│   ├── utils.js - Utility functions
│   ├── validate.js - Form validation
│   ├── loader.js - Partial loading logic
│   └── page-specific modules (index-page.js, city.js, etc.)
│
├── css/ - Stylesheets
│
├── partials/ - Reusable HTML fragments
│   ├── header.html
│   └── footer.html
│
├── pages/ - Main HTML pages
│   ├── index.html - Home page
│   ├── city.html - City detail page
│   └── ... other pages
│
└── data/ - Static data files
```

## Core Modules

### UI Module (ui.js)
Handles theme management (dark/light mode) and mobile menu functionality. This module consolidates functionality that was previously spread across multiple files.

### API Module (api.js)
Handles all API calls to backend services.

### Auth Module (auth.js)
Manages user authentication, signup, login, and profile management.

### Loader Module (loader.js)
Handles dynamic loading of HTML partials and components.

## Maintenance Guidelines

### Adding New Features

1. Add new features to the appropriate module
2. For UI components, extend the UI module
3. For new pages, create a dedicated page-specific module that imports from core modules

### Styling

1. Use Tailwind CSS for styling
2. All custom styles should respect dark mode with appropriate class conditionals
3. Use CSS variables for consistent theming

### JavaScript Code

1. Follow the modular pattern established
2. Import only what you need from modules
3. Use the `ui.js` module for theme and mobile menu functionality
4. Use the utility functions from `utils.js` where possible

## Theme Management

The theme system (dark/light mode) is managed by the UI module. It uses:

- A `dark` class on the `html` element
- localStorage for persistence
- Tailwind CSS dark mode classes

## Mobile Menu

The mobile menu is implemented in the UI module and:

- Is accessible and keyboard navigable
- Uses smooth animations
- Works consistently across all pages

## Browser Support

This application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- JS modules are structured for optimal loading
- Critical CSS is inlined
- Images are optimized