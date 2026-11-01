import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isCartOpen: false,
  isWishlistOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,
  activeMegaMenu: null, // nav label of the open mega menu, or null

  openCart: () => set({ isCartOpen: true, isWishlistOpen: false }),
  closeCart: () => set({ isCartOpen: false }),

  openWishlist: () => set({ isWishlistOpen: true, isCartOpen: false }),
  closeWishlist: () => set({ isWishlistOpen: false }),

  openSearch: () => set({ isSearchOpen: true, isMobileMenuOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),

  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  setActiveMegaMenu: (label) => set({ activeMegaMenu: label }),

  closeAllOverlays: () =>
    set({
      isCartOpen: false,
      isWishlistOpen: false,
      isSearchOpen: false,
      isMobileMenuOpen: false,
      activeMegaMenu: null,
    }),
}));
