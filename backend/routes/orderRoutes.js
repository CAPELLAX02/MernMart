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
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

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

router.post('/create-checkout-session', createCheckoutSession);
router.get('/session-status', getStripeSessionStatus);

export default router;
