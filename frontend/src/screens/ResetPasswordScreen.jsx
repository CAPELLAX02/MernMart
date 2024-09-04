import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useResetPasswordMutation } from '../slices/usersApiSlice';

const ResetPasswordScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('You must enter an email address.', {
        theme: 'colored',
        position: 'top-center',
      });
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.warn('New passwords do not match.', {
        theme: 'colored',
        position: 'top-center',
      });
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters.', {
        theme: 'colored',
        position: 'top-center',
      });
      return;
    }
    try {
      // console.log('Sending data:', {
      //   email,
      //   resetPasswordCode: resetCode,
      //   newPassword,
      // });
      await resetPassword({
        email,
        resetPasswordCode: resetCode,
        newPassword,
      }).unwrap();
      toast.success(
        'Password reset successfull! You can sign in with your new password.',
        {
          theme: 'colored',
          position: 'top-center',
        }
      );
      navigate('/login');
    } catch (err) {
      toast.error(`Something wen wrong. [${err?.data?.message || err.error}]`, {
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  return (
    <FormContainer>
      <h1>Şifrenizi Sıfırlayın</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='resetCode' className='my-3'>
          <Form.Label>Şifre Sıfırlama Kodu</Form.Label>
          <Form.Control
            type='text'
            placeholder='6 Haneli Kodu Girin'
            maxLength={6}
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='newPassword' className='my-3'>
          <Form.Label>Yeni Şifre</Form.Label>
          <Form.Control
            type='password'
            placeholder='Yeni Şifrenizi Girin'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmNewPassword' className='my-3'>
          <Form.Label>Yeni Şifre (Tekrar)</Form.Label>
          <Form.Control
            type='password'
            placeholder='Yeni Şifrenizi Girin (Tekrar)'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='mt-2'
          disabled={isLoading}
        >
          Şifreyi Sıfırla
        </Button>
        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ResetPasswordScreen;
