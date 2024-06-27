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
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        style={{ width: '300px' }}
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Ürün, kategori veya marka ara'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button
        type='submit'
        style={{ backgroundColor: '#ffc500' }}
        className='p-2 px-3 mx-2 text-black fw-medium'
      >
        Ara
      </Button>
    </Form>
  );
};

export default SearchBox;
