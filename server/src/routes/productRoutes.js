const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize('admin'), createProduct);

router.put('/:id', protect, authorize('admin'), updateProduct);

module.exports = router;
