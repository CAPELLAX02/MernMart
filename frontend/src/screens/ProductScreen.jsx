import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Table,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/formatDate';
import Meta from '../components/Meta';

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingReview }] =
    useCreateReviewMutation();

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review added successfully.', {
        theme: 'colored',
        position: 'top-center',
      });
    } catch (err) {
      toast.error(
        `Something went wrong. [${err?.data?.message || err.error}]`,
        {
          theme: 'colored',
          position: 'top-center',
        }
      );
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row className="border-bottom pb-5">
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating value={product.rating} />
                  <span>{product.rating}</span>
                  <p className="ms-1 mt-2">
                    {product.numReviews}{' '}
                    {product.numReviews === 1 ? 'Review' : 'Reviews'}
                  </p>
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  <b>Description:</b> {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review my-4">
            <Col md={6}>
              <h2 className="fs-3 border-0 bg-white my-1">Product Reviews</h2>
              {product.reviews.length === 0 && (
                <Message>No review yet.</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{formatDate(review.createdAt)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2 className="fs-3 border-0 bg-white mb-2 px-0">
                    Review This Product
                  </h2>
                  {loadingReview && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitReviewHandler}>
                      <Form.Group className="my-2" controlId="rating">
                        <Form.Label>Your rating for the product</Form.Label>
                        <Form.Control
                          as="select"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="0">Select</option>
                          <option value="1">1 - Terrible</option>
                          <option value="2">2 - Bad</option>
                          <option value="3">3 - Okay</option>
                          <option value="4">4 - Good</option>
                          <option value="5">5 - Perfect</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="my-2" controlId="comment">
                        <Form.Label>Your comment for the product</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="4"
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button
                        disabled={loadingReview}
                        type="submit"
                        variant="primary"
                      >
                        Review
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      You need to <Link to="/login">sign in</Link> to review
                      this product.
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6} className="ps-4">
              <ListGroup variant="flush">
                <h2 className="fs-3 border-0 bg-white mb-2 px-0">
                  Product Details
                </h2>
                <ListGroup.Item className="ps-0">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aliquid animi rem beatae! Doloremque eveniet, voluptates sed
                  consequatur, quibusdam facere minus vero aliquid cumque
                  suscipit dicta nisi ex aperiam non! Voluptatem impedit
                  adipisci quas asperiores, aperiam beatae doloribus iusto in
                  ea!
                </ListGroup.Item>
                <ListGroup.Item className="ps-0">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Nostrum perspiciatis pariatur soluta dolore, sed nihil veniam
                  sit adipisci. Incidunt, quae.
                </ListGroup.Item>
                <ListGroup.Item className="ps-0">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Similique a repellat unde voluptatibus nostrum? Est.
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
