import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button.jsx';
import { useAuthStore } from '../store/useAuthStore.js';

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function Register() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser(data);
      navigate('/account');
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-char">Create your account</h1>
      <p className="mt-2 font-body text-char/60">Save addresses, track orders, and check out faster.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wideish text-char/50">Full name</label>
          <input
            {...register('name')}
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {errors.name && <p className="mt-1 font-mono text-xs text-ember">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wideish text-char/50">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {errors.email && <p className="mt-1 font-mono text-xs text-ember">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wideish text-char/50">Password</label>
          <input
            {...register('password')}
            type="password"
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {errors.password && <p className="mt-1 font-mono text-xs text-ember">{errors.password.message}</p>}
        </div>

        {serverError && <p className="font-mono text-xs text-ember">{serverError}</p>}

        <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-char/60">
        Already have an account?{' '}
        <Link to="/login" className="text-char underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
