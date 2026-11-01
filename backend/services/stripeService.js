import Stripe from 'stripe';

let stripeClient;

// Lazily instantiate so the app can still boot without a key set (dev/demo mode)
export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripeClient) stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
};

export const createPaymentIntent = async (amountInPaise, currency = 'inr', metadata = {}) => {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error('Stripe is not configured — set STRIPE_SECRET_KEY in backend/.env');
  }
  return stripe.paymentIntents.create({
    amount: Math.round(amountInPaise),
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
};

export const retrievePaymentIntent = async (paymentIntentId) => {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error('Stripe is not configured \u2014 set STRIPE_SECRET_KEY in backend/.env');
  }
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

export const constructWebhookEvent = (rawBody, signature) => {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
};
