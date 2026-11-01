import asyncHandler from '../middleware/asyncHandler.js';
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import { createAdminNotification, notifyProductInventory } from '../utils/adminNotifications.js';
import { createPaymentIntent, retrievePaymentIntent } from '../services/stripeService.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

const FLAT_SHIPPING = 99;
const FREE_SHIPPING_THRESHOLD = 2999;
const TAX_RATE = 0.05;

/**
 * Recomputes order pricing from the database — never trusts prices sent by the client.
 * Returns { lineItems, itemsPrice, shippingPrice, taxPrice, discountAmount, totalPrice, coupon }
 */
function normalizeCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError('Cart is empty', 400);
  }

  return items.map((item) => {
    const product = String(item?.product || '');
    const quantity = Number(item?.quantity);
    const size = String(item?.size || '').trim();

    if (!mongoose.isValidObjectId(product) || !Number.isInteger(quantity) || quantity < 1 || !size) {
      throw new ApiError('Your cart contains an invalid item', 400);
    }

    return { product, quantity, size, color: String(item?.color || '').trim() };
  });
}

function buildStockReservations(lineItems) {
  const reservations = new Map();

  lineItems.forEach((item) => {
    const key = `${item.product.toString()}:${item.size}`;
    const current = reservations.get(key) || { product: item.product, size: item.size, quantity: 0 };
    current.quantity += item.quantity;
    reservations.set(key, current);
  });

  return [...reservations.values()];
}

async function reserveStock(reservations) {
  const reserved = [];
  try {
    for (const reservation of reservations) {
      const result = await Product.updateOne(
        {
          _id: reservation.product,
          status: 'active',
          sizes: { $elemMatch: { value: reservation.size, stock: { $gte: reservation.quantity } } },
        },
        { $inc: { 'sizes.$.stock': -reservation.quantity, purchaseCount: reservation.quantity } }
      );

      if (result.modifiedCount !== 1) {
        throw new ApiError('Stock changed while placing your order. Please review your cart.', 409);
      }
      reserved.push(reservation);
    }
  } catch (error) {
    await releaseStock(reserved);
    throw error;
  }
}

async function releaseStock(reservations) {
  await Promise.all(
    reservations.map((reservation) =>
      Product.updateOne(
        { _id: reservation.product, 'sizes.value': reservation.size },
        { $inc: { 'sizes.$.stock': reservation.quantity, purchaseCount: -reservation.quantity } }
      )
    )
  );
}

async function claimCoupon(coupon) {
  if (!coupon) return false;

  const filter = { _id: coupon._id, isActive: true, expiresAt: { $gte: new Date() } };
  if (coupon.usageLimit !== null) filter.usedCount = { $lt: coupon.usageLimit };

  const result = await Coupon.updateOne(filter, { $inc: { usedCount: 1 } });
  if (result.modifiedCount !== 1) {
    throw new ApiError('This coupon is no longer available', 409);
  }
  return true;
}

async function releaseCoupon(coupon) {
  if (coupon) await Coupon.updateOne({ _id: coupon._id, usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } });
}

async function priceCart(rawItems, couponCode) {
  const items = normalizeCartItems(rawItems);
  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds }, status: 'active' });

  const lineItems = items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.product);
    if (!product) throw new ApiError('One or more items are no longer available', 400);

    const sizeEntry = product.sizes.find((s) => s.value === item.size);
    if (!sizeEntry) {
      throw new ApiError(`"${product.name}" (${item.size || 'selected size'}) is out of stock`, 409);
    }

    const unitPrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;

    return {
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: unitPrice,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    };
  });

  const reservations = buildStockReservations(lineItems);
  reservations.forEach((reservation) => {
    const product = products.find((entry) => entry._id.equals(reservation.product));
    const sizeEntry = product.sizes.find((size) => size.value === reservation.size);
    if (sizeEntry.stock < reservation.quantity) {
      throw new ApiError(`"${product.name}" (${reservation.size}) does not have enough stock`, 409);
    }
  });

  const itemsPrice = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;

  let discountAmount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) throw new ApiError('Invalid coupon code', 400);
    const check = coupon.isValidForUse(itemsPrice);
    if (!check.valid) throw new ApiError(check.reason, 400);
    discountAmount = Math.round(coupon.calculateDiscount(itemsPrice) * 100) / 100;
  }

  const taxableAmount = itemsPrice - discountAmount;
  const taxPrice = Math.round(taxableAmount * TAX_RATE * 100) / 100;
  const totalPrice = Math.round((taxableAmount + taxPrice + shippingPrice) * 100) / 100;

  return { lineItems, reservations, itemsPrice, shippingPrice, taxPrice, discountAmount, totalPrice, coupon };
}

// @route  POST /api/orders/pricing  (used by cart drawer + checkout summary, no payment created)
export const getCartPricing = asyncHandler(async (req, res) => {
  const { items, couponCode } = req.body;
  const { lineItems, itemsPrice, shippingPrice, taxPrice, discountAmount, totalPrice } = await priceCart(
    items,
    couponCode
  );
  res.json({ success: true, lineItems, itemsPrice, shippingPrice, taxPrice, discountAmount, totalPrice });
});

// @route  POST /api/orders/create-payment-intent
export const createOrderPaymentIntent = asyncHandler(async (req, res) => {
  const { items, couponCode } = req.body;
  const pricing = await priceCart(items, couponCode);

  const paymentIntent = await createPaymentIntent(pricing.totalPrice * 100, 'inr', {
    userId: req.user._id.toString(),
  });

  const { coupon, reservations, ...paymentPricing } = pricing;
  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    ...paymentPricing,
  });
});

