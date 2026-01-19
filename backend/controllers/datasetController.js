const Dataset = require('../models/Dataset');
const CSVRow = require('../models/CSVRow');

/**
 * Fetch rows for a dataset (with pagination support)
 */
const getTableData = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Validate dataset exists
    const dataset = await Dataset.findOne({ dataset_id: id });
    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found'
      });
    }

    // Fetch rows with pagination
    const rows = await CSVRow.find({ dataset_id: id })
      .sort({ row_index: 1 })
      .skip(skip)
      .limit(limit)
      .select('row_index data -_id');

    // Get total count
    const totalRows = await CSVRow.countDocuments({ dataset_id: id });

    res.status(200).json({
      success: true,
      dataset_id: id,
      total_rows: totalRows,
      page,
      limit,
      total_pages: Math.ceil(totalRows / limit),
      rows: rows.map(row => ({
        index: row.row_index,
        data: row.data
      }))
    });

  } catch (error) {
    console.error('Get table data error:', error);
    res.status(500).json({
      success: false,
      error: `Server error: ${error.message}`
    });
  }
};

module.exports = {
  getTableData
};
