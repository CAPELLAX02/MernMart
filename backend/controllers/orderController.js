import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import iyzipay from '../config/iyzico.js';
import Iyzipay from 'iyzipay';

/*
    Request equivalents of CRUD (Create, Read, Update, and Delete):

       POST : Create
        GET : Read
        PUT : Update
     DELETE : Delete
*/

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
        // product: x._id,
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
// @route    GET /api/orders/myorders/:id
// @access   Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc     Update order to paid
// @route    PUT /api/orders/:id/pay
// @access   Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  console.log('BUYER ID:', order.user._id.toString());
  console.log('BUYER NAME:', order.user.name);
  console.log('BUYER EMAIL:', order.user.email);

  // Sepet öğelerinin toplam fiyatını hesaplayın
  const basketTotalPrice = order.orderItems.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);

  const { cardUserName, cardNumber, expireDate, cvc } = req.body;

  const paymentRequest = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: order._id.toString(),
    price: basketTotalPrice.toFixed(2), // Sepet toplam fiyatını kullanın
    paidPrice: basketTotalPrice.toFixed(2), // Sepet toplam fiyatını kullanın
    currency: Iyzipay.CURRENCY.TRY,
    installment: '1',
    basketId: order._id.toString(),
    paymentCard: {
      cardHolderName: cardUserName,
      cardNumber: cardNumber,
      expireMonth: expireDate.split('/')[0],
      expireYear: '20' + expireDate.split('/')[1],
      // expireMonth: req.body.expireMonth,
      // expireYear: req.body.expireYear,
      cvc: cvc,
      registerCard: '0',
    },
    buyer: {
      id: order.user._id.toString(),
      name: order.user.name,
      surname: order.user.name.split(' ').slice(1).join(' ') || 'NA',
      email: order.user.email,
      identityNumber: '11111111111',
      registrationAddress: order.shippingAddress.address,
      ip: req.ip,
      city: order.shippingAddress.city,
      country: order.shippingAddress.country,
      zipCode: order.shippingAddress.postalCode,
    },
    shippingAddress: {
      contactName: order.user.name,
      city: order.shippingAddress.city,
      country: order.shippingAddress.country,
      address: order.shippingAddress.address,
      zipCode: order.shippingAddress.postalCode,
    },
    billingAddress: {
      contactName: order.user.name,
      city: order.shippingAddress.city,
      country: order.shippingAddress.country,
      address: order.shippingAddress.address,
      zipCode: order.shippingAddress.postalCode,
    },
    basketItems: order.orderItems.map((item) => ({
      id: item.product.toString(),
      name: item.name,
      category1: 'General',
      category2: 'General',
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.qty).toFixed(2), // Sepet öğesinin fiyatını ve miktarını kullanın
    })),
  };

  // // Eksik alanları kontrol edin
  // const requiredFields = [
  //   'cardHolderName',
  //   'cardNumber',
  //   'expireMonth',
  //   'expireYear',
  //   'cvc',
  // ];
  // for (const field of requiredFields) {
  //   if (!req.body[field]) {
  //     res.status(400).json({ message: `${field} alanı zorunludur` });
  //     return;
  //   }
  // }

  iyzipay.payment.create(paymentRequest, async (err, result) => {
    if (err) {
      console.error('IYZICO Payment Error:', err);
      res
        .status(500)
        .json({ message: 'Payment processing failed', error: err });
    } else if (result.status !== 'success') {
      console.error('IYZICO Payment Error:', result.errorMessage);
      res.status(500).json({
        message: 'Payment processing failed',
        error: result.errorMessage,
      });
    } else {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: result.paymentId,
        status: result.status,
        update_time: Date.now(),
        email_address: order.user.email,
      };
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    }
  });
});

// @desc     Update order to delivered
// @route    PUT /api/orders/:id/deliver
// @access   Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send('update order to paid');
});

// @desc     Get all orders
// @route    GET /api/orders
// @access   Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  res.send('get all orders');
});

// @desc     Delete order
// @route    DELETE /api/orders/:id/delete
// @access   Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  res.send('delete order');
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
  deleteOrder,
};
