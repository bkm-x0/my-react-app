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

    const users = await User.findAll(Number(limit), (Number(page) - 1) * Number(limit));
    
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
      page: Number(page),
      pages: Math.ceil(total / limit),
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
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Soft delete
    await User.update(req.params.id, { isActive: false });

    res.json({ message: 'User deactivated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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