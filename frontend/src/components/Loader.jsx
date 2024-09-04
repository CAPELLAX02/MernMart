import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
      // animation='border'
      animation='grow'
      role='status'
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
