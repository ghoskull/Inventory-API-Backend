const express = require('express');
const router = express.Router();
const {
  getTotalValueBySupplier,
  getLowStockItems,
  getInventorySummary
} = require('../controllers/reportController');

// Jika ingin laporan hanya bisa diakses user login, tambahkan middleware auth
// const auth = require('../middleware/auth');
// router.use(auth); // semua route di bawah akan diproteksi

router.get('/total-value-by-supplier', getTotalValueBySupplier);
router.get('/low-stock', getLowStockItems);
router.get('/inventory-summary', getInventorySummary);

module.exports = router;