import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' }, // e.g. "Marathon runner"
    location: { type: String, default: '' },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    message: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
