import { Container, Row, Col } from 'react-bootstrap';

/**
 * FormContainer component for centering forms within a responsive layout.
 *
 * This component wraps its children (usually forms) inside a Bootstrap container,
 * with the content centered in the middle of the screen on larger devices.
 *
 * @param {object} props - The properties passed to the component.
 * @param {JSX.Element} props.children - The form elements or content to be rendered inside the container.
 *
 * @returns {JSX.Element} - A centered container with children elements.
 */
const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-md-center my-3">
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
