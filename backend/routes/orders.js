const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
  getOrderStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/', protect, createOrder);

// Protected routes
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, admin, getOrders);
router.put('/:id', protect, admin, updateOrder);
router.delete('/:id', protect, admin, deleteOrder);
router.get('/stats/overview', protect, admin, getOrderStats);

module.exports = router;