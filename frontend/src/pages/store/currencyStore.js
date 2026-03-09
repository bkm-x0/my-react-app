import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1 USD ≈ 135 DZD (Algerian Dinar)
const USD_TO_DZD = 135;

const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'USD', // 'USD' | 'DZD'

      toggleCurrency: () =>
        set(state => ({ currency: state.currency === 'USD' ? 'DZD' : 'USD' })),

      formatPrice: (price) => {
        const { currency } = get();
        const num = Number(price);
        if (!price && price !== 0) return currency === 'USD' ? '$0' : '0 دج';
        if (currency === 'DZD') {
          const dzdPrice = Math.round(num * USD_TO_DZD);
          return dzdPrice.toLocaleString('ar-DZ') + ' دج';
        }
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      },

      // Raw converted value (for thresholds/calculations)
      convert: (price) => {
        const { currency } = get();
        const num = Number(price);
        return currency === 'DZD' ? Math.round(num * USD_TO_DZD) : num;
      },
    }),
    { name: 'currency-storage' }
  )
);

export default useCurrencyStore;
