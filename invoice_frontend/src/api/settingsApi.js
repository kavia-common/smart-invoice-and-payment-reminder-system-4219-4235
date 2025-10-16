import http from './http';

// PUBLIC_INTERFACE
export const SettingsApi = {
  get: () => http.get('/api/settings'),
  update: (data) => http.put('/api/settings', data),
};
