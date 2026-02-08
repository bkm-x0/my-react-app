// test-db.js - Test database connectivity and seed
const { pool, db } = require('./config/db');
const path = require('path');

async function testAndSeed() {
  try {
    console.log('🔍 Testing database connection...');
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    
    // Test categories table
    console.log('\n📋 Checking categories table...');
    const [categories] = await pool.execute('SELECT * FROM categories');
    console.log(`Found ${categories.length} categories:`);
    categories.forEach(cat => {
      console.log(`  - ${cat.id}: ${cat.name} (${cat.slug})`);
    });
    
    if (categories.length === 0) {
      console.log('\n⚠️  No categories found! Running seed...');
      require('./seed');
    } else {
      console.log('\n✅ Database appears to be properly seeded!');
    }
    
    // Test users table
    console.log('\n👥 Checking users table...');
    const [users] = await pool.execute('SELECT id, username, email, role FROM users');
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - ${user.role}`);
    });
    
    connection.release();
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MySQL is running');
    console.error('2. Check your .env file has DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    console.error('3. Verify the database exists: cyberstore');
    console.error('4. Check MySQL credentials are correct');
    process.exit(1);
  }
}

testAndSeed();
