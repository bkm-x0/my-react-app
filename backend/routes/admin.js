const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  updateSettings,
  backupDatabase,
  clearCache
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, getAdminStats);
router.put('/settings', protect, admin, updateSettings);
router.post('/backup', protect, admin, backupDatabase);
router.post('/clear-cache', protect, admin, clearCache);

module.exports = router;