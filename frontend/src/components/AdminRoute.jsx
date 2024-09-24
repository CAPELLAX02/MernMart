import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * AdminRoute component to protect routes accessible only by admin users.
 *
 * This component checks if the logged-in user has admin privileges.
 * If the user is an admin, it renders the desired route (Outlet). Otherwise, it redirects user to the login page.
 *
 * @returns {JSX.Element} - The outlet or the login page.
 */
const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
