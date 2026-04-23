// backend/routes/taxRoutes.js
const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');
const { protect, admin } = require('../middleware/auth');
const auditLog = require('../middleware/auditLog');

/**
 * جميع المسارات محمية بالمصادقة والإدمن فقط
 * فقط المسؤولون يمكنهم الوصول إلى نظام الضرائب والفائدة
 */

// حساب الضرائب والفائدة - إدمن فقط
router.post(
  '/calculate',
  protect,
  admin,
  auditLog('حساب الضرائب والفائدة'),
  taxController.calculateTaxAndInterest
);

// حساب سعر البيع بناءً على الربح المطلوب - إدمن فقط
router.post(
  '/calculate-selling-price',
  protect,
  admin,
  auditLog('حساب سعر البيع'),
  taxController.calculateSellingPrice
);

// حساب بناءً على نسبة الهامش - إدمن فقط
router.post(
  '/calculate-by-margin',
  protect,
  admin,
  auditLog('حساب بناءً على الهامش'),
  taxController.calculateByMargin
);

// حساب مجموعة من المنتجات - إدمن فقط
router.post(
  '/calculate-batch',
  protect,
  admin,
  auditLog('حساب جماعي للمنتجات'),
  taxController.calculateBatch
);

// تقرير المقارنة - إدمن فقط
router.get(
  '/comparison-report',
  protect,
  admin,
  auditLog('الحصول على تقرير المقارنة'),
  taxController.getComparisonReport
);

// الحصول على ملخص الضرائب والفائدة - إدمن فقط
router.get(
  '/summary',
  protect,
  admin,
  auditLog('الحصول على ملخص الضرائب والفائدة'),
  taxController.getTaxSummary
);

// الحصول على تقرير تفصيلي - إدمن فقط
router.get(
  '/report',
  protect,
  admin,
  auditLog('الحصول على التقرير التفصيلي'),
  taxController.getTaxReport
);

// حفظ سجل الضرائب والفائدة - إدمن فقط
router.post(
  '/record',
  protect,
  admin,
  auditLog('حفظ سجل الضرائب والفائدة'),
  taxController.saveTaxRecord
);

// الحصول على سجل محدد - إدمن فقط
router.get(
  '/record/:id',
  protect,
  admin,
  auditLog('الحصول على سجل محدد'),
  taxController.getTaxRecord
);

// الحصول على سجلات الطلب - إدمن فقط
router.get(
  '/order/:orderId',
  protect,
  admin,
  auditLog('الحصول على سجلات الطلب'),
  taxController.getOrderTaxRecords
);

module.exports = router;
