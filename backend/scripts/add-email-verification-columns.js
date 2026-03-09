// Adds email verification and password-reset columns to the users table
const { pool } = require('../config/db');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const columns = [
  { name: 'is_email_verified',      def: 'TINYINT(1) NOT NULL DEFAULT 0' },
  { name: 'email_verify_token',      def: 'VARCHAR(128) DEFAULT NULL' },
  { name: 'email_verify_expires',    def: 'DATETIME DEFAULT NULL' },
  { name: 'reset_password_token',    def: 'VARCHAR(128) DEFAULT NULL' },
  { name: 'reset_password_expires',  def: 'DATETIME DEFAULT NULL' },
];

async function columnExists(name) {
  const [[row]] = await pool.execute(
    `SELECT COUNT(*) AS cnt
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = ?`,
    [name]
  );
  return row.cnt > 0;
}

async function migrate() {
  for (const col of columns) {
    if (await columnExists(col.name)) {
      console.log(`⚠️  Column '${col.name}' already exists, skipping`);
    } else {
      await pool.execute(`ALTER TABLE users ADD COLUMN ${col.name} ${col.def}`);
      console.log(`✅ Added column: ${col.name}`);
    }
  }

  // Mark existing admin users as already verified
  await pool.execute(`UPDATE users SET is_email_verified = 1 WHERE role = 'admin'`);
  // Mark all previously-existing (non-admin) users as verified so they can still log in
  await pool.execute(`UPDATE users SET is_email_verified = 1 WHERE is_email_verified = 0 AND created_at < NOW()`);
  console.log('✅ Existing users marked as verified');
  console.log('\n✨ Migration complete!');
  process.exit(0);
}

migrate().catch(err => { console.error(err); process.exit(1); });
