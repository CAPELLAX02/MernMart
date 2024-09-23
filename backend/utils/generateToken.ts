import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: Response, userId: string): void => {
  // Create the json web token (JWT)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '30d', // Change 30d (30 days) to 1d after production.
  });

  // Set JWT as HTTP-Only Cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Set secure flag for production
    sameSite: 'strict', // Protect against CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days' equivalent in ms.
  });
};

export default generateToken;
