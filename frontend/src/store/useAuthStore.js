import { create } from 'zustand';
import api from '../services/axiosInstance.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  status: 'idle', // 'idle' | 'loading' | 'ready'

  isAdmin: () => get().user?.role === 'admin',

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: null, accessToken: null, status: 'ready' }),

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    set({ user: data.user, accessToken: data.accessToken, status: 'ready' });
    return data.user;
  },

  async login(identifier, password) {
    const { data } = await api.post('/auth/login', { identifier, password });
    set({ user: data.user, accessToken: data.accessToken, status: 'ready' });
    return data.user;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, accessToken: null, status: 'ready' });
    }
  },

  async updateProfile(payload) {
    const { data } = await api.put('/users/profile', payload);
    set({ user: data.user });
    return data.user;
  },

  // Runs once on app boot: tries to silently exchange the httpOnly refresh
  // cookie (if any) for a fresh access token, then loads the profile.
  async hydrate() {
    set({ status: 'loading' });
    try {
      const { data: refreshData } = await api.post('/auth/refresh');
      set({ accessToken: refreshData.accessToken });
      const { data: meData } = await api.get('/auth/me');
      set({ user: meData.user, status: 'ready' });
    } catch (err) {
      set({ user: null, accessToken: null, status: 'ready' });
    }
  },
}));
