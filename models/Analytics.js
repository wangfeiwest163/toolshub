const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  toolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool',
    required: true
  },
  userId: {
    type: String,
    default: null
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  eventType: {
    type: String,
    enum: ['view', 'use', 'favorite', 'search'],
    default: 'view'
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);