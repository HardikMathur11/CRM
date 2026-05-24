const express = require('express');
const router = express.Router();
const { login, getMe, createUser, getUsers } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);
router.post('/create-user', protect, authorize('admin'), createUser);

module.exports = router;
