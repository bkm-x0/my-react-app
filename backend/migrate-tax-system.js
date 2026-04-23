// backend/migrate-tax-system.js
const { pool } = require('./config/db');

async function migrateTaxSystem() {
  const connection = await pool.getConnection();

  try {
    console.log('🔄 جاري تشغيل هجرة نظام الضرائب والفائدة...\n');

    // 1. إنشاء جدول أسعار الموردين
    console.log('1️⃣  جاري إنشاء جدول أسعار الموردين...');
    const [supplierPriceTables] = await connection.execute(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_NAME = 'supplier_prices'
    `);

    if (supplierPriceTables.length === 0) {
      await connection.execute(`
        CREATE TABLE supplier_prices (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          supplier_id INT NOT NULL,
          cost_price DECIMAL(12, 2) NOT NULL,
          quantity_min INT DEFAULT 1,
          quantity_max INT DEFAULT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          validity_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          validity_end TIMESTAMP DEFAULT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
          INDEX idx_product_supplier (product_id, supplier_id),
          INDEX idx_validity (validity_start, validity_end),
          INDEX idx_quantity (quantity_min, quantity_max)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('✅ تم إنشاء جدول أسعار الموردين');
    } else {
      console.log('✅ جدول أسعار الموردين موجود بالفعل');
    }

    // 2. إنشاء جدول الضرائب والفائدة
    console.log('\n2️⃣  جاري إنشاء جدول الضرائب والفائدة...');
    const [taxTables] = await connection.execute(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_NAME = 'taxes_interests'
    `);

    if (taxTables.length === 0) {
      await connection.execute(`
        CREATE TABLE taxes_interests (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT DEFAULT NULL,
          order_item_id INT DEFAULT NULL,
          supplier_id INT NOT NULL,
          cost_price DECIMAL(12, 2) NOT NULL,
          selling_price DECIMAL(12, 2) NOT NULL,
          quantity INT DEFAULT 1,
          cost_total DECIMAL(14, 2) NOT NULL,
          selling_total DECIMAL(14, 2) NOT NULL,
          profit DECIMAL(14, 2) NOT NULL,
          tax_rate DECIMAL(5, 4) DEFAULT 0.15,
          tax_amount DECIMAL(14, 2) DEFAULT 0,
          interest_rate DECIMAL(5, 4) DEFAULT 0.05,
          interest_amount DECIMAL(14, 2) DEFAULT 0,
          total_charges DECIMAL(14, 2) DEFAULT 0,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
          FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
          INDEX idx_order_id (order_id),
          INDEX idx_supplier_id (supplier_id),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('✅ تم إنشاء جدول الضرائب والفائدة');
    } else {
      console.log('✅ جدول الضرائب والفائدة موجود بالفعل');
    }

    // 3. التحقق من إضافة عمود سعر التكلفة في جدول المنتجات
    console.log('\n3️⃣  جاري التحقق من إضافة أعمدة التكلفة...');
    const [productColumns] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'products'
    `);

    const columnNames = productColumns.map(c => c.COLUMN_NAME);

    // إضافة عمود سعر التكلفة إذا لم يكن موجوداً
    if (!columnNames.includes('cost_price')) {
      console.log('⚠️  عمود سعر التكلفة غير موجود. جاري إضافته...');
      await connection.execute(`
        ALTER TABLE products ADD COLUMN cost_price DECIMAL(12, 2) DEFAULT NULL
        AFTER price
      `);
      console.log('✅ تم إضافة عمود سعر التكلفة');
    } else {
      console.log('✅ عمود سعر التكلفة موجود بالفعل');
    }

    // 4. إضافة أعمدة الضرائب والفائدة لجدول الطلبات
    console.log('\n4️⃣  جاري التحقق من أعمدة الطلبات...');
    const [orderColumns] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'orders'
    `);

    const orderColumnNames = orderColumns.map(c => c.COLUMN_NAME);

    if (!orderColumnNames.includes('tax_amount')) {
      console.log('⚠️  عمود الضرائب غير موجود. جاري إضافته...');
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN tax_amount DECIMAL(14, 2) DEFAULT 0
      `);
      console.log('✅ تم إضافة عمود الضرائب');
    }

    if (!orderColumnNames.includes('interest_amount')) {
      console.log('⚠️  عمود الفائدة غير موجود. جاري إضافته...');
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN interest_amount DECIMAL(14, 2) DEFAULT 0
      `);
      console.log('✅ تم إضافة عمود الفائدة');
    }

    if (!orderColumnNames.includes('supplier_id')) {
      console.log('⚠️  عمود معرف المورد غير موجود. جاري إضافته...');
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN supplier_id INT DEFAULT NULL
      `);
      console.log('✅ تم إضافة عمود معرف المورد');
    }

    console.log('\n✅ اكتملت هجرة نظام الضرائب والفائدة بنجاح!');
    process.exit(0);

  } catch (error) {
    console.error('❌ فشلت الهجرة:', error.message);
    process.exit(1);
  } finally {
    connection.release();
  }
}

migrateTaxSystem();
