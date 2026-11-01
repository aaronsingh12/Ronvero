import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Testimonial from '../models/Testimonial.js';

// @route  GET /api/testimonials
export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort('displayOrder');
  res.json({ success: true, count: testimonials.length, testimonials });
});

// ---------- Admin ----------

export const getAllTestimonialsAdmin = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort('displayOrder');
  res.json({ success: true, testimonials });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, testimonial });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!testimonial) throw new ApiError('Testimonial not found', 404);
  res.json({ success: true, testimonial });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) throw new ApiError('Testimonial not found', 404);
  res.json({ success: true, message: 'Testimonial removed' });
});
