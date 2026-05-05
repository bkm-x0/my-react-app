/*const { sendPasswordResetEmail } = require('./config/email');

async function test() {
  try {
    console.log('Testing password reset email...');
    const result = await sendPasswordResetEmail(
      'bkmzater@gmail.com',
      'bkmuser',
      'test-token-12345'
    );
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
  process.exit(0);
}

test();
*/