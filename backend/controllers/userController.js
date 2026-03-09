const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all users with stats
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      search
    } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const users = await User.findAll(limitNum, (pageNum - 1) * limitNum);
    
    // Filter by role or status if needed
    let filteredUsers = users;
    
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.role === role);
    }

    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.is_active === (status === 'active'));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.username?.toLowerCase().includes(searchLower) || 
        u.email?.toLowerCase().includes(searchLower) ||
        u.neural_implant_id?.toLowerCase().includes(searchLower)
      );
    }

    const total = await User.count();

    res.json({
      users: filteredUsers,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Order.findByUserId(user.id, { limit: 10 });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      neuralImplantId: user.neural_implant_id,
      biometricEnabled: user.biometric_enabled,
      neuralAuthEnabled: user.neural_auth_enabled,
      balance: user.balance,
      isActive: user.is_active,
      recentOrders: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent updating password through this route
    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData.id;

    const updatedUser = await User.update(req.params.id, updateData);
    
    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      neuralImplantId: updatedUser.neural_implant_id,
      biometricEnabled: updatedUser.biometric_enabled,
      neuralAuthEnabled: updatedUser.neural_auth_enabled,
      balance: updatedUser.balance,
      isActive: updatedUser.is_active
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res.status(500).json({ message: 'Failed to delete user' });
    }

    res.json({ message: `User "${user.username}" deleted successfully` });
  } catch (error) {
    console.error('[DELETE USER]', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats/overview
// @access  Private/Admin
const getUserStatsController = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const users = await User.findAll(999999, 0);
    const activeUsers = users.filter(u => u.is_active).length;
    const today = new Date();
    const newUsersToday = users.filter(u => {
      const createdDate = new Date(u.created_at);
      return createdDate.toDateString() === today.toDateString();
    }).length;

    res.json({
      totalUsers,
      activeUsers,
      newUsersToday
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats: getUserStatsController
};