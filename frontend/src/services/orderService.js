import api from './axiosInstance.js';

export const orderService = {
  getPricing: (items, couponCode) => api.post('/orders/pricing', { items, couponCode }).then((r) => r.data),
  createPaymentIntent: (items, couponCode) =>
    api.post('/orders/create-payment-intent', { items, couponCode }).then((r) => r.data),
  create: (payload) => api.post('/orders', payload).then((r) => r.data),
  getMine: (params) => api.get('/orders/my', { params }).then((r) => r.data),
  getById: (id) => api.get(`/orders/${id}`).then((r) => r.data),

  // admin
  listAdmin: (params) => api.get('/orders', { params }).then((r) => r.data),
  updateStatus: (id, payload) => api.put(`/orders/${id}/status`, payload).then((r) => r.data),
  getAnalytics: () => api.get('/orders/analytics/summary').then((r) => r.data),
};
