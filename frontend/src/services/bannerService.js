import api from './axiosInstance.js';

export const bannerService = {
  list: (position) => api.get('/banners', { params: position ? { position } : {} }).then((r) => r.data),

  // admin
  listAdmin: () => api.get('/banners/admin/all').then((r) => r.data),
  create: (payload) => api.post('/banners', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/banners/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/banners/${id}`).then((r) => r.data),
};
