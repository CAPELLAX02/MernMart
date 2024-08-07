import { useState } from 'react'; // useState'i import edin
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import AlertDialog from '../components/AlertDialog';
import { toast } from 'react-toastify';

const CartScreen = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const handleShowDialog = (item) => {
    setSelectedItem(item);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setShowDialog(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      dispatch(removeFromCart(selectedItem._id));
      handleCloseDialog();
      toast.info(`Item (${selectedItem.name}) removed from the cart.`, {
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/checkout');
  };

  return (
    <>
      <Row className='my-4'>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty for now. <Link to='/'> Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as='select'
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type='button'
                        variant='danger'
                        onClick={() => handleShowDialog(item)}
                      >
                        <FaTrash color='#fff' />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>
                  Total ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  Products
                </h2>
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}{' '}
                TL
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed Payment
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {selectedItem && (
        <AlertDialog
          title='Confirm Delete'
          bodyText={`Are you sure you want to remove the item (${selectedItem.name}) from the cart?`}
          closeBtnText='Cancel'
          proceedBtnText='Delete'
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          show={showDialog}
          setShow={setShowDialog}
        />
      )}
    </>
  );
};

export default CartScreen;
