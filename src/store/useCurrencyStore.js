import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'INR', // 'INR' | 'USD'
      exchangeRate: 85, // 1 USD = 85 INR

      toggleCurrency: () =>
        set((state) => ({
          currency: state.currency === 'INR' ? 'USD' : 'INR',
        })),

      setCurrency: (currency) => set({ currency }),

      formatAmount: (amountInINR) => {
        const num = Number(amountInINR) || 0;
        const { currency, exchangeRate } = get();
        if (currency === 'USD') {
          const usd = Math.round(num / exchangeRate);
          return `$${usd.toLocaleString('en-US')}`;
        }
        return `₹${num.toLocaleString('en-IN')}`;
      },

      convertAmount: (amountInINR) => {
        const num = Number(amountInINR) || 0;
        const { currency, exchangeRate } = get();
        if (currency === 'USD') {
          return Math.round(num / exchangeRate);
        }
        return num;
      },

      getSymbol: () => (get().currency === 'USD' ? '$' : '₹'),
    }),
    {
      name: 'modern-teams-currency',
    }
  )
);
