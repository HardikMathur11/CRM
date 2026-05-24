const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const leadRoutes = require('./leads');
const clientRoutes = require('./clients');
const followupRoutes = require('./followups');
const reportsRoutes = require('./reports');

// Mount sub-routers under specific paths
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/clients', clientRoutes);
router.use('/followups', followupRoutes);
router.use('/reports', reportsRoutes);

module.exports = router;
