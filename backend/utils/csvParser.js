const csv = require('csv-parser');
const { Readable } = require('stream');

/**
 * Detects the data type of a value
 * @param {string} value - The value to analyze
 * @returns {string} - The detected type: 'number', 'date', 'boolean', or 'string'
 */
function detectType(value) {
  if (!value || value.trim() === '') {
    return 'string'; // Empty values default to string
  }

  const trimmed = value.trim();

  // Check for boolean
  if (trimmed.toLowerCase() === 'true' || trimmed.toLowerCase() === 'false') {
    return 'boolean';
  }

  // Check for number (integer or float)
  if (!isNaN(trimmed) && trimmed !== '') {
    // Check if it's a valid number (not just whitespace)
    const num = parseFloat(trimmed);
    if (isFinite(num)) {
      return 'number';
    }
  }

  // Check for date (basic check)
  const date = new Date(trimmed);
  if (!isNaN(date.getTime()) && trimmed.match(/^\d{4}-\d{2}-\d{2}/)) {
    return 'date';
  }

  return 'string';
}

/**
 * Determines the most common type for a column
 * @param {Array} values - Array of values for the column
 * @returns {string} - The dominant type
 */
function determineColumnType(values) {
  const typeCounts = {
    number: 0,
    string: 0,
    date: 0,
    boolean: 0
  };

  values.forEach(value => {
    const type = detectType(value);
    typeCounts[type]++;
  });

  // Return the type with the highest count
  return Object.keys(typeCounts).reduce((a, b) => 
    typeCounts[a] > typeCounts[b] ? a : b
  );
}

/**
 * Parses CSV data from a buffer
 * @param {Buffer} buffer - CSV file buffer
 * @returns {Promise<Object>} - Object containing rows and schema information
 */
async function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        if (rows.length === 0) {
          reject(new Error('CSV file is empty or has no valid rows'));
          return;
        }

        // Get column names from first row
        const columnNames = Object.keys(rows[0]);
        
        if (columnNames.length === 0) {
          reject(new Error('CSV file has no columns'));
          return;
        }

        // Determine types for each column
        const columns = columnNames.map(colName => {
          const values = rows.map(row => row[colName] || '');
          const type = determineColumnType(values);
          
          return {
            name: colName,
            type: type
          };
        });

        resolve({
          rows,
          columns,
          totalRows: rows.length
        });
      })
      .on('error', (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      });
  });
}

module.exports = {
  parseCSV,
  detectType,
  determineColumnType
};
