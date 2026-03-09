const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail, sendTestEmail } = require('../config/email');

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

    // Generate email verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await User.update(user.id, {
      emailVerifyToken: verifyToken,
      emailVerifyExpires: verifyExpires
    });

    // Send verification email (non-blocking)
    sendVerificationEmail(user.email, user.username, verifyToken).catch(err =>
      console.error('[EMAIL] Failed to send verification email:', err.message)
    );

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      neuralImplantId: user.neuralImplantId,
      emailVerified: false,
      message: 'Account created! Please check your email to verify your account before logging in.'
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

    // Require email verification (skip for admins)
    if (!user.is_email_verified && user.role !== 'admin') {
      return res.status(403).json({
        message: 'Please verify your email address before logging in. Check your inbox.',
        emailNotVerified: true
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

// @desc    Verify email address
// @route   GET /api/auth/verify-email?token=...
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    const user = await User.findByEmailVerifyToken(token);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    // Already verified (e.g. React StrictMode double-call) — return success
    if (user.is_email_verified) {
      return res.json({ message: 'Email verified successfully! You can now log in.' });
    }

    // Check expiry
    if (new Date() > new Date(user.email_verify_expires)) {
      return res.status(400).json({ message: 'Verification link has expired. Please request a new one.' });
    }

    // Mark as verified — keep token so duplicate calls still find the user
    await User.update(user.id, {
      isEmailVerified: true
    });

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'If that email exists, a verification link has been sent.' });
    }

    if (user.is_email_verified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await User.update(user.id, { emailVerifyToken: verifyToken, emailVerifyExpires: verifyExpires });
    sendVerificationEmail(user.email, user.username, verifyToken).catch(err =>
      console.error('[EMAIL] resend failed:', err.message)
    );

    res.json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findByEmail(email);
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If that email exists, a password reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await User.update(user.id, { resetPasswordToken: resetToken, resetPasswordExpires: resetExpires });

    sendPasswordResetEmail(user.email, user.username, resetToken).catch(err =>
      console.error('[EMAIL] reset email failed:', err.message)
    );

    res.json({ message: 'If that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and new password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link. Please request a new one.' });
    }

    await User.update(user.id, {
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({ message: 'Password reset successful! You can now log in with your new password.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Test email configuration (Admin only)
// @route   POST /api/auth/test-email
// @access  Private/Admin
const testEmail = async (req, res) => {
  try {
    const { to } = req.body;
    if (!to) return res.status(400).json({ message: 'Recipient email (to) is required' });

    const info = await sendTestEmail(to);
    res.json({
      success: true,
      message: `Test email sent successfully to ${to}`,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('[TEST EMAIL]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
      code: error.code,
      smtpResponse: error.response,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getUsers,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  testEmail
};