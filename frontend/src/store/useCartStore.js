import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const lineKey = (item) => `${item.productId}__${item.color || ''}__${item.size || ''}`;

const normalizeQuantity = (value) => {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
};

const stockLimit = (value) => {
  const stock = Number(value);
  return Number.isFinite(stock) && stock >= 0 ? Math.floor(stock) : null;
};

const capQuantity = (quantity, maxStock) => {
  const normalizedQuantity = normalizeQuantity(quantity);
  return maxStock === null ? normalizedQuantity : Math.min(normalizedQuantity, maxStock);
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { productId, name, image, price, discountPrice, color, size, quantity, maxStock }
      couponCode: '',

      addItem: (item, quantity = 1) => {
        const key = lineKey(item);
        const existing = get().items.find((i) => lineKey(i) === key);
        const incomingStock = stockLimit(item.maxStock);

        if (existing) {
          const maxStock = incomingStock ?? stockLimit(existing.maxStock);
        const nextQty = capQuantity(normalizeQuantity(existing.quantity) + normalizeQuantity(quantity), maxStock);
          if (nextQty <= existing.quantity) return false;
          set({
            items: get().items.map((i) =>
              lineKey(i) === key ? { ...i, ...item, maxStock: maxStock ?? i.maxStock, quantity: nextQty } : i
            ),
          });
        } else {
          const nextQty = capQuantity(quantity, incomingStock);
          if (nextQty <= 0) return false;
          set({ items: [...get().items, { ...item, maxStock: incomingStock ?? item.maxStock, quantity: nextQty }] });
        }
        return true;
      },

      updateQuantity: (item, quantity) => {
        const key = lineKey(item);
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => lineKey(i) !== key) });
          return;
        }
        const currentItem = get().items.find((i) => lineKey(i) === key);
        if (!currentItem) return;

        const maxStock = stockLimit(currentItem.maxStock);
        if (maxStock === 0) return;

        set({
          items: get().items.map((i) =>
            lineKey(i) === key ? { ...i, quantity: capQuantity(quantity, maxStock) } : i
          ),
        });
      },

      removeItem: (item) => set({ items: get().items.filter((i) => lineKey(i) !== lineKey(item)) }),

      clearCart: () => set({ items: [], couponCode: '' }),

      setCouponCode: (couponCode) => set({ couponCode: (couponCode || '').trim().toUpperCase() }),

      reconcileStock: (products) => {
        const productsById = new Map(products.map((product) => [product._id, product]));
        let changed = false;
        const nextItems = get().items.map((item) => {
          const product = productsById.get(item.productId);
          const size = product?.sizes?.find((entry) => entry.value === item.size);
          const maxStock = size ? stockLimit(size.stock) : 0;
          const unavailable = maxStock === 0;
          const quantity = maxStock && maxStock > 0 ? Math.min(item.quantity, maxStock) : item.quantity;
          const nextItem = { ...item, maxStock, unavailable };

          if (nextItem.maxStock !== item.maxStock || nextItem.unavailable !== item.unavailable || quantity !== item.quantity) {
            changed = true;
            nextItem.quantity = quantity;
          }
          return nextItem;
        });

        if (changed) set({ items: nextItems });
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.quantity, 0),

      toApiPayload: () =>
        get().items.map((i) => ({
          product: i.productId,
          quantity: i.quantity,
          color: i.color,
          size: i.size,
        })),
    }),
    {
      name: 'ronvero-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, couponCode: state.couponCode }),
    }
  )
);
