import Notification from '../models/Notification.js';

const LOW_STOCK_THRESHOLD = 5;
const DEFAULT_DEDUPE_WINDOW_MS = 30 * 60 * 1000;

export const createAdminNotification = async (payload, options = {}) => {
  try {
    const metadata = { ...(payload.metadata || {}) };

    if (options.dedupeKey) {
      const since = new Date(Date.now() - (options.dedupeWindowMs || DEFAULT_DEDUPE_WINDOW_MS));
      const existing = await Notification.exists({
        read: false,
        'metadata.dedupeKey': options.dedupeKey,
        createdAt: { $gte: since },
      });

      if (existing) return null;
      metadata.dedupeKey = options.dedupeKey;
    }

    return await Notification.create({ ...payload, metadata });
  } catch (error) {
    console.error('Admin notification failed:', error.message);
    return null;
  }
};

export const getProductTotalStock = (product) => {
  if (!product?.sizes?.length) return 0;
  return product.sizes.reduce((sum, size) => sum + Number(size.stock || 0), 0);
};

export const notifyProductInventory = async (product) => {
  const totalStock = getProductTotalStock(product);
  const productId = product._id;

  if (totalStock === 0) {
    return createAdminNotification(
      {
        type: 'inventory',
        title: `${product.name} is out of stock`,
        message: 'Total stock is 0. Add stock or move the product to draft.',
        severity: 'critical',
        entityType: 'Product',
        entityId: productId,
        metadata: { totalStock },
      },
      { dedupeKey: `product:${productId}:out-of-stock`, dedupeWindowMs: 12 * 60 * 60 * 1000 }
    );
  }

  if (totalStock <= LOW_STOCK_THRESHOLD) {
    return createAdminNotification(
      {
        type: 'inventory',
        title: `${product.name} is low on stock`,
        message: `Only ${totalStock} units are left in stock.`,
        severity: 'warning',
        entityType: 'Product',
        entityId: productId,
        metadata: { totalStock },
      },
      { dedupeKey: `product:${productId}:low-stock`, dedupeWindowMs: 12 * 60 * 60 * 1000 }
    );
  }

  return null;
};
