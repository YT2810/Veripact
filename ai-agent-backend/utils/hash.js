const crypto = require('crypto');

function createHashFromText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

module.exports = { createHashFromText };

