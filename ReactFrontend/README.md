# ReactFrontend

This frontend uses Vite + React 18 + TypeScript.

Commands:
- npm install
- npm run dev
- npm run build
- npm run preview

Environment:
- Copy `.env.example` to `.env` and set:
  - VITE_API_BASE_URL: Backend API base URL (default http://localhost:5000)
    - If running Vite dev server (default http://localhost:5173) and Flask backend on port 5000, the default works.

CORS:
- Ensure the backend allows your frontend origin (http://localhost:5173 by default).
- The backend includes flask-cors; set CORS_ALLOW_ORIGINS accordingly in the backend .env if needed.

Dependencies (pinned to latest compatible at time of update):
- react ^18.3.1
- react-dom ^18.3.1
- react-router-dom ^6.26.2
- axios ^1.7.7

DevDependencies:
- vite ^5.4.8
- @vitejs/plugin-react ^4.3.1
- typescript ^5.6.3
- eslint ^9.12.0 and @typescript-eslint ^8.8.1
- prettier ^3.3.3

Node >= 18.18.0 required.
