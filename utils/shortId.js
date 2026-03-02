const { nanoid } = require('nanoid');

const shortId = {
  type: String,
  default: () => nanoid(8), // panjang 8 karakter
  required: true,
  unique: true, // pastikan unik
  index: true,
};

module.exports = shortId;