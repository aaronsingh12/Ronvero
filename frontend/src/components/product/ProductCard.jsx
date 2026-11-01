import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, BagIcon } from '../ui/Icons.jsx';
import Badge from '../ui/Badge.jsx';
import Rating from '../ui/Rating.jsx';
import ProductImageGallery from './ProductImageGallery.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useWishlistStore } from '../../store/useWishlistStore.js';
import { useCartStore } from '../../store/useCartStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { cn } from '../../utils/cn.js';

export default function ProductCard({ product, onQuickView }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product._id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const activeColor = product.colors?.[colorIndex];
  const primaryImage = activeColor?.images?.[0]?.url || product.images?.[0]?.url;

  // All frames for the active color (falling back to the product's own images).
  const galleryImages = useMemo(() => {
    const colorImgs = (activeColor?.images || []).map((im) => im?.url).filter(Boolean);
    if (colorImgs.length) return colorImgs;
    return (product.images || []).map((im) => im?.url).filter(Boolean);
  }, [activeColor, product.images]);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const totalStock = product.sizes?.reduce((sum, s) => sum + Number(s.stock || 0), 0) ?? 0;
  const inStock = totalStock > 0;

  const handleQuickAdd = (size) => {
    addItem(
      {
        productId: product._id,
        name: product.name,
        image: primaryImage,
        price: product.price,
        discountPrice: product.discountPrice,
        color: activeColor?.name,
        size: size.value,
        maxStock: size.stock,
      },
      1
    );
    setJustAdded(true);
    openCart();
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-graphite/5">
        <ProductImageGallery
          images={galleryImages}
          alt={product.name}
          to={`/product/${product.slug}`}
          isHovering={isHovering}
          resetKey={colorIndex}
        />

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {hasDiscount && <Badge type="sale">Sale</Badge>}
          {product.isNewArrival && !hasDiscount && <Badge type="new">New</Badge>}
          {product.isBestSeller && !product.isNewArrival && !hasDiscount && (
            <Badge type="bestseller">Best seller</Badge>
          )}
          {!inStock && <Badge type="outOfStock">Sold out</Badge>}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product._id)}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-mist/90 text-char shadow-soft backdrop-blur transition-transform hover:scale-110"
        >
          <HeartIcon size={17} filled={isWishlisted} className={isWishlisted ? 'text-ember' : ''} />
        </button>

        {onQuickView && (
          <motion.button
            type="button"
            onClick={() => onQuickView(product)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 8 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-3 left-3 right-3 z-10 hidden rounded-full bg-mist/95 py-2.5 text-center font-body text-xs font-semibold uppercase tracking-wideish text-char shadow-soft backdrop-blur md:block"
          >
            Quick view
          </motion.button>
        )}

        {inStock && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 12 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-x-3 bottom-3 z-10 hidden items-center gap-1.5 rounded-full bg-graphite/95 p-1.5 md:flex"
            style={{ pointerEvents: isHovering ? 'auto' : 'none' }}
          >
            <BagIcon size={15} className="ml-2 shrink-0 text-chalk/70" />
            <div className="flex flex-1 flex-wrap items-center gap-1">
              {product.sizes
                ?.filter((s) => s.stock > 0)
                .slice(0, 5)
                .map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => handleQuickAdd(s)}
                    className="rounded-full px-2.5 py-1 font-mono text-[11px] text-chalk transition-colors hover:bg-ember"
                  >
                    {s.value}
                  </button>
                ))}
            </div>
            {justAdded && <CheckPop />}
          </motion.div>
        )}
      </div>

      {product.colors?.length > 1 && (
        <div className="mt-2.5 flex gap-1.5">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColorIndex(i)}
              aria-label={c.name}
              className={cn(
                'h-4 w-4 rounded-full border transition-transform',
                i === colorIndex ? 'scale-110 border-char' : 'border-transparent'
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      )}

      <Link to={`/product/${product.slug}`} className="mt-2 flex flex-col gap-1">
        <h3 className="trace-underline inline w-fit font-body text-sm font-medium text-char">{product.name}</h3>
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className={hasDiscount ? 'text-ember' : 'text-char'}>
            {formatCurrency(hasDiscount ? product.discountPrice : product.price)}
          </span>
          {hasDiscount && <span className="text-char/40 line-through">{formatCurrency(product.price)}</span>}
        </div>
        {product.ratingsQuantity > 0 && <Rating value={product.ratingsAverage} count={product.ratingsQuantity} />}
      </Link>
    </motion.div>
  );
}

function CheckPop() {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember font-mono text-[10px] text-chalk"
    >
      ✓
    </motion.span>
  );
}
