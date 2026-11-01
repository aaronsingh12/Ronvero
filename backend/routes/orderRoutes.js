import express from 'express';
import {
  getCartPricing,
  createOrderPaymentIntent,
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getSalesAnalytics,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/pricing', getCartPricing); // public — cart drawer preview, no auth required

router.use(protect);

router.post('/create-payment-intent', createOrderPaymentIntent);
router.post('/', createOrder);
router.get('/my', getMyOrders);

router.get('/analytics/summary', authorize('admin'), getSalesAnalytics);
router.get('/', authorize('admin'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
