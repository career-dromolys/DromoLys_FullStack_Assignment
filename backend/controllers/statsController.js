const Dataset = require('../models/Dataset');
const CSVRow = require('../models/CSVRow');
const { computeStats } = require('../utils/statistics');

/**
 * Get statistics for a specific column
 */
const getColumnStats = async (req, res) => {
  try {
    const { id, col } = req.params;

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

    // Fetch all rows for this dataset
    const rows = await CSVRow.find({ dataset_id: id })
      .sort({ row_index: 1 })
      .select('data -_id');

    // Extract column values
    const values = rows.map(row => row.data[col]);

    // Check if column is numeric
    if (column.type !== 'number') {
      return res.status(200).json({
        success: true,
        dataset_id: id,
        column: col,
        type: column.type,
        stats: {
          min: 'Not applicable',
          max: 'Not applicable',
          mean: 'Not applicable',
          median: 'Not applicable',
          mode: 'Not applicable',
          missing_count: values.filter(v => v === null || v === undefined || v === '').length
        }
      });
    }

    // Compute statistics for numeric column
    const stats = computeStats(values);

    res.status(200).json({
      success: true,
      dataset_id: id,
      column: col,
      type: column.type,
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: `Server error: ${error.message}`
    });
  }
};

module.exports = {
  getColumnStats
};
