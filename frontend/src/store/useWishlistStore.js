import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/axiosInstance.js';
import { useAuthStore } from './useAuthStore.js';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      productIds: [],

      isWishlisted: (productId) => get().productIds.includes(productId),

      async toggle(productId) {
        const already = get().productIds.includes(productId);
        set({
          productIds: already
            ? get().productIds.filter((id) => id !== productId)
            : [...get().productIds, productId],
        });

        // Best-effort server sync for logged-in users — local state is the source of truth for guests
        if (useAuthStore.getState().user) {
          try {
            await api.post(`/users/wishlist/${productId}`);
          } catch (err) {
            // non-fatal — local wishlist state already updated
          }
        }
      },

      setFromServer: (productIds) => set({ productIds }),
    }),
    {
      name: 'ronvero-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
