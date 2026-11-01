import api from './axiosInstance.js';

export const productService = {
  list: (params) => api.get('/products', { params }).then((r) => r.data),
  getFilters: () => api.get('/products/filters').then((r) => r.data),
  getBySlug: (slug) => api.get(`/products/${slug}`).then((r) => r.data),
  getRelated: (id) => api.get(`/products/${id}/related`).then((r) => r.data),
  getByIds: (ids) => api.post('/products/by-ids', { ids }).then((r) => r.data),
  getReviews: (id) => api.get(`/products/${id}/reviews`).then((r) => r.data),
  createReview: (id, payload) => api.post(`/products/${id}/reviews`, payload).then((r) => r.data),

  // admin
  listAdmin: (params) => api.get('/products/admin/all', { params }).then((r) => r.data),
  create: (payload) => api.post('/products', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/products/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
};
