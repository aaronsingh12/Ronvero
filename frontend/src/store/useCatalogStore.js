import { create } from 'zustand';

export const useCatalogStore = create((set) => ({
  version: 0,
  refresh: () => set((state) => ({ version: state.version + 1 })),
}));
