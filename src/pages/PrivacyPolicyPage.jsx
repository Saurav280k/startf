import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicyPage = () => {
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
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full">
          Legal & Privacy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">Last updated: September 2026</p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-500" />
            1. Information We Collect
          </h2>
          <p>
            When you use Modern Teams, we collect your contact email, phone number, and destination transfer email solely to fulfill your account transfer, delivery, and internship application review.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            2. How We Secure Your Data
          </h2>
          <p>
            All passwords are encrypted with bcrypt hashes before being stored in our database. We never store credit card numbers on our servers. All UPI transactions are verified using standard bank reference numbers (UTR).
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-500" />
            3. Account Credentials Safety
          </h2>
          <p>
            Login credentials for purchased social media accounts are never displayed publicly. They are sent strictly to your confirmed destination email address.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" />
            4. Contact Us
          </h2>
          <p>
            If you have any questions regarding your data or privacy, contact our support team on WhatsApp anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
