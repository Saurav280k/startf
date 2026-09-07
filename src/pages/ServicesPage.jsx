import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Check, ArrowRight, Code, TrendingUp, Palette, Server, Star } from 'lucide-react';
import { api } from '../api/client';
import { ShimmerList } from '../components/common/ShimmerCard';
import { useCurrencyStore } from '../store/useCurrencyStore';

const getServiceIcon = (category) => {
  switch (category) {
    case 'Development':
      return Code;
    case 'Growth':
      return TrendingUp;
    case 'Design':
      return Palette;
    case 'Cloud & DevOps':
      return Server;
    default:
      return Sparkles;
  }
};

const ServicesPage = () => {
  const [category, setCategory] = useState('All');
  const { formatAmount } = useCurrencyStore();

  const { data, isLoading } = useQuery({
    queryKey: ['services', category],
    queryFn: () => api.getServices({ category }),
  });

  const categories = ['All', 'Development', 'Growth', 'Design', 'Cloud & DevOps'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Digital Services
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-950 dark:text-white">
          Professional Tech & Growth Services
        </h1>
      </div>

      {/* Category Filter Pills in Single Horizontal Scrollable Line */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              category === cat
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25 scale-105'
                : 'bg-slate-100 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services List - Whole Card Clickable */}
      {isLoading ? (
        <ShimmerList count={4} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data?.services?.map((service) => {
            const Icon = getServiceIcon(service.category);

            return (
              <Link
                key={service._id}
                to={`/services/${service._id}`}
                className="group relative block rounded-3xl p-6 sm:p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 hover:border-brand-500/80 dark:hover:border-brand-500/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {service.category}
                        </span>
                        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      {service.tag}
                    </span>
                  </div>

                  {/* 1-Line Clean Summary */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                    {service.shortDesc || service.description}
                  </p>

                  {/* Tier Comparison Mini Grid without silver highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.pricingTiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          tier.isPopular
                            ? 'bg-brand-500/10 border-brand-500/50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 shadow-sm'
                            : 'bg-slate-50 dark:bg-obsidian-850 border-slate-200/60 dark:border-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {tier.tierName}
                          </span>
                          {tier.isPopular && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-600 text-white">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-lg font-black font-display text-slate-900 dark:text-white mb-2">
                          {formatAmount(tier.price)}
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {tier.features.slice(0, 2).map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{service.rating}</span>
                    <span>({service.completedProjects}+ Completed)</span>
                  </div>

                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 group-hover:bg-brand-600 dark:bg-white dark:group-hover:bg-brand-400 text-white dark:text-slate-950 dark:group-hover:text-white text-xs font-bold transition-all shadow-sm">
                    <span>Select Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
