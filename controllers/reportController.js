const Item = require('../models/Item');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get total inventory value by supplier
// @route   GET /api/reports/total-value-by-supplier
// @access  Public (bisa juga diproteksi dengan auth jika ingin)
const getTotalValueBySupplier = asyncHandler(async (req, res) => {
  const result = await Item.aggregate([
    {
      $group: {
        _id: "$supplier",
        totalValue: { $sum: { $multiply: ["$quantity", "$unitPrice"] } },
        itemCount: { $sum: 1 }
      }
    },
    { $sort: { totalValue: -1 } }
  ]);

  res.status(200).json({ success: true, data: result });
});

// @desc    Get items with stock below threshold
// @route   GET /api/reports/low-stock
// @access  Public
const getLowStockItems = asyncHandler(async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 10;

  const items = await Item.find({ quantity: { $lt: threshold } })
    .sort({ quantity: 1 });

  res.status(200).json({
    success: true,
    threshold,
    count: items.length,
    data: items
  });
});

// @desc    Get inventory summary (total items, total quantity, total value, avg price)
// @route   GET /api/reports/inventory-summary
// @access  Public
const getInventorySummary = asyncHandler(async (req, res) => {
  const result = await Item.aggregate([
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
        totalValue: { $sum: { $multiply: ["$quantity", "$unitPrice"] } },
        avgPrice: { $avg: "$unitPrice" }
      }
    }
  ]);

  const summary = result[0] || { totalItems: 0, totalQuantity: 0, totalValue: 0, avgPrice: 0 };

  res.status(200).json({ success: true, data: summary });
});

module.exports = {
  getTotalValueBySupplier,
  getLowStockItems,
  getInventorySummary
};