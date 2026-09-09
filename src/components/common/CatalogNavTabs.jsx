import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Sparkles, Briefcase } from 'lucide-react';

const CatalogNavTabs = () => {
  const location = useLocation();

  const tabs = [
    {
      name: 'Verified Accounts',
      path: '/accounts',
      icon: Layers,
      tag: 'Marketplace',
      active: location.pathname.startsWith('/accounts'),
    },
    {
      name: 'Digital Services',
      path: '/services',
      icon: Sparkles,
      tag: 'Custom Work',
      active: location.pathname.startsWith('/services'),
    },
    {
      name: 'Tech Internships',
      path: '/internships',
      icon: Briefcase,
      tag: 'Now Hiring',
      active: location.pathname.startsWith('/internships'),
    },
  ];

  return (
    <div className="w-full pb-2">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                tab.active
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/25 scale-[1.02]'
                  : 'bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-obsidian-850'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.active ? 'text-white' : 'text-brand-500'}`} />
              <span>{tab.name}</span>
              <span
                className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold ${
                  tab.active
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-obsidian-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.tag}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogNavTabs;
