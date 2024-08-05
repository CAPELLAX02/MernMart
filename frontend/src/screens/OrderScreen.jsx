import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import PaymentModal from '../components/PaymentModal';
import { formatDate } from '../utils/formatDate';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Sipariş 'Teslim Edildi' olarak işaretlendi.");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handlePayment = () => {
    setShowModal(true);
  };

  const processPayment = async (paymentDetails) => {
    try {
      const paymentResult = {
        cardHolderName: paymentDetails.name,
        cardNumber: paymentDetails.number,
        expireMonth: paymentDetails.expiry.split('/')[0],
        expireYear: paymentDetails.expiry.split('/')[1],
        cvc: paymentDetails.cvc,
      };
      await payOrder({ orderId, paymentResult }).unwrap();
      toast.success('Payment Successfull!');
      refetch();
      setShowModal(false);
    } catch (error) {
      toast.error('Payment failed.');
      console.error(error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1 className='mt-2 py-3'>Order ({order._id})</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping Information</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered at {formatDate(order.deliveredAt)}.
                </Message>
              ) : (
                <Message variant='danger'>Not delivered yet.</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong> {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant='success'>
                  Paid at{formatDate(order.paidAt)}.
                </Message>
              ) : (
                <Message variant='danger'>Not paid yet.</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={7}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row className='py-2'>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
                <Row className='py-2'>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
                <Row className='py-2'>
                  <Col>Vergi</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
                <Row className='py-2'>
                  <Col>
                    <strong>TOTAL</strong>
                  </Col>
                  <Col>
                    <strong>${order.totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {userInfo && !userInfo.isAdmin && (
                <ListGroup.Item>
                  {order.isPaid ? (
                    <Message variant='success'>Payment Successfull</Message>
                  ) : (
                    <Button
                      type='button'
                      className='btn-block'
                      disabled={isPaying || order.isPaid}
                      onClick={handlePayment}
                    >
                      {isPaying ? 'İşleniyor...' : 'Ödemeye Geç'}
                    </Button>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverOrderHandler}
                    >
                      Mark as "Delivered"
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <PaymentModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        processPayment={processPayment}
      />
    </>
  );
};

export default OrderScreen;
