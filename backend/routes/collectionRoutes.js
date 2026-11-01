import express from 'express';
import {
  getCollections,
  getCollectionBySlug,
  getAllCollectionsAdmin,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collectionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCollections);
router.get('/admin/all', protect, authorize('admin'), getAllCollectionsAdmin);
router.get('/:slug', getCollectionBySlug);

router.post('/', protect, authorize('admin'), createCollection);
router.put('/:id', protect, authorize('admin'), updateCollection);
router.delete('/:id', protect, authorize('admin'), deleteCollection);

export default router;
