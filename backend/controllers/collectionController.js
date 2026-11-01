import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Collection from '../models/Collection.js';

// @route  GET /api/collections
export const getCollections = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.featured) filter.isFeatured = true;

  const collections = await Collection.find(filter).sort('displayOrder');
  res.json({ success: true, count: collections.length, collections });
});

// @route  GET /api/collections/:slug
export const getCollectionBySlug = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({ slug: req.params.slug, isActive: true }).populate({
    path: 'products',
    match: { status: 'active' },
    select: 'name slug price discountPrice images ratingsAverage ratingsQuantity sizes',
  });
  if (!collection) throw new ApiError('Collection not found', 404);
  res.json({ success: true, collection });
});

// ---------- Admin ----------

export const getAllCollectionsAdmin = asyncHandler(async (req, res) => {
  const collections = await Collection.find().sort('displayOrder');
  res.json({ success: true, collections });
});

export const createCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.create(req.body);
  res.status(201).json({ success: true, collection });
});

export const updateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!collection) throw new ApiError('Collection not found', 404);
  res.json({ success: true, collection });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndDelete(req.params.id);
  if (!collection) throw new ApiError('Collection not found', 404);
  res.json({ success: true, message: 'Collection removed' });
});
