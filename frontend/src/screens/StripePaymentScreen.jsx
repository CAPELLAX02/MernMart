import { useCallback, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartItems } from '../slices/cartSlice';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';

// const stripePromise = loadStripe(`${process.env.STRIPE_PUBLISHABLE_KEY}`);
const stripePromise = loadStripe(
  `pk_test_51PkqaLH9opOR77k1BtGN1DVRUfujkaJ1DsF7IIbgVb9U3Tbfm2KK6wUqqZGbCFcCzyqT0N748tPEexaXdDsR1YQN00nL9T903d`
);

export const CheckoutForm = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const fetchClientSecret = useCallback(async () => {
    try {
      const response = await fetch('/api/orders/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems: cartItems }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        return data.clientSecret;
      } else {
        throw new Error(`Failed to fetch client secret: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching client secret:', error);
      throw error;
    }
  }, [cartItems]);

  const options = { fetchClientSecret };

  return (
    <div id='checkout' className='mb-5 mt-2'>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

/**
 *
 *    YAPILACAKLAR:
 *
 *  - Ödeme zart diye olmayacak. Bir progress UI ı olacak ve bu UI ın son adımında olucak embedded Stripe Checkout Form. ondan önce kullanıcı adresini falan gircek.
 *
 *  - EJS ile mail gönderme eklenecek. Kayıt olurken gönderilen mail kesin olucak. Duruma göre sipariş sonrası da mail yollanabilir fatura hesabı.
 *
 *  - Giriş/Çıkış Sayfalarındaki formlar güzelleştirilebilir. floating inputlar çok şık durabilir örneğin.
 *
 *  - Admin kullanıcı ürün ekleyip editlediğinde ürünü kaydetmeden önce bir preview sayfası olucak. AYRICA ÜRÜNÜ EDİTLEMEDEN HEMEN EKLİYOR ŞU ANKİ LOGICTE BUNU DEĞİŞTİRMEK LAZIM KESİNLİKLE.
 *
 *  - Product componentindeki add to cart fonksiyonu stokta olmayan ürünler için farklı bir akış izleyecek. buton disabled olucak ve ürün kardında bu belirtilecek.
 *
 *  - Email onaylama süresi bittikten sonra kullanıncı kaydı (isEmailVerified: false hali) veritabanından kalıcı olarak silinecek.
 *
 *  + + + Düzenli her gün repositorylerini düzenle!
 *
 *  + + + Git/Github Eğitimi al.
 *
 */

export const Return = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  console.log(cart);
  const {
    cartItems,
    // shippingAddress,
    // paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = cart;

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      await createOrder({
        orderItems: cartItems,
        shippingAddress:
          'example shipping address (address should be taken from the user before the payment actually.)',
        paymentMethod: 'Credit & Debit Card',
        itemsPrice,
        shippingPrice: 5,
        taxPrice,
        totalPrice,
      }).unwrap();
      // dispatch(clearCartItems());
    } catch (err) {
      console.log('Placing order error: ', err);
    }
  };

  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/api/orders/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
        if (data.status === 'complete') {
          placeOrderHandler(); // Place the order only if the payment was successful
        }
      })
      .catch((error) => {
        console.error('Error fetching session status:', error);
      });
  }, [dispatch, createOrder]);

  if (status === 'open') {
    return <Navigate to='/checkout' />;
  }

  if (status === 'complete') {
    return (
      <section id='success' className='container mt-4 mb-5'>
        <div className='card text-black'>
          <div className='card-header bg-success text-white'>
            <h1 className='text-center my-auto'>Order Confirmation</h1>
          </div>
          <div className='card-body'>
            <h5 className='card-title ps-4'>
              Thank you for your purchase, {userInfo.name.split(' ')[0]}!
            </h5>
            <p className='card-text ps-4 mb-4'>
              We have successfully received your order and a confirmation email
              has been sent to your email address.
            </p>

            {/* Displaying product images and details */}
            <div className='row border-top pt-4'>
              <div className='col-md-8'>
                <h5 className='ps-4 mb-1'>Order Details:</h5>
                <ul className='list-group list-group-flush'>
                  {cartItems.map((item, index) => (
                    <li key={index} className='list-group-item'>
                      <div className='row'>
                        <div className='col-6 col-md-4'>
                          <img
                            src={item.image}
                            alt={item.name}
                            className='img-thumbnail'
                          />
                        </div>
                        <div className='col-6 col-md-8'>
                          <div>{item.name}</div>
                          <div>
                            {item.qty} x ${item.price}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='col-md-4 border-start ps-4 pt-2'>
                <h5>Order Summary:</h5>
                <div className='mb-2'>
                  <span className='text-muted'>Items Total: </span>
                  <p className='float-right'>${itemsPrice}</p>
                </div>
                <div className='mb-2'>
                  <span className='text-muted'>Shipping: </span>
                  <p className='float-right'>${shippingPrice}</p>
                </div>
                <div className='mb-2'>
                  <span className='text-muted'>Tax: </span>
                  <p className='float-right'>${taxPrice}</p>
                </div>
                <div className='mb-4 border-top pt-2'>
                  <span className='text-muted'>Total: </span>
                  <p className='float-right'>${totalPrice}</p>
                </div>
                <div className='text-center'>
                  <a href='/' className='btn btn-primary'>
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>

            <div className='card-footer mt-3'>
              <p>
                If you have any questions, please email{' '}
                <a href='mailto:support@mernmart.com'>support@mernmart.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};
