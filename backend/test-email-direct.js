/*require('dotenv').config();
const { sendPasswordResetEmail } = require('./config/email');

async function test() {
  try {
    console.log('Brevo API Key:', process.env.BREVO_API_KEY ? '✓ Set' : '✗ Not set');
    console.log('Testing password reset email to bkmzater@gmail.com...');
    const result = await sendPasswordResetEmail(
      'bkmzater@gmail.com',
      'bkmuser',
      'test-token-12345'
    );
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
  } catch (error) {
    console.error('❌ Error:');
    console.error(error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response body:', error.response.body);
    }
  }
  process.exit(0);
}

test();
*/