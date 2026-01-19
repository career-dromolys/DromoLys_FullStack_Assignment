const crypto = require('crypto');

/**
 * Generates a unique ID (UUID v4)
 * Uses crypto.randomUUID() if available (Node 14.17.0+), otherwise falls back to manual generation
 */
function generateUniqueId() {
  // Try to use crypto.randomUUID() if available
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older Node versions
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = {
  generateUniqueId
};
