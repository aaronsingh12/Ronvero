import api from './axiosInstance.js';

export const categoryService = {
  list: (params) => api.get('/categories', { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/categories/${slug}`).then((r) => r.data),

  // admin
  listAdmin: () => api.get('/categories/admin/all').then((r) => r.data),
  create: (payload) => api.post('/categories', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/categories/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};
