import api from './axiosInstance.js';

export const testimonialService = {
  list: () => api.get('/testimonials').then((r) => r.data),

  // admin
  listAdmin: () => api.get('/testimonials/admin/all').then((r) => r.data),
  create: (payload) => api.post('/testimonials', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/testimonials/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/testimonials/${id}`).then((r) => r.data),
};
