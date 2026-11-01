import express from 'express';
import multer from 'multer';
import { uploadImages, deleteImage } from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const router = express.Router();

router.post('/', protect, authorize('admin'), upload.array('images', 6), uploadImages);
router.delete('/:publicId', protect, authorize('admin'), deleteImage);

export default router;
