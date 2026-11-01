import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import Button from '../../components/ui/Button.jsx';
import { bannerService } from '../../services/bannerService.js';

const inputClass =
  'w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = () => bannerService.listAdmin().then((data) => setBanners(data.banners));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete banner "${row.title}"?`)) return;
    await bannerService.remove(row._id);
    load();
  };

  const handleSubmit = async (data) => {
    setError('');
    try {
      const payload = { ...data, image: { url: data.imageUrl, publicId: '' } };
      if (editing?._id) await bannerService.update(editing._id, payload);
      else await bannerService.create(payload);
      setEditing(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save banner');
    }
  };

  return (
    <div>
      <AdminTable
        columns={[
          { key: 'position', label: 'Position' },
          { key: 'title', label: 'Title' },
          { key: 'theme', label: 'Theme' },
          { key: 'isActive', label: 'Active', render: (r) => (r.isActive ? 'Yes' : 'No') },
        ]}
        rows={banners}
        onEdit={setEditing}
        onDelete={handleDelete}
        onCreate={() => setEditing({})}
        createLabel="Add banner"
      />

      <AdminModal open={Boolean(editing)} title={editing?._id ? 'Edit banner' : 'New banner'} onClose={() => setEditing(null)}>
        {editing && <BannerForm initial={editing} onSubmit={handleSubmit} error={error} />}
      </AdminModal>
    </div>
  );
}

function BannerForm({ initial, onSubmit, error }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      position: initial.position || 'hero',
      eyebrow: initial.eyebrow || '',
      title: initial.title || '',
      subtitle: initial.subtitle || '',
      imageUrl: initial.image?.url || 'https://picsum.photos/seed/ronvero-new-banner/1600/900',
      ctaText: initial.ctaText || 'Shop now',
      ctaLink: initial.ctaLink || '/shop',
      theme: initial.theme || 'dark',
      displayOrder: initial.displayOrder ?? 0,
      isActive: initial.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <select {...register('position')} className={inputClass}>
        <option value="hero">Hero</option>
        <option value="promo">Promo</option>
        <option value="collection">Collection</option>
        <option value="lifestyle">Lifestyle</option>
      </select>
      <input {...register('eyebrow')} placeholder="Eyebrow text" className={inputClass} />
      <input {...register('title', { required: true })} placeholder="Title" className={inputClass} />
      <input {...register('subtitle')} placeholder="Subtitle" className={inputClass} />
      <input {...register('imageUrl')} placeholder="Image URL" className={inputClass} />
      <div className="grid grid-cols-2 gap-3">
        <input {...register('ctaText')} placeholder="CTA text" className={inputClass} />
        <input {...register('ctaLink')} placeholder="CTA link" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select {...register('theme')} className={inputClass}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
        <input {...register('displayOrder')} type="number" placeholder="Display order" className={inputClass} />
      </div>
      <label className="flex items-center gap-2 font-body text-sm text-char">
        <input type="checkbox" {...register('isActive')} /> Active
      </label>
      {error && <p className="font-mono text-xs text-ember">{error}</p>}
      <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save banner'}
      </Button>
    </form>
  );
}
