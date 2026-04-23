## نظام حساب الضرائب والفائدة ✅

تم إضافة نظام شامل ومتكامل لحساب الضرائب والفائدة على المبيعات بناءً على فرق السعر بين:
- **سعر الشراء من المورد** (التكلفة)
- **سعر البيع للعميل** (الإيراد)

---

## 🎯 الملفات المضافة

### Backend

#### النماذج (Models)
- `backend/models/SupplierPrice.js` - لتتبع أسعار الموردين
- `backend/models/TaxAndInterest.js` - لتسجيل الضرائب والفائدة

#### الأدوات (Utilities)
- `backend/utils/taxCalculator.js` - حسابات الضرائب والفائدة الأساسية
- `backend/utils/orderTaxHelper.js` - وظائف مساعدة لربط الطلبات

#### التحكم والمسارات
- `backend/controllers/taxController.js` - معالجات API
- `backend/routes/taxRoutes.js` - مسارات API
- `backend/migrate-tax-system.js` - ملف الهجرة لإنشاء الجداول

#### الاختبارات
- `backend/tests/taxCalculator.test.js` - اختبارات شاملة

### Frontend
- `frontend/src/components/TaxCalculator.jsx` - مكون React لحساب الضرائب والفائدة

### التوثيق
- `TAX_SYSTEM_DOCUMENTATION.md` - دليل مفصل

---

## 🚀 البدء السريع

### 1. تشغيل الهجرة (إنشاء الجداول)
```bash
node backend/migrate-tax-system.js
```

### 2. تشغيل الاختبارات
```bash
node backend/tests/taxCalculator.test.js
```

### 3. استخدام API

#### مثال 1: حساب الضرائب والفائدة
```bash
curl -X POST http://localhost:5000/api/tax/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "costPrice": 100,
    "sellingPrice": 150,
    "quantity": 5,
    "taxRate": 0.15,
    "interestRate": 0.05
  }'
```

**النتيجة:**
```json
{
  "success": true,
  "data": {
    "costPrice": 100,
    "sellingPrice": 150,
    "quantity": 5,
    "costTotal": 500,
    "sellingTotal": 750,
    "profit": 250,
    "profitMargin": 50,
    "taxRate": 15,
    "taxAmount": 112.5,
    "interestRate": 5,
    "interestAmount": 25,
    "totalCharges": 137.5,
    "netProfit": 112.5,
    "netProfitMargin": 22.5
  }
}
```

---

## 💡 أمثلة الاستخدام

### في Node.js
```javascript
const TaxCalculator = require('./utils/taxCalculator');

// حساب بسيط
const result = TaxCalculator.calculateTaxAndInterest(
  100,   // سعر الشراء
  150,   // سعر البيع
  5,     // الكمية
  0.15,  // نسبة الضريبة (15%)
  0.05   // نسبة الفائدة (5%)
);

console.log(`الربح الصافي: ${result.netProfit}`); // 112.5
```

### في React
```javascript
import TaxCalculator from './components/TaxCalculator';

function App() {
  return <TaxCalculator />;
}
```

### في جاف سكريبت العادي
```javascript
// استدعاء API مباشرة
fetch('/api/tax/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    costPrice: 100,
    sellingPrice: 150,
    quantity: 5,
    taxRate: 0.15,
    interestRate: 0.05
  })
})
.then(res => res.json())
.then(data => console.log(data.data));
```

---

## 📊 الحسابات المدعومة

### 1. الحساب الأساسي
```
POST /api/tax/calculate
```
حساب الضرائب والفائدة والربح الصافي

### 2. حساب سعر البيع
```
POST /api/tax/calculate-selling-price
```
حساب سعر البيع المطلوب للحصول على ربح معين

### 3. حساب بناءً على الهامش
```
POST /api/tax/calculate-by-margin
```
حساب السعر بناءً على نسبة هامش مطلوبة

### 4. حساب جماعي
```
POST /api/tax/calculate-batch
```
حساب مجموعة من المنتجات دفعة واحدة

### 5. التقارير
```
GET /api/tax/summary
GET /api/tax/report
GET /api/tax/comparison-report
```

---

## 📈 حالات الاستخدام

