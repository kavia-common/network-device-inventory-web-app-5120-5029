import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:3001";

const apiKey = process.env.REACT_APP_API_KEY || "";

// Create Axios instance with interceptors for headers and error handling
const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach API key if provided
client.interceptors.request.use((config) => {
  if (apiKey) {
    config.headers["X-API-KEY"] = apiKey;
  }
  return config;
});

// Basic error interceptor to normalize errors
client.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error";
    return Promise.reject({
      message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
  }
);

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured API base URL used by the HTTP client. */
  return baseURL;
}

export default client;
