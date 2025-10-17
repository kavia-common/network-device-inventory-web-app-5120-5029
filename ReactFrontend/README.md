# ReactFrontend

This frontend uses Vite + React 18 + TypeScript.

Commands:
- npm install
- npm run dev       # serves on http://localhost:3000
- npm run build
- npm run preview   # previews build on http://localhost:3000

Environment:
- Copy `.env.example` to `.env` (optional). Defaults:
  - VITE_API_BASE_URL: If not set, the app defaults to http://localhost:3001
  - VITE_PORT: Port for Vite dev server and preview (default 3000)

Notes:
- The Vite config binds host: true (0.0.0.0) and defaults to port 3000 to satisfy preview container expectations.
- strictPort is enabled; if 3000 is taken, Vite will exit with a clear error instead of auto-switching ports.
- If your backend runs on a different port (e.g., 5000 locally), set VITE_API_BASE_URL accordingly.

Health/Status:
- Visit `/status` to see a simple UI status panel.
- The panel calls GET `${VITE_API_BASE_URL || http://localhost:3001}/health` and displays results.

CORS:
- Ensure the backend allows your frontend origin (http://localhost:3000 by default).
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
   - npm run dev
   - Confirm Vite logs: Local: http://localhost:3000 and Network: http://0.0.0.0:3000

3) Browser verification:
   - Visit http://localhost:3000/
   - Visit http://localhost:3000/status
     - Expect "Backend health: ok" and JSON from /health.
     - If error, open browser console and see logs starting with [Status] for diagnostics.

Troubleshooting:
- If port 3000 is busy, free it or set VITE_PORT in .env. Vite will not auto-switch due to strictPort.
- If running within a container, ensure port 3000 is exposed and mapped to host.
- If you changed backend port, update VITE_API_BASE_URL and restart dev server.
