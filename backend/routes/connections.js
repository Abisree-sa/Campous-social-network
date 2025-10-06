const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  mentorshipRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentorship'
  }
}, {
  timestamps: true
});

// Ensure unique connections
connectionSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);
