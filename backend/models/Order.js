import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    color: { type: String },
    size: { type: String },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, unique: true },
    orderItems: { type: [orderItemSchema], validate: (v) => v.length > 0 },

    shippingAddress: { type: addressSnapshotSchema, required: true },
    paymentMethod: { type: String, enum: ['stripe', 'cod'], default: 'stripe' },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      email: String,
    },

    couponCode: { type: String, default: null },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: { type: String },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre('save', function generateOrderNumber(next) {
  if (!this.orderNumber) {
    this.orderNumber = `RNV-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'paymentResult.id': 1 }, { unique: true, sparse: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
