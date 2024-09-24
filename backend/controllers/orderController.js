import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Stripe from 'stripe';
const stripe = new Stripe(
  'sk_test_51PkqaLH9opOR77k1n9SVX2wpXcVoNy1ujaxKWIAGHHRvWeT9CXGo3TqXIkuVtL0UcjF9rnrBe37m18eI7LgHTZ6m00BTYSmt8s'
);

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  const order = new Order({
    orderItems: orderItems.map((item) => ({
      ...item,
      product: item._id,
      _id: undefined,
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  res.status(200).json(createdOrder);
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

/**
 * @desc    Update order to delivered
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

/**
 * @desc    Delete order
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.status(200).json({ message: 'Order removed' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

/**
 * @desc    Create a checkout session with Stripe
 * @route   POST /api/orders/create-checkout-session
 * @access  Private
 */
const createCheckoutSession = asyncHandler(async (req, res) => {
  try {
    const { cartItems, shippingAddress } = req.body;

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ message: 'Cart items are required' });
      return;
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const returnUrl =
      process.env.NODE_ENV === 'production'
        ? `https://mernmart.onrender.com/return?session_id={CHECKOUT_SESSION_ID}`
        : `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      return_url: returnUrl,
      metadata: {
        userId: req.user._id.toString(),
        productIds: cartItems.map((item) => item._id).join(','),
        shippingAddress: JSON.stringify({
          address: shippingAddress.address || 'No address provided',
          city: shippingAddress.city || 'No city',
          postalCode: shippingAddress.postalCode || '00000',
          country: shippingAddress.country || 'No country',
        }),
      },
    });

    res.send({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @desc    Get Stripe checkout session status
 * @route   GET /api/orders/session-status
 * @access  Private
 */
const getStripeSessionStatus = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

/**
 * @desc    Get order by session ID
 * @route   GET /api/orders/order-by-session-id
 * @access  Private
 */
const getOrderBySessionId = asyncHandler(async (req, res) => {
  const sessionId = req.query.session_id;
  const order = await Order.findOne({ 'paymentResult.id': sessionId });

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  getAllOrders,
  deleteOrder,
  createCheckoutSession,
  getStripeSessionStatus,
  getOrderBySessionId,
};
