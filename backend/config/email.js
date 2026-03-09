// backend/config/email.js
const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const useSmtp =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (useSmtp) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3',
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      socketTimeout: 30000,
      connectionTimeout: 30000,
      greetingTimeout: 30000,
    });

    // Verify connection on startup
    transporter.verify((err) => {
      if (err) {
        console.error('[EMAIL] SMTP connection failed:', err.message);
        console.error('[EMAIL] Check your SMTP credentials in .env');
      } else {
        console.log('[EMAIL] ✅ SMTP server ready - emails will be sent');
      }
    });
  } else {
    console.warn('[EMAIL] ⚠️  No SMTP credentials found – using Ethereal test account (emails won\'t reach real inboxes)');
    // Fallback: Ethereal (fake SMTP for dev – emails are captured online, not sent)
    transporter = {
      _ethereal: true,
      sendMail: async (opts) => {
        try {
          const testAccount = await nodemailer.createTestAccount();
          const t = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: { user: testAccount.user, pass: testAccount.pass },
          });
          const info = await t.sendMail(opts);
          console.log(
            '\n📧 [EMAIL - PREVIEW URL]',
            nodemailer.getTestMessageUrl(info)
          );
          return info;
        } catch (err) {
          console.error('[EMAIL] Ethereal send failed:', err.message);
          return { messageId: 'dev-skipped' };
        }
      },
    };
  }

  return transporter;
}

// Reusable send function with retry logic
async function sendMail(opts, retries = 2) {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const info = await getTransporter().sendMail(opts);
      console.log(`[EMAIL] ✅ Sent to ${opts.to} | MessageId: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error(`[EMAIL] ❌ Attempt ${attempt} failed for ${opts.to}: ${err.message}`);
      if (attempt <= retries) {
        await new Promise(r => setTimeout(r, 2000 * attempt)); // exponential backoff
      } else {
        throw err;
      }
    }
  }
}

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';
const FROM = process.env.EMAIL_FROM || '"CyberStore" <noreply@cyberstore.dev>';

async function sendVerificationEmail(email, username, token) {
  const link = `${FRONTEND}/verify-email?token=${token}`;
  return sendMail({
    from: FROM,
    to: email,
    replyTo: FROM,
    subject: '✅ Verify your CyberStore account',
    html: `
      <div style="background:#09090b;color:#fff;font-family:sans-serif;padding:40px;border-radius:12px;max-width:520px;margin:auto">
        <h2 style="color:#f97316;margin-bottom:8px">CyberStore</h2>
        <h3 style="margin-bottom:24px">Verify your email, ${username}</h3>
        <p style="color:#a1a1aa;margin-bottom:32px">
          Click the button below to verify your email address and activate your account.
          This link expires in <strong style="color:#fff">24 hours</strong>.
        </p>
        <a href="${link}"
           style="display:inline-block;background:#f97316;color:#000;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px">
          Verify Email →
        </a>
        <p style="color:#52525b;margin-top:32px;font-size:12px">
          If you did not create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail(email, username, token) {
  const link = `${FRONTEND}/reset-password?token=${token}`;
  return sendMail({
    from: FROM,
    to: email,
    replyTo: FROM,
    subject: '🔑 Reset your CyberStore password',
    html: `
      <div style="background:#09090b;color:#fff;font-family:sans-serif;padding:40px;border-radius:12px;max-width:520px;margin:auto">
        <h2 style="color:#f97316;margin-bottom:8px">CyberStore</h2>
        <h3 style="margin-bottom:24px">Password reset request</h3>
        <p style="color:#a1a1aa;margin-bottom:32px">
          Hi <strong style="color:#fff">${username}</strong>, we received a request to reset your password.
          Click the button below. This link expires in <strong style="color:#fff">1 hour</strong>.
        </p>
        <a href="${link}"
           style="display:inline-block;background:#f97316;color:#000;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px">
          Reset Password →
        </a>
        <p style="color:#52525b;margin-top:32px;font-size:12px">
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </p>
      </div>
    `,
  });
}

async function sendTestEmail(to) {
  return sendMail({
    from: FROM,
    to,
    replyTo: FROM,
    subject: '🧪 CyberStore - Email Test',
    html: `
      <div style="background:#09090b;color:#fff;font-family:sans-serif;padding:40px;border-radius:12px;max-width:520px;margin:auto">
        <h2 style="color:#f97316;margin-bottom:8px">CyberStore</h2>
        <h3 style="margin-bottom:16px">✅ Email Configuration Works!</h3>
        <p style="color:#a1a1aa">This is a test email confirming that your SMTP settings are correctly configured.</p>
        <hr style="border-color:#27272a;margin:24px 0">
        <p style="color:#52525b;font-size:12px">Sent from: ${FROM}<br>SMTP Host: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}</p>
      </div>
    `,
  });
}

async function sendInvoiceEmail(order, pdfBuffer) {
  const orderDate = new Date(order.created_at).toLocaleDateString();

  const itemRows = (order.items || [])
    .map(item => `
      <tr>
        <td style="padding:8px 12px;color:#d4d4d8;border-bottom:1px solid #27272a">${item.product_name || 'Product'}</td>
        <td style="padding:8px 12px;color:#d4d4d8;border-bottom:1px solid #27272a;text-align:center">${item.quantity}</td>
        <td style="padding:8px 12px;color:#d4d4d8;border-bottom:1px solid #27272a;text-align:right">$${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `)
    .join('');

  return sendMail({
    from: FROM,
    to: order.user_email,
    replyTo: FROM,
    subject: `Invoice for Order #${order.id}`,
    html: `
      <div style="background:#09090b;color:#fff;font-family:sans-serif;padding:40px;border-radius:12px;max-width:520px;margin:auto">
        <h2 style="color:#f97316;margin-bottom:8px">CyberStore</h2>
        <h3 style="margin-bottom:24px">Invoice for Order #${order.id}</h3>

        <p style="color:#a1a1aa;margin-bottom:24px">
          Hi <strong style="color:#fff">${order.user_username || 'Customer'}</strong>,
          here is your invoice for the order placed on
          <strong style="color:#fff">${orderDate}</strong>.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:2px solid #f97316">
              <th style="padding:8px 12px;text-align:left;color:#f97316;font-size:13px">Item</th>
              <th style="padding:8px 12px;text-align:center;color:#f97316;font-size:13px">Qty</th>
              <th style="padding:8px 12px;text-align:right;color:#f97316;font-size:13px">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="text-align:right;margin-bottom:24px">
          <span style="color:#a1a1aa;font-size:14px">Total:&nbsp;</span>
          <strong style="color:#f97316;font-size:18px">$${(order.total_amount || 0).toLocaleString()}</strong>
        </div>

        <hr style="border-color:#27272a;margin:24px 0">

        <p style="color:#a1a1aa;font-size:13px;margin-bottom:4px">
          <strong style="color:#fff">Status:</strong> ${order.status}
        </p>
        <p style="color:#a1a1aa;font-size:13px;margin-bottom:16px">
          <strong style="color:#fff">Payment:</strong> ${order.payment_method || 'N/A'}
        </p>

        <p style="color:#a1a1aa;font-size:13px;margin-bottom:0">
          The full PDF invoice is attached to this email.
        </p>

        <p style="color:#52525b;margin-top:32px;font-size:12px">
          Thank you for shopping with CyberStore.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `Invoice-${order.id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendTestEmail, sendInvoiceEmail };
