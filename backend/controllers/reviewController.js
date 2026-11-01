import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Review from '../models/Review.js';

// @route  PUT /api/reviews/:id
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError('Review not found', 404);
  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError('You can only edit your own review', 403);
  }

  const { rating, title, comment } = req.body;
  if (rating) review.rating = rating;
  if (title !== undefined) review.title = title;
  if (comment) review.comment = comment;
  await review.save();

  res.json({ success: true, review });
});

// @route  DELETE /api/reviews/:id
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError('Review not found', 404);

  const isOwner = review.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw new ApiError('Not authorized to delete this review', 403);

  await Review.findOneAndDelete({ _id: review._id });
  res.json({ success: true, message: 'Review removed' });
});

// @route  PUT /api/reviews/:id/helpful
export const markReviewHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpfulCount: 1 } },
    { new: true }
  );
  if (!review) throw new ApiError('Review not found', 404);
  res.json({ success: true, helpfulCount: review.helpfulCount });
});

// ---------- Admin ----------

// @route  GET /api/reviews (admin)
export const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate('product', 'name slug')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Review.countDocuments();
  res.json({ success: true, count: reviews.length, total, reviews });
});
