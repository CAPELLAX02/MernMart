import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import {
  useRegisterMutation,
  useVerifyUserMutation,
} from '../slices/usersApiSlice';
import './OTP.css';

const EmailVerifyScreen = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email, password } = location.state || {};

  console.log(email);
  console.log(name);
  console.log(password);

  const [verifyUser, { isLoading: verifyLoading }] = useVerifyUserMutation();

  const [register, { isLoading: resendCodeLoading }] = useRegisterMutation();

  const resendVerificationCode = async () => {
    await register({ name, email, password }).unwrap();
  };

  const initialTimer = localStorage.getItem('timer')
    ? parseInt(localStorage.getItem('timer'))
    : 180;
  const [timer, setTimer] = useState(initialTimer);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
        localStorage.setItem('timer', timer - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/^[0-9a-zA-Z]$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus next input field
      if (index < otp.length - 1 && value) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    try {
      await verifyUser({ email, verificationCode: otpCode }).unwrap();
      toast.success('Email verified successfully, you can sign in.', {
        theme: 'colored',
        position: 'top-center',
      });
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || error.error, {
        theme: 'colored',
        position: 'top-center',
      });
      console.log(error);
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <FormContainer>
      <h1 className='text-center mb-4'>Email Verification</h1>
      <div className='container height-100 d-flex justify-content-center'>
        <div className='position-relative'>
          <div className='card text-center bg-info bg-opacity-10'>
            <h6>
              Please enter the 6-digit code that you received to verify your
              account
            </h6>
            <div>
              <p>
                A code has been sent to{' '}
                <span className='text-white bg-primary py-1 px-2 rounded-5'>
                  {email}
                </span>
              </p>
              <div className='timer'>{formatTime()}</div>
            </div>
            <Form onSubmit={submitHandler}>
              <div
                id='otp'
                className='inputs d-flex flex-row justify-content-center mt-2'
              >
                {otp.map((value, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    className='m-2 text-center form-control rounded'
                    type='text'
                    maxLength='1'
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
              <div className='mt-4'>
                {timer === 0 && <p></p>}
                {verifyLoading ? (
                  <Loader />
                ) : (
                  <Button
                    type='submit'
                    variant='primary'
                    disabled={verifyLoading || timer === 0}
                  >
                    Verify Email
                  </Button>
                )}
              </div>
              {resendCodeLoading ? (
                <Loader />
              ) : (
                <div className='mt-3'>
                  <Link onClick={resendVerificationCode}>
                    Resend Verification Code
                  </Link>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    </FormContainer>
  );
};

export default EmailVerifyScreen;
