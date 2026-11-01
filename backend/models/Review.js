import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    comment: { type: String, required: true, trim: true },
    images: [{ url: String, publicId: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // one review per user per product

reviewSchema.statics.recalculateProductRating = async function recalculateProductRating(productId) {
  const Product = mongoose.model('Product');
  const stats = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { ratingsAverage: 0, ratingsQuantity: 0 });
  }
};

reviewSchema.post('save', function afterSave() {
  this.constructor.recalculateProductRating(this.product);
});

reviewSchema.post('findOneAndDelete', (doc) => {
  if (doc) doc.constructor.recalculateProductRating(doc.product);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
