import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/ApiFeatures.js';
import User from '../models/User.js';

// @route  PUT /api/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;

  await user.save();
  res.json({ success: true, user: user.toSafeObject() });
});

// @route  GET /api/users/addresses
export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, addresses: user.addresses });
});

// @route  POST /api/users/addresses
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

// @route  PUT /api/users/addresses/:addressId
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new ApiError('Address not found', 404);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }
  Object.assign(address, req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// @route  DELETE /api/users/addresses/:addressId
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.addressId);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// @route  GET /api/users/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    select: 'name slug price discountPrice images ratingsAverage ratingsQuantity sizes',
  });
  res.json({ success: true, wishlist: user.wishlist });
});

// @route  POST /api/users/wishlist/:productId
export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;
  const exists = user.wishlist.some((id) => id.toString() === productId);

  if (exists) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  // Return the same populated shape as GET /wishlist so the client gets a
  // consistent structure from both endpoints.
  await user.populate({
    path: 'wishlist',
    select: 'name slug price discountPrice images ratingsAverage ratingsQuantity sizes',
  });
  res.json({ success: true, inWishlist: !exists, wishlist: user.wishlist });
});

// ---------- Admin ----------

// @route  GET /api/users (admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(User.find(), req.query).search(['name', 'email']).filter().sort().paginate();
  const countFeatures = new ApiFeatures(User.find(), req.query).search(['name', 'email']).filter();
  const [users, total] = await Promise.all([features.query, countFeatures.query.countDocuments()]);
  res.json({ success: true, count: users.length, total, users });
});

// @route  PUT /api/users/:id/role (admin)
export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  if (!user) throw new ApiError('User not found', 404);
  res.json({ success: true, user: user.toSafeObject() });
});

// @route  DELETE /api/users/:id (admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError('User not found', 404);
  res.json({ success: true, message: 'User removed' });
});
