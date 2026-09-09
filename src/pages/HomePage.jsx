import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import {
  ShieldCheck,
  TrendingUp,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Briefcase,
  Users,
  Award,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { api } from '../api/client';
import AccountCard from '../components/accounts/AccountCard';
import { ShimmerList } from '../components/common/ShimmerCard';
import { useCurrencyStore } from '../store/useCurrencyStore';

const HomePage = () => {
  const { currency, formatAmount } = useCurrencyStore();
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const cardsFloatRef = useRef(null);

  const { data: featuredAccountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ['featured-accounts'],
    queryFn: api.getFeaturedAccounts,
  });

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['featured-services'],
    queryFn: () => api.getServices(),
  });

  const { data: internshipsData, isLoading: internshipsLoading } = useQuery({
    queryKey: ['featured-internships'],
    queryFn: () => api.getInternships(),
  });

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-anim', {
        y: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.to('.floating-card-1', {
        y: -10,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.floating-card-2', {
        y: 12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.4,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-4 sm:pt-8 overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 to-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Kinetic Hero Copy */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="hero-anim inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Next-Gen Marketplace & Talent Portal</span>
              </div>

              <h1 className="hero-anim text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-950 dark:text-white leading-[1.1]">
                Acquire Verified <br />
                <span className="bg-gradient-to-r from-brand-600 via-blue-500 to-emerald-400 bg-clip-text text-transparent">
                  Digital Properties
                </span>{' '}
                & Top Talent.
              </h1>

              <p className="hero-anim text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Buy high-reach monetized social media accounts with buyer protection guarantee, hire expert digital services, or apply for paid tech internships.
              </p>

              {/* Action Buttons: Quick 1-tap portals to Accounts, Services, and Internships */}
              <div className="hero-anim flex flex-wrap gap-2.5 pt-1">
                <Link
                  to="/accounts"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-brand-600/25 hover:scale-105 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Explore Accounts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/services"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/25 hover:scale-105 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Digital Services</span>
                </Link>
                <Link
                  to="/internships"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-obsidian-850 hover:bg-slate-200 dark:hover:bg-obsidian-700 text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/10 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-brand-500" />
                  <span>Tech Internships</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="hero-anim pt-4 border-t border-slate-200/80 dark:border-white/5 flex flex-wrap items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Buyer Protection Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Sub-4Hr Credential Transfer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-brand-500" />
                  <span>Audience Verified</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Interactive Cards (Both clickable) */}
            <div className="lg:col-span-5 relative flex justify-center items-center pt-6 pb-28 sm:pb-12">
              {/* Card 1: Featured Social Account Mockup - Clickable to /accounts */}
              <Link
                to="/accounts"
                className="floating-card-1 block w-full max-w-sm rounded-3xl p-6 glass-panel shadow-2xl border-2 border-slate-200/90 dark:border-white/15 hover:border-brand-500/80 dark:hover:border-brand-500/80 transition-all duration-300 relative z-20 cursor-pointer group hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    Instagram Viral
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +6.8% Engagement
                  </span>
                </div>
                <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 bg-slate-900 border border-slate-200/60 dark:border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
                    alt="preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  @techfuture.ai • 148.2K
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  US/Tier-1 Tech Demographic • Monetization Active
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                  <span className="text-lg font-black font-display text-slate-900 dark:text-white">
                    {formatAmount(112500)}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-brand-600 group-hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/20">
                    Explore Accounts →
                  </span>
                </div>
              </Link>

              {/* Card 2: Floating Internship Notification Badge - Clickable to /internships */}
              <Link
                to="/internships"
                className="floating-card-2 block absolute bottom-2 sm:-bottom-4 right-2 sm:-right-4 w-60 sm:w-64 rounded-2xl p-3 sm:p-4 glass-panel bg-white/95 dark:bg-obsidian-900/95 shadow-2xl border-2 border-emerald-500/40 hover:border-emerald-500 z-30 transition-all duration-300 hover:scale-[1.04] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">Full Stack Intern</h5>
                    <p className="text-[11px] text-emerald-500 font-semibold">{formatAmount(45000)}/mo Stipend • Remote</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-10 lg:mt-6">
        <div className="rounded-3xl p-8 bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black font-display text-brand-600 dark:text-brand-400">
              {currency === 'USD' ? '$5080+' : '₹4.8 Lakh+'}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Safe Transactions Volume
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black font-display text-emerald-500">
              100%
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Guaranteed Handoff Rate
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black font-display text-amber-500">
              &lt; 2 Hrs
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Average Account Transfer
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black font-display text-purple-500">
              45+
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Interns Placed into Tech
            </div>
          </div>
        </div>
      </section>

      {/* Featured Accounts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Inventory
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-950 dark:text-white">
              Featured Premium Social Properties
            </h2>
          </div>
          <Link
            to="/accounts"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
          >
            <span>Browse Full Marketplace</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {accountsLoading ? (
          <ShimmerList count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAccountsData?.accounts?.slice(0, 3).map((account) => (
              <AccountCard key={account._id} account={account} />
            ))}
          </div>
        )}
      </section>

      {/* Digital Services Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              Engineering Excellence
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-950 dark:text-white">
              Bespoke Digital Services & Growth
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
          >
            <span>Explore All Services</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {servicesData?.services?.slice(0, 2).map((srv) => {
            const lowestPrice = srv.pricingTiers?.length
              ? Math.min(...srv.pricingTiers.map((t) => t.price))
              : (srv.price || 0);

            return (
              <Link
                key={srv._id}
                to={`/services/${srv._id}`}
                className="group rounded-3xl p-5 sm:p-6 bg-white dark:bg-obsidian-900 border-2 border-slate-200 dark:border-white/15 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      {srv.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ⭐ {srv.rating} ({srv.completedProjects} delivered)
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {srv.shortDesc || srv.description}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Starting at
                    </span>
                    <span className="text-base font-black font-display text-slate-900 dark:text-white">
                      {formatAmount(lowestPrice)}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 group-hover:bg-brand-600 dark:bg-white dark:group-hover:bg-brand-500 text-white dark:text-slate-950 dark:group-hover:text-white text-xs font-bold transition-all shadow-sm">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Internship Portal Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl p-8 sm:p-12 bg-gradient-to-tr from-brand-900 via-obsidian-900 to-obsidian-950 text-white border border-brand-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Applications Open For Summer & Fall Batches</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
              Launch Your Engineering Career With Industry Mentors
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Work on production-grade systems in Full Stack, Frontend Animation, Backend Infrastructure, AI/ML, and UI/UX. Competitive monthly stipends ({currency === 'USD' ? '$1,200 - $2,500 / mo' : '₹20,000 - ₹40,000 / month'}), flexible hours, and direct PPO conversion tracks.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/internships"
                className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-105"
              >
                View Available Domains & Apply
              </Link>
              <Link
                to="/internships"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all"
              >
                View Stipend & Perks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Secure Buyer Protection & Transfer Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-950 dark:text-white">
            Secure Buyer Protection & Transfer Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Every transaction is protected until you receive and verify full ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Scan UPI & Submit 12-Digit UTR
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Scan the UPI QR code with any app (GPay, PhonePe, Paytm), enter the 12-digit transaction ID, and confirm payment.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Fast Account & Details Delivery
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Account login details, primary email access, and security codes are sent directly to your delivery email.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Change Password & Take Ownership
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Log in, change the password, and secure your account. WhatsApp support is always ready to assist you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
