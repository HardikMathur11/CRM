const express = require('express');
const router = express.Router();
const { getFollowUps, createFollowUp, updateFollowUp } = require('../controllers/followUpController');
const protect = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getFollowUps)
  .post(protect, createFollowUp);

router.put('/:id', protect, updateFollowUp);

module.exports = router;
