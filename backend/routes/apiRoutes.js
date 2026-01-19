const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const datasetController = require('../controllers/datasetController');
const statsController = require('../controllers/statsController');
const histogramController = require('../controllers/histogramController');

const router = express.Router();

// Configure multer for memory storage (no disk writes)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only CSV files
    if (file.mimetype === 'text/csv' || 
        file.mimetype === 'application/vnd.ms-excel' ||
        file.originalname.toLowerCase().endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// POST /api/upload - Upload and parse CSV file
router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size too large. Maximum size is 50MB.'
        });
      }
      return res.status(400).json({
        success: false,
        error: `Upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    next();
  });
}, uploadController.uploadCSV);

// GET /api/dataset/:id/table - Get table data with pagination
router.get('/dataset/:id/table', datasetController.getTableData);

// GET /api/dataset/:id/column/:col/stats - Get column statistics
router.get('/dataset/:id/column/:col/stats', statsController.getColumnStats);

// GET /api/dataset/:id/column/:col/hist - Get column histogram
router.get('/dataset/:id/column/:col/hist', histogramController.getColumnHistogram);

module.exports = router;
