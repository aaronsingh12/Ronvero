import { create } from 'zustand';
import { notificationService } from '../services/notificationService.js';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  status: 'idle',

  async load(params = { limit: 50 }) {
    set({ status: 'loading' });
    try {
      const data = await notificationService.list(params);
      set({ notifications: data.notifications || [], unreadCount: data.unreadCount || 0, status: 'ready' });
      return data;
    } catch (error) {
      set({ status: 'error' });
      throw error;
    }
  },

  async markRead(id) {
    const wasUnread = get().notifications.find((notification) => notification._id === id && !notification.read);
    const data = await notificationService.markRead(id);

    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      ),
      unreadCount: data.unreadCount ?? Math.max(0, state.unreadCount - (wasUnread ? 1 : 0)),
    }));

    return data.notification;
  },

  async markAllRead() {
    await notificationService.markAllRead();
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
      unreadCount: 0,
    }));
  },
}));
