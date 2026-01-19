/**
 * Computes statistics for a numeric column
 * @param {Array} values - Array of numeric values
 * @returns {Object} - Statistics object
 */
function computeStats(values) {
  // Filter out empty, null, undefined, and non-numeric values
  const numericValues = values
    .map(v => {
      if (v === null || v === undefined || v === '') return null;
      const num = parseFloat(v);
      return isNaN(num) ? null : num;
    })
    .filter(v => v !== null);

  if (numericValues.length === 0) {
    return {
      min: 'Not applicable',
      max: 'Not applicable',
      mean: 'Not applicable',
      median: 'Not applicable',
      mode: 'Not applicable',
      missing_count: values.length
    };
  }

  // Sort for median calculation
  const sorted = [...numericValues].sort((a, b) => a - b);

  // Min and Max
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Mean
  const sum = numericValues.reduce((acc, val) => acc + val, 0);
  const mean = sum / numericValues.length;

  // Median
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];

  // Mode (most frequent value)
  const frequency = {};
  numericValues.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  
  let maxFreq = 0;
  let mode = null;
  Object.keys(frequency).forEach(val => {
    if (frequency[val] > maxFreq) {
      maxFreq = frequency[val];
      mode = parseFloat(val);
    }
  });

  // If all values have frequency 1, mode is not meaningful
  if (maxFreq === 1 && numericValues.length > 1) {
    mode = 'Not applicable';
  }

  // Missing count
  const missing_count = values.length - numericValues.length;

  return {
    min: min.toFixed(2),
    max: max.toFixed(2),
    mean: mean.toFixed(2),
    median: median.toFixed(2),
    mode: mode === 'Not applicable' ? mode : mode.toFixed(2),
    missing_count
  };
}

/**
 * Generates histogram bins for numeric data
 * @param {Array} values - Array of numeric values
 * @param {number} bins - Number of bins (default: 30)
 * @returns {Object} - Histogram data with bins and counts
 */
function generateHistogram(values, bins = 30) {
  // Filter out empty, null, undefined, and non-numeric values
  const numericValues = values
    .map(v => {
      if (v === null || v === undefined || v === '') return null;
      const num = parseFloat(v);
      return isNaN(num) ? null : num;
    })
    .filter(v => v !== null);

  if (numericValues.length === 0) {
    return {
      bins: [],
      counts: [],
      message: 'No valid numeric data exists for this column'
    };
  }

  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);

  // Handle case where all values are the same
  if (min === max) {
    return {
      bins: [min.toFixed(2)],
      counts: [numericValues.length],
      message: null
    };
  }

  const binWidth = (max - min) / bins;
  const histogram = new Array(bins).fill(0);
  const binLabels = [];

  // Create bin labels
  for (let i = 0; i < bins; i++) {
    const binStart = min + (i * binWidth);
    const binEnd = min + ((i + 1) * binWidth);
    binLabels.push(`${binStart.toFixed(2)} - ${binEnd.toFixed(2)}`);
  }

  // Distribute values into bins
  numericValues.forEach(value => {
    let binIndex = Math.floor((value - min) / binWidth);
    // Handle edge case where value equals max
    if (binIndex >= bins) {
      binIndex = bins - 1;
    }
    histogram[binIndex]++;
  });

  return {
    bins: binLabels,
    counts: histogram,
    message: null
  };
}

module.exports = {
  computeStats,
  generateHistogram
};
