import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/ApiFeatures.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import { publishCatalogUpdate } from '../utils/catalogEvents.js';
import { createAdminNotification, notifyProductInventory } from '../utils/adminNotifications.js';

// A fresh ObjectId that will never match an existing document — used so that an
// unknown category/collection slug yields an empty result set instead of a CastError.
const noMatchId = () => new mongoose.Types.ObjectId().toString();

const allObjectIds = (csv) => String(csv).split(',').every((v) => mongoose.isValidObjectId(v));

// The storefront filters by category/collection *slug*, but the schema stores
// ObjectId refs. Resolve slugs → ids (accepting raw ids too) before filtering,
// otherwise Mongoose throws a CastError that the error handler turns into a 404.
async function resolveCatalogFilters(query) {
  const q = { ...query };

  if (q.category && !allObjectIds(q.category)) {
    const cats = await Category.find({ slug: { $in: String(q.category).split(',') } }).select('_id');
    q.category = cats.length ? cats.map((c) => String(c._id)).join(',') : noMatchId();
  }

  // Frontend may send either `collection` or `collections`; the schema field is `collections`.
  const rawCollection = q.collections ?? q.collection;
  if (rawCollection !== undefined) {
    delete q.collection;
    let val = String(rawCollection);
    if (!allObjectIds(val)) {
      const cols = await Collection.find({ slug: { $in: val.split(',') } }).select('_id');
      val = cols.length ? cols.map((c) => String(c._id)).join(',') : noMatchId();
    }
    q.collections = val;
  }

  return q;
}

// @route  GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const resolvedQuery = await resolveCatalogFilters(req.query);
  const baseQuery = Product.find({ status: 'active' }).populate('category', 'name slug');

  const searchFields = ['name', 'shortDescription', 'tags'];
  const features = new ApiFeatures(baseQuery, resolvedQuery)
    .search(searchFields)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const countFeatures = new ApiFeatures(Product.find({ status: 'active' }), resolvedQuery)
    .search(searchFields)
    .filter();

  const [products, total] = await Promise.all([features.query, countFeatures.query.countDocuments()]);

  res.json({
    success: true,
    count: products.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    products,
  });
});

// @route  GET /api/products/filters
// Distinct colors, sizes and price range across the ACTIVE catalog — powers the
// shop filter sidebar so the options always reflect what's really in stock.
export const getProductFilters = asyncHandler(async (req, res) => {
  const [result] = await Product.aggregate([
    { $match: { status: 'active' } },
    {
      $facet: {
        colors: [
          { $unwind: '$colors' },
          { $group: { _id: '$colors.name', hex: { $first: '$colors.hex' } } },
          { $project: { _id: 0, name: '$_id', hex: 1 } },
          { $sort: { name: 1 } },
        ],
        sizes: [
          { $unwind: '$sizes' },
          { $group: { _id: '$sizes.value' } },
          { $project: { _id: 0, value: '$_id' } },
        ],
        price: [{ $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }],
      },
    },
  ]);

  const colors = (result?.colors || []).filter((c) => c.name);
  const sizes = (result?.sizes || []).map((s) => s.value).filter(Boolean);
  const price = result?.price?.[0] || { min: 0, max: 0 };

  res.json({ success: true, colors, sizes, priceRange: { min: price.min ?? 0, max: price.max ?? 0 } });
});

// @route  GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { slug: req.params.slug, status: 'active' },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate('category', 'name slug');

  if (!product) throw new ApiError('Product not found', 404);
  res.json({ success: true, product });
});

// @route  GET /api/products/:id/related
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError('Product not found', 404);

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    status: 'active',
  })
    .limit(8)
    .select('name slug price discountPrice images ratingsAverage ratingsQuantity sizes');

  res.json({ success: true, products: related });
});

// @route  POST /api/products/by-ids  (batch fetch — cart hydration, recently viewed, FBT)
export const getProductsByIds = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.json({ success: true, products: [] });
  }
  const products = await Product.find({ _id: { $in: ids }, status: 'active' }).select(
    'name slug price discountPrice images colors sizes ratingsAverage ratingsQuantity'
  );
  res.json({ success: true, products });
});

// @route  GET /api/products/:id/reviews
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  res.json({ success: true, count: reviews.length, breakdown, reviews });
});

// @route  POST /api/products/:id/reviews
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  const existing = await Review.findOne({ product: req.params.id, user: req.user._id });
  if (existing) throw new ApiError('You have already reviewed this product', 409);

  const review = await Review.create({
    product: req.params.id,
    user: req.user._id,
    rating,
    title,
    comment,
  });

  res.status(201).json({ success: true, review });
});

// ---------- Admin ----------

// @route  POST /api/products (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  await createAdminNotification({
    type: 'product',
    title: 'Product added',
    message: `${product.name} was added as ${product.status}.`,
    severity: product.status === 'active' ? 'success' : 'info',
    entityType: 'Product',
    entityId: product._id,
    metadata: { status: product.status },
  });
  await notifyProductInventory(product);
  publishCatalogUpdate('products');
  res.status(201).json({ success: true, product });
});

// @route  PUT /api/products/:id (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError('Product not found', 404);
  await notifyProductInventory(product);
  publishCatalogUpdate('products');
  res.json({ success: true, product });
});

// @route  DELETE /api/products/:id (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError('Product not found', 404);
  await createAdminNotification({
    type: 'product',
    title: 'Product deleted',
    message: `${product.name} was removed from the catalog.`,
    severity: 'warning',
    entityType: 'Product',
    entityId: product._id,
  });
  publishCatalogUpdate('products');
  res.json({ success: true, message: 'Product removed' });
});

// @route  GET /api/products/admin/all (admin — includes drafts/archived)
export const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const resolvedQuery = await resolveCatalogFilters(req.query);
  const features = new ApiFeatures(Product.find().populate('category', 'name'), resolvedQuery)
    .search(['name'])
    .filter()
    .sort()
    .paginate();
  const countFeatures = new ApiFeatures(Product.find(), resolvedQuery).search(['name']).filter();
  const [products, total] = await Promise.all([features.query, countFeatures.query.countDocuments()]);
  res.json({
    success: true,
    count: products.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    products,
  });
});
