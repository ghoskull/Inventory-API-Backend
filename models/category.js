const mongoose = require('mongoose');
const shortId = require('../utils/shortId');

const categorySchema = new mongoose.Schema(
  {
    categoryCode: shortId,
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Category name must be at least 2 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: '#3B82F6'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);