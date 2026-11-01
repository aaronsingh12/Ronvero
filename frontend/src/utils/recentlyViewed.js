const KEY = 'ronvero-recently-viewed';
const MAX_ITEMS = 8;

export function trackRecentlyViewed(productId) {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]');
    const next = [productId, ...existing.filter((id) => id !== productId)].slice(0, MAX_ITEMS);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (err) {
    // localStorage unavailable (private browsing, etc.) — safe to no-op
  }
}

export function getRecentlyViewed(excludeId) {
  try {
    const ids = JSON.parse(localStorage.getItem(KEY) || '[]');
    return ids.filter((id) => id !== excludeId);
  } catch (err) {
    return [];
  }
}
