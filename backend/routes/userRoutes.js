import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByID,
  deleteUser,
  updateUser,
  sendForgotPasswordEmail,
  resetPassword,
  verifyUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(getUsers);

router.post('/logout', logoutUser);
router.post('/auth', authUser);
router.post('/forgot-password', sendForgotPasswordEmail);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyUser);

router.route('/profile').get(getUserProfile).put(updateUserProfile);

router.route('/:id').delete(deleteUser).get(getUserByID).put(updateUser);

export default router;
