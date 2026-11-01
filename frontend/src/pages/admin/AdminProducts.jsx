import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import Button from '../../components/ui/Button.jsx';
import { PlusIcon, TrashIcon } from '../../components/ui/Icons.jsx';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { productService } from '../../services/productService.js';
import { categoryService } from '../../services/categoryService.js';
import { useNotificationStore } from '../../store/useNotificationStore.js';

const emptyProduct = {
  name: '',
  shortDescription: '',
  description: '',
  category: '',
  price: '',
  discountPrice: '',
  sku: '',
  imagesText: '',
  status: 'active',
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  colors: [{ name: 'Graphite', hex: '#1E211D' }],
  sizes: [{ value: 'M', stock: 20 }],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = modal closed, {} = creating, {...} = editing
  const [error, setError] = useState('');
  const refreshNotifications = useNotificationStore((s) => s.load);

  const load = () => productService.listAdmin({ limit: 100 }).then((data) => setProducts(data.products));

  useEffect(() => {
    Promise.all([load(), categoryService.listAdmin().then((d) => setCategories(d.categories))]).finally(() =>
      setLoading(false)
    );
  }, []);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.name}"?`)) return;
    await productService.remove(row._id);
    refreshNotifications({ limit: 50 }).catch(() => {});
    load();
  };

  const handleSubmit = async (payload) => {
    setError('');
    try {
      if (editing?._id) await productService.update(editing._id, payload);
      else await productService.create(payload);
      setEditing(null);
      refreshNotifications({ limit: 50 }).catch(() => {});
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save product');
    }
  };

  return (
    <div>
      <AdminTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category', render: (r) => r.category?.name || '—' },
          {
            key: 'price',
            label: 'Price',
            render: (r) => (
              <span>
                {formatCurrency(r.discountPrice || r.price)}
                {r.discountPrice && <span className="ml-1.5 text-char/40 line-through">{formatCurrency(r.price)}</span>}
              </span>
            ),
          },
          { key: 'status', label: 'Status' },
        ]}
        rows={loading ? [] : products}
        onEdit={(row) => setEditing(row)}
        onDelete={handleDelete}
        onCreate={() => setEditing({})}
        createLabel="Add product"
      />

      <AdminModal open={Boolean(editing)} title={editing?._id ? 'Edit product' : 'New product'} onClose={() => setEditing(null)}>
        {editing && (
          <ProductForm
            key={editing._id || 'new'}
            initial={editing}
            categories={categories}
            onSubmit={handleSubmit}
            error={error}
          />
        )}
      </AdminModal>
    </div>
  );
}

