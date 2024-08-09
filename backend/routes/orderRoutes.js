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

router.post('/create-checkout-session', createCheckoutSession);
router.get('/session-status', getStripeSessionStatus);

router.route('/').post(addOrderItems).get(getAllOrders);

router.route('/mine').get(getMyOrders);

router.route('/:id').get(getOrderById).put(deleteOrder);

// router.route('/:id/pay').put(protect, updateOrderToPaid);

router.route('/:id/deliver').put(updateOrderToDelivered);

export default router;
