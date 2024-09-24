import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * SearchBox component for handling product searches.
 * It captures the search keyword and navigates to the appropriate route based on the search input.
 *
 * @returns {JSX.Element} - A form with an input field for search and a submit button.
 */
const SearchBox = () => {
  const navigate = useNavigate();

  // Retrieve keyword from URL, if available
  const { keyword: urlKeyword } = useParams();

  // Controlled input with initial value from URL
  const [keyword, setKeyword] = useState(urlKeyword || '');

  /**
   * Handles the form submission and redirects to the search results page.
   * If no keyword is provided, it navigates to the home page.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const submitHandler = (event) => {
    event.preventDefault();
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
      className="d-flex position-relative searchbox"
      style={{ width: '440px' }}
    >
      <Form.Control
        type="text"
        style={{
          paddingRight: '70px',
          paddingTop: 8,
          paddingBottom: 8,
          borderColor: '#ffb51a',
        }}
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search product, category or brand."
        className="mr-sm-2 ml-sm-5 ms-4 border-2 bg-primary search-input text-white fw-medium"
      ></Form.Control>
      <Button
        type="submit"
        style={{
          position: 'absolute',
          right: '0',
          top: '50%',
          border: 'none',
          transform: 'translateY(-50%)',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderColor: '#ffb51a',
          backgroundColor: '#ffb51a',
        }}
        className="py-0 px-3 m-0 h-100 text-black fw-medium text-primary shadow-none"
      >
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