// @route  POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { items, couponCode, shippingAddress, paymentMethod, paymentResult } = req.body;
  const requiredAddressFields = ['fullName', 'phone', 'line1', 'city', 'state', 'postalCode', 'country'];
  if (
    !shippingAddress ||
    requiredAddressFields.some((field) => !String(shippingAddress[field] || '').trim())
  ) {
    throw new ApiError('A complete shipping address is required', 400);
  }

  const normalizedPaymentMethod = paymentMethod === 'cod' ? 'cod' : 'stripe';

  const pricing = await priceCart(items, couponCode);
  let verifiedPaymentResult;

  if (normalizedPaymentMethod === 'stripe') {
    const paymentIntentId = String(paymentResult?.id || '');
    if (!paymentIntentId) throw new ApiError('A completed card payment is required', 400);

    const duplicateOrder = await Order.exists({ 'paymentResult.id': paymentIntentId });
    if (duplicateOrder) throw new ApiError('This payment has already been used for an order', 409);

    const paymentIntent = await retrievePaymentIntent(paymentIntentId);
    const expectedAmount = Math.round(pricing.totalPrice * 100);
    if (
      paymentIntent.status !== 'succeeded' ||
      paymentIntent.amount !== expectedAmount ||
      paymentIntent.currency !== 'inr' ||
      paymentIntent.metadata?.userId !== req.user._id.toString()
    ) {
      throw new ApiError('Payment could not be verified', 400);
    }

    verifiedPaymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      updateTime: new Date().toISOString(),
      email: paymentIntent.receipt_email || req.user.email,
    };
  }

  await reserveStock(pricing.reservations);
  let couponClaimed = false;
  let order;
  try {
    couponClaimed = await claimCoupon(pricing.coupon);
    order = await Order.create({
      user: req.user._id,
      orderItems: pricing.lineItems,
      shippingAddress,
      paymentMethod: normalizedPaymentMethod,
      paymentResult: verifiedPaymentResult,
      couponCode: pricing.coupon?.code || null,
      itemsPrice: pricing.itemsPrice,
      shippingPrice: pricing.shippingPrice,
      taxPrice: pricing.taxPrice,
      discountAmount: pricing.discountAmount,
      totalPrice: pricing.totalPrice,
      isPaid: normalizedPaymentMethod === 'stripe',
      paidAt: normalizedPaymentMethod === 'stripe' ? new Date() : undefined,
    });
  } catch (error) {
    if (couponClaimed) await releaseCoupon(pricing.coupon);
    await releaseStock(pricing.reservations);
    throw error;
  }

  await createAdminNotification({
    type: 'order',
    title: 'New order received',
    message: `${order.orderNumber} was placed for INR ${order.totalPrice}.`,
    severity: 'success',
    entityType: 'Order',
    entityId: order._id,
    metadata: { status: order.status, totalPrice: order.totalPrice },
  });

  const affectedProductIds = [...new Set(pricing.lineItems.map((item) => item.product.toString()))];
  const affectedProducts = await Product.find({ _id: { $in: affectedProductIds } }).select('name sizes');
  await Promise.all(affectedProducts.map((product) => notifyProductInventory(product)));

  sendOrderConfirmationEmail(req.user.email, req.user.name, order).catch((e) =>
    console.error('Order email failed:', e.message)
  );

  res.status(201).json({ success: true, order });
});

// @route  GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Order.countDocuments({ user: req.user._id });
  res.json({ success: true, count: orders.length, total, orders });
});

// @route  GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new ApiError('Order not found', 404);

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw new ApiError('Not authorized to view this order', 403);

  res.json({ success: true, order });
});

// ---------- Admin ----------

// @route  GET /api/orders (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Order.countDocuments(filter);
  res.json({ success: true, count: orders.length, total, orders });
});

// @route  PUT /api/orders/:id/status (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) throw new ApiError('Invalid order status', 400);
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError('Order not found', 404);

  if (order.status === 'cancelled' && status !== 'cancelled') {
    throw new ApiError('Cancelled orders cannot be reopened', 409);
  }
  if (order.status === 'cancelled' && status === 'cancelled') {
    throw new ApiError('This order is already cancelled', 409);
  }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    // Cash-on-delivery is collected on delivery — mark it paid so it counts
    // toward revenue analytics (which only match { isPaid: true }).
    if (order.paymentMethod === 'cod' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }
  }
  if (status === 'cancelled') order.cancelledAt = new Date();

  await order.save();
  if (status === 'cancelled') {
    await releaseStock(buildStockReservations(order.orderItems));
  }
  await createAdminNotification({
    type: 'order',
    title: `Order ${status}`,
    message: `${order.orderNumber} was marked ${status}.`,
    severity: status === 'delivered' ? 'success' : status === 'cancelled' ? 'warning' : 'info',
    entityType: 'Order',
    entityId: order._id,
    metadata: { status, trackingNumber: trackingNumber || order.trackingNumber || '' },
  });

  res.json({ success: true, order });
});

// @route  GET /api/orders/analytics/summary (admin)
export const getSalesAnalytics = asyncHandler(async (req, res) => {
  const [summary] = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: '$totalPrice' },
      },
    },
  ]);

  const revenueByDay = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: { isPaid: true } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        unitsSold: { $sum: '$orderItems.quantity' },
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    success: true,
    summary: summary || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
    revenueByDay,
    topProducts,
  });
});
