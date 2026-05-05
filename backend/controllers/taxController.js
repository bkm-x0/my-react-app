// backend/controllers/taxController.js
const TaxAndInterest = require('../models/TaxAndInterest');
const SupplierPrice = require('../models/SupplierPrice');
const Order = require('../models/Order');
const TaxCalculator = require('../utils/taxCalculator');

exports.calculateTaxAndInterest = async (req, res) => {
  try {
    const {
      costPrice,
      sellingPrice,
      quantity = 1,
      taxRate = 15,
      interestRate = 5
    } = req.body;

    console.log('[TAX-CALC] Input:', { taxRate, interestRate });

    if (!costPrice || !sellingPrice) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير سعر الشراء وسعر البيع'
      });
    }

    // Convert percentages to decimals (15 → 0.15, 5 → 0.05)
    const taxRateDecimal = parseFloat(taxRate) / 100;
    const interestRateDecimal = parseFloat(interestRate) / 100;

    console.log('[TAX-CALC] Converted:', { taxRateDecimal, interestRateDecimal });

    const result = TaxCalculator.calculateTaxAndInterest(
      parseFloat(costPrice),
      parseFloat(sellingPrice),
      parseInt(quantity),
      taxRateDecimal,
      interestRateDecimal
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حساب الضرائب والفائدة',
      error: error.message
    });
  }
};

exports.calculateSellingPrice = async (req, res) => {
  try {
    const {
      costPrice,
      desiredProfit,
      taxRate = 15,
      interestRate = 5
    } = req.body;

    if (!costPrice || !desiredProfit) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير سعر الشراء والربح المطلوب'
      });
    }

    // Convert percentages to decimals
    const taxRateDecimal = parseFloat(taxRate) / 100;
    const interestRateDecimal = parseFloat(interestRate) / 100;

    const sellingPrice = TaxCalculator.calculateSellingPrice(
      parseFloat(costPrice),
      parseFloat(desiredProfit),
      taxRateDecimal,
      interestRateDecimal
    );

    res.json({
      success: true,
      data: {
        costPrice: parseFloat(costPrice),
        desiredProfit: parseFloat(desiredProfit),
        sellingPrice,
        message: `سعر البيع المطلوب هو ${sellingPrice}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حساب سعر البيع',
      error: error.message
    });
  }
};

exports.calculateByMargin = async (req, res) => {
  try {
    const {
      costPrice,
      profitMarginPercent,
      taxRate = 15,
      interestRate = 5
    } = req.body;

    if (!costPrice || !profitMarginPercent) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير سعر الشراء ونسبة الهامش'
      });
    }

    // Convert percentages to decimals
    const taxRateDecimal = parseFloat(taxRate) / 100;
    const interestRateDecimal = parseFloat(interestRate) / 100;

    const result = TaxCalculator.calculateByMargin(
      parseFloat(costPrice),
      parseFloat(profitMarginPercent),
      taxRateDecimal,
      interestRateDecimal
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حساب الهامش',
      error: error.message
    });
  }
};

exports.calculateBatch = async (req, res) => {
  try {
    const {
      items,
      taxRate = 15,
      interestRate = 5
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير قائمة بالمنتجات'
      });
    }

    // Convert percentages to decimals
    const taxRateDecimal = parseFloat(taxRate) / 100;
    const interestRateDecimal = parseFloat(interestRate) / 100;

    const result = TaxCalculator.calculateBatch(
      items,
      taxRateDecimal,
      interestRateDecimal
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حساب المجموعة',
      error: error.message
    });
  }
};

exports.getTaxSummary = async (req, res) => {
  try {
    const { supplierId, startDate, endDate } = req.query;

    const summary = await TaxAndInterest.getSummary({
      supplierId,
      startDate,
      endDate
    });

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الحصول على الملخص',
      error: error.message
    });
  }
};

exports.getTaxReport = async (req, res) => {
  try {
    const {
      supplierId,
      startDate,
      endDate,
      limit = 100,
      offset = 0
    } = req.query;

    const report = await TaxAndInterest.getDetailedReport({
      supplierId,
      startDate,
      endDate,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الحصول على التقرير',
      error: error.message
    });
  }
};

exports.saveTaxRecord = async (req, res) => {
  try {
    const {
      orderId,
      supplierId,
      costPrice,
      sellingPrice,
      quantity,
      taxRate = 15,
      interestRate = 5,
      notes
    } = req.body;

    if (!orderId || !supplierId) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير معرف الطلب ومعرف المورد'
      });
    }

    // Convert percentages to decimals
    const taxRateDecimal = parseFloat(taxRate) / 100;
    const interestRateDecimal = parseFloat(interestRate) / 100;

    const calculations = TaxCalculator.calculateTaxAndInterest(
      parseFloat(costPrice),
      parseFloat(sellingPrice),
      parseInt(quantity),
      taxRateDecimal,
      interestRateDecimal
    );

    const taxRecord = await TaxAndInterest.create({
      orderId,
      supplierId,
      costPrice: calculations.costPrice,
      sellingPrice: calculations.sellingPrice,
      quantity: calculations.quantity,
      costTotal: calculations.costTotal,
      sellingTotal: calculations.sellingTotal,
      profit: calculations.profit,
      taxRate: parseFloat(taxRate),
      taxAmount: calculations.taxAmount,
      interestRate: parseFloat(interestRate),
      interestAmount: calculations.interestAmount,
      totalCharges: calculations.totalCharges,
      notes
    });

    res.json({
      success: true,
      data: {
        record: taxRecord,
        calculations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حفظ سجل الضرائب',
      error: error.message
    });
  }
};

exports.getTaxRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await TaxAndInterest.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على السجل'
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الحصول على السجل',
      error: error.message
    });
  }
};

exports.getOrderTaxRecords = async (req, res) => {
  try {
    const { orderId } = req.params;

    const records = await TaxAndInterest.getByOrderId(orderId);

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الحصول على سجلات الطلب',
      error: error.message
    });
  }
};

exports.getComparisonReport = async (req, res) => {
  try {
    const { costPrice, quantity = 1 } = req.query;

    if (!costPrice) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير سعر الشراء'
      });
    }

    const comparison = TaxCalculator.generateComparisonReport(
      parseFloat(costPrice),
      parseInt(quantity)
    );

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إنشاء تقرير المقارنة',
      error: error.message
    });
  }
};
