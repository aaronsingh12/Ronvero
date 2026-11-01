import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../ui/Button.jsx';

export default function StripePaymentForm({ onConfirmed, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message);
      setSubmitting(false);
      return;
    }

    onConfirmed(paymentIntent);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PaymentElement />
      <Button type="submit" variant="accent" disabled={!stripe || submitting} magnetic={false}>
        {submitting ? 'Processing…' : 'Pay & place order'}
      </Button>
    </form>
  );
}
