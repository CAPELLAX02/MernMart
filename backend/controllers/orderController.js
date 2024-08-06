import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(
  'sk_test_51PkqaLH9opOR77k1n9SVX2wpXcVoNy1ujaxKWIAGHHRvWeT9CXGo3TqXIkuVtL0UcjF9rnrBe37m18eI7LgHTZ6m00BTYSmt8s'
);

// @desc     Create new order
// @route    POST /api/orders
// @access   Private
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

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((order) => ({
        ...order,
        product: order._id,
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
  if (!req.body.cartItems) {
    res.status(400).json({ message: 'Cart items are required' });
    console.log('Cart Items Error!');
    return;
  }
  const { cartItems } = req.body; // Frontend'den gelen sepet ürünleri

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        // images: [item.image], // Ürün resmini de ekleyebilirsiniz.
      },
      unit_amount: Math.round(item.price * 100), // Fiyatı cent cinsinden.
    },
    quantity: item.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    // success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
    // success_url: `http://localhost:3000/success`,
    // cancel_url: `http://localhost:3000/cancel`,
    return_url: `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.json({ clientSecret: session.client_secret });
});

// GET /api/orders/session-status
const getStripeSessionStatus = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
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
};
