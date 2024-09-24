import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PrivateRoute component to protect routes that require user authentication.
 *
 * If the user is authenticated, it renders the desired route (Outlet).
 * Otherwise, it redirects the user to the login page.
 *
 * @returns {JSX.Element} - The outlet for authenticated routes or a redirect to the login page.
 */
const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
