const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  dataset_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  columns: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['string', 'number', 'date', 'boolean']
    }
  }],
  upload_time: {
    type: Date,
    default: Date.now
  },
  total_rows: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Dataset = mongoose.model('Dataset', datasetSchema);

module.exports = Dataset;
