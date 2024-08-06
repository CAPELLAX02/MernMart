import { useCallback, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// const stripePromise = loadStripe(`${process.env.STRIPE_PUBLISHABLE_KEY}`);
const stripePromise = loadStripe(
  `pk_test_51PkqaLH9opOR77k1BtGN1DVRUfujkaJ1DsF7IIbgVb9U3Tbfm2KK6wUqqZGbCFcCzyqT0N748tPEexaXdDsR1YQN00nL9T903d`
);

export const CheckoutForm = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  console.log(cartItems);

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

export const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return <Navigate to='/checkout' />;
  }

  if (status === 'complete') {
    return (
      <section id='success'>
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customerEmail}. If you have any questions, please email{' '}
          <a href='mailto:support@mernmart.com'>support@mernmart.com</a>.
        </p>
      </section>
    );
  }

  return null;
};
