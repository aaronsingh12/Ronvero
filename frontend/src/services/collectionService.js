import api from './axiosInstance.js';

export const collectionService = {
  list: (params) => api.get('/collections', { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/collections/${slug}`).then((r) => r.data),

  // admin
  listAdmin: () => api.get('/collections/admin/all').then((r) => r.data),
  create: (payload) => api.post('/collections', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/collections/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/collections/${id}`).then((r) => r.data),
};
