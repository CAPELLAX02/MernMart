import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

/**
 * AlertDialog component for displaying a modal dialog with customizable
 * title, body text, and buttons for close and proceed actions.
 *
 * @param {string} title - The title of the dialog.
 * @param {string} bodyText - The body text of the dialog.
 * @param {string} closeBtnText - The text for the close button.
 * @param {string} proceedBtnText - The text for the proceed button.
 * @param {function} onClose - Function to be called when the dialog is closed.
 * @param {function} onConfirm - Function to be called when the proceed button is clicked.
 * @param {boolean} show - Boolean value to control whether the modal is shown or hidden.
 * @param {function} setShow - Function to control the visibility of the modal.
 *
 * @returns {JSX.Element} - A modal dialog with customizable title, body, and buttons.
 */
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
  /**
   * Handles the closing of the modal, triggers onClose and hides the modal.
   */
  const handleClose = () => {
    onClose();
    setShow(false);
  };

  /**
   * Handles the confirm action, triggers onConfirm and hides the modal.
   */
  const handleConfirm = () => {
    onConfirm();
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{ border: 'none' }}>
        <Modal.Title className="mx-2">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mx-2">{bodyText}</Modal.Body>
      <Modal.Footer style={{ border: 'none' }}>
        <Button className="bg-primary text-white" onClick={handleClose}>
          {closeBtnText}
        </Button>
        <Button className="bg-danger text-white" onClick={handleConfirm}>
          {proceedBtnText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertDialog;
