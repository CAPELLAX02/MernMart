import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(
  'sk_test_51PkqaLH9opOR77k1n9SVX2wpXcVoNy1ujaxKWIAGHHRvWeT9CXGo3TqXIkuVtL0UcjF9rnrBe37m18eI7LgHTZ6m00BTYSmt8s'
);

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

  try {
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
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Order could not be saved.' });
  }
});

// @desc     Get logged in user orders
// @route    GET /api/orders/myorders
// @access   Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc     Get order by ID
// @route    GET /api/orders/:id
// @access   Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).throw(new Error('Order not found'));
  }
});

// @desc     Update order to delivered
// @route    PUT /api/orders/:id/deliver
// @access   Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404).throw(new Error('Order not found'));
  }
});

// @desc     Get all orders
// @route    GET /api/orders
// @access   Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

// @desc     Delete order
// @route    DELETE /api/orders/:id
// @access   Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.status(200).json({ message: 'Order removed' });
  } else {
    res.status(404).throw(new Error('Order not found'));
  }
});

// POST /api/orders/create-checkout-session
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
      return_url: returnUrl, // Only use this URL in embedded mode
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

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/orders/session-status
const getStripeSessionStatus = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

// Webhook Endpoint Secret Key
const STRIPE_WEBHOOK_SECRET =
  'whsec_ad4f985b9f5b5454898d6808a6d71b663123d72e2ecd058abf186013b76d10e7';

// Stripe Webhook Handler
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`⚠️ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extract metadata and save the order in the database
    const orderItems = JSON.parse(session.metadata.cartItems);
    const shippingAddress = JSON.parse(session.metadata.shippingAddress);

    const order = new Order({
      orderItems: orderItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      })),
      user: session.metadata.userId,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      paymentMethod: 'Credit & Debit Card',
      itemsPrice: session.amount_total / 100,
      totalPrice: session.amount_total / 100,
      isPaid: true,
      paidAt: Date.now(),
    });

    await order.save();
  }

  res.status(200).json({ received: true });
});

// @desc     Get order by session ID
// @route    GET /api/orders/order-by-session-id
// @access   Private
const getOrderBySessionId = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ sessionId: req.query.session_id });

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
  stripeWebhook,
  getOrderBySessionId,
};
