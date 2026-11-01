import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

const wrapper = (heading, body) => `
  <div style="font-family: 'IBM Plex Sans', Arial, sans-serif; background:#EEF1EC; padding:32px;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <div style="background:#14171A;padding:28px 32px;">
        <span style="color:#F5F7F3;font-size:20px;letter-spacing:0.08em;font-weight:700;">RONVERO</span>
      </div>
      <div style="padding:32px;color:#1E211D;">
        <h1 style="font-size:20px;margin:0 0 16px;">${heading}</h1>
        ${body}
      </div>
    </div>
  </div>
`;

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(`[emailService] SMTP not configured — skipping email "${subject}" to ${to}`);
    return { skipped: true };
  }
  return getTransporter().sendMail({
    from: process.env.EMAIL_FROM || 'RONVERO <no-reply@ronvero.com>',
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = (to, name, verifyUrl) =>
  sendEmail({
    to,
    subject: 'Verify your RONVERO account',
    html: wrapper(
      `Welcome, ${name}`,
      `<p>Confirm your email to activate your account.</p>
       <p><a href="${verifyUrl}" style="display:inline-block;background:#FF4A2E;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600;">Verify email</a></p>
       <p style="font-size:13px;color:#666;">If the button doesn't work, copy this link: ${verifyUrl}</p>`
    ),
  });

export const sendPasswordResetEmail = (to, name, resetUrl) =>
  sendEmail({
    to,
    subject: 'Reset your RONVERO password',
    html: wrapper(
      `Hi ${name}, reset your password`,
      `<p>We received a request to reset your password. This link expires in 30 minutes.</p>
       <p><a href="${resetUrl}" style="display:inline-block;background:#14171A;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600;">Reset password</a></p>
       <p style="font-size:13px;color:#666;">If you didn't request this, you can safely ignore this email.</p>`
    ),
  });

export const sendOrderConfirmationEmail = (to, name, order) =>
  sendEmail({
    to,
    subject: `Your RONVERO order ${order.orderNumber} is confirmed`,
    html: wrapper(
      `Thanks for your order, ${name}`,
      `<p>Order <strong>${order.orderNumber}</strong> is confirmed and will be prepared for shipping.</p>
       <p style="font-size:22px;font-weight:700;">₹${order.totalPrice.toFixed(2)}</p>
       <p style="font-size:13px;color:#666;">We'll email you again once it ships.</p>`
    ),
  });
