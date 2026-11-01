import mongoose from 'mongoose';
import slugify from 'slugify';

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, unique: true, index: true },
    tagline: { type: String, trim: true },
    description: { type: String, trim: true },
    bannerImage: {
      url: { type: String, required: true },
      publicId: { type: String, default: '' },
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

collectionSchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
