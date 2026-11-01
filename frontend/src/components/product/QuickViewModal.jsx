import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CloseIcon } from '../ui/Icons.jsx';
import Rating from '../ui/Rating.jsx';
import Button from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useCartStore } from '../../store/useCartStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js';
import { overlayFade } from '../../animations/variants.js';
import { cn } from '../../utils/cn.js';

export default function QuickViewModal({ product, onClose }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  useLockBodyScroll(Boolean(product));

  useEffect(() => {
    setColorIndex(0);
    setSelectedSize(null);
  }, [product]);

  if (!product) return null;

  const activeColor = product.colors?.[colorIndex];
  const image = activeColor?.images?.[0]?.url || product.images?.[0]?.url;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    const added = addItem(
      {
        productId: product._id,
        name: product.name,
        image,
        price: product.price,
        discountPrice: product.discountPrice,
        color: activeColor?.name,
        size: selectedSize.value,
        maxStock: selectedSize.stock,
      },
      1
    );
    if (added) {
      openCart();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          variants={overlayFade}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl bg-mist shadow-lift md:grid-cols-2"
          >
            <div className="relative aspect-square md:aspect-auto">
              <img src={image} alt={product.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-mist/90 text-char shadow-soft"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-6 md:p-8">
              <div>
                <h2 className="font-display text-2xl font-semibold text-char">{product.name}</h2>
                {product.ratingsQuantity > 0 && (
                  <Rating value={product.ratingsAverage} count={product.ratingsQuantity} className="mt-1.5" />
                )}
              </div>

              <div className="flex items-center gap-2 font-mono text-lg">
                <span className={hasDiscount ? 'text-ember' : 'text-char'}>
                  {formatCurrency(hasDiscount ? product.discountPrice : product.price)}
                </span>
                {hasDiscount && <span className="text-char/40 line-through">{formatCurrency(product.price)}</span>}
              </div>

              {product.colors?.length > 0 && (
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-wideish text-char/60">
                    Color — {activeColor?.name}
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColorIndex(i)}
                        className={cn(
                          'h-7 w-7 rounded-full border-2 transition-transform',
                          i === colorIndex ? 'scale-110 border-char' : 'border-transparent'
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-wideish text-char/60">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        disabled={s.stock === 0}
                        onClick={() => setSelectedSize(s)}
                        className={cn(
                          'rounded-full border px-3.5 py-2 font-mono text-xs transition-colors',
                          s.stock === 0 && 'cursor-not-allowed border-char/10 text-char/30 line-through',
                          s.stock > 0 &&
                            selectedSize?.value === s.value &&
                            'border-graphite bg-graphite text-chalk',
                          s.stock > 0 &&
                            selectedSize?.value !== s.value &&
                            'border-char/20 text-char hover:border-char'
                        )}
                      >
                        {s.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto flex flex-col gap-3 pt-2">
                <Button variant="accent" onClick={handleAddToCart} disabled={!selectedSize}>
                  {selectedSize ? 'Add to bag' : 'Select a size'}
                </Button>
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-center font-body text-sm text-char/70 underline underline-offset-4"
                >
                  View full details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
