const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  analysisResults: {
    overallHealth: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'needs-attention'],
      default: 'fair'
    },
    dominantColors: [{
      color: String,
      percentage: Number,
      interpretation: String
    }],
    detectedPatterns: [{
      type: String,
      location: String,
      significance: String
    }],
    recommendations: [String]
  },
  zoneData: [{
    zoneId: Number,
    zoneName: String,
    bodyOrgan: String,
    clockPosition: String,
    detectedColor: String,
    detectedPatterns: [String],
    healthStatus: {
      type: String,
      enum: ['normal', 'attention', 'concern']
    },
    interpretation: String
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
analysisSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
