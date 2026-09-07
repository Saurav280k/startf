import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, CheckCircle2, Clock, ArrowRight, ShieldCheck, Mail, MessageCircle, AlertCircle, ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const { formatAmount } = useCurrencyStore();
  const { addItem } = useCartStore();

  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const [deliveryEmail, setDeliveryEmail] = useState(user?.email || '');
  const [emailError, setEmailError] = useState('');
  const [addedToCartAnim, setAddedToCartAnim] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: () => api.getServiceById(id),
  });

  const service = data?.service;
  const currentTier = service?.pricingTiers?.[selectedTierIdx] || service?.pricingTiers?.[0];

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/services');
    }
  };

  const handleProceed = () => {
    if (!deliveryEmail || !/^\S+@\S+\.\S+$/.test(deliveryEmail)) {
      setEmailError('Please enter a valid email address for project updates and onboarding.');
      addToast({ message: 'Valid email required to start your project.', type: 'error' });
      return;
    }

    navigate(
      `/checkout?type=service&id=${service._id}&tier=${encodeURIComponent(
        currentTier.tierName
      )}&transferEmail=${encodeURIComponent(deliveryEmail)}`
    );
  };

  const handleAddToCart = () => {
    const res = addItem({
      id: service._id,
      type: 'service',
      title: service.title,
      subtitle: `${service.category} • ${currentTier?.tierName || 'Starter'} Package`,
      tierName: currentTier?.tierName || 'Starter',
      price: currentTier?.price || 9999,
      image: '',
    });
    setAddedToCartAnim(true);
    setTimeout(() => setAddedToCartAnim(false), 1600);
    if (res.added) {
      addToast({
        message: `"${service.title} (${currentTier?.tierName})" added to cart!`,
        type: 'success',
      });
    } else {
      addToast({ message: res.message, type: 'info' });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 rounded-3xl shimmer-box" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass-panel text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Service Not Found</h2>
        <Link to="/services" className="inline-block px-5 py-2.5 rounded-2xl bg-brand-600 text-white text-xs font-bold">
          Return to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top back & navigation bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </button>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
          {service.category}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details & Tier Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              {service.title}
            </h1>
            {/* 1-Line Clean Info */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Pricing Tier Selector - Vibrant Blue Active Highlight (NO SILVER) */}
          <div className="space-y-3">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Choose Your Package:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {service.pricingTiers?.map((tier, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedTierIdx(idx)}
                  className={`p-5 rounded-3xl text-left border-2 transition-all flex flex-col justify-between cursor-pointer ${
                    selectedTierIdx === idx
                      ? 'border-brand-500 bg-brand-500/10 dark:bg-brand-950/50 shadow-xl ring-2 ring-brand-500/30'
                      : 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-obsidian-900 hover:border-brand-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold ${
                        selectedTierIdx === idx ? 'text-brand-600 dark:text-brand-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {tier.tierName}
                      </span>
                      {tier.isPopular && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-600 text-white">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
                      {formatAmount(tier.price)}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-4 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span>~{tier.turnaroundDays || 5} Days Delivery</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Tier Feature Checklist */}
          {currentTier && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                What you get in {currentTier.tierName} package:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentTier.features?.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Confirmation Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6 sticky top-28">
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Order Summary
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 space-y-1">
              <div className="text-xs text-slate-400">Selected Package</div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {service.title} ({currentTier?.tierName})
              </div>
              <div className="text-2xl font-black font-display text-brand-600 dark:text-brand-400 pt-2">
                {formatAmount(currentTier?.price || 0)}
              </div>
            </div>

            {/* Email specification */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Your Email for Project Delivery:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={deliveryEmail}
                  onChange={(e) => setDeliveryEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              {emailError && <p className="text-[11px] text-red-500">{emailError}</p>}
            </div>

            {/* Action Buttons: Add to Cart & Buy Now Horizontally in a Single Line */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                id="add-to-cart-service-btn"
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
                onClick={handleProceed}
                id="buy-now-service-btn"
                className="flex-1 py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-2">
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Hi, I want to discuss about ${service.title} (${currentTier?.tierName} tier) before paying.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Have questions? Chat on WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Money-Back Guarantee if not satisfied</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
