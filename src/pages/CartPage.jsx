import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Sparkles,
  Layers,
  CreditCard,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useToastStore } from '../store/useToastStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, getTotal } = useCartStore();
  const { formatAmount } = useCurrencyStore();
  const { addToast } = useToastStore();

  const totalAmount = getTotal();

  const handleRemove = (id, tierName, title) => {
    removeItem(id, tierName);
    addToast({
      message: `Removed "${title}" from your cart`,
      type: 'info',
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      addToast({ message: 'Your cart is empty', type: 'error' });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-28">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/accounts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Safe Buyer Protection</span>
        </div>
      </div>

      {/* Cart Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shopping Cart</span>
          </div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">
            Your Cart ({items.length} {items.length === 1 ? 'Item' : 'Items'})
          </h1>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer"
          >
            Clear Entire Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="rounded-3xl p-12 text-center bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your cart is empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse verified social accounts or custom engineering services to add items to your cart.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/accounts"
              className="flex-1 py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs text-center transition-all shadow-md shadow-brand-600/25"
            >
              Explore Accounts
            </Link>
            <Link
              to="/services"
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-obsidian-850 hover:bg-slate-200 dark:hover:bg-obsidian-800 text-slate-800 dark:text-slate-200 font-bold text-xs text-center transition-all border border-slate-200/60 dark:border-white/5"
            >
              View Services
            </Link>
          </div>
        </div>
      ) : (
        /* Cart Items Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item, idx) => (
              <div
                key={`${item.id}-${item.tierName || idx}`}
                className="p-5 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-brand-500/40"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {item.image ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200/80 dark:border-white/10">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
                      {item.type === 'account' ? (
                        <Layers className="w-7 h-7" />
                      ) : (
                        <Sparkles className="w-7 h-7" />
                      )}
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        {item.type === 'account' ? 'Social Account' : 'Digital Service'}
                      </span>
                      {item.tierName && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          {item.tierName} Package
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                  <div className="text-right">
                    <div className="text-lg font-black font-display text-slate-900 dark:text-white">
                      {formatAmount(item.price)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, item.tierName, item.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-6 sticky top-28">
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/5">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Subtotal ({items.length} items):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatAmount(totalAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Buyer Protection Guarantee:</span>
                  <span className="font-bold text-emerald-500">FREE</span>
                </div>

                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Estimated Delivery:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Within 1 - 2 Hours</span>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Total Price:</span>
                  <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                    {formatAmount(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Proceed to Checkout ({formatAmount(totalAmount)})</span>
              </button>

              {/* Safety Badge Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Buyer Satisfaction Guarantee</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  Every asset purchase is backed by money-back guarantee. Admin verifies ownership release before completing transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Middle Bar for Instant Total and Quick Checkout */}
      {items.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] sm:w-auto min-w-[320px] sm:min-w-[420px] max-w-lg bg-slate-950/95 dark:bg-obsidian-850/95 backdrop-blur-2xl text-white rounded-full p-3 sm:px-6 shadow-2xl border border-slate-700/60 dark:border-white/20 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-6">
          <div className="flex flex-col pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>
            <span className="text-lg sm:text-xl font-black font-display text-white">
              {formatAmount(totalAmount)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            id="cart-sticky-pay-now-btn"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-brand-600/40 cursor-pointer"
          >
            <span>Pay Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
