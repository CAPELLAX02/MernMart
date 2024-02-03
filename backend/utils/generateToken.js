import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  // Create the json web token (JWT)
  const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  }); // Change 30d (30 days) to 1d after production.

  // Set JWT as HTTP-Only Cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days' equivalent in ms.
  });
};

export default generateToken;
