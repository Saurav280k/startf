import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Check, ArrowRight, Code, TrendingUp, Palette, Server, Star } from 'lucide-react';
import { api } from '../api/client';
import { ShimmerList } from '../components/common/ShimmerCard';
import { useCurrencyStore } from '../store/useCurrencyStore';
import CatalogNavTabs from '../components/common/CatalogNavTabs';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Universal Catalog Switcher: Accounts | Services | Internships */}
      <CatalogNavTabs />

      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Digital Services
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-950 dark:text-white">
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
        <ShimmerList count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.services?.map((service) => {
            const Icon = getServiceIcon(service.category);
            const lowestPrice = service.pricingTiers?.length
              ? Math.min(...service.pricingTiers.map((t) => t.price))
              : (service.price || 0);

            return (
              <Link
                key={service._id}
                to={`/services/${service._id}`}
                className="group relative rounded-3xl p-5 sm:p-6 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 hover:border-brand-500/80 dark:hover:border-brand-500/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      {service.tag || service.category}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {service.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                      {service.title}
                    </h3>
                  </div>

                  {/* Clean Summary */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {service.shortDesc || service.description}
                  </p>
                </div>

                {/* Bottom section with starting price & CTA */}
                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Starting at
                    </span>
                    <span className="text-base font-black font-display text-slate-900 dark:text-white">
                      {formatAmount(lowestPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 mr-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-900 dark:text-white">{service.rating}</span>
                    </div>
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 group-hover:bg-brand-600 dark:bg-white dark:group-hover:bg-brand-400 text-white dark:text-slate-950 dark:group-hover:text-white text-xs font-bold transition-all shadow-sm">
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
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
