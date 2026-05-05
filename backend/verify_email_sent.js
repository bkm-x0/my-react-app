/*require('dotenv').config();
const { sendPasswordResetEmail } = require('./config/email');

async function test() {
  try {
    console.log('📧 Testing password reset email send...');
    const result = await sendPasswordResetEmail(
      'passwordtest@test.com',
      'passwordtest',
      'test-reset-token'
    );
    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', result.messageId);
  } catch (error) {
    console.error('❌ Email send failed:');
    console.error('   Error:', error.message);
  }
  process.exit(0);
}

test();*/