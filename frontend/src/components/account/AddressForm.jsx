import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button.jsx';

// Defined at module scope (not inside AddressForm) so it isn't recreated on every
// render — otherwise the inputs remount on each keystroke and lose focus once a
// validation error has appeared.
function Field({ name, label, register, errors, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wideish text-char/50">{label}</label>
      <input
        {...register(name)}
        className="w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char"
      />
      {errors[name] && <p className="mt-1 font-mono text-xs text-ember">{errors[name].message}</p>}
    </div>
  );
}

const schema = z.object({
  fullName: z.string().min(2, 'Enter the recipient\u2019s full name'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  line1: z.string().min(3, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(4, 'Enter a valid postal code'),
  country: z.string().min(2, 'Country is required'),
});

export default function AddressForm({ defaultValues, onSubmit, submitLabel = 'Save address' }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { country: 'India', ...defaultValues },
  });

  const fieldProps = { register, errors };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field name="fullName" label="Full name" className="sm:col-span-2" {...fieldProps} />
      <Field name="phone" label="Phone" {...fieldProps} />
      <Field name="country" label="Country" {...fieldProps} />
      <Field name="line1" label="Address line 1" className="sm:col-span-2" {...fieldProps} />
      <Field name="line2" label="Address line 2 (optional)" className="sm:col-span-2" {...fieldProps} />
      <Field name="city" label="City" {...fieldProps} />
      <Field name="state" label="State" {...fieldProps} />
      <Field name="postalCode" label="Postal code" {...fieldProps} />
      <div className="sm:col-span-2">
        <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
