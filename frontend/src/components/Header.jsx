import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
// import logo from '../assets/logo.png';
import logo from '../assets/mernmart-bg.png';
import './Header.css';
import SearchBox from './SearchBox';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap(); // unwrap used because logoutApiCall gives a promise
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header style={{ zoom: '85%', backgroundColor: '#fef3e7' }}>
      <Navbar expand='md' collapseOnSelect>
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
            <Navbar.Brand className='d-flex flex-row'>
              <img src={logo} alt='logo' style={{ width: 100 }} />
              <div className='my-auto'>
                <span
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: '700',
                    color: '#EE2433',
                    fontSize: 28,
                  }}
                >
                  MERN
                </span>
                <span
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: '400',
                    color: '#EE2433',
                    fontSize: 28,
                  }}
                >
                  MART
                </span>
              </div>

              {/* e-com */}
              {/* <span style={{ fontWeight: 'bold', color: '#99ebff' }}>MERN</span> */}
              {/* ce */}
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />

          <Navbar.Collapse id='basic-navbar-nav'>
            <SearchBox />
            <Nav className='ms-auto'>
              <LinkContainer
                to='/cart'
                style={{ paddingLeft: 24, fontSize: 17, marginRight: 12 }}
              >
                <Nav.Link>
                  <FaShoppingCart size={22} style={{ paddingRight: 4 }} /> Cart
                  {cartItems.length > 0 && (
                    <Badge
                      bg='danger'
                      style={{
                        zoom: '120%',
                        marginLeft: '7px',
                        borderRadius: '50%',
                      }}
                    >
                      {cartItems.reduce((acc, curr) => acc + curr.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown
                  style={{ paddingLeft: 12, paddingRight: 12, fontSize: 17 }}
                  title={userInfo.name}
                  id='username'
                >
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer
                  to='/login'
                  style={{ paddingLeft: 24, fontSize: 17 }}
                >
                  <Nav.Link>
                    <FaUser size={20} style={{ paddingRight: 5 }} /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  style={{ fontSize: 17 }}
                  title='Yönetici Paneli'
                  id='adminmenu'
                >
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className='slider'>
        <div className='slider-text'>
          %50 Discount! | Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Neque, nulla cumque. Aliquam est asperiores delectus ex dolorem!
          Repellendus natus ad tenetur! Laudantium esse excepturi obcaecati
          repellendus sit sapiente quam dicta?
        </div>
      </div>
    </header>
  );
};

export default Header;
