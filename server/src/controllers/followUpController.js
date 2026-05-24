const FollowUp = require('../models/FollowUp');

// @desc    Get all follow-ups
// @route   GET /api/followups
// @access  Private
const getFollowUps = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'bda') {
      query.assignedTo = req.user._id;
    }
    const followups = await FollowUp.find(query)
      .populate('lead', 'contactName companyName phone status score')
      .populate('assignedTo', 'name email')
      .sort({ scheduledAt: 1 });
    res.json(followups);
  } catch (error) {
    console.log('Get followups error:', error);
    res.status(500).json({ message: 'Server error fetching followups' });
  }
};

// @desc    Create a new follow-up
// @route   POST /api/followups
// @access  Private
const createFollowUp = async (req, res) => {
  const { lead, type, scheduledAt, notes, assignedTo } = req.body;
  try {
    const followup = new FollowUp({
      lead,
      assignedTo: assignedTo || req.user._id,
      type,
      scheduledAt,
      notes,
      status: 'Pending'
    });
    const savedFollowUp = await followup.save();
    res.status(201).json(savedFollowUp);
  } catch (error) {
    console.log('Create followup error:', error);
    res.status(500).json({ message: 'Server error creating followup' });
  }
};

// @desc    Update a follow-up
// @route   PUT /api/followups/:id
// @access  Private
const updateFollowUp = async (req, res) => {
  try {
    const followup = await FollowUp.findById(req.params.id);
    if (!followup) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }
    const allowedUpdates = ['type', 'scheduledAt', 'notes', 'status', 'outcome', 'assignedTo'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) followup[field] = req.body[field];
    });
    const updatedFollowUp = await followup.save();
    res.json(updatedFollowUp);
  } catch (error) {
    console.log('Update followup error:', error);
    res.status(500).json({ message: 'Server error updating followup' });
  }
};

module.exports = {
  getFollowUps,
  createFollowUp,
  updateFollowUp
};
