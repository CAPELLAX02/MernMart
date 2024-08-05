import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useVerifyUserMutation } from '../slices/usersApiSlice';

const EmailVerifyScreen = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [verifyUser, { isLoading }] = useVerifyUserMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await verifyUser({ email, verificationCode }).unwrap();
      toast.success('E-posta başarıyla doğrulandı.');
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      console.log(error);
    }
  };

  return (
    <FormContainer>
      <h1>Email Verification</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='verificationCode' className='my-3'>
          <Form.Label>Verification Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter 6-Digit Vode'
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          type='submit'
          variant='primary'
          className='mt-2'
          disabled={isLoading}
        >
          Verify
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default EmailVerifyScreen;
