import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, unique: true, index: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, default: '' },
    },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.index({ displayOrder: 1 });

const Category = mongoose.model('Category', categorySchema);
export default Category;
