import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button.jsx';
import api from '../services/axiosInstance.js';
import { useAuthStore } from '../store/useAuthStore.js';

const schema = z.object({ password: z.string().min(8, 'Password must be at least 8 characters') });

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const { data: res } = await api.put(`/auth/reset-password/${token}`, data);
      setAccessToken(res.accessToken);
      navigate('/account');
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Reset link is invalid or has expired');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-char">Set a new password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wideish text-char/50">New password</label>
          <input
            {...register('password')}
            type="password"
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
          {errors.password && <p className="mt-1 font-mono text-xs text-ember">{errors.password.message}</p>}
        </div>
        {serverError && <p className="font-mono text-xs text-ember">{serverError}</p>}
        <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Updating…' : 'Update password'}
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
