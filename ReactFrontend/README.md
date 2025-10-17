# ReactFrontend

This frontend uses Vite + React 18 + TypeScript.

Commands:
- npm install
- npm start         # serves on http://localhost:3000 by default (alias: npm run dev), auto-falls back if busy
- npm run dev       # same as npm start
- npm run start:3002 # explicitly start on port 3002 if 3000 is blocked by your environment
- npm run build
- npm run preview   # previews build on http://localhost:3000 by default (auto-fallback enabled)

Environment:
- Copy `.env.example` to `.env` (optional). Defaults:
  - VITE_API_BASE_URL: If not set, the app defaults to http://localhost:3001
  - PORT or VITE_PORT: Preferred port for Vite dev server and preview (default 3000)
  - VITE_HMR_CLIENT_PORT: Public port used by the HMR client (defaults to PORT/VITE_PORT)

Notes:
- The Vite config binds host: true (0.0.0.0) for both dev and preview, and allows automatic port fallback (strictPort=false).
- If 3000 is unavailable, Vite chooses the next available port (e.g., 3001/3002). A startup banner logs the final host/port and warns if a fallback was used.
- If your backend runs on a different port (e.g., 5000 locally), set VITE_API_BASE_URL accordingly.

Health/Readiness:
- Static readiness: visit `/health.html` (should return HTTP 200 and body `OK`).
- UI status page: visit `/status` to see a simple panel that calls GET `${VITE_API_BASE_URL || http://localhost:3001}/health` and displays results.

CORS:
- Ensure the backend allows your frontend origin (http://localhost:3000 by default or whichever fallback port you use).
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

Verification steps:
1) Start backend (port 3001 by default) and verify:
   - GET http://localhost:3001/health returns 200.

2) Start frontend:
   - cd ReactFrontend
   - npm install
   - cp .env.example .env   # optional
   - npm start
   - Confirm Vite logs include "Dev server ready at ..." and show the chosen host/port.
   - If port 3000 is blocked and the environment doesn't allow auto-fallback, run: npm run start:3002

3) Browser verification:
   - Visit http://localhost:3000/ (or the fallback port shown in logs)
   - Visit /health.html (should display "OK")
   - Visit /status
     - Expect "Backend health: ok" and JSON from /health.
     - If error, open browser console and see logs starting with [Status] for diagnostics.

Troubleshooting:
- If HMR fails to connect over websockets in a preview environment, set VITE_HMR_CLIENT_PORT to the public port (commonly 3000 or 3002).
- If running within a container, ensure the chosen port is exposed and mapped, and that the server binds to 0.0.0.0 (host: true).
- If you changed backend port, update VITE_API_BASE_URL and restart dev server.
