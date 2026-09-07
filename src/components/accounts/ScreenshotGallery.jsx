import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, ShieldCheck } from 'lucide-react';

const ScreenshotGallery = ({ screenshots = [], title = 'Account Proof' }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Active Screenshot View */}
      <div className="relative w-full h-80 sm:h-96 md:h-[440px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 group shadow-xl">
        <img
          src={screenshots[activeIdx]}
          alt={`${title} screenshot proof ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Top badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified Authentic Screenshot Proof
          </span>
        </div>

        {/* Counter */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-medium border border-white/10">
          {activeIdx + 1} / {screenshots.length}
        </div>

        {/* Prev / Next controls */}
        {screenshots.length > 1 && (
          <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
            <button
              onClick={() => setActiveIdx((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))}
              className="pointer-events-auto p-2.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white transition-all hover:scale-105 border border-white/10"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIdx((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))}
              className="pointer-events-auto p-2.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white transition-all hover:scale-105 border border-white/10"
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail Bar */}
      {screenshots.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {screenshots.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative shrink-0 w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                activeIdx === idx
                  ? 'border-brand-600 scale-105 shadow-md shadow-brand-600/30'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScreenshotGallery;
