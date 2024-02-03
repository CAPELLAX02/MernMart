import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer
            to='/'
            style={{
              color: '#E0E5EB',
              letterSpacing: 1.4,
              fontWeight: 600,
              fontSize: 23,
            }}
          >
            <Navbar.Brand>
              <img src={logo} alt='' />
              e-comMERNce
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <LinkContainer
                to='/cart'
                style={{ paddingLeft: 24, fontSize: 17 }}
              >
                <Nav.Link>
                  <FaShoppingCart /> Cart
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to='/login'
                style={{ paddingLeft: 24, fontSize: 17 }}
              >
                <Nav.Link>
                  <FaUser /> Login
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
