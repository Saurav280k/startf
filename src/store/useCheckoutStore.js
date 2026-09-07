import { create } from 'zustand';

export const useCheckoutStore = create((set) => ({
  buyerEmail: '',
  buyerPhone: '',
  transferDestinationEmail: '',
  upiTransactionId: '',
  notes: '',

  setCheckoutData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  clearCheckoutData: () =>
    set({
      buyerEmail: '',
      buyerPhone: '',
      transferDestinationEmail: '',
      upiTransactionId: '',
      notes: '',
    }),
}));
