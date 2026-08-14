import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Priority: find the active token based on what's available
      // Only one role should be active at a time
      const superAdminToken = localStorage.getItem('superAdminToken');
      const adminToken = localStorage.getItem('adminToken');
      let userToken = null;

      const userData = sessionStorage.getItem('userData');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          userToken = parsed.token;
        } catch {
          // Invalid session data
        }
      }

      // Use the most specific token available (only one should be active)
      const token = superAdminToken || adminToken || userToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear all auth data on 401
        sessionStorage.removeItem('userData');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('superAdminToken');
        sessionStorage.removeItem('adminData');
        sessionStorage.removeItem('superAdminData');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
