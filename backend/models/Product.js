import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
  },
  { _id: false }
);

const colorVariantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    images: [imageSchema],
  },
  { _id: false }
);

const sizeVariantSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true }, // XS, S, M, L, XL or numeric
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const specSchema = new mongoose.Schema(
  { key: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, index: true },
    shortDescription: { type: String, trim: true, maxlength: 200 },
    description: { type: String, required: true },

    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
    brand: { type: String, default: 'RONVERO' },

    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },

    images: { type: [imageSchema], validate: (v) => v.length > 0 },
    colors: [colorVariantSchema],
    sizes: {
      type: [sizeVariantSchema],
      required: [true, 'At least one size is required'],
      validate: {
        validator: (sizes) =>
          Array.isArray(sizes) &&
          sizes.length > 0 &&
          new Set(sizes.map((size) => String(size.value || '').toLowerCase())).size === sizes.length,
        message: 'Add at least one unique size',
      },
    },

    sku: { type: String, unique: true, sparse: true },
    specifications: [specSchema],
    shippingInfo: { type: String, default: 'Free shipping on orders above ₹2,999. Delivered in 3–5 business days.' },
    careInstructions: { type: String, default: '' },

    ratingsAverage: { type: Number, default: 0, min: 0, max: 5, set: (v) => Math.round(v * 10) / 10 },
    ratingsQuantity: { type: Number, default: 0 },

    tags: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },

    viewCount: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Math.random().toString(36).slice(2, 7)}`;
  }
  next();
});

productSchema.virtual('totalStock').get(function getTotalStock() {
  if (!this.sizes || this.sizes.length === 0) return 0;
  return this.sizes.reduce((sum, s) => sum + s.stock, 0);
});

productSchema.virtual('inStock').get(function getInStock() {
  return this.totalStock > 0;
});

productSchema.virtual('discountPercent').get(function getDiscountPercent() {
  if (!this.discountPrice || this.discountPrice >= this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
