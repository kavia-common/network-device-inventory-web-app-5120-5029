# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Environment Variables

Create a `.env` file based on `.env.example`:

- REACT_APP_API_BASE_URL: Base URL of the Flask Backend API (default local: http://localhost:3001)
- REACT_APP_API_KEY: Optional API key sent as X-API-KEY header to the backend

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open http://localhost:3000 to view it in your browser.

## Cross-Container Startup Order

For local development:
1) Start MongoDB on port 5001
2) Start Flask Backend API on port 3001
3) Start React Frontend on port 3000

Ensure REACT_APP_API_BASE_URL points to the backend URL (e.g., http://localhost:3001).

## Customization

See `src/App.css` for theme variables and component styles.

## Learn More

To learn React, check out the React documentation: https://reactjs.org/
