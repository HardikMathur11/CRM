const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // check if header has token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // grab bearer token
      token = req.headers.authorization.split(' ')[1];

      // decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user details but exclude password
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found, unauthorized' });
      }

      console.log('user from token:', req.user._id);

      next();
    } catch (error) {
      console.log('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // no token found
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = protect;
