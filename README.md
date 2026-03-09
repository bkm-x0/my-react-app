# CyberStore - E-commerce Platform

Full-stack e-commerce application built with React and Node.js/Express.

**[العربية](#-دليل-التثبيت-بالعربية)** | **[English](#-installation-guide)**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Framer Motion, Zustand, Axios |
| Backend | Node.js, Express, MySQL, JWT, Nodemailer, PDFKit |
| Database | MySQL 8.x (InnoDB, utf8mb4) |

---

## 📖 Installation Guide

### Prerequisites

- **Node.js** v16 or higher — [Download](https://nodejs.org/)
- **MySQL** 5.7+ or 8.x — [Download](https://dev.mysql.com/downloads/)

### 1. Clone the repository

```bash
git clone <repository-url>
cd my-react-app
```

### 2. Create the MySQL database

Open MySQL and run:

```sql
CREATE DATABASE cyberstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure environment variables

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cyberstore
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Frontend URL (used in email links)
FRONTEND_URL=http://localhost:3000

# SMTP (optional — without these, emails go to Ethereal test inbox)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=CyberStore <noreply@cyberstore.dev>
```

> `frontend/.env` is optional. Defaults auto-detect the API URL from the browser hostname.

### 4. Install dependencies

```bash
npm run install-all
```

This installs dependencies for root, backend, and frontend in one command.

### 5. Run database migrations

```bash
node backend/scripts/add-email-verification-columns.js
```

### 6. Seed the database (optional)

```bash
cd backend
npm run seed
node scripts/seed-suppliers.js
cd ..
```

> **Warning:** `npm run seed` deletes all existing data and creates fresh sample data.

### 7. Start the application

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

### Default Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@cyberstore.com` | `admin123` |
| User | `user@cyberstore.com` | `user123` |

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend together |
| `npm run backend` | Start backend only (with nodemon) |
| `npm run frontend` | Start frontend only |
| `npm run build` | Build frontend for production |
| `npm run install-all` | Install all dependencies |

### Project Structure

```
my-react-app/
├── backend/
│   ├── config/          # Database & email configuration
│   ├── controllers/     # Route handlers
│   ├── models/          # MySQL models (User, Product, Order)
│   ├── routes/          # API routes
│   ├── scripts/         # Migration & seed scripts
│   ├── seed.js          # Database seeder
│   └── server.js        # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components (Navbar, ProductCard)
│   │   ├── pages/       # Page components (Home, Login, Cart, Admin)
│   │   ├── services/    # API service (Axios)
│   │   └── pages/store/ # Zustand stores (auth, cart, lang, currency)
│   └── public/
└── package.json         # Root scripts (install-all, dev)
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/verify-email` | Verify email address |
| GET | `/api/products` | List products |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:id/invoice` | Download PDF invoice |
| POST | `/api/orders/:id/send-invoice` | Email PDF invoice |

---

## 📖 دليل التثبيت بالعربية

### المتطلبات

- **Node.js** الإصدار 16 أو أحدث — [تحميل](https://nodejs.org/)
- **MySQL** الإصدار 5.7 أو أحدث — [تحميل](https://dev.mysql.com/downloads/)

### 1. نسخ المشروع

```bash
git clone <repository-url>
cd my-react-app
```

### 2. إنشاء قاعدة البيانات

افتح MySQL ونفّذ:

```sql
CREATE DATABASE cyberstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `backend/.env`:

```env
NODE_ENV=development
PORT=5000

# قاعدة البيانات
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cyberstore
DB_USER=root
DB_PASSWORD=كلمة_سر_MySQL

# مفتاح JWT
JWT_SECRET=مفتاح_سري_هنا
JWT_EXPIRE=7d

# رابط الواجهة الأمامية (يُستخدم في روابط البريد)
FRONTEND_URL=http://localhost:3000

# SMTP (اختياري — بدونه تُرسل الرسائل إلى صندوق Ethereal التجريبي)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=اسم_مستخدم_SMTP
SMTP_PASS=كلمة_سر_SMTP
EMAIL_FROM=CyberStore <noreply@cyberstore.dev>
```

> ملف `frontend/.env` اختياري. الإعدادات الافتراضية تكشف رابط API تلقائياً.

### 4. تثبيت جميع التبعيات

```bash
npm run install-all
```

هذا الأمر يثبّت تبعيات المشروع الرئيسي والباك اند والفرونت اند دفعة واحدة.

### 5. تشغيل الترحيلات (Migrations)

```bash
node backend/scripts/add-email-verification-columns.js
```

### 6. ملء قاعدة البيانات ببيانات تجريبية (اختياري)

```bash
cd backend
npm run seed
node scripts/seed-suppliers.js
cd ..
```

> **تحذير:** أمر `npm run seed` يحذف جميع البيانات الموجودة وينشئ بيانات تجريبية جديدة.

### 7. تشغيل التطبيق

```bash
npm run dev
```

| الخدمة | الرابط |
|--------|--------|
| الواجهة الأمامية | http://localhost:3000 |
| واجهة API | http://localhost:5000/api |
| فحص الصحة | http://localhost:5000/api/health |

### الحسابات الافتراضية (بعد ملء البيانات)

| الدور | البريد الإلكتروني | كلمة السر |
|-------|-------------------|----------|
| مدير | `admin@cyberstore.com` | `admin123` |
| مستخدم | `user@cyberstore.com` | `user123` |

### الأوامر المتاحة

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | تشغيل الفرونت اند والباك اند معاً |
| `npm run backend` | تشغيل الباك اند فقط (مع nodemon) |
| `npm run frontend` | تشغيل الفرونت اند فقط |
| `npm run build` | بناء الفرونت اند للإنتاج |
| `npm run install-all` | تثبيت جميع التبعيات |

### هيكل المشروع

```
my-react-app/
├── backend/
│   ├── config/          # إعدادات قاعدة البيانات والبريد
│   ├── controllers/     # معالجات المسارات
│   ├── models/          # نماذج MySQL (المستخدم، المنتج، الطلب)
│   ├── routes/          # مسارات API
│   ├── scripts/         # سكربتات الترحيل والملء
│   ├── seed.js          # ملء قاعدة البيانات
│   └── server.js        # نقطة دخول خادم Express
├── frontend/
│   ├── src/
│   │   ├── components/  # مكونات قابلة لإعادة الاستخدام
│   │   ├── pages/       # صفحات التطبيق
│   │   ├── services/    # خدمة API (Axios)
│   │   └── pages/store/ # متاجر Zustand (المصادقة، السلة، اللغة، العملة)
│   └── public/
└── package.json         # أوامر المشروع الرئيسية
```

### نقاط API الرئيسية

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/auth/register` | تسجيل مستخدم جديد |
| POST | `/api/auth/login` | تسجيل الدخول |
| GET | `/api/auth/verify-email` | تأكيد البريد الإلكتروني |
| GET | `/api/products` | عرض المنتجات |
| POST | `/api/orders` | إنشاء طلب |
| GET | `/api/orders/:id/invoice` | تحميل فاتورة PDF |
| POST | `/api/orders/:id/send-invoice` | إرسال فاتورة بالبريد |
