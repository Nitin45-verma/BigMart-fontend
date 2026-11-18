import axios from 'axios';

// Sanitize base URL: strip duplicate slashes and ensure proper /api/v1 ending
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'https://bigmart-backend.onrender.com/api/v1';
const trimmedBase = rawBaseURL.trim().replace(/([^:]\/)\/+/g, '$1').replace(/\/+$/, '');
const baseURL = trimmedBase.endsWith('/api/v1') ? trimmedBase : `${trimmedBase}/api/v1`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const setupInterceptors = (store) => {
  api.interceptors.request.use(
    (config) => {
      // Normalize relative URL if it starts with duplicate slashes
      if (config.url && config.url.startsWith('//')) {
        config.url = config.url.replace(/^\/+/, '/');
      }
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Safe check to prevent infinite loops if the /me endpoint itself is 401
        if (error.config.url !== '/auth/me') {
          store.dispatch({ type: 'auth/forceLogout' });
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;
