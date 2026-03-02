const mongoose = require('mongoose');
const shortId = require('../utils/shortId');

const itemSchema = new mongoose.Schema(
  {
    itemCode: shortId,
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [3, 'Item name must be at least 3 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    supplier: {
      type: String,
      required: [true, 'Supplier is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    location: {
      type: String,
      default: 'Unassigned',
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Item', itemSchema);