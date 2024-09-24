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
  const { name, email, password, activationToken } = location.state || {};

  const [resendAttempts, setResendAttempts] = useState(0);

  const [verifyUser, { isLoading: verifyLoading }] = useVerifyUserMutation();
  const [register, { isLoading: resendCodeLoading }] = useRegisterMutation();

  const initialTimer = 180;
  const [timer, setTimer] = useState(initialTimer);

  useEffect(() => {
    if (!email) {
      localStorage.removeItem('timer');
      setTimer(180);
    }
  }, [email]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          localStorage.setItem('timer', newTimer);
          return newTimer;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const resendVerificationCode = async () => {
    if (resendAttempts < 3) {
      try {
        const response = await register({ name, email, password }).unwrap();
        setResendAttempts((prev) => prev + 1);
        setTimer(180);
        localStorage.setItem('timer', '180');
        toast.info('A new verification code has been sent to your email.', {
          theme: 'colored',
          position: 'top-center',
        });
        navigate('/verify', {
          state: {
            name,
            email,
            password,
            activationToken: response.activationToken,
          },
        });
      } catch (error) {
        toast.error('Failed to resend verification code.', {
          theme: 'colored',
          position: 'top-center',
        });
      }
    } else {
      toast.error('No more attempts left to resend verification code.', {
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/^\d$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < otp.length - 1 && value) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    try {
      await verifyUser({
        activation_token: activationToken,
        activation_code: otpCode,
      }).unwrap();
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
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <FormContainer>
      <h1 className="text-center mb-4">Email Verification</h1>
      <div className="container height-100 d-flex justify-content-center">
        <div className="position-relative">
          <div className="card text-center bg-info bg-opacity-10">
            <h6>
              Please enter the 6-digit code that you received to verify your
              account
            </h6>
            <div>
              <p>
                The code has been sent to{' '}
                <span className="text-white bg-primary py-1 px-2 rounded-5">
                  {email}
                </span>
              </p>
              <div className="timer">{formatTime()}</div>
            </div>
            <Form onSubmit={submitHandler}>
              <div
                id="otp"
                className="inputs d-flex flex-row justify-content-center mt-2"
              >
                {otp.map((value, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    className="m-2 text-center form-control rounded"
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
              <div className="mt-4">
                {timer === 0 && <p></p>}
                {verifyLoading ? (
                  <Loader />
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={verifyLoading || timer === 0}
                  >
                    Verify Email
                  </Button>
                )}
              </div>
              {resendCodeLoading ? (
                <Loader />
              ) : (
                <div className="mt-3">
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
