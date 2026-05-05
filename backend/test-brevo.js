/*const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

async function testEmail() {
  try {
    console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? '✓ Set' : '✗ Not set');
    console.log('SMTP_USER:', process.env.SMTP_USER);

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.basePath = 'https://api.brevo.com/v3';
    const apiKeyAuth = defaultClient.authentications['api-key'];
    apiKeyAuth.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendEmail.sender = {
      name: 'CyberStore',
      email: process.env.SMTP_USER
    };
    sendEmail.to = [{ email: 'bkmzater@gmail.com' }];
    sendEmail.subject = 'Test Email from Brevo API';
    sendEmail.htmlContent = '<h1>Test</h1><p>This is a test email</p>';
    sendEmail.replyTo = {
      email: process.env.SMTP_USER,
      name: 'CyberStore Support'
    };

    console.log('\nSending email via Brevo API...');
    const data = await apiInstance.sendTransacEmail(sendEmail);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', data.messageId);
  } catch (err) {
    console.error('❌ Error sending email:');
    console.error('Message:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Body:', err.response.body || err.response.text);
    }
    console.error('Full error:', err);
  }
}

testEmail();*/
