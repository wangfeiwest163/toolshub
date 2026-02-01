const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Utility Tools', 'AI Tools', 'Online Calculators', 'Text Tools', 'Image Tools', 'Developer Tools', 'Converter Tools']
  },
  url: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'tool'
  },
  popularity: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Tool', toolSchema);