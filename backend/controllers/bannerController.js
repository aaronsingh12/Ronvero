import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Banner from '../models/Banner.js';
import { publishCatalogUpdate } from '../utils/catalogEvents.js';

const MAX_IMAGE_DATA_URL_BYTES = 7 * 1024 * 1024;
const supportedImageUrl = /^(https?:\/\/|\/|data:image\/(png|jpe?g|webp|gif);base64,)/i;

function normalizeImage(image, label, required = true) {
  const url = String(image?.url || '').trim();
  if (!url && !required) return { url: '', publicId: '' };
  if (!url) throw new ApiError(`${label} is required`, 400);
  if (!supportedImageUrl.test(url)) {
    throw new ApiError(`${label} must be an image URL or an uploaded JPG, PNG, WebP, or GIF`, 400);
  }
  if (url.startsWith('data:') && Buffer.byteLength(url, 'utf8') > MAX_IMAGE_DATA_URL_BYTES) {
    throw new ApiError(`${label} is too large. Choose an image smaller than 5 MB.`, 400);
  }
  return { url, publicId: String(image?.publicId || '') };
}

function normalizeBannerPayload(payload) {
  const displayOrder = Number(payload.displayOrder);
  if (!Number.isInteger(displayOrder) || displayOrder < 0) {
    throw new ApiError('Display sequence must be a whole number starting at 0', 400);
  }

  return {
    ...payload,
    image: normalizeImage(payload.image, 'Banner image'),
    mobileImage: normalizeImage(payload.mobileImage, 'Mobile banner image', false),
    displayOrder,
  };
}

// @route  GET /api/banners?position=hero
export const getBanners = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.position) filter.position = req.query.position;

  const now = new Date();
  const banners = await Banner.find(filter)
    .or([{ startDate: { $exists: false } }, { startDate: { $lte: now } }, { startDate: null }])
    .sort('displayOrder');

  // filter out expired banners (kept simple, done in JS to avoid a gnarly $or/$and mix)
  const visible = banners.filter((b) => !b.endDate || b.endDate >= now);
  res.json({ success: true, count: visible.length, banners: visible });
});

// ---------- Admin ----------

export const getAllBannersAdmin = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort('displayOrder');
  res.json({ success: true, banners });
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(normalizeBannerPayload(req.body));
  publishCatalogUpdate('banners');
  res.status(201).json({ success: true, banner });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, normalizeBannerPayload(req.body), {
    new: true,
    runValidators: true,
  });
  if (!banner) throw new ApiError('Banner not found', 404);
  publishCatalogUpdate('banners');
  res.json({ success: true, banner });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw new ApiError('Banner not found', 404);
  publishCatalogUpdate('banners');
  res.json({ success: true, message: 'Banner removed' });
});
