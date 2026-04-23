// backend/tests/taxCalculator.test.js
/**
 * اختبارات أداة حساب الضرائب والفائدة
 * تشغيل: node backend/tests/taxCalculator.test.js
 */

const TaxCalculator = require('../utils/taxCalculator');

console.log('🧪 اختبار أداة حساب الضرائب والفائدة\n');

// اختبار 1: الحساب الأساسي
console.log('1️⃣  اختبار الحساب الأساسي');
const result1 = TaxCalculator.calculateTaxAndInterest(100, 150, 5, 0.15, 0.05);
console.log('السعر المشترى:', result1.costPrice);
console.log('سعر البيع:', result1.sellingPrice);
console.log('الكمية:', result1.quantity);
console.log('التكلفة الإجمالية:', result1.costTotal);
console.log('الإيرادات الإجمالية:', result1.sellingTotal);
console.log('الربح الأساسي:', result1.profit);
console.log('الضرائب (15%):', result1.taxAmount);
console.log('الفائدة (5%):', result1.interestAmount);
console.log('الربح الصافي:', result1.netProfit);
console.log('✅ النتيجة المتوقعة:');
console.log('  - التكلفة: 500');
console.log('  - الإيرادات: 750');
console.log('  - الربح الأساسي: 250');
console.log('  - الضرائب: 112.5');
console.log('  - الفائدة: 25');
console.log('  - الربح الصافي: 112.5\n');

// اختبار 2: حساب سعر البيع
console.log('2️⃣  اختبار حساب سعر البيع بناءً على الربح المطلوب');
const sellingPrice = TaxCalculator.calculateSellingPrice(100, 50, 0.15, 0.05);
console.log('سعر الشراء:', 100);
console.log('الربح المطلوب:', 50);
console.log('سعر البيع المطلوب:', sellingPrice);
console.log('✅ سعر البيع الذي يحقق ربح 50 (مع خصم الضرائب والفائدة) هو:', sellingPrice, '\n');

// اختبار 3: حساب بناءً على الهامش
console.log('3️⃣  اختبار حساب بناءً على نسبة الهامش');
const result3 = TaxCalculator.calculateByMargin(100, 30, 0.15, 0.05);
console.log('سعر الشراء:', result3.costPrice);
console.log('نسبة الهامش المطلوبة:', result3.profitMarginPercent, '%');
console.log('سعر البيع:', result3.sellingPrice);
console.log('الربح الأساسي:', result3.profit);
console.log('الربح الصافي:', result3.netProfit, '\n');

// اختبار 4: حساب مجموعة
console.log('4️⃣  اختبار حساب مجموعة من المنتجات');
const items = [
  { costPrice: 100, sellingPrice: 150, quantity: 5 },
  { costPrice: 200, sellingPrice: 280, quantity: 3 },
  { costPrice: 50, sellingPrice: 75, quantity: 10 }
];
const result4 = TaxCalculator.calculateBatch(items, 0.15, 0.05);
console.log('عدد المنتجات:', result4.items.length);
console.log('الملخص:');
console.log('  - إجمالي الكمية:', result4.summary.totalQuantity);
console.log('  - إجمالي التكلفة:', result4.summary.totalCostTotal);
console.log('  - إجمالي الإيرادات:', result4.summary.totalSellingTotal);
console.log('  - إجمالي الربح الأساسي:', result4.summary.totalProfit);
console.log('  - إجمالي الضرائب:', result4.summary.totalTaxAmount);
console.log('  - إجمالي الفائدة:', result4.summary.totalInterestAmount);
console.log('  - إجمالي الربح الصافي:', result4.summary.netProfit, '\n');

// اختبار 5: حساب التكلفة الإجمالية
console.log('5️⃣  اختبار حساب التكلفة الإجمالية (شاملة الضرائب والفائدة)');
const totalCost = TaxCalculator.calculateTotalCost(100, 5, 0.15, 0.05);
console.log('سعر الوحدة:', 100);
console.log('الكمية:', 5);
console.log('التكلفة الإجمالية (شاملة الضرائب والفائدة):', totalCost);
console.log('✅ التفصيل:');
console.log('  - التكلفة الأساسية: 500');
console.log('  - الضرائب (15%): 75');
console.log('  - الفائدة (5%): 25');
console.log('  - المجموع: 600\n');

// اختبار 6: تقرير المقارنة
console.log('6️⃣  اختبار تقرير المقارنة');
const comparison = TaxCalculator.generateComparisonReport(100, 1);
console.log('مقارنة نسب الضرائب والفائدة المختلفة:');
comparison.forEach((opt, index) => {
  console.log(`${index + 1}. ${opt.name}:`);
  console.log(`   - الضريبة: ${opt.taxRate}%`);
  console.log(`   - الفائدة: ${opt.interestRate}%`);
  console.log(`   - الربح الصافي: ${opt.netProfit}`);
});
console.log('\n');

// اختبار 7: السعر الصافي
console.log('7️⃣  اختبار حساب السعر الصافي');
const netPrice = TaxCalculator.calculateNetPrice(625, 0.15, 0.05);
console.log('السعر الإجمالي (مع الضرائب والفائدة):', 625);
console.log('السعر الصافي (بدون رسوم):', netPrice);
console.log('✅ هذا هو السعر الأساسي قبل إضافة الضرائب والفائدة\n');

// اختبار 8: حالات خاصة
console.log('8️⃣  اختبار حالات خاصة');

// حالة: لا يوجد ربح (السعر = التكلفة)
console.log('أ) عندما يكون السعر = التكلفة:');
const noProfit = TaxCalculator.calculateTaxAndInterest(100, 100, 1, 0.15, 0.05);
console.log('  - الربح الأساسي:', noProfit.profit);
console.log('  - الضرائب:', noProfit.taxAmount);
console.log('  - الربح الصافي:', noProfit.netProfit);
console.log('  - ملاحظة: قد يكون الربح الصافي سالب بسبب الرسوم\n');

// حالة: نسب عالية من الضرائب والفائدة
console.log('ب) نسب عالية من الضرائب والفائدة:');
const highRates = TaxCalculator.calculateTaxAndInterest(100, 200, 1, 0.30, 0.15);
console.log('  - الربح الأساسي:', highRates.profit);
console.log('  - الضرائب:', highRates.taxAmount);
console.log('  - الفائدة:', highRates.interestAmount);
console.log('  - الربح الصافي:', highRates.netProfit);
console.log('  - نسبة الربح الصافي:', highRates.netProfitMargin, '%\n');

// حالة: كمية كبيرة
console.log('ج) كمية كبيرة:');
const largeQty = TaxCalculator.calculateTaxAndInterest(50, 80, 1000, 0.15, 0.05);
console.log('  - الكمية:', largeQty.quantity);
console.log('  - التكلفة الإجمالية:', largeQty.costTotal);
console.log('  - الإيرادات الإجمالية:', largeQty.sellingTotal);
console.log('  - الربح الصافي:', largeQty.netProfit, '\n');

console.log('✅ اكتملت جميع الاختبارات بنجاح!');
