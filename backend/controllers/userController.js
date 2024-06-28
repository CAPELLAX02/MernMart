import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/emailServices.js';

// @desc     Auth user & get token
// @route    POST /api/users/login
// @access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Kullanıcıyı e-posta ile bul
  const user = await User.findOne({ email: email });

  if (!user) {
    console.log('Kullanıcı bulunamadı:', email);
    res.status(401);
    throw new Error('Geçersiz e-posta veya şifre!');
  }

  // Şifre eşleşmesini kontrol et
  const isPasswordMatch = await user.matchPassword(password);
  console.log('Şifre karşılaştırması sonucu:', isPasswordMatch);

  if (!isPasswordMatch) {
    console.log('Şifre yanlış:', email);
    res.status(401);
    throw new Error('Geçersiz e-posta veya şifre!');
  }

  // E-posta doğrulamasını kontrol et
  if (!user.isEmailVerified) {
    console.log('E-posta doğrulanmamış:', email);
    res.status(401);
    throw new Error('E-posta adresiniz doğrulanmamış!');
  }

  // JWT oluştur ve HTTP-Only Cookie olarak ayarla
  generateToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// @desc     Register user
// @route    POST /api/users
// @access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error('Bu e-posta adresi zaten kullanımda.');
  }

  const emailVerificationCode = Math.random().toString().slice(2, 8);
  const emailVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

  user = new User({
    name,
    email,
    password,
    isEmailVerified: false,
    emailVerificationCode,
    emailVerificationCodeExpires,
  });

  await user.save();
  console.log('Kayıt edilen kullanıcı:', user);
  await sendEmail(user.email, emailVerificationCode, 'verification');

  res.status(201).json({
    message: `Doğrulama kodu ${user.email} adresine gönderildi.`,
  });
});

// @desc     Verify user
// @router   POST /api/users/verify-email
// @access   Private
const verifyUser = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.body;

  const user = await User.findOne({
    email,
    emailVerificationCode: verificationCode,
    emailVerificationCodeExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Geçersiz veya süresi dolmuş doğrulama kodu.');
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationCodeExpires = undefined;
  await user.save();

  res.json({ message: 'E-posta başarıyla doğrulandı!' });
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
