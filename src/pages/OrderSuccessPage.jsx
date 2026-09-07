import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  MessageCircle,
  Mail,
  Copy,
  ArrowLeft,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { useToastStore } from '../store/useToastStore';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.getOrderById(id),
  });

  const order = data?.order;

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    } catch (e) {}

    // Prevent accidental browser back button from re-submitting payment
    const handlePopState = () => {
      navigate('/my-orders', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast({ message: 'Copied to clipboard!', type: 'info' });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="h-96 rounded-3xl shimmer-box" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass-panel text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
        <Link to="/" className="px-5 py-2.5 rounded-2xl bg-brand-600 text-white text-xs font-bold">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Top back navigation safely pointing to My Orders */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>View All My Orders</span>
        </Link>
        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          100% Safe Buyer Guarantee
        </span>
      </div>

      {/* Success Badge & Headline */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          {order.verificationStatus || 'Pending Admin Approval'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-950 dark:text-white">
          Payment Details Submitted!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Your UPI payment has been received. Our team will verify your 12-digit transaction UTR and transfer your account details within 1-2 hours.
        </p>
      </div>

      {/* Primary Receipt Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6">
        {/* Top Order Details */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Order Number
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                {order.orderNumber}
              </span>
              <button
                onClick={() => copyToClipboard(order.orderNumber)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Paid Amount
            </span>
            <div className="text-2xl font-black font-display text-emerald-500 mt-0.5">
              ₹{order.amount.toLocaleString('en-IN')} INR
            </div>
          </div>
        </div>

        {/* Transfer Destination Highlight Box */}
        <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border-2 border-blue-500/50 dark:border-blue-500/70 space-y-2.5 shadow-sm shadow-blue-500/10">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 dark:bg-blue-500/25 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <span className="uppercase tracking-wider">Account Details Delivery Email</span>
          </div>
          <div className="text-base sm:text-lg font-mono font-bold text-slate-900 dark:text-white pl-0.5">
            {order.transferDestinationEmail}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Your login username, password, and security codes will be delivered to this email within{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{order.transferEta || '1 - 2 Hours'}</span>.
          </p>
        </div>

        {/* UPI UTR Verification Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Submitted UPI Transaction ID (UTR):</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {order.upiTransactionId || 'Under verification'}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500">
            {order.verificationStatus || 'Pending Admin Approval'}
          </span>
        </div>

        {/* Step-by-Step Delivery Tracker */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Handoff Progress Tracker
          </h4>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                ✓
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Payment Submitted by Buyer
                </div>
                <div className="text-[11px] text-slate-400">UTR: {order.upiTransactionId}</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Submitted
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                2
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Admin Verification & Credentials Dispatch
                </div>
                <div className="text-[11px] text-slate-400">
                  Sending details to {order.transferDestinationEmail}
                </div>
              </div>
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
                In Progress
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 opacity-60">
              <div className="w-8 h-8 rounded-xl bg-slate-300 dark:bg-obsidian-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Buyer Verification & Order Complete
                </div>
                <div className="text-[11px] text-slate-400">Log in, change password, and enjoy your new account</div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Next Step</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-3">
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(
              `Hi Apex Support, I have submitted UPI payment for order ${order.orderNumber} (UTR: ${order.upiTransactionId}). Please verify and transfer details.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 px-4 rounded-2xl border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Support</span>
          </a>

          <Link
            to="/my-orders"
            className="flex-1 py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-600/25"
          >
            <span>My Orders & Purchases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
