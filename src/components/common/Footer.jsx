import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Smartphone, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-obsidian-900/60 pt-16 pb-12 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200/60 dark:border-white/5">
          {/* Column 1: Brand & Safe Guarantee */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-base shadow-md">
                ▲
              </div>
              <span className="text-lg font-black font-display tracking-tight text-slate-900 dark:text-white">
                MODERN TEAMS
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The global trusted marketplace for verified social media accounts, high-quality development services, and paid engineering internships.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Safe Buyer Protection Guarantee</span>
            </div>
          </div>

          {/* Column 2: Social Media Marketplace */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 text-[11px]">
              Social Accounts
            </h5>
            <ul className="space-y-2.5">
              <li>
                <Link to="/accounts?platform=Instagram" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Instagram Verified Pages
                </Link>
              </li>
              <li>
                <Link to="/accounts?platform=YouTube" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Monetized YouTube Channels
                </Link>
              </li>
              <li>
                <Link to="/accounts?platform=X/Twitter" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  X / Twitter Premium Accounts
                </Link>
              </li>
              <li>
                <Link to="/accounts?platform=Telegram" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Telegram VIP Communities
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services & Internships */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 text-[11px]">
              Services & Careers
            </h5>
            <ul className="space-y-2.5">
              <li>
                <Link to="/services" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Full Stack Website & App Dev
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Organic Growth & Marketing
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Paid Engineering Internships
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Contact Support Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: UPI Payment & Safety */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 text-[11px]">
              Payment & Security
            </h5>
            <div className="p-4 rounded-2xl bg-white dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>Instant UPI Accepted</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Pay via GPay, PhonePe, Paytm, or BHIM. Safe transfer with 100% money-back guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal page links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Modern Teams. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              About Us
            </Link>
            <Link to="/privacy-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Refund Policy
            </Link>
            <Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
