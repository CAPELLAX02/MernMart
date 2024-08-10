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

const stripePromise = loadStripe(
  `pk_test_51PkqaLH9opOR77k1BtGN1DVRUfujkaJ1DsF7IIbgVb9U3Tbfm2KK6wUqqZGbCFcCzyqT0N748tPEexaXdDsR1YQN00nL9T903d`
);

/**
 *        SORUNLAR:
 *
 *    1. sipariş 2 kez db ye kaydediliyor.
 *    2. return sayfasındaki sipariş verileri db den degil de cart statinden cekildigi için sipariş sonrası cart boşaldığından anına boşalıyor sipariş bilgileri de order confirmation kısmında return sayfasındaki.
 */

export const CheckoutForm = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;

  const fetchClientSecret = useCallback(async () => {
    const shippingAddress = cart.shippingAddress || {
      address: 'No address provided',
      city: 'No city',
      postalCode: '00000',
      country: 'No country',
    };

    try {
      const response = await fetch('/api/orders/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems, shippingAddress }),
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
  }, [cartItems, cart.shippingAddress]);

  const options = { fetchClientSecret };

  return (
    <div id='checkout' className='mb-5 mt-2'>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export const Return = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const {
    cartItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = cart;

  const [createOrder] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  const placeOrderHandler = useCallback(async () => {
    try {
      await createOrder({
        orderItems: cartItems,
        shippingAddress: shippingAddress || 'default shipping address',
        paymentMethod: 'Credit & Debit Card',
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
    } catch (err) {
      console.log('Placing order error: ', err);
    }
  }, [
    cartItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    createOrder,
    dispatch,
  ]);

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
          placeOrderHandler();
        }
      })
      .catch((error) => {
        console.error('Error fetching session status:', error);
      });
  }, [placeOrderHandler]);

  if (status === 'open') {
    return <Navigate to='/checkout' />;
  }

  if (status === 'complete') {
    return (
      <section id='success' className='container mt-2 mb-5'>
        <div className='card text-black mt-0'>
          <div className='card-header bg-success text-white w-100 my-2'>
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
                  <a
                    href='/'
                    className='btn text-white bg-primary px-4 fw-semibold'
                  >
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
