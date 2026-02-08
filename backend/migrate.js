// migrate.js - Add missing image column to products table
const { pool } = require('./config/db');

async function migrate() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Running migrations...\n');

    // Check if image column exists
    console.log('1️⃣  Checking products table structure...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' AND COLUMN_NAME = 'image'
    `);

    if (columns.length === 0) {
      console.log('⚠️  Image column not found. Adding it now...');
      
      await connection.execute(`
        ALTER TABLE products 
        ADD COLUMN image VARCHAR(255) DEFAULT NULL 
        AFTER features
      `);
      
      console.log('✅ Image column added successfully!');
    } else {
      console.log('✅ Image column already exists');
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
