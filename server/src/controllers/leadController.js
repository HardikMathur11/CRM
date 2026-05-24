const Lead = require('../models/Lead');
const Client = require('../models/Client');

// pull all leads, filter if it is a BDA
const getLeads = async (req, res) => {
  try {
    console.log('fetching leads for user:', req.user._id);
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
};

// add a brand new lead
const createLead = async (req, res) => {
  const { contactName, companyName, phone, email, status, priority, estimatedValue, leadSource, location, assignedTo } = req.body;
  try {
    console.log('creating lead for company:', companyName);
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
};

// fetch single lead by id
const getLeadById = async (req, res) => {
  try {
    console.log('getting lead details for:', req.params.id);
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    console.log('Get lead by ID error:', error);
    res.status(500).json({ message: 'Server error fetching lead details' });
  }
};

// save updates to lead
const updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
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
};

// delete lead
const deleteLead = async (req, res) => {
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
};

// append a quick note
const addNote = async (req, res) => {
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
};

// move lead to client table when won
const convertLead = async (req, res) => {
  const { gstNumber, city, state } = req.body;
  try {
    console.log('converting lead:', req.params.id, 'to client');
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    if (lead.isConverted) {
      return res.status(400).json({ message: 'Lead is already converted' });
    }

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

    lead.status = 'Won';
    lead.isConverted = true;
    lead.convertedAt = Date.now();
    await lead.save();

    res.status(201).json(newClient);
  } catch (error) {
    console.log('Convert lead error:', error);
    res.status(500).json({ message: 'Server error converting lead to client' });
  }
};

module.exports = {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  addNote,
  convertLead
};
