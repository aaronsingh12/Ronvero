import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { publishCatalogUpdate } from '../utils/catalogEvents.js';
import { createAdminNotification } from '../utils/adminNotifications.js';

// @route  GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.featured) filter.isFeatured = true;

  const categories = await Category.find(filter).sort('displayOrder');
  res.json({ success: true, count: categories.length, categories });
});

// @route  GET /api/categories/:slug
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) throw new ApiError('Category not found', 404);
  res.json({ success: true, category });
});

// ---------- Admin ----------

export const getAllCategoriesAdmin = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('displayOrder');
  res.json({ success: true, categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  await createAdminNotification({
    type: 'category',
    title: 'Category added',
    message: `${category.name} is ready for products.`,
    severity: 'success',
    entityType: 'Category',
    entityId: category._id,
  });
  publishCatalogUpdate('categories');
  res.status(201).json({ success: true, category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError('Category not found', 404);
  await createAdminNotification({
    type: 'category',
    title: 'Category updated',
    message: `${category.name} was updated.`,
    severity: 'info',
    entityType: 'Category',
    entityId: category._id,
  });
  publishCatalogUpdate('categories');
  res.json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.exists({ category: req.params.id });
  if (inUse) throw new ApiError('Cannot delete a category that still has products assigned to it', 409);

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError('Category not found', 404);
  await createAdminNotification({
    type: 'category',
    title: 'Category deleted',
    message: `${category.name} was removed.`,
    severity: 'warning',
    entityType: 'Category',
    entityId: category._id,
  });
  publishCatalogUpdate('categories');
  res.json({ success: true, message: 'Category removed' });
});
