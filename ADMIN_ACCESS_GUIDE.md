# 🔐 نظام الضرائب والفائدة - قيود الوصول الإداري

## ⛔ سياسة الوصول

نظام حساب الضرائب والفائدة **محمي بالكامل** ويمكن الوصول إليه فقط من قبل:
- ✅ المسؤولون (Admin)

### من لا يمكنه الوصول:
- ❌ المستخدمون العاديون
- ❌ المستخدمون غير المسجلين
- ❌ أي شخص بدون دور "admin"

---

## 🔑 كيفية الوصول

### 1. تسجيل الدخول كمسؤول
أولاً، قم بتسجيل الدخول بحساب مسؤول:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin_password"
  }'
```

**الاستجابة:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 2. استخدام الـ Token
ثم استخدم الـ token في رؤوس الطلبات:

```bash
curl -X GET http://localhost:5000/api/tax/summary \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🛡️ آليات الحماية

### 1. المصادقة (Authentication)
- ✅ يجب توفير `Bearer Token` صحيح
- ✅ الـ Token يُتحقق من خلال JWT Secret
- ✅ الـ Token المنتهي الصلاحية يُرفض

### 2. التفويض (Authorization)
- ✅ يجب أن يكون دور المستخدم `admin`
- ✅ أي دور آخر يُرفض تلقائياً
- ✅ الطلبات بدون token تُرفض

### 3. تسجيل النشاطات (Auditing)
- ✅ كل عملية تُسجل مع:
  - اسم المسؤول
  - نوع العملية
  - التاريخ والوقت
  - عنوان IP
  - معلومات الجهاز

---

## 📋 رسائل الخطأ

### خطأ 1: بدون Token
```
HTTP 401 Unauthorized
{
  "message": "Not authorized, please login first"
}
```

### خطأ 2: Token غير صحيح
```
HTTP 401 Unauthorized
{
  "message": "Not authorized, token expired or invalid. Please login again."
}
```

### خطأ 3: ليس مسؤول
```
HTTP 403 Forbidden
{
  "message": "Not authorized as admin"
}
```

---

## 💻 أمثلة في الكود

### JavaScript/Fetch
```javascript
// 1. تسجيل الدخول
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// 2. استخدام النظام
const response = await fetch('/api/tax/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    costPrice: 100,
    sellingPrice: 150,
    quantity: 5,
    taxRate: 0.15,
    interestRate: 0.05
  })
});

const result = await response.json();
console.log(result.data);
```

### Axios
```javascript
// إعداد axios مع token
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// استخدام النظام
const result = await instance.post('/tax/calculate', {
  costPrice: 100,
  sellingPrice: 150,
  quantity: 5
});
```

---

## 📱 في الواجهة الأمامية

### حماية المكونات
```javascript
import { useAuth } from './hooks/useAuth';
import TaxCalculator from './components/TaxCalculator';

export default function AdminPanel() {
  const { user } = useAuth();

  // عرض النظام فقط للمسؤولين
  if (user?.role !== 'admin') {
    return <div>لا توجد صلاحيات للوصول إلى هذه الصفحة</div>;
  }

  return <TaxCalculator />;
}
```

### إضافة Token تلقائياً
```javascript
// في interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🔍 عرض السجلات

### عرض سجل العمليات في Console
```bash
# كل عملية تطبع هذا الشكل:
🔐 ═══════════════════════════════════════════
📋 عملية إدمن محمية تم تنفيذها
🔐 ═══════════════════════════════════════════
👤 المستخدم: admin (ID: 1)
👮 الدور: admin
⚙️  العملية: حساب الضرائب والفائدة
📍 المسار: POST /api/tax/calculate
🌐 عنوان IP: 192.168.1.100
⏰ الوقت: 2024-04-23T10:30:45.123Z
🔐 ═══════════════════════════════════════════
```

---

## ⚙️ إعدادات الأمان

### متغيرات البيئة المطلوبة
```
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### معايير كلمات المرور القوية
- ✅ 8 أحرف على الأقل
- ✅ حروف كبيرة وصغيرة
- ✅ أرقام ورموز خاصة
- ✅ تجنب الكلمات الشهيرة

---

## 🛠️ الصيانة والمراقبة

### تحديث دور المستخدم
```bash
# في قاعدة البيانات
UPDATE users SET role = 'admin' WHERE id = 1;
```

### إبطال جميع الـ Tokens
```javascript
// عند تغيير JWT_SECRET في .env
process.env.JWT_SECRET = 'new_secret_key';
// سيتم إبطال جميع الـ tokens القديمة تلقائياً
```

### مراقبة محاولات الوصول
```javascript
// في السجلات
console.log('محاولة وصول بدون صلاحيات من:', req.ip);
```

---

## 📞 استكشاف الأخطاء

### المشكلة: "Not authorized as admin"
**الحل**: تأكد من أن المستخدم لديه دور `admin` في قاعدة البيانات

### المشكلة: "Token expired"
**الحل**: قم بتسجيل الدخول مرة أخرى للحصول على token جديد

### المشكلة: لا يمكن الوصول للـ API
**الحل**: تحقق من:
- ✅ الـ token صحيح
- ✅ Server يعمل
- ✅ CORS مفعل
- ✅ رؤوس الطلب صحيحة

---

## ✅ ملخص الأمان

| العنصر | الحالة |
|------|--------|
| المصادقة (Token) | ✅ محمي |
| التفويض (Admin) | ✅ محمي |
| التشفير | ✅ JWT |
| تسجيل النشاطات | ✅ مفعل |
| رسائل الخطأ | ✅ آمنة |

---

**🎉 النظام محمي بالكامل ومتاح فقط للمسؤولين!**
