import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();

  // FIX: uncontrolled input - urlKeyword may be undefined
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Form
      onSubmit={submitHandler}
      className='d-flex position-relative'
      style={{ width: '440px' }}
    >
      <Form.Control
        type='text'
        style={{
          paddingRight: '70px',
          paddingTop: 8,
          paddingBottom: 8,
          borderColor: '#bbb',
        }}
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search product, category or brand.'
        className='mr-sm-2 ml-sm-5 ms-4 border-2'
      ></Form.Control>
      <Button
        type='submit'
        style={{
          position: 'absolute',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderColor: '#bbb',
        }}
        className='py-0 px-3 m-0 h-100 text-black fw-medium bg-danger text-white shadow-none'
      >
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
