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
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // NOTE: here we must assume that the prices from our client are incorrect.
    // We must only trust the price of the item as it exists in
    // our DB. This prevents a user paying whatever they want by hacking our client
    // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff

    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const { itemsPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    order.isPaid = true;
    order.paidAt = Date.now();

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
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

  const shippingRate = await stripe.shippingRates.create({
    display_name: 'Ground shipping',
    type: 'fixed_amount',
    fixed_amount: {
      amount: 500,
      currency: 'usd',
    },
    delivery_estimate: {
      minimum: {
        unit: 'business_day',
        value: 5,
      },
      maximum: {
        unit: 'business_day',
        value: 7,
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    // shipping_options: [
    //   {
    //     shipping_rate: shippingRate,
    //   },
    // ],
    // success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
    // success_url: `http://localhost:3000/success`,
    // cancel_url: `http://localhost:3000/cancel`,
    return_url: `https://mernmart.onrender.com/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({ clientSecret: session.client_secret });
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
