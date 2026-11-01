import { create } from 'zustand';
import { categoryService } from '../services/categoryService.js';

/**
 * Shared, cached list of the REAL catalog categories — so the navbar, mobile
 * menu, and footer all link to categories that actually exist (instead of the
 * old hard-coded taxonomy that pointed at empty shop pages).
 */
export const useCategoriesStore = create((set, get) => ({
  categories: [],
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    try {
      const data = await categoryService.list();
      set({ categories: data.categories || [], loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  reload: async () => {
    try {
      const data = await categoryService.list();
      set({ categories: data.categories || [], loaded: true });
    } catch {
      /* keep whatever we already have */
    }
  },
}));
