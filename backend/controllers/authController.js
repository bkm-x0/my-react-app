const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password, neuralImplantId } = req.body;

    // Check if user exists
    const emailExists = await User.findByEmail(email);
    const usernameExists = await User.findByUsername(username);

    if (emailExists || usernameExists) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      neuralImplantId: neuralImplantId || ''
    });

    // Create token
    const token = generateToken(user.id);

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      neuralImplantId: user.neuralImplantId,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordMatch = await User.comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    await User.update(user.id, { lastLogin: new Date() });

    // Create token
    const token = generateToken(user.id);

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      neuralImplantId: user.neuralImplantId,
      biometricEnabled: user.biometric_enabled,
      neuralAuthEnabled: user.neural_auth_enabled,
      balance: user.balance,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        neuralImplantId: user.neural_implant_id,
        biometricEnabled: user.biometric_enabled,
        neuralAuthEnabled: user.neural_auth_enabled,
        balance: user.balance,
        isActive: user.is_active
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      const updateData = {};
      if (req.body.username) updateData.username = req.body.username;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.neuralImplantId) updateData.neuralImplantId = req.body.neuralImplantId;
      if (req.body.biometricEnabled !== undefined) updateData.biometricEnabled = req.body.biometricEnabled;
      if (req.body.neuralAuthEnabled !== undefined) updateData.neuralAuthEnabled = req.body.neuralAuthEnabled;
      if (req.body.password) updateData.password = req.body.password;

      const updatedUser = await User.update(req.user.id, updateData);

      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        neuralImplantId: updatedUser.neural_implant_id,
        biometricEnabled: updatedUser.biometric_enabled,
        neuralAuthEnabled: updatedUser.neural_auth_enabled,
        role: updatedUser.role,
        token: generateToken(updatedUser.id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll(100, 0);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getUsers
};