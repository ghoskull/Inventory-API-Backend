const express = require('express');
const router = express.Router();
// DISINI PERUBAHANNYA: Menggunakan 'Item' (Huruf Besar)
const Item = require('../models/Item'); 
const authView = require('../middleware/authView');

// 1. HALAMAN UTAMA (Pengganti Landing Page)
// Jika user sudah login, lempar ke dashboard. Jika belum, lempar ke login.
router.get('/', (req, res) => {
    if (req.cookies.token || req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.redirect('/login');
});

// 2. HALAMAN LOGIN
router.get('/login', (req, res) => {
    if (req.cookies.token || req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('login', { user: null });
});

// 3. HALAMAN REGISTER
router.get('/register', (req, res) => {
    res.render('register', { user: null });
});

// 4. HALAMAN DASHBOARD (Hanya Login)
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

// 5. HALAMAN LAPORAN
router.get('/reports', authView, async (req, res) => {
    try {
        const { search } = req.query;
        let searchResults = [];
        if (search && search.trim() !== '') {
            const regex = new RegExp(search, 'i');
            searchResults = await Item.find({
                $or: [
                    { itemName: regex },
                    { itemCode: regex }
                ]
            }).limit(20);
        }
        res.render('reports', { 
            user: req.user,
            search,
            searchResults
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 6. MANAJEMEN ITEM (Tambah, Edit, Detail)
router.get('/items/new', authView, (req, res) => {
    res.render('form', { item: null, user: req.user });
});

router.get('/items/:itemCode/edit', authView, async (req, res) => {
    try {
        const item = await Item.findOne({ itemCode: req.params.itemCode });
        if (!item) return res.status(404).send('Item not found');
        res.render('form', { item, user: req.user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/items/:itemCode', async (req, res) => {
    try {
        const item = await Item.findOne({ itemCode: req.params.itemCode });
        if (!item) return res.status(404).send('Item not found');
        res.render('detail', { item, user: req.user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 7. PROSES CRUD
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

// 8. PROSES LOGOUT
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    if (req.logout) {
        req.logout(() => {
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;