import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 pb-2 rounded-3 border-0 shadow-lg border-info'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating value={product.rating} text={`${product.numReviews} Yorum`} />
        </Card.Text>

        <Card.Text className='pt-2' as='h3'>
          {product.price} TL
        </Card.Text>

        <Button className='text-white btn-info'>Sepete Ekle</Button>
      </Card.Body>
    </Card>
  );
};

export default Product;
