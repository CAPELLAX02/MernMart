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
      <h1>Reset Your Password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="resetCode" className="my-3">
          <Form.Label>Password Reset Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter 6-digit Code"
            maxLength={6}
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="newPassword" className="my-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="confirmNewPassword" className="my-3">
          <Form.Label>New Password (Again)</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your new password (Again)"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Reset Password
        </Button>
        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ResetPasswordScreen;
