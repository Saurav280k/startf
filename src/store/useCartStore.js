import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        // Check if item with same id and tierName already exists
        const exists = items.some(
          (i) => i.id === item.id && (i.tierName || '') === (item.tierName || '')
        );

        if (exists) {
          return { added: false, message: 'Item is already in your cart' };
        }

        set({ items: [...items, { ...item, quantity: 1, addedAt: Date.now() }] });
        return { added: true, message: 'Added to cart successfully' };
      },

      removeItem: (id, tierName = '') => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && (i.tierName || '') === (tierName || ''))
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'apex-cart-storage',
    }
  )
);
