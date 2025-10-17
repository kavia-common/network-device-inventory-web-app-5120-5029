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
- Static health: http://localhost:3000/health.html
- Health UI: http://localhost:3000/status (confirms connection to backend /health)

Notes:
- The dev server binds to 0.0.0.0 and will automatically fallback to the next available port if 3000 is busy.
- If 3000 is not available in your environment, you can explicitly use: npm run start:3002
- If you change backend port, update VITE_API_BASE_URL in ReactFrontend/.env.
- For CORS, ensure backend allows http://localhost:3000 (or the fallback port) (see backend .env.example).

Environment variables introduced:
- ReactFrontend: VITE_API_BASE_URL (documented in ReactFrontend/.env.example)
- FlaskBackendAPI: PORT (default 3001), APP_VERSION, and MongoDB settings (documented in FlaskBackendAPI/.env.example)

Manual follow-ups:
- Wire real CRUD endpoints and MongoDB client in backend.
- Connect frontend to backend endpoints and implement UI per project spec.
