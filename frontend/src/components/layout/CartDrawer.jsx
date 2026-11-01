import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon, PlusIcon, MinusIcon, TrashIcon } from '../ui/Icons.jsx';
import Button from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useCartStore } from '../../store/useCartStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js';
import { orderService } from '../../services/orderService.js';
import { drawerVariants, overlayFade } from '../../animations/variants.js';

export default function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const toApiPayload = useCartStore((s) => s.toApiPayload);
  const localSubtotal = useCartStore((s) => s.subtotal());
  const couponCode = useCartStore((s) => s.couponCode);
  const setCouponCode = useCartStore((s) => s.setCouponCode);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [pricing, setPricing] = useState(null);
  const [pricingError, setPricingError] = useState('');
  const [pricingLoading, setPricingLoading] = useState(false);

  const hasUnavailableItems = items.some((item) => item.unavailable || Number(item.maxStock) === 0);
  const checkoutBlocked = pricingLoading || Boolean(pricingError) || hasUnavailableItems;

  useLockBodyScroll(isOpen);

  useEffect(() => {
    setCouponInput(couponCode);
  }, [couponCode]);

  useEffect(() => {
    if (!isOpen || items.length === 0) {
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
  }, [isOpen, items, couponCode]);

  const applyCoupon = async () => {
    setCouponError('');
    const nextCouponCode = couponInput.trim().toUpperCase();
    if (!nextCouponCode) {
      setCouponCode('');
      return;
    }
    try {
      await orderService.getPricing(toApiPayload(), nextCouponCode);
      setCouponCode(nextCouponCode);
    } catch (err) {
      setCouponError(err?.response?.data?.message || 'Could not apply that code');
    }
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
            onClick={closeCart}
          />
          <motion.aside
            variants={drawerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-mist shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-graphite/10 p-5">
              <h2 className="font-display text-lg font-semibold text-char">Your bag ({items.length})</h2>
              <button type="button" onClick={closeCart} aria-label="Close cart">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="font-body text-char/60">Your bag is empty.</p>
                  <Link to="/shop" onClick={closeCart} className="btn-ghost">
                    Start shopping
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="h-24 w-20 rounded-xl object-cover" />
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="font-body text-sm text-char">{item.name}</p>
                        <p className="font-mono text-xs text-char/60">
                          {item.color} · {item.size}
                        </p>
                        <p className="font-mono text-sm text-char">
                          {formatCurrency(item.discountPrice || item.price)}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-graphite/15 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              disabled={item.quantity <= 1}
                              className="disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              <MinusIcon size={14} />
                            </button>
                            <span className="w-4 text-center font-mono text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item, item.quantity + 1)}
                              aria-label="Increase quantity"
                              disabled={item.unavailable || item.quantity >= Number(item.maxStock)}
                              className="disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              <PlusIcon size={14} />
                            </button>
                          </div>
                          <button type="button" onClick={() => removeItem(item)} aria-label="Remove item">
                            <TrashIcon size={16} className="text-char/50 hover:text-ember" />
                          </button>
                        </div>
                        {(item.unavailable || Number.isFinite(Number(item.maxStock))) && (
                          <p className={`font-mono text-[10px] ${item.unavailable ? 'text-ember' : 'text-char/50'}`}>
                            {item.unavailable ? 'This variant is unavailable.' : `${item.maxStock} available`}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-graphite/10 p-5">
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 rounded-full border border-graphite/15 bg-transparent px-4 py-2.5 font-mono text-xs uppercase outline-none focus:border-char"
                  />
                  <button type="button" onClick={applyCoupon} className="btn-ghost !px-5 !py-2.5 text-xs">
                    Apply
                  </button>
                </div>
                {couponError && <p className="-mt-2 font-mono text-xs text-ember">{couponError}</p>}
                {couponCode && !couponError && (
                  <p className="-mt-2 font-mono text-xs text-trace">Code "{couponCode}" applied</p>
                )}
                {pricingError && <p className="-mt-2 font-mono text-xs text-ember">{pricingError}</p>}

                <div className="flex flex-col gap-1.5 font-mono text-sm">
                  <div className="flex justify-between text-char/70">
                    <span>Subtotal</span>
                    <span>{formatCurrency(pricing?.itemsPrice ?? localSubtotal)}</span>
                  </div>
                  {pricing?.discountAmount > 0 && (
                    <div className="flex justify-between text-trace">
                      <span>Discount</span>
                      <span>-{formatCurrency(pricing.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-char/70">
                    <span>Shipping</span>
                    <span>{pricing ? (pricing.shippingPrice === 0 ? 'Free' : formatCurrency(pricing.shippingPrice)) : '—'}</span>
                  </div>
                  <div className="flex justify-between text-char/70">
                    <span>Tax</span>
                    <span>{pricing ? formatCurrency(pricing.taxPrice) : '—'}</span>
                  </div>
                  <div className="mt-1 flex justify-between border-t border-graphite/10 pt-2 text-base font-semibold text-char">
                    <span>Total</span>
                    <span>{formatCurrency(pricing?.totalPrice ?? localSubtotal)}</span>
                  </div>
                </div>

                {checkoutBlocked ? (
                  <Button variant="accent" className="w-full" disabled>
                    {pricingLoading ? 'Checking cart...' : 'Resolve cart to checkout'}
                  </Button>
                ) : (
                  <Link to="/checkout" onClick={closeCart}>
                    <Button variant="accent" className="w-full">
                      Checkout
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
