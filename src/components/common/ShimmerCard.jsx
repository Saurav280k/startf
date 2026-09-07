import React from 'react';

export const ShimmerCard = () => {
  return (
    <div className="rounded-3xl p-5 border border-slate-200/70 dark:border-white/5 bg-slate-50/50 dark:bg-obsidian-900/40 space-y-4">
      {/* Media thumbnail shimmer */}
      <div className="w-full h-44 rounded-2xl shimmer-box" />

      {/* Title & badge */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-3/5 h-5 rounded-lg shimmer-box" />
        <div className="w-16 h-5 rounded-full shimmer-box" />
      </div>

      {/* Metric pills */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="h-10 rounded-xl shimmer-box" />
        <div className="h-10 rounded-xl shimmer-box" />
      </div>

      {/* Footer price & action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-white/5">
        <div className="w-20 h-6 rounded-lg shimmer-box" />
        <div className="w-24 h-9 rounded-xl shimmer-box" />
      </div>
    </div>
  );
};

export const ShimmerList = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  );
};

export default ShimmerCard;
