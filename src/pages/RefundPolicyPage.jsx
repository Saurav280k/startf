import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2, Clock, ArrowRight, RotateCcw } from 'lucide-react';

const RefundPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <Link
          to="/my-orders"
          id="refund-policy-cta-top-btn"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Request a Refund</span>
        </Link>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full inline-block border border-emerald-500/20">
          100% Protection
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
          Refund & Buyer Protection Policy
        </h1>
        <p className="text-xs text-slate-500">Simple, transparent, risk-free buyer satisfaction guarantee</p>
      </div>

      {/* Prominent Action Banner for Requesting Refund */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-500/10 via-brand-500/10 to-purple-500/10 border-2 border-red-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-red-600 dark:text-red-400 font-black text-sm sm:text-base">
            <RotateCcw className="w-4 h-4" />
            <span>Need to Request a Refund for an Order?</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Select your purchase from My Orders and click "Request Refund" to submit your refund claim in 1-click.
          </p>
        </div>
        <Link
          to="/my-orders"
          id="refund-policy-cta-main-btn"
          className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 whitespace-nowrap transition-all active:scale-95 flex items-center gap-2"
        >
          <span>Open My Orders & Request Refund</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/30 space-y-2">
          <h2 className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            100% Money-Back Guarantee
          </h2>
          <p className="text-slate-700 dark:text-slate-200">
            If the account you purchased does not match its listing screenshots, has unexpected strikes, or cannot be accessed, you get an instant 100% refund back to your UPI ID without hassle.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            1. 24-Hour Inspection Window
          </h3>
          <p>
            You have 24 hours after receiving account details to inspect followers, check AdSense earnings, and verify original email access.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-purple-500" />
            2. How Refunds are Processed
          </h3>
          <p>
            Refunds are credited back directly to your submitted UPI ID within 2 to 4 business hours after admin verification.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            3. Digital Services Satisfaction
          </h3>
          <p>
            All custom web and app development projects include milestone revisions. If we fail to deliver on agreed requirements, a refund is promptly credited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
