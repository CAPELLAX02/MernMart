import express from 'express';
const router = express.Router();
import iyzipay from '../config/iyzico';
import asyncHandler from '../middleware/asyncHandler.js';
import { protect } from '../middleware/authMiddleware.js';

router.post(
  '/pay',
  protect,
  asyncHandler(async (req, res) => {
    const { cartItems, user } = req.body;

    const request = {
      locale: Iyzipay.LOCALE.EN,
      conversationId: '123456789',
      price: '1',
      paidPrice: '1.2',
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: 'B67832',
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard: {
        cardHolderName: 'John Doe',
        cardNumber: '5528790000000008',
        expireMonth: '12',
        expireYear: '2030',
        cvc: '123',
        registerCard: '0',
      },
      buyer: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        identityNumber: '74300864791',
        lastLoginDate: new Date().toISOString(),
        registrationDate: user.createdAt,
        registrationAddress: user.address,
        ip: req.ip,
        city: user.city,
        country: user.country,
        zipCode: user.zipCode,
      },
      shippingAddress: {
        contactName: user.name,
        city: user.city,
        country: user.country,
        address: user.address,
        zipCode: user.zipCode,
      },
      billingAddress: {
        contactName: user.name,
        city: user.city,
        country: user.country,
        address: user.address,
        zipCode: user.zipCode,
      },
      basketItems: cartItems.map((item) => ({
        id: item._id,
        name: item.name,
        category1: item.category,
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: item.price,
      })),
    };

    iyzipay.payment.create(request, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err?.message || err });
      }
      res.json(result);
    });
  })
);

export default router;
