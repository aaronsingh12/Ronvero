import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Notification from '../models/Notification.js';

// @route  GET /api/notifications (admin)
export const getNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const filter = {};

  if (req.query.unreadOnly === 'true') filter.read = false;
  if (req.query.type) filter.type = req.query.type;

  const [notifications, unreadCount] = await Promise.all([
    Notification.find(filter).sort('-createdAt').limit(limit),
    Notification.countDocuments({ read: false }),
  ]);

  res.json({ success: true, notifications, unreadCount });
});

// @route  PUT /api/notifications/read-all (admin)
export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ read: false }, { $set: { read: true } });
  res.json({ success: true, unreadCount: 0 });
});

// @route  PUT /api/notifications/:id/read (admin)
export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!notification) throw new ApiError('Notification not found', 404);

  const unreadCount = await Notification.countDocuments({ read: false });
  res.json({ success: true, notification, unreadCount });
});
