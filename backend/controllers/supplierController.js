// backend/controllers/supplierController.js
const Supplier = require('../models/Supplier');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
const getSuppliers = async (req, res) => {
  try {
    const options = {
      search: req.query.search,
      country: req.query.country,
      sort: req.query.sort,
      page: req.query.page,
      limit: req.query.limit,
      isActive: true
    };

    const result = await Supplier.findAll(options);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single supplier by ID
// @route   GET /api/suppliers/:id
// @access  Public
const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    // Get product count
    const productCount = await Supplier.getProductCount(supplier.id);

    res.json({ success: true, supplier: { ...supplier, product_count: productCount } });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get supplier products
// @route   GET /api/suppliers/:id/products
// @access  Public
const getSupplierProducts = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const result = await Supplier.getProducts(supplier.id, {
      page: req.query.page,
      limit: req.query.limit
    });

    res.json({ success: true, supplier: supplier.name, ...result });
  } catch (error) {
    console.error('Error fetching supplier products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Private/Admin
const createSupplier = async (req, res) => {
  try {
    const {
      name, description, logo, contact_person, contact_first_name, contact_last_name,
      email, phone, mobile, website, address, street, city, country,
      commercial_register, tax_number, currency, opening_balance
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Supplier name is required' });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existing = await Supplier.findBySlug(slug);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Supplier with this name already exists' });
    }

    const supplier = await Supplier.create({
      name, slug, description, logo,
      contact_person, contact_first_name, contact_last_name,
      email, phone, mobile, website,
      address, street, city, country,
      commercial_register, tax_number, currency, opening_balance
    });

    res.status(201).json({ success: true, supplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const updateData = { ...req.body };

    // Update slug if name changed
    if (updateData.name && updateData.name !== supplier.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updated = await Supplier.update(req.params.id, updateData);
    res.json({ success: true, supplier: updated });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const deleted = await Supplier.delete(req.params.id);
    if (deleted) {
      res.json({ success: true, message: 'Supplier deleted successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete supplier' });
    }
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all suppliers (admin - includes inactive)
// @route   GET /api/suppliers/admin/all
// @access  Private/Admin
const getAllSuppliersAdmin = async (req, res) => {
  try {
    const options = {
      search: req.query.search,
      country: req.query.country,
      sort: req.query.sort,
      page: req.query.page,
      limit: req.query.limit
      // No isActive filter - show all
    };

    const result = await Supplier.findAll(options);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching all suppliers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  getSupplierProducts,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getAllSuppliersAdmin
};
