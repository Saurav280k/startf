import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full inline-block border border-brand-500/20">
          Rules & Safety
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
          Terms of Service & Buyer Rules
        </h1>
        <p className="text-xs text-slate-500">Last updated: September 2026</p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            1. Account Purchase & Ownership
          </h2>
          <p>
            When purchasing a verified social media account or channel on Modern Teams, the buyer receives 100% full ownership, including login username, password, and original recovery email (OGE).
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            2. Payment & Verification Window
          </h2>
          <p>
            Payments are made via UPI QR scan. Once you enter your 12-digit UPI UTR number, admin verifies the transaction and initiates credential transfer within 1 to 2 hours.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            3. Buyer Responsibility
          </h2>
          <p>
            Upon receiving account credentials, the buyer must immediately log in, verify all details, change the password, and enable their own two-factor authentication (2FA).
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" />
            4. Internship Applications
          </h2>
          <p>
            All submitted applications are evaluated based on merit and practical portfolio projects. Applying does not guarantee selection, but every shortlisted candidate receives an email and WhatsApp update within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
