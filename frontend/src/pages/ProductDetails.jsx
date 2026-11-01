import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Rating from '../components/ui/Rating.jsx';
import Button from '../components/ui/Button.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { TextSkeleton, SkeletonBox } from '../components/ui/Skeleton.jsx';
import { PlusIcon, MinusIcon, TruckIcon, ShieldIcon, RefreshIcon, BagIcon, StarIcon } from '../components/ui/Icons.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { productService } from '../services/productService.js';
import { useCartStore } from '../store/useCartStore.js';
import { useUIStore } from '../store/useUIStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { trackRecentlyViewed, getRecentlyViewed } from '../utils/recentlyViewed.js';
import { fadeUp, viewportOnce } from '../animations/variants.js';
import { cn } from '../utils/cn.js';
import { useCatalogStore } from '../store/useCatalogStore.js';

export default function ProductDetails() {
  const catalogVersion = useCatalogStore((state) => state.version);
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [colorIndex, setColorIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({});
  const [tab, setTab] = useState('description');

  const [reviews, setReviews] = useState({ reviews: [], breakdown: [] });
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  useEffect(() => {
    setLoading(true);
    setColorIndex(0);
    setActiveImage(0);
    setSelectedSize(null);
    setQuantity(1);

    productService
      .getBySlug(slug)
      .then((data) => {
        setProduct(data.product);
        trackRecentlyViewed(data.product._id);

        productService.getRelated(data.product._id).then((r) => setRelated(r.products));
        productService.getReviews(data.product._id).then((r) => setReviews(r));

        const recentIds = getRecentlyViewed(data.product._id);
        if (recentIds.length) productService.getByIds(recentIds).then((r) => setRecentlyViewed(r.products));
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug, catalogVersion]);

  if (loading) return <ProductDetailsSkeleton />;
  if (!product) {
    return (
      <div className="mx-auto max-w-8xl px-5 py-24 text-center">
        <p className="font-display text-2xl text-char">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-ember underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const activeColor = product.colors?.[colorIndex];
  const gallery = activeColor?.images?.length ? activeColor.images : product.images;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const totalStock = product.sizes?.reduce((sum, s) => sum + Number(s.stock || 0), 0) ?? 0;
  const selectedStock = Number(selectedSize?.stock || 0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(1.8)' });
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    const added = addItem(
      {
        productId: product._id,
        name: product.name,
        image: gallery[0]?.url,
        price: product.price,
        discountPrice: product.discountPrice,
        color: activeColor?.name,
        size: selectedSize.value,
        maxStock: selectedSize.stock,
      },
      Math.min(quantity, selectedStock)
    );
    if (added) openCart();
  };

  return (
    <div className="mx-auto max-w-8xl px-5 py-10 md:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex shrink-0 gap-3 md:flex-col">
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  'h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 md:h-20 md:w-16',
                  activeImage === i ? 'border-char' : 'border-transparent'
                )}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div
            className="relative flex-1 overflow-hidden rounded-3xl bg-graphite/5"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomStyle({})}
          >
            <img
              src={gallery[activeImage]?.url}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover transition-transform duration-200 ease-out"
              style={zoomStyle}
            />
          </div>
        </div>

        {/* Purchase panel */}
        <div className="md:sticky md:top-24 md:self-start">
          <span className="eyebrow">{product.category?.name}</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-char md:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            {product.ratingsQuantity > 0 && <Rating value={product.ratingsAverage} count={product.ratingsQuantity} />}
          </div>

          <div className="mt-4 flex items-center gap-3 font-mono text-xl">
            <span className={hasDiscount ? 'text-ember' : 'text-char'}>
              {formatCurrency(hasDiscount ? product.discountPrice : product.price)}
            </span>
            {hasDiscount && <span className="text-char/40 line-through">{formatCurrency(product.price)}</span>}
          </div>

          <p className="mt-4 font-body text-[15px] leading-relaxed text-char/70">{product.shortDescription}</p>

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-mono text-xs uppercase tracking-wideish text-char/60">
                Color — {activeColor?.name}
              </p>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setColorIndex(i);
                      setActiveImage(0);
                    }}
                    className={cn(
                      'h-8 w-8 rounded-full border-2 transition-transform',
                      i === colorIndex ? 'scale-110 border-char' : 'border-transparent'
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-mono text-xs uppercase tracking-wideish text-char/60">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    disabled={s.stock === 0}
                    onClick={() => {
                      setSelectedSize(s);
                      setQuantity((currentQuantity) => Math.min(currentQuantity, Number(s.stock)));
                    }}
                    className={cn(
                      'rounded-full border px-4 py-2 font-mono text-xs transition-colors',
                      s.stock === 0 && 'cursor-not-allowed border-char/10 text-char/30 line-through',
                      s.stock > 0 && selectedSize?.value === s.value && 'border-graphite bg-graphite text-chalk',
                      s.stock > 0 && selectedSize?.value !== s.value && 'border-char/20 text-char hover:border-char'
                    )}
                  >
                    {s.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-4 rounded-full border border-graphite/15 px-3 py-2.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease"
                disabled={quantity <= 1}
              >
                <MinusIcon size={15} />
              </button>
              <span className="w-4 text-center font-mono text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(selectedStock, q + 1))}
                aria-label="Increase"
                disabled={!selectedSize || quantity >= selectedStock}
              >
                <PlusIcon size={15} />
              </button>
            </div>
            <Button
              variant="accent"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={totalStock === 0 || !selectedSize}
            >
              <BagIcon size={16} /> {totalStock === 0 ? 'Sold out' : selectedSize ? 'Add to bag' : 'Select a size'}
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-graphite/10 pt-6 font-mono text-[11px] text-char/60">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <TruckIcon size={18} />
              Free shipping over ₹2,999
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <RefreshIcon size={18} />
              30-day returns
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <ShieldIcon size={18} />
              Secure checkout
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 border-t border-graphite/10 pt-8">
        <div className="flex gap-6 border-b border-graphite/10">
          {['description', 'specifications', 'shipping', `reviews (${reviews.count || 0})`].map((label) => {
            const key = label.split(' ')[0];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  'border-b-2 pb-3 font-body text-sm capitalize transition-colors',
                  tab === key ? 'border-char text-char' : 'border-transparent text-char/50'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="max-w-2xl py-8">
          {tab === 'description' && <p className="font-body leading-relaxed text-char/80">{product.description}</p>}

          {tab === 'specifications' && (
            <dl className="flex flex-col gap-3">
              {product.specifications?.map((spec) => (
                <div key={spec.key} className="flex justify-between border-b border-graphite/5 pb-2 font-body text-sm">
                  <dt className="text-char/60">{spec.key}</dt>
                  <dd className="text-char">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {tab === 'shipping' && <p className="font-body leading-relaxed text-char/80">{product.shippingInfo}</p>}

          {tab === 'reviews' && (
            <ReviewsPanel
              productId={product._id}
              reviews={reviews}
              onReviewAdded={() => productService.getReviews(product._id).then(setReviews)}
            />
          )}
        </div>
      </div>

      {related.length > 0 && (
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mt-16">
          <h2 className="mb-8 font-display text-2xl font-semibold text-char">You may also like</h2>
          <ProductGrid products={related} columns={4} />
        </motion.section>
      )}

      {recentlyViewed.length > 0 && (
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mt-16">
          <h2 className="mb-8 font-display text-2xl font-semibold text-char">Recently viewed</h2>
          <ProductGrid products={recentlyViewed} columns={4} />
        </motion.section>
      )}
    </div>
  );
}

function ReviewsPanel({ productId, reviews, onReviewAdded }) {
  const maxCount = Math.max(1, ...reviews.breakdown.map((b) => b.count));
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await productService.createReview(productId, form);
      setForm({ rating: 5, title: '', comment: '' });
      onReviewAdded();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not submit your review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        {reviews.breakdown.map((b) => (
          <div key={b.star} className="flex items-center gap-3 font-mono text-xs text-char/60">
            <span className="w-10">{b.star} star</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-graphite/10">
              <div className="h-full bg-ember" style={{ width: `${(b.count / maxCount) * 100}%` }} />
            </div>
            <span className="w-6 text-right">{b.count}</span>
          </div>
        ))}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-graphite/10 p-5">
          <p className="font-body text-sm font-medium text-char">Write a review</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm((f) => ({ ...f, rating: star }))}
                aria-label={`${star} stars`}
              >
                <StarIcon size={20} filled={star <= form.rating} className={star <= form.rating ? 'text-ember' : 'text-graphite/20'} />
              </button>
            ))}
          </div>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Review title (optional)"
            className="rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          <textarea
            required
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            placeholder="Share your experience with this product…"
            rows={3}
            className="rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {error && <p className="font-mono text-xs text-ember">{error}</p>}
          <Button type="submit" variant="primary" magnetic={false} className="w-fit !px-6 !py-2.5 text-xs">
            {submitting ? 'Submitting…' : 'Submit review'}
          </Button>
        </form>
      ) : (
        <p className="font-body text-sm text-char/60">
          <Link to="/login" className="text-ember underline">
            Log in
          </Link>{' '}
          to write a review.
        </p>
      )}

      <div className="flex flex-col gap-6">
        {reviews.reviews.length === 0 && <p className="font-body text-char/50">No reviews yet — be the first.</p>}
        {reviews.reviews.map((r) => (
          <div key={r._id} className="border-b border-graphite/10 pb-6">
            <div className="flex items-center justify-between">
              <p className="font-body text-sm font-medium text-char">{r.user?.name}</p>
              <Rating value={r.rating} size={12} />
            </div>
            {r.title && <p className="mt-2 font-body text-sm font-medium text-char">{r.title}</p>}
            <p className="mt-1 font-body text-sm text-char/70">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-8xl px-5 py-10 md:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        <SkeletonBox className="aspect-[4/5] w-full" />
        <div className="flex flex-col gap-4">
          <SkeletonBox className="h-6 w-1/3" />
          <SkeletonBox className="h-10 w-2/3" />
          <TextSkeleton lines={3} />
        </div>
      </div>
    </div>
  );
}
