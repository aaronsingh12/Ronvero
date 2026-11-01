import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

export default router;
