import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();

app.use(cors());

// Body parse middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// USE PRODUCT ROUTES
app.use('/api/products', productRoutes); // origin API for product routers
// USE USER ROUTES
app.use('/api/users', userRoutes); // origin API for user routers
// USE ORDER ROUTES
app.use('/api/orders', orderRoutes); // origin API for order routers

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

app.use(notFound);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
