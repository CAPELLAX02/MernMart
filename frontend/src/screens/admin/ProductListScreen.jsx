import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (
      window.confirm(
        'This action cannot be undone. Do you want to delete the product?'
      )
    ) {
      try {
        await deleteProduct(id);
        toast.success(`Product (${id}) deleted successfully.`, {
          theme: 'colored',
          position: 'top-center',
        });
        refetch();
      } catch (err) {
        toast.error(
          `Someting went wrong. [${err?.data?.message || err.error}]`,
          {
            theme: 'colored',
            position: 'top-center',
          }
        );
        // console.log(err);
      }
    }
  };

  const createProductHandler = async (id) => {
    if (window.confirm('Create a new product?')) {
      try {
        await createProduct(id);
        refetch();
        toast.success(
          'New product created successfully. You can edit the product now.',
          {
            theme: 'colored',
            position: 'top-center',
          }
        );
      } catch (err) {
        toast.error(
          `Someting went wrong. [${err?.data?.message || err.error}]`,
          {
            theme: 'colored',
            position: 'top-center',
          }
        );
      }
    }
  };

  return (
    <>
      <Row className='align-items-center mt-2'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> New Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          Something went wrong. [{error?.data?.message || error.error}]
        </Message>
      ) : (
        <>
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>PRODUCT ID</th>
                <th>PRODUCT NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price} TL</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                      variant='success'
                      className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm mx-2'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
