import { loadStripe } from '@stripe/stripe-js';

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Resolves to null (rather than throwing) when no publishable key is configured,
// so the checkout can fall back to Cash on Delivery instead of crashing.
export const stripePromise = key ? loadStripe(key) : Promise.resolve(null);
export const isStripeConfigured = Boolean(key);
