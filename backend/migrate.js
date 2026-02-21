// migrate.js - Add missing image column to products table
const { pool } = require('./config/db');

async function migrate() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Running migrations...\n');

    // Check products table structure
    console.log('1️⃣  Checking products table structure...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products'
    `);

    const columnNames = columns.map(c => c.COLUMN_NAME);

    // image
    if (!columnNames.includes('image')) {
      console.log('⚠️  Image column not found. Adding it now...');
      await connection.execute(`ALTER TABLE products ADD COLUMN image VARCHAR(255) DEFAULT NULL AFTER features`);
      console.log('✅ Image column added successfully!');
    } else {
      console.log('✅ Image column already exists');
    }

    // specifications
    if (!columnNames.includes('specifications')) {
      console.log('⚠️  specifications column not found. Adding it now...');
      await connection.execute(`ALTER TABLE products ADD COLUMN specifications JSON NULL AFTER features`);
      console.log('✅ specifications column added successfully!');
    } else {
      console.log('✅ specifications column already exists');
    }

    // Create reviews table if missing
    const [reviewCols] = await connection.execute(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reviews'
    `);

    if (reviewCols.length === 0) {
      console.log('⚠️  reviews table not found. Creating it now...');
      await connection.execute(`
        CREATE TABLE reviews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          user_id INT DEFAULT NULL,
          rating TINYINT NOT NULL,
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_product_id (product_id),
          INDEX idx_user_id (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('✅ reviews table created');
    } else {
      console.log('✅ reviews table already exists');
    }

    // Check other important columns
    console.log('\n2️⃣  Verifying all required columns...');
    const [allColumns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products'
      ORDER BY ORDINAL_POSITION
    `);

    console.log('\nProducts table structure:');
    allColumns.forEach(col => {
      console.log(`  ✓ ${col.COLUMN_NAME}: ${col.DATA_TYPE}`);
    });

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    connection.release();
  }
}

migrate();
