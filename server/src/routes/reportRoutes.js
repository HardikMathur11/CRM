const express = require('express');
const router = express.Router();
const { getSummary, exportCSV } = require('../controllers/reportController');
const protect = require('../middleware/authMiddleware');

router.get('/summary', protect, getSummary);
router.get('/export-csv', protect, exportCSV);

module.exports = router;
