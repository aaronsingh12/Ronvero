import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, MinusIcon, TrashIcon, BagIcon } from '../components/ui/Icons.jsx';
import Button from '../components/ui/Button.jsx';
import ProductRail from '../components/home/ProductRail.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { useCartStore } from '../store/useCartStore.js';
import { orderService } from '../services/orderService.js';
import { productService } from '../services/productService.js';

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const toApiPayload = useCartStore((s) => s.toApiPayload);
  const localSubtotal = useCartStore((s) => s.subtotal());
  const couponCode = useCartStore((s) => s.couponCode);

  const [pricing, setPricing] = useState(null);
  const [pricingError, setPricingError] = useState('');
  const [pricingLoading, setPricingLoading] = useState(false);
  const [recommended, setRecommended] = useState([]);

  const hasUnavailableItems = items.some((item) => item.unavailable || Number(item.maxStock) === 0);
  const checkoutBlocked = pricingLoading || Boolean(pricingError) || hasUnavailableItems;

  useEffect(() => {
    if (items.length === 0) {
      setPricing(null);
      setPricingError('');
      setPricingLoading(false);
      return;
    }
    let cancelled = false;
    setPricingLoading(true);
    setPricingError('');
    orderService
      .getPricing(toApiPayload(), couponCode)
      .then((data) => {
        if (!cancelled) setPricing(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setPricing(null);
          setPricingError(error?.response?.data?.message || 'Could not confirm current stock and pricing');
        }
      })
      .finally(() => {
        if (!cancelled) setPricingLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, couponCode]);

  useEffect(() => {
    productService.list({ isBestSeller: true, limit: 4 }).then((data) => setRecommended(data.products));
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-8xl flex-col items-center gap-4 px-5 py-28 text-center">
        <BagIcon size={32} className="text-char/30" />
        <h1 className="font-display text-2xl text-char">Your bag is empty</h1>
        <Link to="/shop">
          <Button variant="primary">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-8xl px-5 py-10 md:px-8">
      <h1 className="mb-8 font-display text-3xl font-semibold text-char md:text-4xl">Your bag</h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_360px]">
        <ul className="flex flex-col divide-y divide-graphite/10">
          {items.map((item) => (
            <li key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-5 py-6">
              <img src={item.image} alt={item.name} className="h-32 w-24 rounded-2xl object-cover" />
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="font-body text-base text-char">{item.name}</p>
                <p className="font-mono text-xs text-char/60">
                  {item.color} · {item.size}
                </p>
                {item.unavailable || Number(item.maxStock) === 0 ? (
                  <p className="font-mono text-xs text-ember">This size is no longer available</p>
                ) : (
                  <p className="font-mono text-xs text-char/50">{item.maxStock} available</p>
                )}
                <p className="font-mono text-sm text-char">{formatCurrency(item.discountPrice || item.price)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-4 rounded-full border border-graphite/15 px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      aria-label="Decrease"
                      disabled={item.quantity <= 1}
                    >
                      <MinusIcon size={14} />
                    </button>
                    <span className="w-4 text-center font-mono text-xs">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      aria-label="Increase"
                      disabled={item.unavailable || item.quantity >= Number(item.maxStock)}
                    >
                      <PlusIcon size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item)}
                    className="flex items-center gap-1.5 font-mono text-xs text-char/50 hover:text-ember"
                  >
                    <TrashIcon size={14} /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-3xl border border-graphite/10 p-6">
          <h2 className="font-display text-lg font-semibold text-char">Order summary</h2>
          {couponCode && <p className="mt-2 font-mono text-xs text-trace">Coupon {couponCode} applied</p>}
          {pricingError && <p className="mt-2 font-mono text-xs text-ember">{pricingError}</p>}
          <div className="mt-4 flex flex-col gap-2 font-mono text-sm">
            <div className="flex justify-between text-char/70">
              <span>Subtotal</span>
              <span>{formatCurrency(pricing?.itemsPrice ?? localSubtotal)}</span>
            </div>
            <div className="flex justify-between text-char/70">
              <span>Shipping</span>
              <span>{pricing ? (pricing.shippingPrice === 0 ? 'Free' : formatCurrency(pricing.shippingPrice)) : '—'}</span>
            </div>
            <div className="flex justify-between text-char/70">
              <span>Tax</span>
              <span>{pricing ? formatCurrency(pricing.taxPrice) : '—'}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-graphite/10 pt-3 text-base font-semibold text-char">
              <span>Total</span>
              <span>{formatCurrency(pricing?.totalPrice ?? localSubtotal)}</span>
            </div>
          </div>
          {checkoutBlocked ? (
            <Button variant="accent" className="mt-5 w-full" disabled>
              {pricingLoading ? 'Checking cart…' : 'Resolve cart to checkout'}
            </Button>
          ) : (
            <Link to="/checkout">
              <Button variant="accent" className="mt-5 w-full">
                Checkout
              </Button>
            </Link>
          )}
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mt-10">
          <ProductRail eyebrow="You might like" title="Complete the fit" products={recommended} />
        </div>
      )}
    </div>
  );
}
