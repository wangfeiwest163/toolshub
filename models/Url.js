const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String, // Could be user ID in a full implementation
    default: 'anonymous'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date // Optional expiration date
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Url', urlSchema);