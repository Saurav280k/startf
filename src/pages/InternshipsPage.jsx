import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import { ShimmerList } from '../components/common/ShimmerCard';
import { useCurrencyStore } from '../store/useCurrencyStore';
import CatalogNavTabs from '../components/common/CatalogNavTabs';

const InternshipsPage = () => {
  const { currency } = useCurrencyStore();
  const [selectedDomain, setSelectedDomain] = useState('All');

  const formatStipend = (stipendStr) => {
    if (!stipendStr) return '';
    if (currency === 'USD') {
      return stipendStr.replace(/₹\s*([0-9,]+)/g, (match, val) => {
        const inr = parseInt(val.replace(/,/g, ''), 10);
        return '$' + Math.round(inr / 85).toLocaleString();
      });
    }
    return stipendStr;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['internships', selectedDomain],
    queryFn: () => api.getInternships({ domain: selectedDomain }),
  });

  const domains = [
    'All',
    'Full Stack',
    'Frontend',
    'Backend',
    'AI & Machine Learning',
    'UI/UX Design',
    'Digital Marketing',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Universal Catalog Switcher: Accounts | Services | Internships */}
      <CatalogNavTabs />

      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Careers & Internships
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-950 dark:text-white">
          Paid Engineering & Design Internships
        </h1>
      </div>

      {/* Domain Pills in Single Horizontal Scrollable Line */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              selectedDomain === dom
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25 scale-105'
                : 'bg-slate-100 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/5'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Listings Grid - Whole Card Clickable */}
      {isLoading ? (
        <ShimmerList count={4} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data?.internships?.map((role) => (
            <Link
              key={role._id}
              to={`/internships/${role._id}/apply`}
              className="group relative block rounded-3xl p-6 sm:p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 hover:border-brand-500/80 dark:hover:border-brand-500/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Top header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full">
                      {role.domain}
                    </span>
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mt-2">
                      {role.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full shrink-0">
                    {role.openings} Openings
                  </span>
                </div>

                {/* 1-Line Clean Summary */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                  {role.summary}
                </p>

                {/* Metrics Pill Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] text-slate-400">Monthly Stipend</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate text-emerald-500">
                      {formatStipend(role.stipend)}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] text-slate-400">Duration</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {role.duration}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-100 dark:border-white/5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400">Location</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {role.location}
                    </div>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {role.skills?.slice(0, 5).map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-obsidian-800 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Perks list */}
                <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Perks:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-600 dark:text-slate-400">
                    {role.perks?.slice(0, 2).map((perk, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply CTA */}
              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400">Applications open on rolling basis</span>
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 group-hover:bg-brand-600 dark:bg-white dark:group-hover:bg-brand-400 text-white dark:text-slate-950 dark:group-hover:text-white text-xs font-bold transition-all shadow-sm">
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipsPage;
