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
      toast.success(`Reset password code sen to ${email}.`, {
        theme: 'colored',
        position: 'top-center',
      });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      toast.error(
        `Something went wrong. [${err?.data?.message || err.error}]`,
        {
          theme: 'colored',
          position: 'top-center',
        }
      );
    }
  };

  return (
    <FormContainer>
      <h1>Forgot Password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Send Reset Code
        </Button>
        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
