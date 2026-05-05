const { pool } = require('./config/db');

async function check() {
  try {
    const [users] = await pool.execute(
      'SELECT email, reset_password_token FROM users WHERE email = ? LIMIT 1',
      ['passwordtest@test.com']
    );
    if (users.length && users[0].reset_password_token) {
      console.log('✅ Reset token CREATED successfully');
      console.log('   Email:', users[0].email);
      console.log('   Token exists: YES');
    } else {
      console.log('❌ No reset token found');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  }
}
check();
