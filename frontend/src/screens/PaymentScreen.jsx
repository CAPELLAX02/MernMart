import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />

      <FormContainer>
        <h1>Ödeme Yöntemi</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label className='mb-4' as='legend'>
              Ödeme Yönteminizi Seçin
            </Form.Label>
            <Col>
              <Form.Check
                type='radio'
                className='mb-4'
                label='Kredi & Banka Kartı'
                id='PayPal'
                name='paymentMethod'
                value='PayPal'
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Devam Et
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
