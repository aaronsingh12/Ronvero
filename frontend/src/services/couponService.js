import api from './axiosInstance.js';

export const couponService = {
  validate: (code, cartTotal) => api.post('/coupons/validate', { code, cartTotal }).then((r) => r.data),

  // admin
  listAdmin: () => api.get('/coupons').then((r) => r.data),
  create: (payload) => api.post('/coupons', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/coupons/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/coupons/${id}`).then((r) => r.data),
};
