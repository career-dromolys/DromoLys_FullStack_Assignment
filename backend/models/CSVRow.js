const mongoose = require('mongoose');

const csvRowSchema = new mongoose.Schema({
  dataset_id: {
    type: String,
    required: true,
    index: true
  },
  row_index: {
    type: Number,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: false
});

// Compound index for efficient queries
csvRowSchema.index({ dataset_id: 1, row_index: 1 });

const CSVRow = mongoose.model('CSVRow', csvRowSchema);

module.exports = CSVRow;
