import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

const RefundPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
          100% Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
          Refund & Buyer Protection Policy
        </h1>
        <p className="text-xs text-slate-500">Simple, transparent, risk-free guarantee</p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/30 space-y-2">
          <h2 className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            100% Money-Back Guarantee
          </h2>
          <p className="text-slate-700 dark:text-slate-200">
            If the account you purchased does not match its listing screenshots, has unexpected strikes, or cannot be accessed, you get an instant 100% refund without questions.
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
            Refunds are credited back directly to the same UPI VPA or bank account from which payment was made within 2 to 4 business hours.
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
