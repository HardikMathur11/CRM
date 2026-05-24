const Product = require('../models/Product');

// @desc    Get all active products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ name: 1 });
    res.json(products);
  } catch (error) {
    console.log('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin/Manager
const createProduct = async (req, res) => {
  const { name, description, price, category, sku } = req.body;
  try {
    const productExists = await Product.findOne({ name });
    if (productExists) {
      return res.status(400).json({ message: 'Product already exists with this name' });
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      sku
    });
    res.status(201).json(product);
  } catch (error) {
    console.log('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin/Manager
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const allowedUpdates = ['name', 'description', 'price', 'category', 'sku', 'isActive'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.log('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct
};
