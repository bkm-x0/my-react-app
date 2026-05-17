import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useLangStore from './langStore';

// 1 USD ≈ 135 DZD (Algerian Dinar)
const DZD_PER_USD = 135;

const getDzdLabel = () => (useLangStore.getState().lang === 'ar' ? 'دج' : 'DZD');

const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'DZD', // 'USD' | 'DZD'

      toggleCurrency: () =>
        set(state => ({ currency: state.currency === 'USD' ? 'DZD' : 'USD' })),

      formatPrice: (price) => {
        const { currency } = get();
        const num = Number(price);
        const dzdLabel = getDzdLabel();
        if (!price && price !== 0) return currency === 'USD' ? '$0' : `0 ${dzdLabel}`;
        if (currency === 'DZD') {
          return Math.round(num).toLocaleString('en-US') + ` ${dzdLabel}`;
        }
        return (Math.round((num / DZD_PER_USD) * 100) / 100).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }) + ' USD';
      },

      // Raw converted value (for thresholds/calculations)
      convert: (price) => {
        const { currency } = get();
        const num = Number(price);
        return currency === 'DZD' ? Math.round(num) : Math.round((num / DZD_PER_USD) * 100) / 100;
      },
    }),
    {
      name: 'currency-storage',
      version: 2,
      migrate: (persistedState) => ({
        ...persistedState,
        currency: 'DZD'
      })
    }
  )
);

export default useCurrencyStore;
