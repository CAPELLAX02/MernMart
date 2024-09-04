import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));

    navigate('/payment');
  };

  return (
    <>
      <CheckoutSteps step1 step2 />

      <FormContainer>
        <h1>Sipariş Adresi</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='address' className='my-2'>
            <Form.Label>Adres</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter the address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Form>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='city' className='my-2'>
            <Form.Label>City</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter the city'
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Form>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='postalCode' className='my-2'>
            <Form.Label>Posta Kodu</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter the postalCode'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Form>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='country' className='my-2'>
            <Form.Label>Şehir</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter the country'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='my-2'>
            Devam Et
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
