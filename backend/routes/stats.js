const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSalesReport,
  getInventoryReport
} = require('../controllers/statsController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/sales', protect, admin, getSalesReport);
router.get('/inventory', protect, admin, getInventoryReport);

module.exports = router;