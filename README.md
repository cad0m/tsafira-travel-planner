# Tsafira - Morocco Travel Website

A beautifully designed and modular website for Tsafira, a personalized Morocco travel planning service.

## Project Structure

```
tsafira/
├── pages/                           # All standalone HTML pages
│     └── index.html                 # Home page with data-page="index"
├── partials/                        # Header/footer fragments
│     ├── header.html                # Global header component
│     └── footer.html                # Global footer component
├── css/
│     ├── main.css                   # Global layout & component styles
│     └── index.css                  # Index-page specific styles
├── js/
│     ├── loader.js                  # Inject partials into pages
│     ├── main.js                    # Entry point, delegates by data-page
│     ├── config.js                  # CSS selectors & default constants
│     ├── utils.js                   # DOM helpers (qs, qsa, on)
│     ├── api.js                     # Fetch wrappers (apiGet, apiPost)
│     ├── validate.js                # Form validation helpers
│     └── index-page.js              # Index.html-specific JavaScript
└── README.md                        # This file
```

## Setup

The project uses vanilla JavaScript with ES modules and TailwindCSS for styling. No build tools are required for development.

### Key Features

- **Modular Structure**: Clean separation of concerns across multiple files
- **Component-Based Design**: Header, footer, and other UI components are reusable
- **Pure ES Modules**: No bundler required, using native JavaScript modules
- **Dynamic Content Loading**: Partials are loaded via JavaScript
- **Page-Specific Logic**: Each page loads only the JavaScript it needs

### Conventions

- HTML pages use `data-page` attribute to identify which JS module to load
- Header and footer are loaded into placeholder elements in each page
- JavaScript follows single responsibility principle with dedicated modules:
  - `config.js`: Centralized configuration and selectors
  - `utils.js`: DOM utility functions
  - `api.js`: Fetch wrapper functions
  - `validate.js`: Form validation helpers
  - Each page has its own JS module (e.g., `index-page.js`)

## Browser Support

This project uses modern JavaScript features that are supported in all current major browsers.