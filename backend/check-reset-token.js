const { pool } = require('./config/db');

async function check() {
  try {
    const [users] = await pool.execute(
      'SELECT id, email, reset_password_token, reset_password_expires FROM users WHERE email = ? ORDER BY id DESC LIMIT 1',
      ['bkmzater@gmail.com']
    );

    if (!users.length) {
      console.log('❌ User not found');
      process.exit(1);
    }

    const user = users[0];
    console.log('✅ Password reset token created:');
    console.log('   Email:', user.email);
    console.log('   Token:', user.reset_password_token.substring(0, 20) + '...');
    console.log('   Expires:', user.reset_password_expires);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

check();
