import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, CheckCircle2, SlidersHorizontal, RefreshCw, X } from 'lucide-react';
import { api } from '../api/client';
import AccountCard from '../components/accounts/AccountCard';
import { ShimmerList } from '../components/common/ShimmerCard';
import CatalogNavTabs from '../components/common/CatalogNavTabs';

const AccountsPage = () => {
  const [searchParams] = useSearchParams();
  const searchInputRef = useRef(null);

  const [platform, setPlatform] = useState('All');
  const [niche, setNiche] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['accounts', { platform, niche, verifiedOnly, search, sort }],
    queryFn: () =>
      api.getAccounts({
        platform: platform === 'All' ? '' : platform,
        niche: niche === 'All' ? '' : niche,
        verified: verifiedOnly ? 'true' : '',
        search,
        sort,
      }),
  });

  const platforms = ['All', 'Instagram', 'YouTube', 'TikTok', 'X/Twitter', 'Telegram'];
  const niches = ['All', 'Tech & AI', 'Crypto/Finance', 'Luxury & Travel', 'Humor/Memes'];

  const resetFilters = () => {
    setPlatform('All');
    setNiche('All');
    setVerifiedOnly(false);
    setSearch('');
    setSort('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Universal Catalog Switcher: Accounts | Services | Internships */}
      <CatalogNavTabs />

      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
          Digital Assets Exchange
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-950 dark:text-white">
          Verified Social Media Properties
        </h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/10 space-y-4">
        {/* Search & Refresh Row in Single Line */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              id="accounts-search-input"
              type="text"
              placeholder="Search accounts by username, niche, platform, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-obsidian-800 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="p-3 rounded-2xl bg-white dark:bg-obsidian-800 border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-obsidian-700 text-slate-600 dark:text-slate-300 transition-colors shrink-0 shadow-sm cursor-pointer"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Categories - Single Horizontal Scrollable Line */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pt-2 border-t border-slate-200/60 dark:border-white/5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Platform:
          </span>
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                platform === p
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25 scale-105'
                  : 'bg-white dark:bg-obsidian-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/5'
              }`}
            >
              {p}
            </button>
          ))}

          {/* Verified Toggle */}
          <button
            type="button"
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              verifiedOnly
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-obsidian-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Badge Only</span>
          </button>
        </div>

        {/* Niche Categories - Single Horizontal Scrollable Line */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pt-1 border-t border-slate-200/60 dark:border-white/5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Niche:
          </span>
          {niches.map((n) => (
            <button
              key={n}
              onClick={() => setNiche(n)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                niche === n
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold'
                  : 'bg-white dark:bg-obsidian-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/5'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Grid */}
      {isLoading ? (
        <ShimmerList count={6} />
      ) : data?.accounts?.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-50 dark:bg-obsidian-900/40 border border-slate-200/80 dark:border-white/5 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No properties matched your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing specific platform/niche filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.accounts?.map((account) => (
            <AccountCard key={account._id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
