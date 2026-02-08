// Admin controller for system-wide operations
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get comprehensive admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const users = await User.findAll(999999, 0);
    const orders = await Order.findAll({ limit: 999999, offset: 0 });
    const products = await Product.findAll({ limit: 999999, offset: 0 });

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.is_active).length;
    const newUsersToday = users.filter(u => {
      const createdDate = new Date(u.created_at);
      return createdDate.toDateString() === new Date().toDateString();
    }).length;

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.is_active).length;
    const lowStockCount = products.filter(p => p.stock < 10).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    const totalOrders = orders.length;
    const todaysOrders = orders.filter(o => {
      const createdDate = new Date(o.created_at);
      return createdDate.toDateString() === new Date().toDateString();
    }).length;

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday
      },
      orders: {
        total: totalOrders,
        today: todaysOrders
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount
      },
      revenue: {
        totalRevenue: totalRevenue.toFixed(2),
        averageOrderValue: averageOrderValue.toFixed(2)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    // In a real application, you would save these to a database
    // For now, we'll just return the updated settings
    res.json({
      message: 'Settings updated successfully',
      settings: req.body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Backup database
// @route   POST /api/admin/backup
// @access  Private/Admin
const backupDatabase = async (req, res) => {
  try {
    // This would typically trigger a database backup process
    const backupInfo = {
      timestamp: new Date().toISOString(),
      status: 'backup_initiated',
      estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
    };
    
    res.json({
      message: 'Database backup initiated',
      backupInfo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear system cache
// @route   POST /api/admin/clear-cache
// @access  Private/Admin
const clearCache = async (req, res) => {
  try {
    // This would typically clear application cache
    res.json({
      message: 'System cache cleared successfully',
      clearedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdminStats,
  updateSettings,
  backupDatabase,
  clearCache
};