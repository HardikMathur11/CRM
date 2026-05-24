const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Client = require('../models/Client');
const { protect } = require('../middleware/auth');

// GET /api/leads - Fetch leads (optional status filter, BDAs see only assigned leads)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'bda') {
      query.assignedTo = req.user._id;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.log('Get leads error:', error);
    res.status(500).json({ message: 'Server error fetching leads' });
  }
});

// POST /api/leads - Create a new lead
router.post('/', protect, async (req, res) => {
  const { contactName, companyName, phone, email, status, priority, estimatedValue, leadSource, location, assignedTo } = req.body;
  try {
    const lead = new Lead({
      contactName,
      companyName,
      phone,
      email,
      status,
      priority,
      estimatedValue,
      leadSource,
      location,
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id
    });
    const savedLead = await lead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    console.log('Create lead error:', error);
    res.status(500).json({ message: 'Server error creating lead' });
  }
});

// GET /api/leads/:id - Get a single lead
router.get('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.targetLeadId || req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    console.log('Get lead error:', error);
    res.status(500).json({ message: 'Server error fetching lead details' });
  }
});

// PUT /api/leads/:id - Update lead
router.put('/:id', protect, async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    // Update fields (mongoose pre-save hook will recalculate score)
    const allowedUpdates = ['contactName', 'companyName', 'phone', 'email', 'status', 'priority', 'estimatedValue', 'leadSource', 'location', 'assignedTo', 'lostReason', 'expectedCloseDate'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) lead[field] = req.body[field];
    });
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    console.log('Update lead error:', error);
    res.status(500).json({ message: 'Server error updating lead' });
  }
});

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.log('Delete lead error:', error);
    res.status(500).json({ message: 'Server error deleting lead' });
  }
});

// POST /api/leads/:id/notes - Add note to lead
router.post('/:id/notes', protect, async (req, res) => {
  const { text } = req.body;
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    lead.notes.push({
      text,
      addedBy: req.user.name
    });
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    console.log('Add note error:', error);
    res.status(500).json({ message: 'Server error adding note' });
  }
});

// POST /api/leads/:id/convert - Convert lead to client
router.post('/:id/convert', protect, async (req, res) => {
  const { gstNumber, city, state } = req.body;
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    if (lead.isConverted) {
      return res.status(400).json({ message: 'Lead is already converted' });
    }
    // Create new Client
    const newClient = await Client.create({
      companyName: lead.companyName,
      contactName: lead.contactName,
      phone: lead.phone,
      email: lead.email,
      gstNumber,
      city,
      state,
      convertedFrom: lead._id,
      assignedTo: lead.assignedTo,
      totalRevenue: lead.estimatedValue || 0,
      isActive: true
    });
    // Mark Lead as Won and Converted
    lead.status = 'Won';
    lead.isConverted = true;
    lead.convertedAt = Date.now();
    await lead.save();
    res.status(201).json(newClient);
  } catch (error) {
    console.log('Convert lead error:', error);
    res.status(500).json({ message: 'Server error converting lead to client' });
  }
});

module.exports = router;
