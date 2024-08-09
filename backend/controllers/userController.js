import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import sendMail from '../utils/emailServices.js';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname ve __filename'i oluşturmak için gerekli
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc     Auth user & get token
// @route    POST /api/users/login
// @access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    console.log('Şifre yanlış:', email);
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  if (!user.isEmailVerified) {
    res.status(401);
    throw new Error('Email address not activated.');
  }

  generateToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// JWT oluşturma fonksiyonu
const createActivationToken = (user) => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 haneli kod

  console.log('Generated Activation Code:', activationCode); // Loglama ekleyin

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    }
  );

  return { token, activationCode };
};

// @desc     Kullanıcı Kaydı
// @route    POST /api/users
// @access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    res.status(400);
    throw new Error('Bu e-posta adresi zaten kullanımda.');
  }

  // Kullanıcı bilgileri ile bir activation token oluşturuyoruz
  const user = { name, email, password };
  const { token, activationCode } = createActivationToken(user);

  // E-posta içeriğini oluşturuyoruz
  const data = { user: { name: user.name }, activationCode };

  const htmlContent = await ejs.renderFile(
    path.join(__dirname, '../mails', 'activation-mail.ejs'),
    data
  );

  // E-posta gönderiyoruz
  try {
    await sendMail({
      email: user.email,
      subject: 'Activate your account',
      template: 'activation-mail.ejs',
      data,
    });

    // Response ile activation_token'ı geri döndürüyoruz
    res.status(201).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account!`,
      activationToken: token, // activation_token'ı burada döndürüyoruz
    });
  } catch (error) {
    console.error('E-posta gönderilemedi:', error);
    console.log(error.stack);
    res.status(400).json({
      message: 'E-posta gönderilemedi, lütfen tekrar deneyin.',
    });
  }
});

// @desc     Kullanıcıyı Doğrulama
// @router   POST /api/users/verify-email
// @access   Public
const verifyUser = asyncHandler(async (req, res) => {
  try {
    const { activation_token, activation_code } = req.body;

    const newUser = jwt.verify(activation_token, process.env.JWT_SECRET);

    if (newUser.activationCode !== activation_code) {
      throw new Error('Invalid activation code');
    }

    const { name, email, password } = newUser.user;

    const existUser = await User.findOne({ email });

    if (existUser) {
      throw new Error('Email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: 'User verified and registered successfully',
      userId: user._id,
    });
  } catch (error) {
    console.log('verifyUser catch block: ', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc     Log out user & clear cookie
// @route    POST /api/users/logout
// @access   Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully.' });
});

// @desc     Get user
// @route    GET /api/users/profile
// @access   Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

// @desc     Update user
// @route    PUT /api/users/profile
// @access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Password is seperated from the others above because it's hashed.
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404); // not found (404)
    throw new Error('User not found');
  }
});

// @desc     Get users
// @route    GET /api/users
// @access   Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error('Users not found');
  }
});

// @desc     Get user by ID
// @route    GET /api/users/:id
// @access   Private/Admin
const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc     Delete user
// @route    DELETE /api/users/:id
// @access   Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc     Update user
// @route    PUT /api/users/:id
// @access   Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc     Send password reset email
// @route    POST /api/users/forgot-password
// @access   Public
const sendForgotPasswordEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    const resetPasswordCode = Math.random().toString().slice(2, 8);
    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log('Reset code saved for user:', user); // Loglama ekleyin

    await sendEmail(user.email, resetPasswordCode, 'reset');
    res.status(200).json({ message: 'Reset password code sent.' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Private
const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetPasswordCode, newPassword } = req.body;

  console.log('Received data:', { email, resetPasswordCode, newPassword });

  if (!email || !resetPasswordCode || !newPassword) {
    res.status(400);
    throw new Error('Fill in all required fields!');
  }

  const user = await User.findOne({
    email: email,
    resetPasswordCode: resetPasswordCode,
    resetPasswordCodeExpires: { $gt: Date.now() },
  });

  console.log('Found user:', user); // Kullanıcıyı loglama

  if (!user) {
    res.status(404);
    throw new Error('User not found or expired code');
  }

  const isSamePassword = await user.matchPassword(newPassword);
  if (isSamePassword) {
    res.status(400);
    throw new Error('Yeni şifreniz eski şifrenizle aynı olamaz.');
  }

  user.password = newPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordCodeExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully.' });
});

export {
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
};
