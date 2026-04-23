# نظام حساب الضرائب والفائدة

## نظرة عامة
تم إضافة نظام شامل لحساب الضرائب والفائدة بناءً على فرق السعر بين سعر الشراء من المورد وسعر البيع للعميل.

## المكونات الرئيسية

### 1. نماذج البيانات (Models)

#### SupplierPrice.js
يدير أسعار الشراء من الموردين:
- تتبع سعر التكلفة لكل منتج من كل مورد
- دعم نطاقات كمية مختلفة
- تحديد فترات صلاحية الأسعار

**الطرق الرئيسية:**
- `create()`: إنشاء سعر شراء جديد
- `getBestPrice()`: الحصول على أفضل سعر لكمية محددة
- `getByProduct()`: الحصول على جميع أسعار المورد لمنتج

#### TaxAndInterest.js
يسجل ويدير حسابات الضرائب والفائدة:
- تخزين التفاصيل الكاملة لكل عملية حساب
- تتبع الضرائب والفائدة لكل طلب
- توليد التقارير والملخصات

**الطرق الرئيسية:**
- `create()`: حفظ سجل الضرائب والفائدة
- `getSummary()`: الحصول على ملخص الضرائب والفائدة
- `getDetailedReport()`: تقرير تفصيلي
- `getByOrderId()`: الحصول على سجلات الطلب

### 2. أداة الحساب (Utility)

#### taxCalculator.js
تحتوي على جميع العمليات الحسابية:

**الدوال الرئيسية:**

##### calculateTaxAndInterest()
حساب شامل للضرائب والفائدة:
```javascript
TaxCalculator.calculateTaxAndInterest(
  costPrice,        // سعر الشراء
  sellingPrice,     // سعر البيع
  quantity,         // الكمية
  taxRate,          // نسبة الضريبة (0.15 = 15%)
  interestRate      // نسبة الفائدة (0.05 = 5%)
);
```

**النتيجة تحتوي على:**
- costTotal: التكلفة الإجمالية
- sellingTotal: الإيرادات الإجمالية
- profit: الربح الأساسي
- profitMargin: نسبة الهامش
- taxAmount: مبلغ الضرائب
- interestAmount: مبلغ الفائدة
- totalCharges: إجمالي الرسوم
- netProfit: الربح الصافي بعد الضرائب والفائدة
- netProfitMargin: نسبة الربح الصافي

##### calculateSellingPrice()
حساب سعر البيع المطلوب للحصول على ربح معين:
```javascript
TaxCalculator.calculateSellingPrice(
  costPrice,        // سعر الشراء
  desiredProfit,    // الربح المطلوب
  taxRate,
  interestRate
);
```

##### calculateByMargin()
حساب بناءً على نسبة هامش مطلوبة:
```javascript
TaxCalculator.calculateByMargin(
  costPrice,             // سعر الشراء
  profitMarginPercent,   // نسبة الهامش المطلوبة (مثل 30%)
  taxRate,
  interestRate
);
```

##### calculateBatch()
حساب متعدد المنتجات دفعة واحدة:
```javascript
TaxCalculator.calculateBatch(
  items,  // مصفوفة {costPrice, sellingPrice, quantity}
  taxRate,
  interestRate
);
```

### 3. مراقب الطلبات (Controller)

#### taxController.js
يوفر endpoints لكل العمليات:

## API Endpoints

### 1. حساب الضرائب والفائدة الأساسي
```
POST /api/tax/calculate
```

**الطلب:**
```json
{
  "costPrice": 100,
  "sellingPrice": 150,
  "quantity": 5,
  "taxRate": 0.15,
  "interestRate": 0.05
}
```

**الاستجابة:**
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

### 2. حساب سعر البيع
```
POST /api/tax/calculate-selling-price
```

**الطلب:**
```json
{
  "costPrice": 100,
  "desiredProfit": 50,
  "taxRate": 0.15,
  "interestRate": 0.05
}
```

### 3. حساب بناءً على نسبة الهامش
```
POST /api/tax/calculate-by-margin
```

**الطلب:**
```json
{
  "costPrice": 100,
  "profitMarginPercent": 30,
  "taxRate": 0.15,
  "interestRate": 0.05
}
```

### 4. حساب مجموعة من المنتجات
```
POST /api/tax/calculate-batch
```

**الطلب:**
```json
{
  "items": [
    {"costPrice": 100, "sellingPrice": 150, "quantity": 5},
    {"costPrice": 200, "sellingPrice": 280, "quantity": 3}
  ],
  "taxRate": 0.15,
  "interestRate": 0.05
}
```

### 5. تقرير المقارنة
```
GET /api/tax/comparison-report?costPrice=100&quantity=1
```

### 6. ملخص الضرائب والفائدة
```
GET /api/tax/summary?supplierId=1&startDate=2024-01-01&endDate=2024-12-31
```

