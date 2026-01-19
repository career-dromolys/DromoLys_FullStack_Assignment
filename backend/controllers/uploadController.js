const Dataset = require('../models/Dataset');
const CSVRow = require('../models/CSVRow');
const { parseCSV } = require('../utils/csvParser');
const { generateUniqueId } = require('../utils/idGenerator');

/**
 * Handle CSV file upload, parse it, and store metadata
 */
const uploadCSV = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please upload a CSV file.'
      });
    }

    // Validate file type
    if (!req.file.mimetype.includes('csv') && !req.file.originalname.endsWith('.csv')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type. Only CSV files are allowed.'
      });
    }

    // Check if file is empty
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Uploaded file is empty.'
      });
    }

    // Parse CSV
    let parsedData;
    try {
      parsedData = await parseCSV(req.file.buffer);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        error: `Failed to parse CSV: ${parseError.message}`
      });
    }

    // Generate unique dataset_id
    const dataset_id = generateUniqueId();

    // Create dataset metadata
    const dataset = new Dataset({
      dataset_id,
      filename: req.file.originalname,
      columns: parsedData.columns,
      total_rows: parsedData.totalRows,
      upload_time: new Date()
    });

    await dataset.save();

    // Store rows in batches for efficiency
    const batchSize = 1000;
    const rowsToInsert = parsedData.rows.map((row, index) => ({
      dataset_id,
      row_index: index,
      data: row
    }));

    // Insert rows in batches
    for (let i = 0; i < rowsToInsert.length; i += batchSize) {
      const batch = rowsToInsert.slice(i, i + batchSize);
      await CSVRow.insertMany(batch);
    }

    // Return success response
    res.status(201).json({
      success: true,
      dataset_id,
      schema: {
        columns: parsedData.columns,
        total_rows: parsedData.totalRows,
        upload_time: dataset.upload_time
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: `Server error: ${error.message}`
    });
  }
};

module.exports = {
  uploadCSV
};
