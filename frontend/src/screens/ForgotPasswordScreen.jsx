import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import { useSendForgotPasswordEmailMutation } from '../slices/usersApiSlice';
import Loader from '../components/Loader';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [sendForgotPasswordEmail, { isLoading }] =
    useSendForgotPasswordEmailMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await sendForgotPasswordEmail({ email }).unwrap();
      toast.success(
        `Şifre sıfırlama kodu ${email} e-posta adresine gönderildi`
      );
      navigate('/reset-password', { state: { email } }); // E-posta adresini burada taşıyoruz
    } catch (err) {
      toast.error(
        `Bir hata meydana geldi. [${err?.data?.message || err.error}]`
      );
    }
  };

  return (
    <FormContainer>
      <h1>Şifremi Unuttum</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Adresinizi</Form.Label>
          <Form.Control
            type='email'
            placeholder='Email Adresinizi Girin'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='mt-2'
          disabled={isLoading}
        >
          Şifre Sıfırlama Kodunu Gönder
        </Button>
        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
