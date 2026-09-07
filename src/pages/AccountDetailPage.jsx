import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Mail,
  Lock,
  Globe,
  Users,
  MessageCircle,
  AlertCircle,
  ArrowLeft,
  ShoppingCart,
  Check,
  ExternalLink,
} from 'lucide-react';
import { api } from '../api/client';
import ScreenshotGallery from '../components/accounts/ScreenshotGallery';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';

const AccountDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const { formatAmount } = useCurrencyStore();
  const { addItem } = useCartStore();

  const [transferEmail, setTransferEmail] = useState(user?.email || '');
  const [emailError, setEmailError] = useState('');
  const [addedToCartAnim, setAddedToCartAnim] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['account', id],
    queryFn: () => api.getAccountById(id),
  });

  const account = data?.account;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/accounts');
    }
  };

  const handleProceedToCheckout = () => {
    if (!transferEmail || !/^\S+@\S+\.\S+$/.test(transferEmail)) {
      setEmailError('Please enter your email where account login details will be sent.');
      addToast({
        message: 'Please enter a valid transfer destination email.',
        type: 'error',
      });
      return;
    }

    setEmailError('');
    navigate(
      `/checkout?type=account&id=${account._id}&transferEmail=${encodeURIComponent(transferEmail)}`
    );
  };

  const handleAddToCart = () => {
    const res = addItem({
      id: account._id,
      type: 'account',
      title: account.title,
      subtitle: `${account.platform} • ${account.handle}`,
      price: account.price,
      image: account.screenshots?.[0] || '',
    });
    setAddedToCartAnim(true);
    setTimeout(() => setAddedToCartAnim(false), 1600);
    if (res.added) {
      addToast({ message: `"${account.title}" added to your cart!`, type: 'success' });
    } else {
      addToast({ message: res.message, type: 'info' });
    }
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hi Modern Teams, I want to know more about this account: ${account?.title} (${account?.handle}) listed for ${formatAmount(account?.price)}.`;
    window.open(
      `https://wa.me/919876543210?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 h-96 rounded-3xl shimmer-box" />
          <div className="lg:col-span-5 h-96 rounded-3xl shimmer-box" />
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass-panel text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Not Available</h2>
        <p className="text-xs text-slate-500">
          This account was either already sold or is no longer listed.
        </p>
        <Link
          to="/accounts"
          className="inline-block px-5 py-2.5 rounded-2xl bg-brand-600 text-white text-xs font-bold"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top back & breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>{account.platform}</span>
          <span>/</span>
          <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{account.handle}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Screenshots & Verification Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Screenshot Gallery */}
          <ScreenshotGallery screenshots={account.screenshots} title={account.title} />

          {/* 1-Line Info & Highlights */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/10 space-y-3">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Account Summary
            </h3>
            {/* 1-Line Clean Info */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {account.description}
            </p>

            {/* Highlights */}
            {account.highlights && account.highlights.length > 0 && (
              <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Account Verification Checklist:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {account.highlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audience Analytics Breakdown */}
          {account.audienceStats && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/10 space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-500" />
                <span>Audience Demographics</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5">
                  <span className="text-slate-400 font-medium">Audience Gender</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">
                    {account.audienceStats.genderDistribution || 'Verified Organic Balance'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5">
                  <span className="text-slate-400 font-medium">Main Age Group</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">
                    {account.audienceStats.primaryAgeGroup || '18 - 34 years'}
                  </div>
                </div>
              </div>

              {account.audienceStats.topCountries && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Top Follower Locations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {account.audienceStats.topCountries.map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-white dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5"
                      >
                        <Globe className="w-3 h-3 text-brand-500" />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Pricing, Destination Email & Checkout Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6 sticky top-28">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  {account.platform}
                </span>
                <span className="text-xs font-semibold text-slate-400">• {account.niche}</span>
                {account.verifiedBadge && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black font-display text-slate-900 dark:text-white">
                {account.title}
              </h1>
              <div className="flex items-center justify-between mt-1 pt-1">
                <span className="text-xs font-mono text-slate-500">{account.handle}</span>
                <a
                  href={
                    account.profileUrl ||
                    `https://${
                      account.platform?.toLowerCase() === 'youtube'
                        ? 'youtube.com/@'
                        : account.platform?.toLowerCase() === 'instagram'
                        ? 'instagram.com/'
                        : account.platform?.toLowerCase() === 'tiktok'
                        ? 'tiktok.com/@'
                        : account.platform?.toLowerCase() === 'telegram'
                        ? 't.me/'
                        : 'x.com/'
                    }${account.handle?.replace('@', '')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline bg-brand-500/10 hover:bg-brand-500/20 px-2.5 py-1 rounded-xl transition-all"
                  title={`Open live ${account.platform} profile`}
                >
                  <span>Visit {account.platform}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 flex items-baseline justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Buyout Price
                </div>
                <div className="text-3xl font-black font-display text-slate-900 dark:text-white mt-1">
                  {formatAmount(account.price)}
                </div>
              </div>
              {account.originalPrice > account.price && (
                <div className="text-right">
                  <span className="text-xs text-slate-400 line-through block">
                    {formatAmount(account.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-500">
                    Save {formatAmount(account.originalPrice - account.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-100 dark:border-white/5">
                <span className="text-[10px] text-slate-400">Audience</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {(account.followersCount / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-100 dark:border-white/5">
                <span className="text-[10px] text-slate-400">Engagement</span>
                <div className="font-bold text-emerald-500 mt-0.5">
                  {account.engagementRate}%
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-100 dark:border-white/5">
                <span className="text-[10px] text-slate-400">Transfer Time</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  ~{account.transferTimeHours || 1} Hour
                </div>
              </div>
            </div>

            {/* Transfer Destination Email */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Enter email where account details should be transferred:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  id="transfer-destination-email-input"
                  placeholder="yourname@gmail.com"
                  value={transferEmail}
                  onChange={(e) => {
                    setTransferEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    emailError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200/80 dark:border-white/10'
                  }`}
                />
              </div>
              {emailError ? (
                <p className="text-[11px] text-red-500 font-medium">{emailError}</p>
              ) : (
                <p className="text-[11px] text-slate-400 leading-snug">
                  * Account username, password, and recovery details will be sent directly to this email address.
                </p>
              )}
            </div>

            {/* Action Buttons: Add to Cart and Buy Now Horizontally in a Single Line */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  id="add-to-cart-account-btn"
                  className={`flex-1 py-3.5 px-3 rounded-2xl border font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                    addedToCartAnim
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 scale-[1.02]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-obsidian-850 dark:hover:bg-obsidian-800 dark:text-white border-slate-200/80 dark:border-white/10 hover:border-brand-500/50'
                  }`}
                >
                  {addedToCartAnim ? (
                    <>
                      <Check className="w-4 h-4 animate-in zoom-in duration-200" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-brand-500" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleProceedToCheckout}
                  id="buy-now-checkout-btn"
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleWhatsAppInquiry}
                id="ask-whatsapp-account-btn"
                className="w-full py-2.5 px-4 rounded-2xl border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask on WhatsApp</span>
              </button>
            </div>

            {/* Safety Assurance */}
            <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400 border-t border-slate-100 dark:border-white/5">
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Safe Transfer Guarantee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Money-Back Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailPage;
