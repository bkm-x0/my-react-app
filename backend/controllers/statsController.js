const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Overall stats
    const products = await Product.findAll({ limit: 999999, offset: 0 });
    const users = await User.findAll(999999, 0);
    const ordersResult = await Order.findAll({ limit: 999999, offset: 0 });
    const orders = ordersResult.orders || ordersResult;

    const totalProducts = products.length;
    const totalUsers = users.filter(u => u.is_active).length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

    // Today's stats
    const today = new Date();
    const todaysOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate.toDateString() === today.toDateString();
    });
    const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

    // Low stock products
    const lowStockProducts = products.filter(p => p.stock < 10 && p.is_active).slice(0, 5);

    // Recent orders (limit 5)
    const recentOrders = orders.slice(-5).reverse();

    res.json({
      overview: {
        totalRevenue: totalRevenue.toFixed(2),
        totalProducts,
        totalUsers,
        totalOrders,
        todaysRevenue: todaysRevenue.toFixed(2),
        todaysOrders: todaysOrders.length,
        revenueGrowth: '0.00'
      },
      lowStockProducts,
      recentOrders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get sales report
// @route   GET /api/stats/sales
// @access  Private/Admin
const getSalesReport = async (req, res) => {
  try {
    const ordersResult = await Order.findAll({ limit: 999999, offset: 0 });
    const orders = ordersResult.orders || ordersResult;

    // Group by date
    const salesByDate = {};
    orders.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = {
          date,
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0
        };
      }
      salesByDate[date].totalRevenue += parseFloat(order.total_amount) || 0;
      salesByDate[date].totalOrders += 1;
    });

    // Calculate average
    Object.keys(salesByDate).forEach(date => {
      salesByDate[date].averageOrderValue = (salesByDate[date].totalRevenue / salesByDate[date].totalOrders).toFixed(2);
    });

    const salesReport = Object.values(salesByDate).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(salesReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get inventory report
// @route   GET /api/stats/inventory
// @access  Private/Admin
const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.findAll({ limit: 999999, offset: 0, isActive: true });

    // Inventory summary
    const inventorySummary = {
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0),
      totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
      lowStockCount: products.filter(p => p.stock < 10).length,
      outOfStockCount: products.filter(p => p.stock === 0).length
    };

    res.json({
      inventory: products,
      summary: inventorySummary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getSalesReport,
  getInventoryReport
};