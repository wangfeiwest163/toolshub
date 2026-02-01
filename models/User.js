const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true // Allows null values
  },
  email: {
    type: String,
    unique: true,
    sparse: true // Allows null values
  },
  password: {
    type: String,
    select: false // Exclude password from queries by default
  },
  favorites: [{
    toolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tool'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  recentTools: [{
    toolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tool'
    },
    accessedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    theme: {
      type: String,
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('User', userSchema);