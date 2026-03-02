const Item = require('../models/Item');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all items with pagination
// @route   GET /api/items
// @access  Public
const getItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const items = await Item.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Item.countDocuments();

  res.status(200).json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    count: items.length,
    data: items,
  });
});

// @desc    Get single item by itemCode
// @route   GET /api/items/:itemCode
// @access  Public
const getItemByCode = asyncHandler(async (req, res, next) => {
  const item = await Item.findOne({ itemCode: req.params.itemCode });
  if (!item) {
    return res.status(404).json({
      success: false,
      message: `Item with code ${req.params.itemCode} not found`,
    });
  }
  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc    Create new item
// @route   POST /api/items
// @access  Public
const createItem = asyncHandler(async (req, res) => {
  const { itemName, description, supplier, quantity, location, unitPrice } = req.body;

  if (!itemName || !supplier || quantity === undefined || unitPrice === undefined) {
    res.status(400);
    throw new Error('Please provide all required fields: itemName, supplier, quantity, unitPrice');
  }

  const item = await Item.create({
    itemName,
    description,
    supplier,
    quantity,
    location,
    unitPrice,
  });

  res.status(201).json({
    success: true,
    data: item,
  });
});

// @desc    Update item by itemCode
// @route   PUT /api/items/:itemCode
// @access  Public
const updateItem = asyncHandler(async (req, res) => {
  let item = await Item.findOne({ itemCode: req.params.itemCode });
  if (!item) {
    res.status(404);
    throw new Error(`Item with code ${req.params.itemCode} not found`);
  }

  item.itemName = req.body.itemName || item.itemName;
  item.description = req.body.description || item.description;
  item.supplier = req.body.supplier || item.supplier;
  item.quantity = req.body.quantity !== undefined ? req.body.quantity : item.quantity;
  item.location = req.body.location || item.location;
  item.unitPrice = req.body.unitPrice !== undefined ? req.body.unitPrice : item.unitPrice;

  const updatedItem = await item.save();

  res.status(200).json({
    success: true,
    data: updatedItem,
  });
});

// @desc    Delete item by itemCode
// @route   DELETE /api/items/:itemCode
// @access  Public
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findOne({ itemCode: req.params.itemCode });
  if (!item) {
    res.status(404);
    throw new Error(`Item with code ${req.params.itemCode} not found`);
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Item deleted successfully',
  });
});

// @desc    Get single item by MongoDB _id
// @route   GET /api/items/by-id/:id
// @access  Public
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: `Item with id ${req.params.id} not found`,
    });
  }
  res.status(200).json({
    success: true,
    data: item,
  });
});

module.exports = {
  getItems,
  getItemByCode,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};