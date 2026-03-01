// backend/routes/suppliers.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getSuppliers,
  getSupplier,
  getSupplierProducts,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getAllSuppliersAdmin
} = require('../controllers/supplierController');

// Admin routes (must be before /:id to avoid conflicts)
router.get('/admin/all', protect, admin, getAllSuppliersAdmin);

// Public routes
router.get('/', getSuppliers);
router.get('/:id', getSupplier);
router.get('/:id/products', getSupplierProducts);

// Admin CUD routes
router.post('/', protect, admin, createSupplier);
router.put('/:id', protect, admin, updateSupplier);
router.delete('/:id', protect, admin, deleteSupplier);

module.exports = router;
