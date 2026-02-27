const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

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

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    
    const options = {
      limit: limitNum,
      offset: (pageNum - 1) * limitNum
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
      page: pageNum,
      pages: Math.ceil(total / limitNum),
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

// @desc    Get order invoice (PDF)
// @route   GET /api/orders/:id/invoice
// @access  Private
const getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Invoice-${order.id}.pdf"`);

    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Order ID: ${order.id}`, { align: 'center' });
    doc.fontSize(10).text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1);

    // Customer Details
    doc.fontSize(12).font('Helvetica-Bold').text('BILLING DETAILS');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Customer: ${order.user_username || 'N/A'}`);
    doc.text(`Email: ${order.user_email || order.user_username || 'N/A'}`);
    doc.text(`Address: ${order.shipping_address || 'N/A'}`);
    doc.moveDown(1);

    // Items table
    doc.fontSize(12).font('Helvetica-Bold').text('ORDER ITEMS');
    doc.moveDown(0.5);

    // Table headers
    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 250;
    const col3 = 350;
    const col4 = 450;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Product', col1, tableTop);
    doc.text('Quantity', col2, tableTop);
    doc.text('Price', col3, tableTop);
    doc.text('Total', col4, tableTop);

    doc.lineWidth(0.5);
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table rows
    let y = tableTop + 25;
    doc.fontSize(10).font('Helvetica');

    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        doc.text(item.product_name || 'Product', col1, y);
        doc.text(String(item.quantity), col2, y);
        doc.text(`${item.price.toLocaleString()}₡`, col3, y);
        doc.text(`${(item.price * item.quantity).toLocaleString()}₡`, col4, y);
        y += 20;
      });
    }

    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 10;

    // Totals
    doc.fontSize(10).font('Helvetica');
    doc.text('Subtotal:', col2, y);
    doc.text(`${(order.total_amount || 0).toLocaleString()}₡`, col4, y);
    y += 20;

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('TOTAL:', col2, y);
    doc.text(`${(order.total_amount || 0).toLocaleString()}₡`, col4, y);

    // Footer
    doc.moveDown(2);
    doc.fontSize(9).font('Helvetica').text('Thank you for your purchase! This is an automated invoice.', { align: 'center' });
    doc.text(`Payment Method: ${order.payment_method || 'N/A'}`, { align: 'center' });
    doc.text(`Status: ${order.status}`, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating invoice' });
  }
};

// @desc    Send invoice via email
// @route   POST /api/orders/:id/send-invoice
// @access  Private
const sendInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Configure email service (use environment variables in production)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'noreply@cyberstore.com',
        pass: process.env.EMAIL_PASS || 'demo_password'
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@cyberstore.com',
      to: order.user_email || req.user.email,
      subject: `Invoice for Order #${order.id}`,
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your purchase!</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Total Amount:</strong> ${order.total_amount}₡</p>
        <p>Your invoice is attached to this email.</p>
        <p>Track your order at: <a href="http://localhost:3000/track-order">http://localhost:3000/track-order</a></p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending invoice' });
  }
};

// @desc    Update order status (Admin Command)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await Order.updateStatus(req.params.id, status);

    res.json({
      message: `Order status updated to ${status}`,
      order: updatedOrder
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
  getOrderStats,
  getInvoice,
  sendInvoice,
  updateOrderStatus
};
