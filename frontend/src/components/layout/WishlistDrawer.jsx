import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon, HeartIcon, BagIcon } from '../ui/Icons.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useWishlistStore } from '../../store/useWishlistStore.js';
import { useCartStore } from '../../store/useCartStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js';
import { productService } from '../../services/productService.js';
import { drawerVariants, overlayFade } from '../../animations/variants.js';

export default function WishlistDrawer() {
  const isOpen = useUIStore((s) => s.isWishlistOpen);
  const closeWishlist = useUIStore((s) => s.closeWishlist);
  const productIds = useWishlistStore((s) => s.productIds);
  const toggle = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const [products, setProducts] = useState([]);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen || productIds.length === 0) {
      setProducts([]);
      return;
    }
    productService
      .getByIds(productIds)
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]));
  }, [isOpen, productIds]);

  const handleMoveToBag = (product) => {
    const firstAvailableSize = product.sizes?.find((s) => s.stock > 0);
    if (!firstAvailableSize) return;
    addItem(
      {
        productId: product._id,
        name: product.name,
        image: product.images?.[0]?.url,
        price: product.price,
        discountPrice: product.discountPrice,
        color: product.colors?.[0]?.name,
        size: firstAvailableSize.value,
        maxStock: firstAvailableSize.stock,
      },
      1
    );
    openCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayFade}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-50 bg-graphite/50 backdrop-blur-sm"
            onClick={closeWishlist}
          />
          <motion.aside
            variants={drawerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-mist shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-graphite/10 p-5">
              <h2 className="font-display text-lg font-semibold text-char">Wishlist ({productIds.length})</h2>
              <button type="button" onClick={closeWishlist} aria-label="Close wishlist">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {productIds.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <HeartIcon size={28} className="text-char/30" />
                  <p className="font-body text-char/60">Nothing saved yet.</p>
                  <Link to="/shop" onClick={closeWishlist} className="btn-ghost">
                    Browse the shop
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  {products.map((product) => (
                    <li key={product._id} className="flex gap-4">
                      <Link to={`/product/${product.slug}`} onClick={closeWishlist}>
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          className="h-24 w-20 rounded-xl object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="font-body text-sm text-char">{product.name}</p>
                        <p className="font-mono text-sm text-char">
                          {formatCurrency(product.discountPrice || product.price)}
                        </p>
                        <div className="mt-1 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleMoveToBag(product)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-graphite px-3 py-1.5 font-mono text-[11px] text-chalk"
                          >
                            <BagIcon size={13} /> Move to bag
                          </button>
                          <button
                            type="button"
                            onClick={() => toggle(product._id)}
                            className="font-mono text-[11px] text-char/50 underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
