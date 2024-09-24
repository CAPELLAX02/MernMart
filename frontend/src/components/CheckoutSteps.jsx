import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * CheckoutSteps component to display the progress of the checkout process.
 * Each step is either enabled (as a link) or disabled based on the provided step props.
 *
 * @param {boolean} step1 - Indicates if the "Sign In" step is active.
 * @param {boolean} step2 - Indicates if the "Address Information" step is active.
 * @param {boolean} step3 - Indicates if the "Payment Method" step is active.
 * @param {boolean} step4 - Indicates if the "Complete the Order" step is active.
 *
 * @returns {JSX.Element} - A navigation component showing the checkout progress.
 */
const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mt-2 mb-5">
      <Nav.Item>
        {step1 ? (
          <LinkContainer
            style={{
              fontWeight: 'bold',
              backgroundColor: '#d4e9f7',
              borderRadius: '36px 0 0 36px',
              paddingLeft: '25px',
              margin: '0 2px',
            }}
            to="/login"
          >
            <Nav.Link>Sign In</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Sign In</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer
            style={{
              fontWeight: 'bold',
              backgroundColor: '#d4e9f7',
              margin: '0 2px',
            }}
            to="/shipping"
          >
            <Nav.Link>Address Information</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Address Information</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer
            style={{
              fontWeight: 'bold',
              backgroundColor: '#d4e9f7',
              margin: '0 2px',
            }}
            to="/payment"
          >
            <Nav.Link>Payment Method</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Payment Method</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer
            style={{
              fontWeight: 'bold',
              backgroundColor: '#d4e9f7',
              borderRadius: ' 0 36px 36px 0',
              paddingRight: '25px',
              margin: '0 2px',
            }}
            to="/placeorder"
          >
            <Nav.Link>Complete the Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Complete the Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
