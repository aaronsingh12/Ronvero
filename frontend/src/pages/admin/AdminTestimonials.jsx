import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import Button from '../../components/ui/Button.jsx';
import { testimonialService } from '../../services/testimonialService.js';

const inputClass =
  'w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = () => testimonialService.listAdmin().then((data) => setTestimonials(data.testimonials));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete testimonial from "${row.name}"?`)) return;
    await testimonialService.remove(row._id);
    load();
  };

  const handleSubmit = async (data) => {
    setError('');
    try {
      const payload = {
        ...data,
        rating: Number(data.rating),
        avatar: { url: data.avatarUrl, publicId: '' },
      };
      if (editing?._id) await testimonialService.update(editing._id, payload);
      else await testimonialService.create(payload);
      setEditing(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save testimonial');
    }
  };

  return (
    <div>
      <AdminTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'rating', label: 'Rating' },
          { key: 'isActive', label: 'Active', render: (r) => (r.isActive ? 'Yes' : 'No') },
        ]}
        rows={testimonials}
        onEdit={setEditing}
        onDelete={handleDelete}
        onCreate={() => setEditing({})}
        createLabel="Add testimonial"
      />

      <AdminModal
        open={Boolean(editing)}
        title={editing?._id ? 'Edit testimonial' : 'New testimonial'}
        onClose={() => setEditing(null)}
      >
        {editing && <TestimonialForm initial={editing} onSubmit={handleSubmit} error={error} />}
      </AdminModal>
    </div>
  );
}

function TestimonialForm({ initial, onSubmit, error }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: initial.name || '',
      role: initial.role || '',
      location: initial.location || '',
      avatarUrl: initial.avatar?.url || 'https://picsum.photos/seed/ronvero-new-avatar/200/200',
      rating: initial.rating || 5,
      message: initial.message || '',
      displayOrder: initial.displayOrder ?? 0,
      isActive: initial.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input {...register('name', { required: true })} placeholder="Name" className={inputClass} />
      <div className="grid grid-cols-2 gap-3">
        <input {...register('role')} placeholder="Role (e.g. Marathon runner)" className={inputClass} />
        <input {...register('location')} placeholder="Location" className={inputClass} />
      </div>
      <input {...register('avatarUrl')} placeholder="Avatar image URL" className={inputClass} />
      <textarea {...register('message', { required: true })} placeholder="Testimonial message" rows={3} className={inputClass} />
      <div className="grid grid-cols-2 gap-3">
        <select {...register('rating')} className={inputClass}>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} stars
            </option>
          ))}
        </select>
        <input {...register('displayOrder')} type="number" placeholder="Display order" className={inputClass} />
      </div>
      <label className="flex items-center gap-2 font-body text-sm text-char">
        <input type="checkbox" {...register('isActive')} /> Active
      </label>
      {error && <p className="font-mono text-xs text-ember">{error}</p>}
      <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save testimonial'}
      </Button>
    </form>
  );
}
