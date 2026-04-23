// backend/utils/orderTaxHelper.js
/**
 * دالات مساعدة لربط الطلبات مع نظام الضرائب والفائدة
 */

const TaxCalculator = require('./taxCalculator');
const TaxAndInterest = require('../models/TaxAndInterest');
const SupplierPrice = require('../models/SupplierPrice');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

class OrderTaxHelper {
  /**
   * حساب الضرائب والفائدة لطلب كامل
   * @param {number} orderId - معرف الطلب
   * @param {number} supplierId - معرف المورد
   * @param {Array} items - عناصر الطلب
   * @param {Object} taxConfig - إعدادات الضرائب والفائدة
   */
  static async calculateOrderTax(orderId, supplierId, items, taxConfig = {}) {
    const {
      taxRate = 0.15,
      interestRate = 0.05,
      saveToDB = true
    } = taxConfig;

    let totalTaxes = 0;
    let totalInterests = 0;
    let totalCharges = 0;
    let totalProfit = 0;
    const records = [];

    for (const item of items) {
      // محاولة الحصول على سعر الشراء من المورد
      let costPrice = item.costPrice;

      if (!costPrice && supplierId && item.productId) {
        const supplierPrice = await SupplierPrice.getBestPrice(
          item.productId,
          supplierId,
          item.quantity
        );
        costPrice = supplierPrice?.cost_price || item.price * 0.7; // افتراض 30% هامش
      }

      const calculation = TaxCalculator.calculateTaxAndInterest(
        costPrice,
        item.price,
        item.quantity,
        taxRate,
        interestRate
      );

      totalTaxes += calculation.taxAmount;
      totalInterests += calculation.interestAmount;
      totalCharges += calculation.totalCharges;
      totalProfit += calculation.profit;

      if (saveToDB) {
        const record = await TaxAndInterest.create({
          orderId,
          supplierId,
          costPrice: calculation.costPrice,
          sellingPrice: calculation.sellingPrice,
          quantity: calculation.quantity,
          costTotal: calculation.costTotal,
          sellingTotal: calculation.sellingTotal,
          profit: calculation.profit,
          taxRate,
          taxAmount: calculation.taxAmount,
          interestRate,
          interestAmount: calculation.interestAmount,
          totalCharges: calculation.totalCharges,
          notes: `عنصر الطلب: ${item.name}`
        });
        records.push(record);
      }
    }

    return {
      orderId,
      supplierId,
      totalTaxes: Math.round(totalTaxes * 100) / 100,
      totalInterests: Math.round(totalInterests * 100) / 100,
      totalCharges: Math.round(totalCharges * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      itemCount: items.length,
      records: saveToDB ? records : null
    };
  }

  /**
   * تحديث طلب مع معلومات الضرائب والفائدة
   */
  static async updateOrderWithTax(orderId, taxData, connection = null) {
    try {
      const Order = require('../models/Order');

      // يمكن إضافة عمود tax_amount و interest_amount في جدول orders
      // ثم تحديثهم هنا
      // await Order.update(orderId, {
      //   taxAmount: taxData.totalTaxes,
      //   interestAmount: taxData.totalInterests
      // });

      return {
        success: true,
        orderId,
        ...taxData
      };
    } catch (error) {
      throw new Error(`فشل تحديث الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على تقرير الضرائب والفائدة لفترة معينة
   */
  static async getPeriodTaxReport(startDate, endDate, supplierId = null) {
    const options = {
      startDate,
      endDate
    };

    if (supplierId) {
      options.supplierId = supplierId;
    }

    const summary = await TaxAndInterest.getSummary(options);
    const details = await TaxAndInterest.getDetailedReport(options);

    return {
      period: {
        startDate,
        endDate
      },
      summary,
      details,
      averagePerTransaction: details.length > 0
        ? Math.round((summary.total_taxes / details.length) * 100) / 100
        : 0
    };
  }

  /**
   * مقارنة الأرباح قبل وبعد الضرائب والفائدة
   */
  static async compareProfits(orderId) {
    const order = await Order.findById(orderId);
    const taxRecords = await TaxAndInterest.getByOrderId(orderId);

    let grossProfit = 0;
    let totalTaxes = 0;
    let totalInterests = 0;

    for (const record of taxRecords) {
      grossProfit += record.profit;
      totalTaxes += record.tax_amount;
      totalInterests += record.interest_amount;
    }

    const netProfit = grossProfit - totalTaxes - totalInterests;
    const profitMarginBefore = (grossProfit / order.total_amount) * 100;
    const profitMarginAfter = (netProfit / order.total_amount) * 100;

    return {
      orderId,
      grossProfit: Math.round(grossProfit * 100) / 100,
      totalTaxes: Math.round(totalTaxes * 100) / 100,
      totalInterests: Math.round(totalInterests * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      profitMarginBefore: Math.round(profitMarginBefore * 100) / 100,
      profitMarginAfter: Math.round(profitMarginAfter * 100) / 100,
      loss: netProfit < 0 ? Math.round(Math.abs(netProfit) * 100) / 100 : 0
    };
  }

  /**
   * إنشاء invoices مع معلومات الضرائب والفائدة
   */
  static async generateInvoiceWithTax(orderId) {
    const order = await Order.findById(orderId);
    const taxRecords = await TaxAndInterest.getByOrderId(orderId);

    let subtotal = 0;
    let totalTaxes = 0;
    let totalInterests = 0;
    const lineItems = [];

    for (const record of taxRecords) {
      subtotal += record.selling_total;
      totalTaxes += record.tax_amount;
      totalInterests += record.interest_amount;

      lineItems.push({
        costPrice: record.cost_price,
        sellingPrice: record.selling_price,
        quantity: record.quantity,
        subtotal: record.selling_total,
        tax: record.tax_amount,
        interest: record.interest_amount,
        total: record.selling_total + record.tax_amount + record.interest_amount
      });
    }

    const totalCharges = totalTaxes + totalInterests;
    const grandTotal = subtotal + totalCharges;

    return {
      orderId,
      date: new Date(),
      customer: {
        id: order.user_id,
        username: order.user_username,
        email: order.user_email
      },
      lineItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxes: Math.round(totalTaxes * 100) / 100,
      interests: Math.round(totalInterests * 100) / 100,
      totalCharges: Math.round(totalCharges * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
      note: 'هذا الفاتورة تتضمن الضرائب والفائدة'
    };
  }

  /**
   * تقرير الربحية حسب المورد
   */
  static async getProfitabilityBySupplier(startDate, endDate) {
    const report = await TaxAndInterest.getDetailedReport({
      startDate,
      endDate,
      limit: 10000
    });

    // تجميع البيانات حسب المورد
    const supplierStats = {};

    for (const record of report) {
      const supplierId = record.supplier_id;

      if (!supplierStats[supplierId]) {
        supplierStats[supplierId] = {
          supplierName: record.supplier_name,
          totalSales: 0,
          totalCost: 0,
          grossProfit: 0,
          totalTaxes: 0,
          totalInterests: 0,
          netProfit: 0,
          transactionCount: 0
        };
      }

      supplierStats[supplierId].totalSales += record.selling_total || 0;
      supplierStats[supplierId].totalCost += record.cost_total || 0;
      supplierStats[supplierId].grossProfit += record.profit || 0;
      supplierStats[supplierId].totalTaxes += record.tax_amount || 0;
      supplierStats[supplierId].totalInterests += record.interest_amount || 0;
      supplierStats[supplierId].netProfit += (record.profit || 0) - (record.tax_amount || 0) - (record.interest_amount || 0);
      supplierStats[supplierId].transactionCount += 1;
    }

    // تحويل إلى مصفوفة وتنسيق
    const results = Object.entries(supplierStats).map(([supplierId, stats]) => ({
      supplierId,
      ...stats,
      profitMargin: stats.totalCost > 0 ? Math.round((stats.grossProfit / stats.totalCost) * 10000) / 100 : 0,
      netProfitMargin: stats.totalCost > 0 ? Math.round((stats.netProfit / stats.totalCost) * 10000) / 100 : 0,
      averageProfit: stats.transactionCount > 0 ? Math.round((stats.netProfit / stats.transactionCount) * 100) / 100 : 0
    }));

    return {
      period: { startDate, endDate },
      suppliers: results,
      totalResults: results.length
    };
  }
}

module.exports = OrderTaxHelper;
