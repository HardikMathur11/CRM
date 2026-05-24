const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const leadRoutes = require('./leadRoutes');
const clientRoutes = require('./clientRoutes');
const followupRoutes = require('./followUpRoutes');
const reportsRoutes = require('./reportRoutes');
const productRoutes = require('./productRoutes');

// wire up all the endpoints
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/clients', clientRoutes);
router.use('/followups', followupRoutes);
router.use('/reports', reportsRoutes);
router.use('/products', productRoutes);

module.exports = router;
