const Client = require('../models/Client');

// get clients, filter if BDA
const getClients = async (req, res) => {
  try {
    console.log('fetching clients. user role:', req.user.role);
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

// specific client details
const getClientById = async (req, res) => {
  try {
    console.log('found client details for ID:', req.params.id);
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
