import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button.jsx';
import { useAuthStore } from '../store/useAuthStore.js';

const schema = z.object({
  identifier: z.string().min(1, 'Enter your email or username'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const user = await login(data.identifier, data.password);
      navigate(user.role === 'admin' ? '/admin' : location.state?.from || '/account');
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-char">Welcome back</h1>
      <p className="mt-2 font-body text-char/60">Log in to manage your account or the admin dashboard.</p>

      <div className="mt-6 rounded-2xl border border-graphite/10 p-3">
        <p className="font-mono text-xs uppercase tracking-wideish text-char/50">Demo admin</p>
        <button
          type="button"
          onClick={() => {
            setValue('identifier', 'admin', { shouldValidate: true });
            setValue('password', 'admin', { shouldValidate: true });
          }}
          className="mt-3 w-full rounded-full border border-graphite/15 px-4 py-2 font-mono text-xs text-char hover:border-char"
        >
          Fill admin login
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wideish text-char/50">Email or username</label>
            <input
            {...register('identifier')}
            autoComplete="username"
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {errors.identifier && <p className="mt-1 font-mono text-xs text-ember">{errors.identifier.message}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wideish text-char/50">Password</label>
            <Link to="/forgot-password" className="font-mono text-xs text-char/50 underline">
              Forgot?
            </Link>
          </div>
          <input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {errors.password && <p className="mt-1 font-mono text-xs text-ember">{errors.password.message}</p>}
        </div>

        {serverError && <p className="font-mono text-xs text-ember">{serverError}</p>}

        <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-char/60">
        New here?{' '}
        <Link to="/register" className="text-char underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
