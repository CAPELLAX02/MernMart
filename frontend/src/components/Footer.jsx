import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
// import { Parallax } from 'react-parallax';
import './Footer.css'; // CSS dosyasını içe aktarın
import logo from '../assets/intechreate-logo-white.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  // const googleMapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Ankara+University+Gölbaşı+Campus&zoom=15`;

  return (
    <footer style={{ background: '#fef3e7' }}>
      <div className='slider'></div>
      <div className='py-5 text-black'>
        <Container>
          <Row>
            <Col
              md={4}
              className='text-center text-md-left px-5 border-end border-1 border-info pb-4 pt-3'
            >
              <h5>About Us</h5>
              <p>
                We are a leading e-commerce site offering the best products at
                the best prices. Follow our social media channels to stay up to
                date.
              </p>
            </Col>
            <Col
              md={4}
              className='text-center my-3 my-md-0 px-5 border-end border-1 border-info'
            >
              <h5>Follow Us</h5>
              <div className='d-flex justify-content-center'>
                <a
                  href='https://facebook.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mx-3 text-white social-icon'
                >
                  <FaFacebook size={30} color='#000' />
                </a>
                <a
                  href='https://twitter.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mx-3 text-white social-icon'
                >
                  <FaTwitter size={30} color='#000' />
                </a>
                <a
                  href='https://instagram.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mx-3 text-white social-icon'
                >
                  <FaInstagram size={30} color='#000' />
                </a>
                <a
                  href='https://linkedin.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mx-3 text-white social-icon'
                >
                  <FaLinkedin size={30} color='#000' />
                </a>
              </div>
            </Col>
            <Col md={4} className='text-center text-md-right px-5'>
              <h5>Reach Us</h5>
              <p>Email: support@mernmart.com</p>
              <p>Phone: +90 123 456 7890</p>
            </Col>
          </Row>
          <Row className='pt-5'>
            <Col className='text-center'>
              <p>Mernmart Inc. &copy; {currentYear} | All rights reserved</p>
            </Col>
          </Row>
          <Row className='d-flex justify-content-center align-items-center pt-3'>
            <Col className='d-flex justify-content-center align-items-center'>
              {/* <h3 className='mb-0 mr-2'>Powered by</h3>
              <Image src={logo} className='w-25' /> */}
            </Col>
          </Row>
        </Container>
      </div>
      {/* GOOGLE MAPS EKLENEBİLİR */}
    </footer>
  );
};

export default Footer;
