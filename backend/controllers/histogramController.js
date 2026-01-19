const Dataset = require('../models/Dataset');
const CSVRow = require('../models/CSVRow');
const { generateHistogram } = require('../utils/statistics');

/**
 * Get histogram data for a specific column
 */
const getColumnHistogram = async (req, res) => {
  try {
    const { id, col } = req.params;
    const bins = parseInt(req.query.bins) || 30;

    // Validate bins parameter
    if (bins < 1 || bins > 100) {
      return res.status(400).json({
        success: false,
        error: 'Number of bins must be between 1 and 100'
      });
    }

    // Validate dataset exists
    const dataset = await Dataset.findOne({ dataset_id: id });
    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found'
      });
    }

    // Find the column in schema
    const column = dataset.columns.find(c => c.name === col);
    if (!column) {
      return res.status(404).json({
        success: false,
        error: `Column '${col}' not found in dataset`
      });
    }

    // Check if column is numeric
    if (column.type !== 'number') {
      return res.status(400).json({
        success: false,
        error: `Histogram can only be generated for numeric columns. Column '${col}' is of type '${column.type}'.`
      });
    }

    // Fetch all rows for this dataset
    const rows = await CSVRow.find({ dataset_id: id })
      .sort({ row_index: 1 })
      .select('data -_id');

    // Extract column values
    const values = rows.map(row => row.data[col]);

    // Generate histogram
    const histogram = generateHistogram(values, bins);

    if (histogram.message) {
      return res.status(200).json({
        success: true,
        dataset_id: id,
        column: col,
        type: column.type,
        bins: histogram.bins,
        counts: histogram.counts,
        message: histogram.message
      });
    }

    res.status(200).json({
      success: true,
      dataset_id: id,
      column: col,
      type: column.type,
      bins: histogram.bins,
      counts: histogram.counts
    });

  } catch (error) {
    console.error('Get histogram error:', error);
    res.status(500).json({
      success: false,
      error: `Server error: ${error.message}`
    });
  }
};

module.exports = {
  getColumnHistogram
};
