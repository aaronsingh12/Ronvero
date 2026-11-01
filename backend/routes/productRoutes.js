import express from 'express';
import {
  getProducts,
  getProductFilters,
  getProductBySlug,
  getRelatedProducts,
  getProductsByIds,
  getProductReviews,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/filters', getProductFilters);
router.post('/by-ids', getProductsByIds);
router.get('/admin/all', protect, authorize('admin'), getAllProductsAdmin);

router.get('/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, createProductReview);

router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
