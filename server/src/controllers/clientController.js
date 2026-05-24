const Client = require('../models/Client');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'bda') {
      query.assignedTo = req.user._id;
    }
    const clients = await Client.find(query)
      .populate('assignedTo', 'name email')
      .populate('convertedFrom', 'contactName companyName score')
      .sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    console.log('Get clients error:', error);
    res.status(500).json({ message: 'Server error fetching clients' });
  }
};

// @desc    Get client detail by ID
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('convertedFrom');
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.log('Get client detail error:', error);
    res.status(500).json({ message: 'Server error fetching client detail' });
  }
};

module.exports = {
  getClients,
  getClientById
};
