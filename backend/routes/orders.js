const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
  getOrderStats,
  getInvoice,
  sendInvoice,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/', protect, createOrder);

// Protected routes
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/:id/invoice', protect, getInvoice);
router.post('/:id/send-invoice', protect, sendInvoice);

// Admin routes
router.get('/', protect, admin, getOrders);
router.put('/:id', protect, admin, updateOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);
router.get('/stats/overview', protect, admin, getOrderStats);

module.exports = router;
