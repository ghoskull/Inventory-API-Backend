const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  getItems,
  getItemByCode,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

router.route('/')
  .get(getItems)
  .post(auth, createItem); // hanya user login bisa create

router.route('/:itemCode')
  .get(getItemByCode)
  .put(auth, updateItem)
  .delete(auth, deleteItem);

// Route khusus untuk mendapatkan item berdasarkan MongoDB _id
router.get('/by-id/:id', getItemById);

module.exports = router;