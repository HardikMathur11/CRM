// check if user role is allowed for this route
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('checking auth for user role:', req.user?.role);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user ? req.user.role : 'none'}' is not authorized.`
      });
    }
    next();
  };
};

module.exports = authorize;
