import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AlertDialog = ({
  title,
  bodyText,
  closeBtnText,
  proceedBtnText,
  onClose,
  onConfirm,
  show,
  setShow,
}) => {
  const handleClose = () => {
    onClose();
    setShow(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton style={{ border: 'none' }}>
        <Modal.Title className='mx-2'>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='mx-2'>{bodyText}</Modal.Body>
      <Modal.Footer style={{ border: 'none' }}>
        <Button className='bg-primary text-white' onClick={handleClose}>
          {closeBtnText}
        </Button>
        <Button className='bg-danger text-white' onClick={handleConfirm}>
          {proceedBtnText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertDialog;
