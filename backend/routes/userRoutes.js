import express from 'express';
import {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  toggleWishlist,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // every route below requires authentication

router.put('/profile', updateProfile);

router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', toggleWishlist);

router.get('/', authorize('admin'), getAllUsers);
router.put('/:id/role', authorize('admin'), updateUserRole);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
