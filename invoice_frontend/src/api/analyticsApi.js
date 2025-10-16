import http from './http';

// PUBLIC_INTERFACE
export const AnalyticsApi = {
  overview: () => http.get('/api/analytics/overview'),
  payments: (params) => http.get('/api/analytics/payments', { params }),
  outstanding: () => http.get('/api/analytics/outstanding'),
};
