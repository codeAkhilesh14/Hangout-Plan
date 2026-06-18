const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  response: {
    type: String,
    enum: ['yes'],
    required: true
  },
  dodgeCount: {
    type: Number,
    default: 0
  },
  day: {
    type: String,
    enum: ['Saturday', 'Sunday']
  },
  place: {
    type: String
  },
  timeSlot: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', SessionSchema);
