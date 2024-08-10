import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  // updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
  deleteOrder,
  createCheckoutSession,
  getStripeSessionStatus,
  stripeWebhook,
  getOrderBySessionId,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/create-checkout-session', protect, createCheckoutSession);

router.get('/session-status', getStripeSessionStatus);

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

router.route('/order-by-session-id').get(protect, getOrderBySessionId);

router
  .route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getAllOrders);

router.route('/mine').get(protect, getMyOrders);

router
  .route('/:id')
  .get(protect, getOrderById)
  .put(protect, admin, deleteOrder);

// router.route('/:id/pay').put(protect, updateOrderToPaid);

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
