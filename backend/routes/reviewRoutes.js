import express from 'express';
import {
  updateReview,
  deleteReview,
  markReviewHelpful,
  getAllReviewsAdmin,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Creating a review and listing a product's reviews live under /api/products/:id/reviews

router.get('/', protect, authorize('admin'), getAllReviewsAdmin);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', protect, markReviewHelpful);

export default router;
