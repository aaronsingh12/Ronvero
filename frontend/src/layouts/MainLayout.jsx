import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnnouncementBar from '../components/layout/AnnouncementBar.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import MobileMenu from '../components/layout/MobileMenu.jsx';
import SearchOverlay from '../components/layout/SearchOverlay.jsx';
import CartDrawer from '../components/layout/CartDrawer.jsx';
import WishlistDrawer from '../components/layout/WishlistDrawer.jsx';
import Footer from '../components/layout/Footer.jsx';
import LoadingScreen from '../components/ui/LoadingScreen.jsx';
import PageTransition from '../components/ui/PageTransition.jsx';
import { useLenis } from '../hooks/useLenis.js';
import { useCatalogUpdates } from '../hooks/useCatalogUpdates.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useCartStore } from '../store/useCartStore.js';
import { useCatalogStore } from '../store/useCatalogStore.js';
import { productService } from '../services/productService.js';

export default function MainLayout() {
  const location = useLocation();
  const authStatus = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);
  const cartItems = useCartStore((s) => s.items);
  const reconcileStock = useCartStore((s) => s.reconcileStock);
  const catalogVersion = useCatalogStore((s) => s.version);
  const [assetsSettled, setAssetsSettled] = useState(false);
  const cartInventorySignature = useMemo(
    () =>
      cartItems
        .map((item) => `${item.productId}:${item.size}:${item.quantity}`)
        .sort()
        .join('|'),
    [cartItems]
  );
  const cartProductIds = useMemo(() => [...new Set(cartItems.map((item) => item.productId))], [cartItems]);

  useLenis();
  useCatalogUpdates();

  useEffect(() => {
    hydrate();
    // A tick to let fonts/first paint settle before we say "ready" to the loading screen
    const t = setTimeout(() => setAssetsSettled(true), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (cartProductIds.length === 0) return undefined;

    let cancelled = false;
    productService
      .getByIds(cartProductIds)
      .then(({ products }) => {
        if (!cancelled) reconcileStock(products);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [cartInventorySignature, cartProductIds, catalogVersion, reconcileStock]);

  return (
    <div className="flex min-h-screen flex-col">
      <LoadingScreen ready={authStatus === 'ready' && assetsSettled} />

      <AnnouncementBar />
      <Navbar />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <WishlistDrawer />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
