const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and authenticate user
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found, unauthorized' });
      }
      
      next();
    } catch (error) {
      console.log('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware to check if user has the correct role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Role '${req.user ? req.user.role : 'none'}' is not authorized.` });
    }
    next();
  };
};

module.exports = { protect, authorize };
