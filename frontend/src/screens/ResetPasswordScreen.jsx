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

  // E-posta adresini location state'den alıyoruz
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('Email bilgisi eksik. Lütfen tekrar deneyin.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('Şifreler eşleşmiyor.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Şifreniz en az 6 haneli olmalıdır.');
      return;
    }
    try {
      // Gönderilen verileri loglayın
      console.log('Sending data:', {
        email,
        resetPasswordCode: resetCode,
        newPassword,
      });
      await resetPassword({
        email,
        resetPasswordCode: resetCode,
        newPassword,
      }).unwrap();
      toast.success(
        'Şifreniz sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.'
      );
      navigate('/login');
    } catch (err) {
      toast.error(
        `Bir hata meydana geldi. [${err?.data?.message || err.error}]`
      );
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
