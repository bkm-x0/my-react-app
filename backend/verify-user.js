/*const { pool } = require('./config/db');

async function verifyAndPromoteUser() {
  try {
    const result = await pool.execute(
      `UPDATE users SET is_email_verified = 1, role = 'admin' WHERE email = ?`,
      ['testadmin@test.com']
    );
    console.log('User verified and promoted to admin');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyAndPromoteUser();
*/