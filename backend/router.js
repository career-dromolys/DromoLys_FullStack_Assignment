const express = require('express');
const apiRoutes = require('./routes/apiRoutes');

const router = express.Router();

// Mount API routes
router.use('/api', apiRoutes);

module.exports = router;