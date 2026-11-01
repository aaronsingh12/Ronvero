import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Coupon from '../models/Coupon.js';

// @route  POST /api/coupons/validate
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body;
  const coupon = await Coupon.findOne({ code: (code || '').toUpperCase() });

  if (!coupon) throw new ApiError('Invalid coupon code', 404);

  const check = coupon.isValidForUse(cartTotal || 0);
  if (!check.valid) throw new ApiError(check.reason, 400);

  const discount = coupon.calculateDiscount(cartTotal || 0);
  res.json({
    success: true,
    coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
    discount,
  });
});

// ---------- Admin ----------

export const getAllCouponsAdmin = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ success: true, coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) throw new ApiError('Coupon not found', 404);
  res.json({ success: true, coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError('Coupon not found', 404);
  res.json({ success: true, message: 'Coupon removed' });
});
