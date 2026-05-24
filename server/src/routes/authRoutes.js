const express = require('express');
const router = express.Router();
const { login, getMe, createUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/create-user', protect, authorize('admin'), createUser);

module.exports = router;
