import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import Button from '../../components/ui/Button.jsx';
import { collectionService } from '../../services/collectionService.js';
import { productService } from '../../services/productService.js';

const inputClass =
  'w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char';

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = () => collectionService.listAdmin().then((data) => setCollections(data.collections));

  useEffect(() => {
    load();
    productService.listAdmin({ limit: 200 }).then((data) => setProducts(data.products));
  }, []);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.name}"?`)) return;
    await collectionService.remove(row._id);
    load();
  };

  const handleSubmit = async (data) => {
    setError('');
    try {
      const payload = { ...data, bannerImage: { url: data.imageUrl, publicId: '' } };
      if (editing?._id) await collectionService.update(editing._id, payload);
      else await collectionService.create(payload);
      setEditing(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save collection');
    }
  };

  return (
    <div>
      <AdminTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'tagline', label: 'Tagline' },
          { key: 'products', label: 'Products', render: (r) => r.products?.length || 0 },
          { key: 'isFeatured', label: 'Featured', render: (r) => (r.isFeatured ? 'Yes' : 'No') },
        ]}
        rows={collections}
        onEdit={setEditing}
        onDelete={handleDelete}
        onCreate={() => setEditing({})}
        createLabel="Add collection"
      />

      <AdminModal open={Boolean(editing)} title={editing?._id ? 'Edit collection' : 'New collection'} onClose={() => setEditing(null)}>
        {editing && <CollectionForm initial={editing} products={products} onSubmit={handleSubmit} error={error} />}
      </AdminModal>
    </div>
  );
}

function CollectionForm({ initial, products, onSubmit, error }) {
  const [selectedProducts, setSelectedProducts] = useState(
    (initial.products || []).map((p) => (typeof p === 'string' ? p : p._id))
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: initial.name || '',
      tagline: initial.tagline || '',
      description: initial.description || '',
      imageUrl: initial.bannerImage?.url || 'https://picsum.photos/seed/ronvero-new-collection/1600/900',
      isFeatured: initial.isFeatured ?? true,
      displayOrder: initial.displayOrder ?? 0,
    },
  });

  const toggleProduct = (id) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const submit = (data) => onSubmit({ ...data, products: selectedProducts });

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <input {...register('name', { required: true })} placeholder="Name" className={inputClass} />
      <input {...register('tagline')} placeholder="Tagline" className={inputClass} />
      <textarea {...register('description')} placeholder="Description" rows={2} className={inputClass} />
      <input {...register('imageUrl')} placeholder="Banner image URL" className={inputClass} />
      <input {...register('displayOrder')} type="number" placeholder="Display order" className={inputClass} />
      <label className="flex items-center gap-2 font-body text-sm text-char">
        <input type="checkbox" {...register('isFeatured')} /> Featured on homepage
      </label>

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wideish text-char/50">Products in this collection</p>
        <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto rounded-xl border border-graphite/10 p-3">
          {products.map((p) => (
            <label key={p._id} className="flex items-center gap-2 font-body text-sm text-char">
              <input type="checkbox" checked={selectedProducts.includes(p._id)} onChange={() => toggleProduct(p._id)} />
              {p.name}
            </label>
          ))}
        </div>
      </div>

      {error && <p className="font-mono text-xs text-ember">{error}</p>}
      <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save collection'}
      </Button>
    </form>
  );
}
