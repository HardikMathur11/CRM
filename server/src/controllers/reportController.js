const Lead = require('../models/Lead');
const Client = require('../models/Client');

// @desc    Get summary statistics for dashboard charts
// @route   GET /api/reports/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'bda') {
      filter.assignedTo = req.user._id;
    }

    const totalLeads = await Lead.countDocuments(filter);
    const totalClients = await Client.countDocuments(filter);

    const revenueResult = await Client.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$totalRevenue' } } }
    ]);
    const totalRevenue = revenueResult[0] ? revenueResult[0].total : 0;

    const convertedFilter = { ...filter, isConverted: true };
    const totalConversions = await Lead.countDocuments(convertedFilter);

    const statusData = await Lead.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

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
};

// @desc    Export client list to CSV format
// @route   GET /api/reports/export-csv
// @access  Private
const exportCSV = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'bda') {
      filter.assignedTo = req.user._id;
    }

    const clients = await Client.find(filter).populate('assignedTo', 'name');

    let csv = 'Company Name,Contact Name,Phone,Email,GST Number,City,State,Assigned To,Revenue\n';
    
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
};

module.exports = {
  getSummary,
  exportCSV
};
