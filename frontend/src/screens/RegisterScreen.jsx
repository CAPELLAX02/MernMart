import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters.', {
        theme: 'colored',
        position: 'top-center',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.warn('Passwords do not match.', {
        theme: 'colored',
        position: 'top-center',
      });
    } else {
      try {
        await register({ name, email, password }).unwrap();
        navigate('/verify', { state: { name, email, password } });
        toast.success(`Verification code sent to ${email}.`, {
          theme: 'colored',
          position: 'top-center',
        });
      } catch (error) {
        toast.error(
          `Something went wrong. [${error?.data?.message || error.error}]`,
          {
            theme: 'colored',
            position: 'top-center',
          }
        );
        console.log(error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <FloatingLabel
          controlId='floatingInput'
          label='Full Name'
          className='mb-3 text-black'
        >
          <Form.Control
            type='text'
            placeholder='your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mb-3'
          />
        </FloatingLabel>
        <FloatingLabel
          controlId='floatingInput'
          label='Email Address'
          className='mb-3'
        >
          <Form.Control
            type='email'
            placeholder='name@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mb-3'
          />
        </FloatingLabel>
        <FloatingLabel controlId='floatingPassword' label='Password'>
          <Form.Control
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='mb-3'
            style={{ letterSpacing: 2 }}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId='floatingInput'
          label='Confirm Password'
          className='mb-3'
        >
          <Form.Control
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='mb-3'
            style={{ letterSpacing: 2 }}
          />
        </FloatingLabel>

        <Button
          type='submit'
          className='mt-2 bg-primary fw-bold px-3 py-2'
          disabled={isLoading}
        >
          Sign Up
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          Already have an account? {'  '}
          <span>
            <b>
              <Link to='/login'>Sign In</Link>
            </b>
          </span>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
