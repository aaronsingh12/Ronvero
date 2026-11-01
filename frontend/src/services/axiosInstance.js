import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore.js';

const apiOrigin = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

const api = axios.create({
  baseURL: apiOrigin ? `${apiOrigin}/api` : '/api',
  withCredentials: true, // send the httpOnly refresh cookie
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isAuthRoute = config?.url?.includes('/auth/login') || config?.url?.includes('/auth/refresh');

    if (response?.status === 401 && !config._retried && !isAuthRoute) {
      config._retried = true;
      try {
        // Only ever run one refresh call at a time, even if several requests 401 together
        refreshPromise = refreshPromise || api.post('/auth/refresh');
        const { data } = await refreshPromise;
        refreshPromise = null;
        useAuthStore.getState().setAccessToken(data.accessToken);
        config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(config);
      } catch (refreshError) {
        refreshPromise = null;
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
