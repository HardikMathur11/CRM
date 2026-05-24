const mongoose = require('mongoose');

const followupSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Call', 'Email', 'Meeting', 'WhatsApp', 'Site Visit'],
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Done', 'Overdue'],
    default: 'Pending'
  },
  outcome: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', followupSchema);
