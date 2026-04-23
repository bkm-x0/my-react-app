// backend/utils/taxCalculator.js

/**
 * حساب الضرائب والفائدة
 * يقوم بحساب الضرائب والفائدة بناءً على فرق السعر بين سعر الشراء والبيع
 */

class TaxCalculator {
  /**
   * حساب الربح والضرائب والفائدة
   * @param {number} costPrice - سعر الشراء من المورد
   * @param {number} sellingPrice - سعر البيع للعميل
   * @param {number} quantity - الكمية
   * @param {number} taxRate - نسبة الضريبة (مثل 0.15 للـ 15%)
   * @param {number} interestRate - نسبة الفائدة (مثل 0.10 للـ 10%)
   * @returns {Object} كائن يحتوي على التفاصيل الكاملة للحساب
   */
  static calculateTaxAndInterest(
    costPrice,
    sellingPrice,
    quantity = 1,
    taxRate = 0.15,    // 15% بشكل افتراضي
    interestRate = 0.05 // 5% بشكل افتراضي
  ) {
    // حسابات الأساسيات
    const costTotal = costPrice * quantity;
    const sellingTotal = sellingPrice * quantity;
    const profit = sellingTotal - costTotal;
    const profitMargin = costTotal > 0 ? (profit / costTotal) * 100 : 0;

    // حساب الضرائب (على الربح أو على سعر البيع، حسب السياسة)
    const taxAmount = sellingTotal * taxRate;

    // حساب الفائدة (على رأس المال المستثمر أو على الربح)
    const interestAmount = costTotal * interestRate;

    // إجمالي الرسوم
    const totalCharges = taxAmount + interestAmount;

    // الربح الصافي بعد الضرائب والفائدة
    const netProfit = profit - totalCharges;

    return {
      costPrice,
      sellingPrice,
      quantity,
      costTotal: Math.round(costTotal * 100) / 100,
      sellingTotal: Math.round(sellingTotal * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      taxRate: taxRate * 100, // تحويل إلى نسبة مئوية
      taxAmount: Math.round(taxAmount * 100) / 100,
      interestRate: interestRate * 100, // تحويل إلى نسبة مئوية
      interestAmount: Math.round(interestAmount * 100) / 100,
      totalCharges: Math.round(totalCharges * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      netProfitMargin: costTotal > 0 ? Math.round((netProfit / costTotal) * 10000) / 100 : 0
    };
  }

  /**
   * حساب سعر البيع المطلوب للحصول على ربح معين بعد الضرائب والفائدة
   * @param {number} costPrice - سعر الشراء
   * @param {number} desiredProfit - الربح المطلوب
   * @param {number} taxRate - نسبة الضريبة
   * @param {number} interestRate - نسبة الفائدة
   * @returns {number} سعر البيع المطلوب
   */
  static calculateSellingPrice(
    costPrice,
    desiredProfit,
    taxRate = 0.15,
    interestRate = 0.05
  ) {
    // المعادلة: sellingPrice = (costPrice + desiredProfit + (costPrice * interestRate)) / (1 - taxRate)
    const baseCost = costPrice + (costPrice * interestRate);
    const requiredRevenue = baseCost + desiredProfit;
    const sellingPrice = requiredRevenue / (1 - taxRate);

    return Math.round(sellingPrice * 100) / 100;
  }

  /**
   * حساب الربح بناءً على نسبة الهامش المطلوبة
   * @param {number} costPrice - سعر الشراء
   * @param {number} profitMarginPercent - نسبة الهامش المطلوبة (مثل 30 للـ 30%)
   * @param {number} taxRate - نسبة الضريبة
   * @param {number} interestRate - نسبة الفائدة
   * @returns {Object} يحتوي على سعر البيع والربح
   */
  static calculateByMargin(
    costPrice,
    profitMarginPercent,
    taxRate = 0.15,
    interestRate = 0.05
  ) {
    const marginFactor = profitMarginPercent / 100;
    const interestAmount = costPrice * interestRate;
    const baseCost = costPrice + interestAmount;

    // المعادلة: Profit = (baseCost * marginFactor) / (1 + marginFactor)
    // sellingPrice = costPrice + Profit
    const sellingPrice = baseCost / (1 - marginFactor);

    const calculations = this.calculateTaxAndInterest(
      costPrice,
      sellingPrice,
      1,
      taxRate,
      interestRate
    );

    return {
      ...calculations,
      profitMarginPercent
    };
  }

  /**
   * حساب تفصيلي متعدد المنتجات
   * @param {Array} items - مصفوفة من المنتجات {costPrice, sellingPrice, quantity}
   * @param {number} taxRate - نسبة الضريبة
   * @param {number} interestRate - نسبة الفائدة
   * @returns {Object} ملخص شامل
   */
  static calculateBatch(items, taxRate = 0.15, interestRate = 0.05) {
    let totalCostPrice = 0;
    let totalCostTotal = 0;
    let totalSellingTotal = 0;
    let totalProfit = 0;
    let totalTaxAmount = 0;
    let totalInterestAmount = 0;
    let totalCharges = 0;
    let totalQuantity = 0;

    const itemsDetails = items.map(item => {
      const detail = this.calculateTaxAndInterest(
        item.costPrice,
        item.sellingPrice,
        item.quantity || 1,
        taxRate,
        interestRate
      );

      totalCostTotal += detail.costTotal;
      totalSellingTotal += detail.sellingTotal;
      totalProfit += detail.profit;
      totalTaxAmount += detail.taxAmount;
      totalInterestAmount += detail.interestAmount;
      totalCharges += detail.totalCharges;
      totalQuantity += detail.quantity;

      return detail;
    });

    const netProfit = totalProfit - totalCharges;

    return {
      items: itemsDetails,
      summary: {
        totalQuantity,
        totalCostTotal: Math.round(totalCostTotal * 100) / 100,
        totalSellingTotal: Math.round(totalSellingTotal * 100) / 100,
        totalProfit: Math.round(totalProfit * 100) / 100,
        profitMargin: totalCostTotal > 0 ? Math.round((totalProfit / totalCostTotal) * 10000) / 100 : 0,
        totalTaxAmount: Math.round(totalTaxAmount * 100) / 100,
        totalInterestAmount: Math.round(totalInterestAmount * 100) / 100,
        totalCharges: Math.round(totalCharges * 100) / 100,
        netProfit: Math.round(netProfit * 100) / 100,
        netProfitMargin: totalCostTotal > 0 ? Math.round((netProfit / totalCostTotal) * 10000) / 100 : 0,
        taxRate: taxRate * 100,
        interestRate: interestRate * 100
      }
    };
  }

  /**
   * حساب التكلفة الإجمالية للمشتري (شامل الضرائب والفائدة)
   * @param {number} costPrice - سعر الشراء الأساسي
   * @param {number} quantity - الكمية
   * @param {number} taxRate - نسبة الضريبة
   * @param {number} interestRate - نسبة الفائدة
   * @returns {number} التكلفة الإجمالية
   */
  static calculateTotalCost(costPrice, quantity = 1, taxRate = 0.15, interestRate = 0.05) {
    const baseCost = costPrice * quantity;
    const tax = baseCost * taxRate;
    const interest = baseCost * interestRate;

    return Math.round((baseCost + tax + interest) * 100) / 100;
  }

  /**
   * حساب السعر الصافي (بعد خصم الضرائب والفائدة)
   * @param {number} totalPrice - السعر الإجمالي
   * @param {number} taxRate - نسبة الضريبة
   * @param {number} interestRate - نسبة الفائدة
   * @returns {number} السعر الصافي
   */
  static calculateNetPrice(totalPrice, taxRate = 0.15, interestRate = 0.05) {
    const totalDeduction = taxRate + interestRate;
    const netPrice = totalPrice / (1 + totalDeduction);

    return Math.round(netPrice * 100) / 100;
  }

  /**
   * توليد تقرير شامل للمقارنة بين خيارات مختلفة
   * @param {number} costPrice - سعر الشراء
   * @param {number} quantity - الكمية
   * @param {Array} options - خيارات مختلفة للضرائب والفائدة
   * @returns {Array} مصفوفة بالمقارنات
   */
  static generateComparisonReport(costPrice, quantity, options = []) {
    // قيم افتراضية للخيارات
    if (options.length === 0) {
      options = [
        { taxRate: 0.1, interestRate: 0.03, name: 'منخفضة' },
        { taxRate: 0.15, interestRate: 0.05, name: 'متوسطة' },
        { taxRate: 0.2, interestRate: 0.07, name: 'مرتفعة' }
      ];
    }

    return options.map(option => {
      const details = this.calculateTaxAndInterest(
        costPrice,
        costPrice * 1.5, // افتراض هامش 50%
        quantity,
        option.taxRate,
        option.interestRate
      );

      return {
        name: option.name,
        ...details
      };
    });
  }
}

module.exports = TaxCalculator;
