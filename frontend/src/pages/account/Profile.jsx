import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../components/ui/Button.jsx';
import { useAuthStore } from '../../store/useAuthStore.js';

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  phone: z.string().optional(),
});

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: user?.name, phone: user?.phone } });

  const onSubmit = async (data) => {
    await updateProfile(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-md">
      <h2 className="mb-6 font-display text-lg font-semibold text-char">Profile details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            value={user?.email}
            disabled
            className="w-full rounded-xl border border-graphite/10 bg-graphite/5 px-3.5 py-2.5 font-body text-sm text-char/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wideish text-char/50">Phone</label>
          <input
            {...register('phone')}
            className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
          />
        </div>
        <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting} className="w-fit">
          {isSubmitting ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
        </Button>
      </form>
    </div>
  );
}
