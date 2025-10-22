# Network Device Inventory - Integration Guide

This document explains how to run the multi-container app locally.

## Services and Ports
- MongoDB: 5001 (host) -> 27017 (container)
- Flask Backend API: 3001
- React Frontend: 3000

## Environment Variables
- React (.env in ReactFrontend):
  - REACT_APP_API_BASE_URL=http://localhost:3001
  - REACT_APP_API_KEY= (optional)

- Flask (.env in FlaskBackendAPI):
  - API_KEY= (optional; must match REACT_APP_API_KEY if set)
  - MONGODB_URI=mongodb://localhost:5001
  - MONGODB_DB_NAME=device_inventory
  - MONGODB_COLLECTION_DEVICES=devices
  - MONGODB_COLLECTION_LOGS=logs
  - PYTHONPING_ENABLED=true
  - FLASK_RUN_PORT=3001
  - CORS_ALLOWED_ORIGINS=http://localhost:3000

- MongoDB (mongodb.env in MongoDBDatabase):
  - MONGO_PORT=5001

## Startup Order
1. Start MongoDB on port 5001
2. Start Flask Backend on port 3001
3. Start React Frontend on port 3000

Ensure the frontend base URL points to the backend and that API keys match if enabled.
