import http from './http';

// PUBLIC_INTERFACE
export const SettingsApi = {
  /** Fetch all settings including channels and preferences. */
  get: () => http.get('/api/settings'),
  /** Update settings (partial or full). */
  update: (data) => http.put('/api/settings', data),
  /** Toggle a specific channel on/off. */
  toggleChannel: (channel, enabled) => http.post('/api/settings/channel', { channel, enabled }),
  /** Trigger a test reminder across selected channels. */
  testReminder: (payload) => http.post('/api/settings/test-reminder', payload),
};