function ProductForm({ initial, categories, onSubmit, error }) {
  const defaults = initial._id
    ? {
        ...initial,
        category: initial.category?._id || initial.category,
        imagesText: (initial.images || []).map((i) => i.url).join('\n'),
      }
    : emptyProduct;

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaults });

  const colorFields = useFieldArray({ control, name: 'colors' });
  const sizeFields = useFieldArray({ control, name: 'sizes' });

  const imageUrls = (watch('imagesText') || '')
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean);

  const addUploadedImages = (uploaded) => {
    const nextUrls = [...imageUrls, ...uploaded.map((image) => image.url)];
    setValue('imagesText', nextUrls.join('\n'), { shouldValidate: true });
  };

  const removeImage = (urlToRemove) => {
    setValue(
      'imagesText',
      imageUrls.filter((url) => url !== urlToRemove).join('\n'),
      { shouldValidate: true }
    );
  };

  const submit = (data) => {
    const images = data.imagesText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => ({ url, publicId: '' }));

    const sizes = data.sizes
      .map((size) => ({ value: size.value.trim(), stock: Number(size.stock) }))
      .filter((size) => size.value);

    if (sizes.length === 0) {
      setError('sizes', { type: 'manual', message: 'Add at least one size and its stock.' });
      return;
    }
    if (sizes.some((size) => !Number.isInteger(size.stock) || size.stock < 0)) {
      setError('sizes', { type: 'manual', message: 'Each size needs a whole-number stock of zero or more.' });
      return;
    }

    onSubmit({
      ...data,
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
      images,
      colors: data.colors.map((c) => ({ ...c, images })),
      sizes,
    });
  };

  const inputClass =
    'w-full rounded-xl border border-graphite/15 bg-transparent px-3.5 py-2.5 font-body text-sm outline-none focus:border-char';

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <p className="font-mono text-xs text-char/50"><span className="text-ember">*</span> Required to publish a product</p>
      <input {...register('name', { required: 'Product name is required' })} placeholder="Product name *" className={inputClass} />
      {errors.name && <p className="-mt-2 font-mono text-xs text-ember">{errors.name.message}</p>}
      <input {...register('shortDescription', { required: 'Short description is required' })} placeholder="Short description *" className={inputClass} />
      {errors.shortDescription && <p className="-mt-2 font-mono text-xs text-ember">{errors.shortDescription.message}</p>}
      <textarea {...register('description', { required: 'Full description is required' })} placeholder="Full description *" rows={3} className={inputClass} />
      {errors.description && <p className="-mt-2 font-mono text-xs text-ember">{errors.description.message}</p>}

      <select {...register('category', { required: true })} className={inputClass}>
        <option value="">Select category *</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      {errors.category && <p className="-mt-2 font-mono text-xs text-ember">A category is required</p>}

      <div className="grid grid-cols-2 gap-3">
        <input {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })} type="number" min="0" placeholder="Price *" className={inputClass} />
        <input {...register('discountPrice', { min: { value: 0, message: 'Discount price cannot be negative' } })} type="number" min="0" placeholder="Discount price (optional)" className={inputClass} />
      </div>
      {(errors.price || errors.discountPrice) && <p className="-mt-2 font-mono text-xs text-ember">{errors.price?.message || errors.discountPrice?.message}</p>}

      <input {...register('sku')} placeholder="SKU (optional)" className={inputClass} />
      <textarea
        {...register('imagesText', {
          validate: (value) =>
            (value || '').split('\n').some((url) => url.trim()) || 'Add at least one image URL or upload a file',
        })}
        placeholder="One image URL per line *"
        rows={2}
        className={inputClass}
      />
      <ImageUploader
        images={imageUrls}
        folder="products"
        label="Or upload product images from your computer"
        multiple
        onUploaded={addUploadedImages}
        onRemove={removeImage}
      />
      {errors.imagesText && <p className="-mt-2 font-mono text-xs text-ember">{errors.imagesText.message}</p>}

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wideish text-char/50">Colors</p>
        <div className="flex flex-col gap-2">
          {colorFields.fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input {...register(`colors.${i}.name`)} placeholder="Name" className={inputClass} />
              <input {...register(`colors.${i}.hex`)} placeholder="#000000" className={inputClass} />
              <button type="button" onClick={() => colorFields.remove(i)} aria-label="Remove color">
                <TrashIcon size={16} className="text-char/40" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => colorFields.append({ name: '', hex: '#1E211D' })}
            className="flex w-fit items-center gap-1 font-mono text-xs text-char/60"
          >
            <PlusIcon size={12} /> Add color
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wideish text-char/50">Sizes & stock</p>
        <div className="flex flex-col gap-2">
          {sizeFields.fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input {...register(`sizes.${i}.value`, { required: 'Size is required' })} placeholder="M" className={inputClass} />
              <input {...register(`sizes.${i}.stock`, { required: true, min: 0 })} type="number" min="0" step="1" placeholder="Stock" className={inputClass} />
              <button type="button" onClick={() => sizeFields.remove(i)} aria-label="Remove size">
                <TrashIcon size={16} className="text-char/40" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => sizeFields.append({ value: '', stock: 0 })}
            className="flex w-fit items-center gap-1 font-mono text-xs text-char/60"
          >
            <PlusIcon size={12} /> Add size
          </button>
        </div>
        {errors.sizes && <p className="mt-2 font-mono text-xs text-ember">{errors.sizes.message}</p>}
      </div>

      <div className="flex flex-wrap gap-4 font-body text-sm text-char">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('isFeatured')} /> Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('isNewArrival')} /> New arrival
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('isBestSeller')} /> Best seller
        </label>
      </div>

      <select {...register('status')} className={inputClass}>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {error && <p className="font-mono text-xs text-ember">{error}</p>}

      <Button type="submit" variant="primary" magnetic={false} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save product'}
      </Button>
    </form>
  );
}
