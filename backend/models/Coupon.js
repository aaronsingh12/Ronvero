import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null }, // caps a percentage discount
    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValidForUse = function isValidForUse(cartTotal) {
  if (!this.isActive) return { valid: false, reason: 'This coupon is no longer active' };
  if (this.expiresAt < new Date()) return { valid: false, reason: 'This coupon has expired' };
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit)
    return { valid: false, reason: 'This coupon has reached its usage limit' };
  if (cartTotal < this.minPurchase)
    return { valid: false, reason: `Minimum purchase of ₹${this.minPurchase} required` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function calculateDiscount(cartTotal) {
  if (this.discountType === 'fixed') return Math.min(this.discountValue, cartTotal);
  const raw = (cartTotal * this.discountValue) / 100;
  return this.maxDiscount ? Math.min(raw, this.maxDiscount) : raw;
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
