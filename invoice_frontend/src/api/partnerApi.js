import http from './http';

// PUBLIC_INTERFACE
export const PartnerApi = {
  list: (params) => http.get('/api/partners', { params }),
  get: (id) => http.get(`/api/partners/${id}`),
  create: (data) => http.post('/api/partners', data),
  update: (id, data) => http.put(`/api/partners/${id}`, data),
  remove: (id) => http.delete(`/api/partners/${id}`),
};
