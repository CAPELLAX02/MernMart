import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingProductImage }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Product updated successfully.', {
        theme: 'colored',
        position: 'top-center',
      });
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(
        `Something went wrong. [${err?.data?.message || err.error}]`,
        {
          theme: 'colored',
          position: 'top-center',
        }
      );
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success('Product image uploaded successfully.', {
        theme: 'colored',
        position: 'top-center',
      });
      setImage(res.image);
    } catch (err) {
      toast.error(
        `Something went wrong. [${err?.data?.message || err.error}]`,
        {
          theme: 'colored',
          position: 'top-center',
        }
      );
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light mt-1'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            Something went wrong. [{error?.data?.message || error.error}]
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className='mt-1 fw-bold' controlId='name'>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Product Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mt-1 fw-bold' controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mt-1 fw-bold' controlId='image'>
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Product Image'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                label='Upload File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
            </Form.Group>
            {loadingProductImage && <Loader />}

            <Form.Group className='mt-1 fw-bold' controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mt-1 fw-bold' controlId='countInStock'>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Stock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mt-1 fw-bold' controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mt-1 fw-bold' controlId='description'>
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={5}
                type='text'
                placeholder='Product Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-3'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
