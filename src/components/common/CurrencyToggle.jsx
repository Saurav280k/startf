import React from 'react';
import { useCurrencyStore } from '../../store/useCurrencyStore';

const CurrencyToggle = ({ className = '' }) => {
  const { currency, toggleCurrency } = useCurrencyStore();

  return (
    <button
      onClick={toggleCurrency}
      id="currency-toggle-btn"
      type="button"
      aria-label="Toggle currency"
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-obsidian-850 dark:hover:bg-obsidian-800 dark:text-white transition-colors duration-200 border border-slate-200/80 dark:border-white/10 text-xs font-bold font-mono tracking-wider cursor-pointer shadow-sm ${className}`}
      title={`Current currency: ${currency}. Click to switch to ${currency === 'INR' ? 'USD' : 'INR'}`}
    >
      <span className="w-5 h-5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 dark:bg-brand-500/20 flex items-center justify-center font-black text-xs">
        {currency === 'INR' ? '₹' : '$'}
      </span>
      <span className="text-slate-900 dark:text-white font-bold">{currency}</span>
    </button>
  );
};

export default CurrencyToggle;
