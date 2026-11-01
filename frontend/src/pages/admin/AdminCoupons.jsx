import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import Button from '../../components/ui/Button.jsx';
import { couponService } from '../../services/couponService.js';

const inputClass =
  'w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = () => couponService.listAdmin().then((data) => setCoupons(data.coupons));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete coupon "${row.code}"?`)) return;
    await couponService.remove(row._id);
    load();
  };

  const handleSubmit = async (data) => {
    setError('');
    try {
      const payload = {
        ...data,
        discountValue: Number(data.discountValue),
        minPurchase: Number(data.minPurchase || 0),
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
        expiresAt: new Date(data.expiresAt).toISOString(),
      };
      if (editing?._id) await couponService.update(editing._id, payload);
      else await couponService.create(payload);
      setEditing(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save coupon');
    }
  };

  return (
    <div>
      <AdminTable
        columns={[
          { key: 'code', label: 'Code' },
          {
            key: 'discountValue',
            label: 'Discount',
            render: (r) => (r.discountType === 'percentage' ? `${r.discountValue}%` : `₹${r.discountValue}`),
          },
          { key: 'usedCount', label: 'Used', render: (r) => `${r.usedCount}${r.usageLimit ? ` / ${r.usageLimit}` : ''}` },
          { key: 'expiresAt', label: 'Expires', render: (r) => new Date(r.expiresAt).toLocaleDateString() },
          { key: 'isActive', label: 'Active', render: (r) => (r.isActive ? 'Yes' : 'No') },
        ]}
        rows={coupons}
        onEdit={setEditing}
        onDelete={handleDelete}
        onCreate={() => setEditing({})}
        createLabel="Add coupon"
      />

      <AdminModal open={Boolean(editing)} title={editing?._id ? 'Edit coupon' : 'New coupon'} onClose={() => setEditing(null)}>
        {editing && <CouponForm initial={editing} onSubmit={handleSubmit} error={error} />}
      </AdminModal>
    </div>
  );
}

function CouponForm({ initial, onSubmit, error }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      code: initial.code || '',
      description: initial.description || '',
      discountType: initial.discountType || 'percentage',
      discountValue: initial.discountValue || '',
      minPurchase: initial.minPurchase || 0,
      maxDiscount: initial.maxDiscount || '',
      usageLimit: initial.usageLimit || '',
      expiresAt: initial.expiresAt ? initial.expiresAt.slice(0, 10) : '',
      isActive: initial.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input {...register('code', { required: true })} placeholder="CODE" className={`${inputClass} uppercase`} />
      <input {...register('description')} placeholder="Description" className={inputClass} />
      <div className="grid grid-cols-2 gap-3">
        <select {...register('discountType')} className={inputClass}>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed amount</option>
        </select>
        <input {...register('discountValue', { required: true })} type="number" placeholder="Value" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input {...register('minPurchase')} type="number" placeholder="Min purchase" className={inputClass} />
        <input {...register('maxDiscount')} type="number" placeholder="Max discount (%  only)" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input {...register('usageLimit')} type="number" placeholder="Usage limit" className={inputClass} />
        <input {...register('expiresAt', { required: true })} type="date" className={inputClass} />
      </div>
      <label className="flex items-center gap-2 font-body text-sm text-char">
        <input type="checkbox" {...register('isActive')} /> Active
      </label>
      {error && <p className="font-mono text-xs text-ember">{error}</p>}
      <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save coupon'}
      </Button>
    </form>
  );
}
