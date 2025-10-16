import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Axios instance configured with baseURL and JWT interceptors.
 * - Attaches Authorization Bearer token if present in localStorage.
 * - On 401 Unauthorized, clears auth and redirects to /login.
 */
const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token
http.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth');
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore parse error
    }
  }
  return config;
});

// Handle 401
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem('auth');
      } catch {}
      // soft notify
      if (typeof window !== 'undefined') {
        window.alert('Your session has expired. Please log in again.');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default http;
