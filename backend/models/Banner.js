import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      enum: ['hero', 'promo', 'collection', 'lifestyle'],
      required: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String },
    eyebrow: { type: String },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, default: '' },
    },
    mobileImage: {
      url: { type: String },
      publicId: { type: String, default: '' },
    },
    ctaText: { type: String, default: 'Shop now' },
    ctaLink: { type: String, default: '/shop' },
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    displayOrder: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

bannerSchema.index({ position: 1, displayOrder: 1 });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
