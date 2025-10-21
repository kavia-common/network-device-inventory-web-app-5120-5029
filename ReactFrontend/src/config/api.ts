/* eslint-disable no-console */
import axios, { AxiosInstance } from 'axios';

// PUBLIC_INTERFACE
export function getApiBaseUrl(): string {
  /**
   * Returns the API base URL from Vite environment configuration.
   * Falls back to http://localhost:3001 when not provided.
   */
  const raw = import.meta?.env?.VITE_API_BASE_URL;
  const base = typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : 'http://localhost:3001';
  if (!raw) {
    console.warn('[api] VITE_API_BASE_URL not set; using default:', base);
  }
  try {
    // Validate URL format early to catch obvious misconfigurations.
    // eslint-disable-next-line no-new
    new URL(base);
  } catch (e) {
    console.warn('[api] Invalid VITE_API_BASE_URL, falling back to http://localhost:3001:', raw, e);
    return 'http://localhost:3001';
  }
  return base.replace(/\/+$/, ''); // trim trailing slashes
}

// PUBLIC_INTERFACE
export function createApiClient(overrides?: { baseURL?: string }): AxiosInstance {
  /**
   * Creates a configured Axios client using the resolved API base URL.
   * Includes sensible defaults for timeouts and JSON handling.
   */
  const baseURL = (overrides?.baseURL ?? getApiBaseUrl()).replace(/\/+$/, '');
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true, // allow cookies if backend chooses to set them
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });

  instance.interceptors.request.use((config) => {
    // Diagnostic logging in development
    if (import.meta.env.DEV) {
      console.info('[api:req]', config.method?.toUpperCase(), `${config.baseURL}${config.url}`);
    }
    return config;
  });

  instance.interceptors.response.use(
    (resp) => resp,
    (error) => {
      // Provide simple normalized error logs in dev
      if (import.meta.env.DEV) {
        console.warn('[api:err]', error?.response?.status, error?.message, error?.config?.url);
      }
      return Promise.reject(error);
    }
  );

  console.info('[api] Axios client configured with baseURL:', baseURL);
  return instance;
}

// PUBLIC_INTERFACE
export const api: AxiosInstance = createApiClient();
