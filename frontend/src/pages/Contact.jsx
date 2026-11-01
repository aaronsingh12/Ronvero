import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button.jsx';
import { CheckIcon } from '../components/ui/Icons.jsx';
import api from '../services/axiosInstance.js';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Tell us a bit more (10+ characters)'),
});

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await api.post('/contact', data);
      setSent(true);
      reset();
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Could not send your message — please try again.');
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-14 px-5 py-16 md:grid-cols-2 md:px-8">
      <div>
        <span className="eyebrow">Get in touch</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-char">We're here to help.</h1>
        <p className="mt-4 max-w-sm font-body text-char/70">
          Questions about sizing, an order, or a wholesale inquiry — send us a note and we'll get back within 1-2
          business days.
        </p>
        <div className="mt-8 flex flex-col gap-2 font-mono text-sm text-char/60">
          <p>support@ronvero.com</p>
          <p>Mon–Fri, 10am–6pm IST</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register('name')}
            placeholder="Name"
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {errors.name && <p className="mt-1 font-mono text-xs text-ember">{errors.name.message}</p>}
        </div>
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {errors.email && <p className="mt-1 font-mono text-xs text-ember">{errors.email.message}</p>}
        </div>
        <input
          {...register('subject')}
          placeholder="Subject (optional)"
          className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
        />
        <div>
          <textarea
            {...register('message')}
            rows={5}
            placeholder="How can we help?"
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {errors.message && <p className="mt-1 font-mono text-xs text-ember">{errors.message.message}</p>}
        </div>
        {serverError && <p className="font-mono text-xs text-ember">{serverError}</p>}
        <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting} className="w-fit">
          {isSubmitting ? 'Sending…' : sent ? (
            <span className="flex items-center gap-1.5">
              <CheckIcon size={14} /> Sent
            </span>
          ) : (
            'Send message'
          )}
        </Button>
      </form>
    </div>
  );
}
