const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { protect } = require('../middleware/auth');

// GET /api/clients - Fetch all clients (BDAs view only assigned clients)
router.get('/', protect, async (req, res) => {
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
});

// GET /api/clients/:id - Fetch single client details
router.get('/:id', protect, async (req, res) => {
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
});

module.exports = router;
