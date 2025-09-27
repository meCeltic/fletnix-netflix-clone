const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  show_id: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Movie', 'TV Show']
  },
  title: {
    type: String,
    required: true,
    index: true // For faster searches
  },
  director: {
    type: String,
    default: 'Unknown'
  },
  cast: {
    type: String,
    default: 'Unknown',
    index: true // For faster searches
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  date_added: {
    type: String
  },
  release_year: {
    type: Number,
    required: true,
    index: true // For sorting
  },
  rating: {
    type: String,
    required: true,
    index: true // For age restriction filtering
  },
  duration: {
    type: String,
    required: true
  },
  listed_in: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create text index for better search performance
contentSchema.index({
  title: 'text',
  cast: 'text',
  description: 'text',
  director: 'text'
});

// Create compound indexes for common queries
contentSchema.index({ type: 1, release_year: -1 });
contentSchema.index({ rating: 1, type: 1 });

module.exports = mongoose.model('Content', contentSchema);
