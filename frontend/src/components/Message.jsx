import { Alert } from 'react-bootstrap';

/**
 * Message component for displaying alerts with different variants.
 * This component uses Bootstrap's Alert component to show contextual messages.
 *
 * @param {string} variant - The variant type for the alert (e.g., 'info', 'danger', 'success').
 * @param {JSX.Element | string} children - The content to be displayed inside the alert.
 *
 * @returns {JSX.Element} - A Bootstrap Alert component with the given variant and content.
 */
const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

// Default variant is set to 'info' if none is provided
Message.defaultProps = {
  variant: 'info',
};

export default Message;
