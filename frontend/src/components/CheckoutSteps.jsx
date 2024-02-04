import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-center mt-2 mb-5'>
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
            to='/login'
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
            to='/shipping'
          >
            <Nav.Link>Shipping</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
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
            to='/payment'
          >
            <Nav.Link>Payment</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
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
            to='/placeorder'
          >
            <Nav.Link>Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
