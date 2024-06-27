import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      window.confirm(
        'Bu kullanıcıdaki değişiklikleri kaydetmek istediğine emin misiniz?'
      )
    ) {
      try {
        await updateUser({ userId, name, email, isAdmin });
        toast.success('Kullanıcı bilgileri başarıyla güncellendi.');
        refetch();
        navigate('/admin/userlist');
      } catch (err) {
        toast.error(
          `Beklenmedik bir hata meydana geldi. [${
            err?.data?.message || err.error
          }]`
        );
      }
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Geri Dön
      </Link>
      <FormContainer>
        <h1>Kullanıcıyı Güncelle</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className='my-3' controlId='name'>
              <Form.Label>İsim</Form.Label>
              <Form.Control
                type='name'
                placeholder='Kullanıcı İsmi'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-3' controlId='email'>
              <Form.Label>Email Adresi</Form.Label>
              <Form.Control
                type='email'
                placeholder='Kullanıcı Email Adresi'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-4' controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='Yöneticilik Yetkisi'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Değişiklikleri Kaydet
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
