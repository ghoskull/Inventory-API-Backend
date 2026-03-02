const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const authView = require('../middleware/authView');

// Halaman landing (publik)
router.get('/', (req, res) => {
  res.render('landing', { user: null });
});

// Halaman login
router.get('/login', (req, res) => {
  res.render('login', { user: null });
});

// Halaman register
router.get('/register', (req, res) => {
  res.render('register', { user: null });
});

// Halaman dashboard (hanya untuk user login)
router.get('/dashboard', authView, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const items = await Item.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Item.countDocuments();

    res.render('index', {
      items,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      user: req.user
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Halaman laporan (publik)
router.get('/reports', async (req, res) => {
  res.render('reports', { user: req.user });
});

// Halaman tambah item (hanya login)
router.get('/items/new', authView, (req, res) => {
  res.render('form', { item: null, user: req.user });
});

// Halaman edit item (hanya login)
router.get('/items/:itemCode/edit', authView, async (req, res) => {
  try {
    const item = await Item.findOne({ itemCode: req.params.itemCode });
    if (!item) return res.status(404).send('Item not found');
    res.render('form', { item, user: req.user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Halaman detail item (publik)
router.get('/items/:itemCode', async (req, res) => {
  try {
    const item = await Item.findOne({ itemCode: req.params.itemCode });
    if (!item) return res.status(404).send('Item not found');
    res.render('detail', { item, user: req.user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Proses tambah item (POST) - hanya login
router.post('/items', authView, async (req, res) => {
  try {
    const { itemName, description, supplier, quantity, location, unitPrice } = req.body;
    await Item.create({
      itemName,
      description,
      supplier,
      quantity: Number(quantity),
      location,
      unitPrice: Number(unitPrice)
    });
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error creating item: ' + err.message);
  }
});

// Proses update item (PUT) - hanya login
router.put('/items/:itemCode', authView, async (req, res) => {
  try {
    const { itemName, description, supplier, quantity, location, unitPrice } = req.body;
    const item = await Item.findOne({ itemCode: req.params.itemCode });
    if (!item) return res.status(404).send('Item not found');

    item.itemName = itemName || item.itemName;
    item.description = description || item.description;
    item.supplier = supplier || item.supplier;
    item.quantity = quantity !== undefined ? Number(quantity) : item.quantity;
    item.location = location || item.location;
    item.unitPrice = unitPrice !== undefined ? Number(unitPrice) : item.unitPrice;

    await item.save();
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error updating item: ' + err.message);
  }
});

// Proses hapus item (DELETE) - hanya login
router.delete('/items/:itemCode', authView, async (req, res) => {
  try {
    const item = await Item.findOne({ itemCode: req.params.itemCode });
    if (!item) return res.status(404).send('Item not found');
    await item.deleteOne();
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error deleting item: ' + err.message);
  }
});

// Proses logout (POST)
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/'); // kembali ke halaman landing
});

module.exports = router;