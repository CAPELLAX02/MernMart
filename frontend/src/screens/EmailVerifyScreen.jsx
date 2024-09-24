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

/**
 * EmailVerifyScreen component handles the OTP verification for user email verification.
 * It allows users to input the OTP, resend it if needed, and gives feedback on success or failure.
 *
 * @returns {JSX.Element} - A form for OTP input and email verification functionality.
 */
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

  /**
   * Reset timer and resend attempts if email is not provided (user not found).
   */
  useEffect(() => {
    if (!email) {
      localStorage.removeItem('timer');
      setTimer(180);
    }
  }, [email]);

  /**
   * Start the countdown timer and store the remaining time in localStorage.
   */
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
    } else {
      toast.warning('Time is up! Please request a new verification code.', {
        theme: 'colored',
        position: 'top-center',
      });
    }
  }, [timer]);

  /**
   * Handle OTP input changes and auto-focus the next input box.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   * @param {number} index - The index of the OTP input being updated.
   */
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

  /**
   * Handle backspace functionality in OTP inputs and manage focus shifting.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keydown event.
   * @param {number} index - The index of the OTP input being updated.
   */
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

  /**
   * Resend verification code if resend attempts are within the limit.
   * Provides feedback based on success or failure of the resend action.
   */
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
        toast.error('Failed to resend verification code. Please try again.', {
          theme: 'colored',
          position: 'top-center',
        });
      }
    } else {
      toast.error('Maximum resend attempts reached. Please try again later.', {
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  /**
   * Submit the OTP verification request and handle various outcomes.
   * Feedback is provided for cases such as success, token expiration, or time running out.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const submitHandler = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (timer === 0) {
      toast.warning('Time is up! Please request another verification code.', {
        theme: 'colored',
        position: 'top-center',
      });
      return;
    }

    try {
      await verifyUser({
        activation_token: activationToken,
        activation_code: otpCode,
      }).unwrap();

      toast.success('Email verified successfully, you can sign in now.', {
        theme: 'colored',
        position: 'top-center',
      });
      navigate('/login');
    } catch (error) {
      if (error?.data?.message === 'JWT expired') {
        toast.error(
          'Verification token has expired. Please request a new code.',
          {
            theme: 'colored',
            position: 'top-center',
          }
        );
        setTimer(0); // Disable further actions
      } else {
        toast.error(error?.data?.message || error.error, {
          theme: 'colored',
          position: 'top-center',
        });
      }
    }
  };

  /**
   * Formats the timer to display in MM:SS format and ensures that when time runs out, it stays at 00:00.
   *
   * @returns {string} - The formatted time string.
   */
  const formatTime = () => {
    const minutes = Math.floor(Math.max(timer, 0) / 60); // Ensure time doesn't go negative
    const seconds = Math.max(timer, 0) % 60; // Ensure time doesn't go negative
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
                    className="bg-primary px-4 fw-semibold"
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
