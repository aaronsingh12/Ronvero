import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import Button from '../../components/ui/Button.jsx';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { categoryService } from '../../services/categoryService.js';
import { useNotificationStore } from '../../store/useNotificationStore.js';

const inputClass =
  'w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const refreshNotifications = useNotificationStore((s) => s.load);

  const load = () => categoryService.listAdmin().then((data) => setCategories(data.categories));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.name}"?`)) return;
    try {
      await categoryService.remove(row._id);
      refreshNotifications({ limit: 50 }).catch(() => {});
      load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Could not delete category');
    }
  };

  const handleSubmit = async (data) => {
    setError('');
    try {
      const payload = { ...data, image: { url: data.imageUrl, publicId: '' } };
      if (editing?._id) await categoryService.update(editing._id, payload);
      else await categoryService.create(payload);
      setEditing(null);
      refreshNotifications({ limit: 50 }).catch(() => {});
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save category');
    }
  };

  return (
    <div>
      <AdminTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'subtitle', label: 'Subtitle' },
          { key: 'displayOrder', label: 'Order' },
          { key: 'isFeatured', label: 'Featured', render: (r) => (r.isFeatured ? 'Yes' : 'No') },
        ]}
        rows={categories}
        onEdit={setEditing}
        onDelete={handleDelete}
        onCreate={() => setEditing({})}
        createLabel="Add category"
      />

      <AdminModal open={Boolean(editing)} title={editing?._id ? 'Edit category' : 'New category'} onClose={() => setEditing(null)}>
        {editing && <CategoryForm initial={editing} onSubmit={handleSubmit} error={error} />}
      </AdminModal>
    </div>
  );
}

function CategoryForm({ initial, onSubmit, error }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initial.name || '',
      subtitle: initial.subtitle || '',
      description: initial.description || '',
      imageUrl: initial.image?.url || '',
      isFeatured: initial.isFeatured || false,
      displayOrder: initial.displayOrder ?? 0,
    },
  });

  const imageUrl = watch('imageUrl');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="font-mono text-xs text-char/50"><span className="text-ember">*</span> Required to publish a category</p>
      <input {...register('name', { required: 'Category name is required' })} placeholder="Name *" className={inputClass} />
      {errors.name && <p className="-mt-2 font-mono text-xs text-ember">{errors.name.message}</p>}
      <input {...register('subtitle')} placeholder="Subtitle" className={inputClass} />
      <textarea {...register('description', { required: 'Category description is required' })} placeholder="Description *" rows={2} className={inputClass} />
      {errors.description && <p className="-mt-2 font-mono text-xs text-ember">{errors.description.message}</p>}
      <input {...register('imageUrl', { required: 'Add an image URL or upload an image' })} placeholder="Image URL *" className={inputClass} />
      <ImageUploader
        images={imageUrl ? [imageUrl] : []}
        folder="categories"
        label="Or upload a category image from your computer"
        onUploaded={(uploaded) => setValue('imageUrl', uploaded[0].url, { shouldValidate: true })}
        onRemove={() => setValue('imageUrl', '', { shouldValidate: true })}
      />
      {errors.imageUrl && <p className="-mt-2 font-mono text-xs text-ember">{errors.imageUrl.message}</p>}
      <input {...register('displayOrder')} type="number" placeholder="Display order" className={inputClass} />
      <label className="flex items-center gap-2 font-body text-sm text-char">
        <input type="checkbox" {...register('isFeatured')} /> Featured on homepage
      </label>
      {error && <p className="font-mono text-xs text-ember">{error}</p>}
      <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save category'}
      </Button>
    </form>
  );
}
