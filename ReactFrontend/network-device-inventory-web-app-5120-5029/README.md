# network-device-inventory-web-app-5120-5029

Multi-container project: ReactFrontend, FlaskBackendAPI, MongoDBDatabase.

Dependency Upgrade Summary (latest compatible as of update):
- ReactFrontend: React 18.3, React Router 6.26, Axios 1.7, Vite 5.4, TypeScript 5.6, ESLint 9, Prettier 3.
- FlaskBackendAPI: Flask 3.0, flask-cors 5.x, pymongo 4.8, motor 3.6, pythonping 1.1.5, pydantic 2.9, requests 2.32, httpx 0.27, gunicorn 23.
- MongoDBDatabase: No direct runtime deps; added guidance for future seed tooling.

Breaking-change adaptations:
- React Router v6 used with createBrowserRouter/RouterProvider.
- ESLint v9 flat config added (eslint.config.js).
- Flask 3.x app factory pattern and route decorator with .get.

Quickstart (local dev):
1) Start backend
- cd ../network-device-inventory-web-app-5120-5030/FlaskBackendAPI
- python -m venv .venv && source .venv/bin/activate
- pip install --upgrade pip && pip install -r requirements.txt
- cp .env.example .env   # optional
- python app.py
- Verify: GET http://localhost:3001/health  # backend defaults to port 3001

2) Start frontend (in a new shell)
- cd ReactFrontend
- npm install
- cp .env.example .env   # optional; default API base points to http://localhost:3001
- npm start
- Visit http://localhost:3000 (or the fallback port shown in Vite logs)
- Health UI: http://localhost:3000/status (confirms connection to backend /health)

Environment:
- ReactFrontend reads API base from VITE_API_BASE_URL (see ReactFrontend/.env.example). If not set, it defaults to http://localhost:3001.
- Backend CORS must allow the frontend origin (default http://localhost:3000). If Vite falls back to another port, update backend CORS origins accordingly.

Notes:
- The dev server binds to 0.0.0.0 and will automatically fallback to the next available port if 3000 is busy.
- If 3000 is not available in your environment, you can explicitly use: npm run start:3002
- If you change backend port, update VITE_API_BASE_URL in ReactFrontend/.env.

CORS configuration (backend):
- Ensure Flask CORS is enabled for origin http://localhost:3000 with credentials support, and that OPTIONS preflight is handled.
- Example (in Flask app factory or app.py):
  from flask_cors import CORS
  CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}}, supports_credentials=True, expose_headers=["Content-Type", "Authorization"])

Acceptance checklist:
- Frontend reads API base URL from import.meta.env.VITE_API_BASE_URL with default http://localhost:3001.
- Single API helper (src/config/api.ts) exports a configured Axios client.
- Visiting /status triggers GET /health and displays the result or a clear error.
- Backend CORS allows http://localhost:3000 and handles preflight OPTIONS.

Manual follow-ups:
- Wire real CRUD endpoints and MongoDB client in backend.
- Connect frontend to backend endpoints and implement UI per project spec.
