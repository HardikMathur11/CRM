const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// POST /api/auth/login - Login user and get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials or inactive user' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        monthlyTarget: user.monthlyTarget
      }
    });
  } catch (error) {
    console.log('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/create-user - Admin only: Create team member
router.post('/create-user', protect, authorize('admin'), async (req, res) => {
  const { name, email, password, role, phone, monthlyTarget } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user (password will be hashed in User schema pre-save hook)
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phone,
      monthlyTarget
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        monthlyTarget: newUser.monthlyTarget
      }
    });
  } catch (error) {
    console.log('Create user error:', error);
    res.status(500).json({ message: 'Server error creating user' });
  }
});

module.exports = router;
