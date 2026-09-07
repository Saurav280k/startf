import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, TrendingUp, ArrowUpRight, ShieldCheck, ShoppingCart, Check } from 'lucide-react';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
};

const getPlatformBadge = (platform) => {
  switch (platform) {
    case 'Instagram':
      return {
        bg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 text-white',
        text: 'Instagram',
      };
    case 'YouTube':
      return {
        bg: 'bg-red-600 text-white',
        text: 'YouTube',
      };
    case 'TikTok':
      return {
        bg: 'bg-slate-900 dark:bg-white text-white dark:text-slate-950',
        text: 'TikTok',
      };
    case 'X/Twitter':
      return {
        bg: 'bg-black text-white border border-white/20',
        text: 'X / Twitter',
      };
    case 'Telegram':
      return {
        bg: 'bg-sky-500 text-white',
        text: 'Telegram',
      };
    default:
      return {
        bg: 'bg-brand-600 text-white',
        text: platform,
      };
  }
};

const AccountCard = ({ account }) => {
  const { formatAmount } = useCurrencyStore();
  const { items, addItem, removeItem } = useCartStore();
  const { addToast } = useToastStore();
  const badge = getPlatformBadge(account.platform);
  const discountPercent = Math.round(
    ((account.originalPrice - account.price) / account.originalPrice) * 100
  );

  const inCart = items.some((i) => i.id === account._id);

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      removeItem(account._id);
      addToast({ message: `Removed ${account.title} from cart`, type: 'info' });
    } else {
      addItem({
        id: account._id,
        type: 'account',
        title: account.title,
        price: account.price,
        platform: account.platform,
        handle: account.handle,
        subtitle: `${account.platform} • ${account.handle}`,
        image: account.screenshots?.[0] || '',
      });
      addToast({ message: `Added ${account.title} to cart!`, type: 'success' });
    }
  };

  return (
    <Link
      to={`/accounts/${account._id}`}
      className="group relative block rounded-3xl p-5 bg-white dark:bg-obsidian-900/80 border border-slate-200/80 dark:border-white/10 hover:border-brand-500/80 dark:hover:border-brand-500/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Screenshot Image Preview with Badges */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-obsidian-800">
          <img
            src={account.screenshots[0]}
            alt={account.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

          {/* Platform badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md ${badge.bg}`}>
              {badge.text}
            </span>
            {account.verifiedBadge && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white shadow-md">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {/* Monthly Earning Pill */}
          {account.monetizationEnabled && (
            <div className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
              <span>Earns {formatAmount(account.monthlyRevenue)}/mo</span>
            </div>
          )}

          {/* Handle & Niche overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-mono font-medium opacity-90 truncate max-w-[180px]">
              {account.handle}
            </span>
            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium">
              {account.niche}
            </span>
          </div>
        </div>

        {/* 1-Line Info & Stats */}
        <div className="space-y-3">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {account.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {account.summary}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
              <span className="text-[11px] text-slate-400 font-normal">Followers</span>
              <span>{formatNumber(account.followersCount)}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 flex items-center justify-between font-semibold text-emerald-500">
              <span className="text-[11px] text-slate-400 font-normal">Engagement</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {account.engagementRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Price & Link */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black font-display text-slate-900 dark:text-white">
              {formatAmount(account.price)}
            </span>
            {account.originalPrice > account.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatAmount(account.originalPrice)}
              </span>
            )}
          </div>
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold text-emerald-500">
              Save {discountPercent}% today
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCartClick}
            title={inCart ? 'Remove from Cart' : 'Add to Cart'}
            className={`p-2 rounded-2xl transition-all ${
              inCart
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-800 dark:hover:bg-obsidian-750 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200/60 dark:border-white/5'
            }`}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>

          <span className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-slate-900 group-hover:bg-brand-600 dark:bg-white dark:group-hover:bg-brand-400 text-white dark:text-slate-950 dark:group-hover:text-white text-xs font-bold transition-all shadow-sm">
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AccountCard;
