import http from './http';

// PUBLIC_INTERFACE
export const TemplateApi = {
  list: (params) => http.get('/api/templates', { params }),
  get: (id) => http.get(`/api/templates/${id}`),
  create: (data) => http.post('/api/templates', data),
  update: (id, data) => http.put(`/api/templates/${id}`, data),
  remove: (id) => http.delete(`/api/templates/${id}`),
};
