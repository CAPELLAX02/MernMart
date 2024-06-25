import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';
import PaymentModal from '../components/PaymentModal';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();

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
      toast.success('Ödeme Başarılı');
      refetch();
      setShowModal(false);
    } catch (error) {
      toast.error('Ödeme Başarısız');
      console.error(error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1 className='mt-2 py-3'>Sipariş No: {order._id}</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Kargo Bilgileri</h2>
              <p>
                <strong>İsim: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Adres: </strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant='success'>
                  {order.deliveredAt} tarihinde kargoya verildi.
                </Message>
              ) : (
                <Message variant='danger'>Henüz kargoya verilmedi.</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Ödeme Yöntemi</h2>
              <p>
                <strong>Metod: </strong> {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant='success'>
                  {order.paidAt} tarihinde ödeme alındı.
                </Message>
              ) : (
                <Message variant='danger'>Henüz ödeme yapılmadı.</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Sipariş Ürünleri</h2>
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
                <h2>Sipariş Özeti</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row className='py-2'>
                  <Col>Ürünler</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
                <Row className='py-2'>
                  <Col>Kargo</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
                <Row className='py-2'>
                  <Col>Vergi</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
                <Row className='py-2'>
                  <Col>
                    <strong>TOPLAM</strong>
                  </Col>
                  <Col>
                    <strong>${order.totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {order.isPaid ? (
                  <Message variant='success'>Ödeme Başarılı</Message>
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