### 7. التقرير التفصيلي
```
GET /api/tax/report?supplierId=1&limit=100&offset=0
```

### 8. حفظ سجل الضرائب والفائدة
```
POST /api/tax/record
```

**الطلب:**
```json
{
  "orderId": 1,
  "supplierId": 2,
  "costPrice": 100,
  "sellingPrice": 150,
  "quantity": 5,
  "taxRate": 0.15,
  "interestRate": 0.05,
  "notes": "ملاحظات إضافية"
}
```

### 9. الحصول على سجل محدد
```
GET /api/tax/record/:id
```

### 10. سجلات الطلب
```
GET /api/tax/order/:orderId
```

## جداول قاعدة البيانات

### supplier_prices
```sql
id INT AUTO_INCREMENT PRIMARY KEY
product_id INT NOT NULL
supplier_id INT NOT NULL
cost_price DECIMAL(12, 2) NOT NULL
quantity_min INT DEFAULT 1
quantity_max INT DEFAULT NULL
currency VARCHAR(3) DEFAULT 'USD'
validity_start TIMESTAMP
validity_end TIMESTAMP DEFAULT NULL
notes TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### taxes_interests
```sql
id INT AUTO_INCREMENT PRIMARY KEY
order_id INT DEFAULT NULL
supplier_id INT NOT NULL
cost_price DECIMAL(12, 2)
selling_price DECIMAL(12, 2)
quantity INT
cost_total DECIMAL(14, 2)
selling_total DECIMAL(14, 2)
profit DECIMAL(14, 2)
tax_rate DECIMAL(5, 4)
tax_amount DECIMAL(14, 2)
interest_rate DECIMAL(5, 4)
interest_amount DECIMAL(14, 2)
total_charges DECIMAL(14, 2)
notes TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

## خطوات التثبيت

### 1. تشغيل الهجرة (Migration)
```bash
node backend/migrate-tax-system.js
```

هذا سينشئ الجداول المطلوبة ويضيف الأعمدة الناقصة.

### 2. استخدام الخدمات

**في الواجهة الأمامية (React):**
```javascript
// حساب الضرائب والفائدة
const response = await fetch('/api/tax/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    costPrice: 100,
    sellingPrice: 150,
    quantity: 5,
    taxRate: 0.15,
    interestRate: 0.05
  })
});

const data = await response.json();
console.log(data.data);
```

**في Node.js:**
```javascript
const TaxCalculator = require('./utils/taxCalculator');

const result = TaxCalculator.calculateTaxAndInterest(
  100,   // costPrice
  150,   // sellingPrice
  5,     // quantity
  0.15,  // taxRate
  0.05   // interestRate
);

console.log(result);
```

## أمثلة عملية

### مثال 1: حساب بسيط
```javascript
// البائع يشتري من المورد بـ 100 ويبيع بـ 150
const result = TaxCalculator.calculateTaxAndInterest(100, 150, 1, 0.15, 0.05);

// النتيجة:
// profit: 50 (150 - 100)
// taxAmount: 22.5 (150 * 0.15)
// interestAmount: 5 (100 * 0.05)
// netProfit: 22.5 (50 - 22.5 - 5)
```

### مثال 2: حساب سعر البيع
```javascript
// إذا أردت ربح صافي بـ 50 ريال
const sellingPrice = TaxCalculator.calculateSellingPrice(100, 50, 0.15, 0.05);
// النتيجة: حوالي 188.24
```

### مثال 3: حساب بناءً على الهامش
```javascript
// أريد هامش 30% على المنتج
const result = TaxCalculator.calculateByMargin(100, 30, 0.15, 0.05);
// سيحسب سعر البيع والربح الصافي
```

## ملاحظات مهمة

1. **نسب الضريبة والفائدة:**
   - الضريبة تُحسب عادة على سعر البيع
   - الفائدة تُحسب على سعر الشراء (رأس المال)
   - يمكن تعديل النسب حسب السياسات المحلية

2. **الدقة:**
   - جميع الحسابات تُقرب لمنزلتين عشريتين
   - استخدم DECIMAL في قاعدة البيانات لدقة مالية

3. **الأداء:**
   - استخدم caching للأسعار المتكررة
   - يمكن حساب الرسوم دفعة واحدة بدلاً من واحد تلو الآخر

## الملفات المضافة

- `backend/models/SupplierPrice.js` - نموذج أسعار الموردين
- `backend/models/TaxAndInterest.js` - نموذج الضرائب والفائدة
- `backend/utils/taxCalculator.js` - أداة الحساب
- `backend/controllers/taxController.js` - مراقب الطلبات
- `backend/routes/taxRoutes.js` - الروتات
- `backend/migrate-tax-system.js` - ملف الهجرة
