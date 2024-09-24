import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Loader from './Loader';
import CreditCardForm from './CreditCardForm';
import { toast } from 'react-toastify';

const PaymentModal = ({ show, handleClose, processPayment }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentSubmit = async (paymentDetails) => {
    setIsSubmitting(true);
    try {
      await processPayment(paymentDetails);
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message || error.error, {
        theme: 'colored',
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Payment Credentials</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isSubmitting ? (
          <Loader />
        ) : (
          <CreditCardForm onSubmit={handlePaymentSubmit} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;
