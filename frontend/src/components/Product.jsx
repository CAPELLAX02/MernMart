import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

import { useNavigate } from 'react-router-dom';
import { addToCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Product = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Item added to cart successfully.', {
      theme: 'colored',
      position: 'bottom-center',
    });
  };

  return (
    <Card className='my-3 p-3 pb-2 rounded-3 shadow-lg'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title '>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} Reviews`}
          />
        </Card.Text>

        <Card.Text className='pt-2 text-primary fw-normal' as='h3'>
          ${product.price}
        </Card.Text>

        <Button
          className='text-white bg-primary py-2'
          onClick={(e) => addToCartHandler(product, 1)}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Product;
