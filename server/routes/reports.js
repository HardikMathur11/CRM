const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Client = require('../models/Client');
const { protect } = require('../middleware/auth');

// GET /api/reports/summary - Aggregate metrics for charts and stat cards
router.get('/summary', protect, async (req, res) => {
  try {
    // If BDA, filter by their own leads/clients
    let filter = {};
    if (req.user.role === 'bda') {
      filter.assignedTo = req.user._id;
    }

    const totalLeads = await Lead.countDocuments(filter);
    const totalClients = await Client.countDocuments(filter);

    // Sum revenue
    const revenueResult = await Client.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$totalRevenue' } } }
    ]);
    const totalRevenue = revenueResult[0] ? revenueResult[0].total : 0;

    // Count conversions (won leads)
    const convertedFilter = { ...filter, isConverted: true };
    const totalConversions = await Lead.countDocuments(convertedFilter);

    // Status distribution
    const statusData = await Lead.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Score distribution
    const scoreData = await Lead.aggregate([
      { $match: filter },
      { $group: { _id: '$score', count: { $sum: 1 } } }
    ]);

    res.json({
      totalLeads,
      totalClients,
      totalRevenue,
      totalConversions,
      statusDistribution: statusData,
      scoreDistribution: scoreData
    });
  } catch (error) {
    console.log('Report summary error:', error);
    res.status(500).json({ message: 'Server error generating reports summary' });
  }
});

// GET /api/reports/export-csv - Generate and download client CSV export
router.get('/export-csv', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'bda') {
      filter.assignedTo = req.user._id;
    }

    const clients = await Client.find(filter).populate('assignedTo', 'name');

    // Header row
    let csv = 'Company Name,Contact Name,Phone,Email,GST Number,City,State,Assigned To,Revenue\n';
    
    // Data rows
    clients.forEach(c => {
      const assignedName = c.assignedTo ? c.assignedTo.name : 'N/A';
      csv += `"${c.companyName.replace(/"/g, '""')}","${c.contactName.replace(/"/g, '""')}","${c.phone}","${c.email}","${c.gstNumber}","${c.city}","${c.state}","${assignedName}",${c.totalRevenue}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=clients-export.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.log('Export CSV error:', error);
    res.status(500).json({ message: 'Server error exporting CSV file' });
  }
});

module.exports = router;
