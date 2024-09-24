import { Spinner } from 'react-bootstrap';

/**
 * Loader component that displays a spinning loader.
 * The loader is centered on the page and provides a visual indicator for loading states.
 *
 * @returns {JSX.Element} - A styled spinner component.
 */
const Loader = () => {
  return (
    <Spinner
      animation="grow"
      role="status"
      style={{
        width: '70px',
        height: '70px',
        margin: 'auto',
        marginTop: '100px',
        display: 'block',
      }}
    ></Spinner>
  );
};

export default Loader;
