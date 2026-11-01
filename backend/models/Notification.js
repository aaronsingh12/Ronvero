import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['order', 'inventory', 'product', 'category', 'system'],
      default: 'system',
      index: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, trim: true, default: '' },
    severity: {
      type: String,
      enum: ['info', 'success', 'warning', 'critical'],
      default: 'info',
      index: true,
    },
    read: { type: Boolean, default: false, index: true },
    entityType: {
      type: String,
      enum: ['Order', 'Product', 'Category', 'Review', 'Coupon', 'Banner', 'Collection', 'Testimonial', 'System'],
      default: 'System',
    },
    entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
