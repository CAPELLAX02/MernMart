import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
} from '../controllers/productController.js';

// get products using the controller
router.route('/').get(getProducts);

// get a particular product using the controller
router.route('/:id').get(getProductById);

export default router;
