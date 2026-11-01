import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button.jsx';
import { CheckIcon } from '../components/ui/Icons.jsx';
import api from '../services/axiosInstance.js';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    await api.post('/auth/forgot-password', data);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckIcon size={28} className="text-ember" />
        <h1 className="font-display text-2xl font-semibold text-char">Check your inbox</h1>
        <p className="font-body text-char/60">If that email is registered, a reset link is on its way.</p>
        <Link to="/login" className="mt-2 text-char underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-char">Reset your password</h1>
      <p className="mt-2 font-body text-char/60">We'll email you a link to get back in.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wideish text-char/50">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {errors.email && <p className="mt-1 font-mono text-xs text-ember">{errors.email.message}</p>}
        </div>
        <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-char/60">
        <Link to="/login" className="text-char underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
