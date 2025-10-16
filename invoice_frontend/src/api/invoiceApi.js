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

  /** Download generated PDF for invoice (as blob). */
  pdf: (id) =>
    http.get(`/api/invoices/${id}/pdf`, { responseType: 'blob' }),

  /** Upload an attachment file for an invoice (multipart/form-data). */
  uploadAttachment: (id, file) => {
    const form = new FormData();
    form.append('file', file);
    return http.post(`/api/invoices/${id}/attachments`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** List attachments for an invoice. */
  listAttachments: (id) => http.get(`/api/invoices/${id}/attachments`),

  /** Download specific attachment (as blob). */
  downloadAttachment: (id, attachmentId) =>
    http.get(`/api/invoices/${id}/attachments/${attachmentId}`, {
      responseType: 'blob',
    }),

  /** Remove an attachment from an invoice. */
  removeAttachment: (id, attachmentId) =>
    http.delete(`/api/invoices/${id}/attachments/${attachmentId}`),

  /** Add a payment record to invoice. */
  addPayment: (id, payment) => http.post(`/api/invoices/${id}/payments`, payment),

  /** Trigger a reminder send for this invoice (test or real send depending backend). */
  sendReminder: (id, channel, test = false) =>
    http.post(`/api/invoices/${id}/reminders`, { channel, test }),
};
