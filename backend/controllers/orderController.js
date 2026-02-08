const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Check stock availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `${product?.name || 'Product'} is out of stock` 
        });
      }
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await Order.update(req.params.id, {
      status: req.body.status,
      paymentMethod: req.body.paymentMethod
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.user.id, {
      limit: 50,
      offset: 0
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status
    } = req.query;

    const options = {
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit)
    };

    if (status && status !== 'all') {
      options.status = status;
    }

    const orders = await Order.findAll(options);
    
    // Get total count
    const allOrders = await Order.findAll({ ...options, limit: 999999, offset: 0 });
    const total = allOrders.length;

    res.json({
      orders,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Restore product stock
    if (order.items) {
      for (const item of order.items) {
        await Product.update(item.product_id, { 
          stock: Product.stock + item.quantity 
        });
      }
    }

    await Order.delete(req.params.id);
    res.json({ message: 'Order removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats/overview
// @access  Private/Admin
const getOrderStats = async (req, res) => {
  try {
    const orders = await Order.findAll({ limit: 999999, offset: 0 });

    // Today's stats
    const today = new Date();
    const todaysOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate.toDateString() === today.toDateString();
    });

    // Status breakdown
    const ordersByStatus = {};
    orders.forEach(o => {
      const status = o.status || 'pending';
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    });

    // Revenue calculations
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    res.json({
      totalOrders: orders.length,
      todaysOrders: todaysOrders.length,
      totalRevenue: totalRevenue.toFixed(2),
      todaysRevenue: todaysRevenue.toFixed(2),
      ordersByStatus,
      averageOrderValue: orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  getMyOrders,
  getOrders,
  deleteOrder,
  getOrderStats
};