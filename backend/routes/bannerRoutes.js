import express from 'express';
import {
  getBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBanners);
router.get('/admin/all', protect, authorize('admin'), getAllBannersAdmin);
router.post('/', protect, authorize('admin'), createBanner);
router.put('/:id', protect, authorize('admin'), updateBanner);
router.delete('/:id', protect, authorize('admin'), deleteBanner);

export default router;
