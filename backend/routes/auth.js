const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, admin, getUsers);
router.post('/test-email', protect, admin, testEmail);

module.exports = router;