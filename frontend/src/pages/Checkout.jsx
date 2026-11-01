import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutStepper from '../components/checkout/CheckoutStepper.jsx';
import StripePaymentForm from '../components/checkout/StripePaymentForm.jsx';
import AddressForm from '../components/account/AddressForm.jsx';
import Button from '../components/ui/Button.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { useCartStore } from '../store/useCartStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { orderService } from '../services/orderService.js';
import { userService } from '../services/userService.js';
import { stripePromise, isStripeConfigured } from '../services/stripeClient.js';
import { cn } from '../utils/cn.js';

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const toApiPayload = useCartStore((s) => s.toApiPayload);
  const couponCode = useCartStore((s) => s.couponCode);
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(isStripeConfigured ? 'stripe' : 'cod');
  const [pricing, setPricing] = useState(null);
  const [pricingError, setPricingError] = useState('');
  const [pricingLoading, setPricingLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items, navigate]);

  useEffect(() => {
    if (user) userService.getAddresses().then((data) => setSavedAddresses(data.addresses));
  }, [user]);

  useEffect(() => {
    let active = true;
    setPricingLoading(true);
    setPricingError('');
    setClientSecret(null);
    orderService
      .getPricing(toApiPayload(), couponCode)
      .then((data) => {
        if (active) setPricing(data);
      })
      .catch((err) => {
        if (!active) return;
        setPricing(null);
        setPricingError(err?.response?.data?.message || 'Your cart could not be verified.');
      })
      .finally(() => {
        if (active) setPricingLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, couponCode]);

  const canCheckout = Boolean(pricing) && !pricingError && !pricingLoading;

  useEffect(() => {
    if (step === 4 && paymentMethod === 'stripe' && canCheckout && !clientSecret) {
      orderService
        .createPaymentIntent(toApiPayload(), couponCode)
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => setOrderError(err?.response?.data?.message || 'Could not start payment'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paymentMethod, clientSecret, couponCode, canCheckout]);

  const placeOrder = async (paymentResult) => {
    if (!canCheckout) {
      setOrderError(pricingError || 'Your cart is still being verified.');
      return;
    }

    setPlacingOrder(true);
    setOrderError('');
    try {
      const { order } = await orderService.create({
        items: toApiPayload(),
        shippingAddress: address,
        paymentMethod,
        paymentResult,
        couponCode,
      });
      clearCart();
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      setOrderError(err?.response?.data?.message || 'Could not place your order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:px-8">
      <h1 className="mb-8 font-display text-3xl font-semibold text-char">Checkout</h1>
      <CheckoutStepper currentStep={step} />

      {step === 1 && (
        <div className="flex flex-col gap-6">
          {savedAddresses.length > 0 && !address && (
            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs uppercase tracking-wideish text-char/50">Saved addresses</p>
              {savedAddresses.map((a) => (
                <button
                  key={a._id}
                  type="button"
                  onClick={() => setAddress(a)}
                  className="rounded-2xl border border-graphite/15 p-4 text-left font-body text-sm hover:border-char"
                >
                  <p className="font-medium text-char">{a.fullName}</p>
                  <p className="text-char/60">
                    {a.line1}, {a.city}, {a.state} {a.postalCode}
                  </p>
                </button>
              ))}
              <p className="font-mono text-xs text-char/40">— or enter a new address below —</p>
            </div>
          )}
          <AddressForm
            defaultValues={address}
            submitLabel="Continue to shipping"
            onSubmit={(data) => {
              setAddress(data);
              setStep(2);
            }}
          />
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-graphite/15 p-5">
            <p className="font-body text-sm font-medium text-char">Standard shipping</p>
            <p className="mt-1 font-mono text-xs text-char/60">Delivered in 3–5 business days</p>
            <p className="mt-3 font-mono text-sm text-char">
              {pricing?.shippingPrice === 0 ? 'Free' : formatCurrency(pricing?.shippingPrice ?? 99)}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" magnetic={false} onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" magnetic={false} onClick={() => setStep(3)} disabled={!canCheckout}>
              Continue to payment
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={!isStripeConfigured}
              onClick={() => setPaymentMethod('stripe')}
              className={cn(
                'rounded-2xl border p-4 text-left font-body text-sm',
                paymentMethod === 'stripe' ? 'border-char' : 'border-graphite/15',
                !isStripeConfigured && 'cursor-not-allowed opacity-40'
              )}
            >
              <p className="font-medium text-char">Card payment</p>
              <p className="text-char/60">{isStripeConfigured ? 'Secured by Stripe' : 'Add a Stripe key to enable'}</p>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={cn(
                'rounded-2xl border p-4 text-left font-body text-sm',
                paymentMethod === 'cod' ? 'border-char' : 'border-graphite/15'
              )}
            >
              <p className="font-medium text-char">Cash on delivery</p>
              <p className="text-char/60">Pay when your order arrives</p>
            </button>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" magnetic={false} onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" magnetic={false} onClick={() => setStep(4)} disabled={!canCheckout}>
              Continue to review
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-graphite/15 p-5">
            <p className="font-mono text-xs uppercase tracking-wideish text-char/50">Shipping to</p>
            <p className="mt-2 font-body text-sm text-char">{address?.fullName}</p>
            <p className="font-body text-sm text-char/70">
              {address?.line1}, {address?.city}, {address?.state} {address?.postalCode}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 rounded-2xl border border-graphite/15 p-5 font-mono text-sm">
            <div className="flex justify-between text-char/70">
              <span>Subtotal</span>
              <span>{formatCurrency(pricing?.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-char/70">
              <span>Shipping</span>
              <span>{pricing?.shippingPrice === 0 ? 'Free' : formatCurrency(pricing?.shippingPrice)}</span>
            </div>
            <div className="flex justify-between text-char/70">
              <span>Tax</span>
              <span>{formatCurrency(pricing?.taxPrice)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-graphite/10 pt-2 text-base font-semibold text-char">
              <span>Total</span>
              <span>{formatCurrency(pricing?.totalPrice)}</span>
            </div>
          </div>

          {pricingLoading && <p className="font-mono text-xs text-char/50">Checking current stock and prices…</p>}
          {pricingError && <p className="font-mono text-xs text-ember">{pricingError}</p>}
          {orderError && <p className="font-mono text-xs text-ember">{orderError}</p>}

          {paymentMethod === 'cod' ? (
            <Button variant="accent" magnetic={false} onClick={() => placeOrder(null)} disabled={placingOrder || !canCheckout}>
              {placingOrder ? 'Placing order…' : 'Place order'}
            </Button>
          ) : canCheckout && clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm
                onConfirmed={(paymentIntent) =>
                  placeOrder({
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    updateTime: new Date().toISOString(),
                    email: user?.email,
                  })
                }
                onError={setOrderError}
              />
            </Elements>
          ) : (
            <p className="font-mono text-xs text-char/50">Preparing payment…</p>
          )}

          <Button variant="ghost" magnetic={false} onClick={() => setStep(3)}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
