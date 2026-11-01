import api from './axiosInstance.js';

export const userService = {
  getAddresses: () => api.get('/users/addresses').then((r) => r.data),
  addAddress: (payload) => api.post('/users/addresses', payload).then((r) => r.data),
  updateAddress: (id, payload) => api.put(`/users/addresses/${id}`, payload).then((r) => r.data),
  removeAddress: (id) => api.delete(`/users/addresses/${id}`).then((r) => r.data),

  getWishlist: () => api.get('/users/wishlist').then((r) => r.data),

  // admin
  listAdmin: (params) => api.get('/users', { params }).then((r) => r.data),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }).then((r) => r.data),
  remove: (id) => api.delete(`/users/${id}`).then((r) => r.data),
};
