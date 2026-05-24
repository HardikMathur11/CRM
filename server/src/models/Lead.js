const mongoose = require('mongoose');
const calculateLeadScore = require('../utils/leadScoring');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  addedBy: {
    type: String, // Storing the name of the user who added it for simplicity
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const leadSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  score: {
    type: String,
    enum: ['Hot', 'Warm', 'Cold'],
    default: 'Cold'
  },
  estimatedValue: {
    type: Number,
    default: 0
  },
  leadSource: {
    type: String,
    default: 'Direct'
  },
  location: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: [noteSchema],
  isConverted: {
    type: Boolean,
    default: false
  },
  convertedAt: {
    type: Date
  },
  lostReason: {
    type: String
  },
  expectedCloseDate: {
    type: Date
  }
}, { timestamps: true });

// run lead scoring rules before save
leadSchema.pre('save', function (next) {
  this.score = calculateLeadScore(this.priority, this.status);
  next();
});

module.exports = mongoose.model('Lead', leadSchema);