### حالة 1: البائع يشتري بسعر مختلف
```javascript
// البائع يشتري من المورد بـ 100
// يبيع للعميل بـ 150
// عليه دفع ضريبة 15% وفائدة 5%

const result = TaxCalculator.calculateTaxAndInterest(100, 150, 1, 0.15, 0.05);

console.log(`الربح الأساسي: 50`);           // 150 - 100
console.log(`الضريبة: 22.5`);              // 150 * 0.15
console.log(`الفائدة: 5`);                 // 100 * 0.05
console.log(`الربح الصافي: 22.5`);         // 50 - 22.5 - 5
```

### حالة 2: حساب سعر البيع المطلوب
```javascript
// البائع يريد ربح صافي 50
// ما هو سعر البيع المطلوب؟

const sellingPrice = TaxCalculator.calculateSellingPrice(
  100,   // سعر الشراء
  50,    // الربح المطلوب
  0.15,  // ضريبة 15%
  0.05   // فائدة 5%
);

console.log(`سعر البيع: ${sellingPrice}`); // حوالي 182.35
```

### حالة 3: مجموعة من المنتجات
```javascript
// حساب متعدد المنتجات
const items = [
  { costPrice: 100, sellingPrice: 150, quantity: 5 },
  { costPrice: 200, sellingPrice: 280, quantity: 3 },
  { costPrice: 50, sellingPrice: 75, quantity: 10 }
];

const result = TaxCalculator.calculateBatch(items, 0.15, 0.05);

console.log(`إجمالي الربح الصافي: ${result.summary.netProfit}`);
console.log(`إجمالي الضرائب: ${result.summary.totalTaxAmount}`);
```

---

## 🗄️ جداول قاعدة البيانات

### supplier_prices
```sql
- id: معرف فريد
- product_id: معرف المنتج
- supplier_id: معرف المورد
- cost_price: سعر التكلفة
- quantity_min/max: نطاق الكمية
- validity_start/end: فترة الصلاحية
```

### taxes_interests
```sql
- id: معرف فريد
- order_id: معرف الطلب
- supplier_id: معرف المورد
- cost_price: سعر الشراء
- selling_price: سعر البيع
- tax_amount: مبلغ الضريبة
- interest_amount: مبلغ الفائدة
```

---

## 🔧 الإعدادات الافتراضية

- **نسبة الضريبة الافتراضية**: 15%
- **نسبة الفائدة الافتراضية**: 5%
- **العملة الافتراضية**: USD
- **الدقة العددية**: منزلتان عشريتان

---

## ✅ النتائج المتوقعة

```
مثال: شراء بـ 100 وبيع بـ 150 كمية 5

التكلفة الإجمالية:     500
الإيرادات الإجمالية:   750
الربح الأساسي:         250

الضريبة (15%):         112.50
الفائدة (5%):          25.00
إجمالي الرسوم:         137.50

الربح الصافي:          112.50
```

---

## 📱 الواجهة الأمامية

المكون `TaxCalculator.jsx` يوفر:
- ✅ واجهة سهلة الاستخدام
- ✅ حسابات فورية
- ✅ عرض تفصيلي للنتائج
- ✅ خيارات حساب متعددة

---

## 🐛 استكشاف الأخطاء

### خطأ: "جدول supplier_prices غير موجود"
**الحل**: قم بتشغيل `node backend/migrate-tax-system.js`

### خطأ: "قيم غير صالحة"
**الحل**: تأكد من إدخال أرقام صحيحة موجبة

### خطأ: "الضرائب والفائدة ليست مسجلة"
**الحل**: تأكد من أن المسارات في `server.js` تم تحديثها

---

## 📞 المساعدة والدعم

- اقرأ `TAX_SYSTEM_DOCUMENTATION.md` للتفاصيل الكاملة
- قم بتشغيل الاختبارات لفهم كل دالة
- استخدم أمثلة الـ API للاختبار السريع

---

## 🎉 تم الانتهاء!

تم إضافة نظام شامل لحساب الضرائب والفائدة إلى المشروع بنجاح!

**الخطوات التالية:**
1. ✅ تشغيل الهجرة
2. ✅ اختبار API
3. ✅ دمج الواجهة الأمامية
4. ✅ تخصيص النسب حسب احتياجاتك

---
