/*
const { pool } = require('./config/db');

async function verifyEmail() {
  try {
    const result = await pool.execute(
      `UPDATE users SET is_email_verified = 1 WHERE email = ?`,
      ['bkmzater@gmail.com']
    );
    console.log('✅ Email verified');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyEmail();
*/