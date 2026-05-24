const jwt = require('jsonwebtoken');
const User = require('../models/User');

// user login
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('login attempt for email:', email);

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials or inactive user' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    console.log('login success for:', user.email);

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
    console.log('Login controller error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// get current logged in user info
const getMe = async (req, res) => {
  try {
    console.log('fetching details for user:', req.user?._id);
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// admin only route to create team members
const createUser = async (req, res) => {
  const { name, email, password, role, phone, monthlyTarget } = req.body;
  console.log('creating user:', email, 'with role:', role);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

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
    console.log('Create user controller error:', error);
    res.status(500).json({ message: 'Server error creating user' });
  }
};

// get all active team members
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('name email role');
    console.log('active users fetched:', users.length);
    res.json(users);
  } catch (error) {
    console.log('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching team members' });
  }
};

module.exports = {
  login,
  getMe,
  createUser,
  getUsers
};
