import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from 'react-icons/ai';
import logoOutline from '../assets/logo-outline.png';
import { toast } from 'react-toastify';

const footerCompanyLinks = [
  { name: 'About Us', link: '/about' },
  { name: 'Careers', link: '/careers' },
  { name: 'Store Locations', link: '/store-locations' },
  { name: 'Our Blog', link: '/blog' },
  { name: 'Reviews', link: '/reviews' },
];

const footerProductLinks = [
  { name: 'Game & Video', link: '/shop/game-video' },
  { name: 'Phone & Tablets', link: '/shop/phone-tablets' },
  { name: 'Computers & Laptop', link: '/shop/computers-laptop' },
  { name: 'Sport Watches', link: '/shop/sport-watches' },
  { name: 'Events', link: '/shop/events' },
];

const footerSupportLinks = [
  { name: 'FAQ', link: '/support/faq' },
  { name: 'Reviews', link: '/support/reviews' },
  { name: 'Contact Us', link: '/support/contact' },
  { name: 'Shipping', link: '/support/shipping' },
  { name: 'Live Chat', link: '/support/live-chat' },
];

/**
 * Footer component that includes company information, product links, support links,
 * social media icons, and an email subscription form.
 *
 * @returns {JSX.Element} - A footer section with navigation links and subscription form.
 */
const Footer = () => {
  const [email, setEmail] = useState('');

  /**
   * Validates the email format.
   *
   * @param {string} email - The email address to validate.
   * @returns {boolean} - True if the email is valid, false otherwise.
   */
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  /**
   * Handles the submission of the email subscription form.
   * Shows appropriate toast notifications based on validation.
   */
  const submitHandler = () => {
    if (email.length === 0) {
      toast.warn('Please enter your email address.', {
        theme: 'colored',
        position: 'top-right',
        style: {
          color: '#000',
          fontWeight: 500,
        },
      });
    } else if (!validateEmail(email)) {
      toast.warn('Please enter a valid email address.', {
        theme: 'colored',
        position: 'top-right',
        style: {
          color: '#000',
          fontWeight: 500,
        },
      });
    } else {
      toast.success(`We have received your email! (${email})`, {
        theme: 'colored',
        position: 'top-right',
        style: {
          padding: 16,
        },
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-primary text-white">
      <div className="py-5 bg-warning text-center text-white">
        <Container className="d-md-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-4 mb-md-0 text-primary fw-semibold pb-4">
              <span
                className="py-1 px-3 rounded-5 fw-bold"
                style={{ backgroundColor: '#fff', color: '#3d3df5' }}
              >
                Subscribe us
              </span>{' '}
              to get new events,
            </h2>
            <h2 className="mb-4 mb-md-0 text-primary fw-semibold pb-4">
              and special{' '}
              <span
                className="py-1 px-3 rounded-5 fw-bold"
                style={{ backgroundColor: '#3d3df5', color: '#fff' }}
              >
                discount
              </span>{' '}
              coupons.
            </h2>
          </div>
          <div className="d-flex">
            <Form.Control
              type="email"
              placeholder="Your Email Address"
              className="me-2 border-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: 320 }}
            />
            <Button className="text-white bg-primary" onClick={submitHandler}>
              Submit
            </Button>
          </div>
        </Container>
      </div>
      <Container className="pt-5 pb-4">
        <Row className="text-center text-md-start mb-5">
          <Col md={3} className="mb-4 mb-md-0">
            <img src={logoOutline} alt="logo" className="mb-3 w-75" />
            <p>The home and elements needed to create beautiful products.</p>
            <div className="d-flex justify-content-center justify-content-md-start">
              <AiFillFacebook size={32} className="me-3" />
              <AiOutlineTwitter size={32} className="me-3" />
              <AiFillInstagram size={32} className="me-3" />
              <AiFillYoutube size={32} className="me-3" />
            </div>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5>Company</h5>
            <ul className="list-unstyled">
              {footerCompanyLinks.map((link, index) => (
                <li className="text-info" key={index}>
                  {link.name}
                </li>
              ))}
            </ul>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5>Shop</h5>
            <ul className="list-unstyled">
              {footerProductLinks.map((link, index) => (
                <li className="text-info" key={index}>
                  {link.name}
                </li>
              ))}
            </ul>
          </Col>
          <Col md={3}>
            <h5>Support</h5>
            <ul className="list-unstyled">
              {footerSupportLinks.map((link, index) => (
                <li className="text-info" key={index}>
                  {link.name}
                </li>
              ))}
            </ul>
          </Col>
        </Row>
        <Row className="pt-4 text-center">
          <Col md={4}>
            <span>© 2024 MernMart. All rights reserved.</span>
          </Col>
          <Col md={4}>
            <span>Terms · Privacy Policy</span>
          </Col>
          <Col md={4} className="d-flex justify-content-center">
            <img
              src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
              alt="Payment Methods"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
