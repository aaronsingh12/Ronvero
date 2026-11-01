import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendEmail } from '../services/emailService.js';

// @route  POST /api/contact
export const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) throw new ApiError('Name, email and message are required', 400);

  await sendEmail({
    to: process.env.SMTP_USER || 'support@ronvero.com',
    subject: `[Contact] ${subject || 'New message'} — from ${name}`,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
  });

  res.status(201).json({ success: true, message: 'Your message has been sent — we\u2019ll reply within 1-2 business days.' });
});
