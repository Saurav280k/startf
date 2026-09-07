import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Users, Award, Sparkles } from 'lucide-react';

const AboutUsPage = () => {
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
          About Modern Teams
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
          The World's Most Trusted Digital Properties Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          We help creators and entrepreneurs safely buy verified social media accounts, access high-quality engineering services, and train the next generation of engineers through paid internships.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% Safe Transfers</h3>
          <p className="text-xs text-slate-500">Every account is verified by our team before being listed.</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Mentorship</h3>
          <p className="text-xs text-slate-500">Interns learn directly from senior full stack engineers.</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Fast Delivery</h3>
          <p className="text-xs text-slate-500">Average ownership transfer completed within 1 to 2 hours.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
