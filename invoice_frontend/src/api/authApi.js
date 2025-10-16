import http from './http';

// PUBLIC_INTERFACE
export const AuthApi = {
  /** Login with email and password. */
  login: (payload) => http.post('/api/auth/login', payload),
  /** Register a new user. */
  register: (payload) => http.post('/api/auth/register', payload),
  /** Get current profile. */
  me: () => http.get('/api/auth/me'),
};
