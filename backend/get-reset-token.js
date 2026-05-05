const { pool } = require('./config/db');

async function getResetToken() {
  try {
    const [users] = await pool.execute(
      'SELECT id, reset_password_token, reset_password_expires FROM users WHERE email = ?',
      ['bkmzater@gmail.com']
    );

    if (!users.length) {
      console.log('❌ User not found');
      process.exit(1);
    }

    const user = users[0];
    console.log('✅ User found:');
    console.log('   ID:', user.id);
    console.log('   Reset Token:', user.reset_password_token);
    console.log('   Expires:', user.reset_password_expires);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

getResetToken();
