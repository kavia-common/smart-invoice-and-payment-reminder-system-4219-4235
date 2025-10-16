import http from './http';

// PUBLIC_INTERFACE
export const InvoiceApi = {
  /** List invoices with optional query params. */
  list: (params) => http.get('/api/invoices', { params }),
  /** Get invoice by id. */
  get: (id) => http.get(`/api/invoices/${id}`),
  /** Create new invoice. */
  create: (data) => http.post('/api/invoices', data),
  /** Update invoice. */
  update: (id, data) => http.put(`/api/invoices/${id}`, data),
  /** Delete invoice. */
  remove: (id) => http.delete(`/api/invoices/${id}`),
};
