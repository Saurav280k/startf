import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  MessageCircle,
  FileText,
  RotateCcw,
  Info,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-obsidian-900/80 pt-12 pb-10 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200/60 dark:border-white/5">
          {/* Column 1: Brand & Buyer Protection Guarantee */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform">
                ▲
              </div>
              <div>
                <span className="text-lg font-black font-display tracking-tight text-slate-900 dark:text-white block">
                  MODERN TEAMS
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">
                  Verified Digital Assets & Services
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The premier platform for buying verified social media accounts, on-demand digital engineering services, and paid tech internships.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Money-Back Buyer Protection</span>
            </div>
          </div>

          {/* Column 2: Verified Marketplace */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Explore Marketplace
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/accounts" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  All Verified Accounts
                </Link>
              </li>
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
                  X / Twitter Premium Handles
                </Link>
              </li>
              <li>
                <Link to="/accounts?platform=Telegram" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Telegram VIP Channels
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Custom Development Services
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Paid Engineering Internships
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal, Policies & Trust (Prominent & Clear) */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-500" />
              <span>Policies & Buyer Trust</span>
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/refund-policy"
                  className="font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Refund Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>About Us</span>
                </Link>
              </li>
              <li className="pt-1.5">
                <Link
                  to="/my-orders"
                  id="footer-request-refund-link"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/20 transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span>Request a Refund</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Payments, Support & Guarantees */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Payment & Support
            </h5>

            {/* UPI Info Pill */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>Instant UPI & QR Scan</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Supported via Google Pay, PhonePe, Paytm, BHIM & CRED.
              </p>
            </div>

            {/* WhatsApp Chat Support Desk */}
            <a
              href="https://wa.me/919876543210?text=Hi%20Modern%20Teams%20Support,%20I%20need%20assistance."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors font-bold text-xs"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Live Desk</span>
              </div>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Admin Verified Handoff Protocol</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Modern Teams Inc. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-5 font-medium">
            <Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              About Us
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/refund-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Refund Policy
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/privacy-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

