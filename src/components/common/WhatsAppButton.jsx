import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send } from 'lucide-react';

const WhatsAppButton = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  // Only show on the home page as requested
  if (location.pathname !== '/') {
    return null;
  }

  // Default support phone (international format without +)
  const WHATSAPP_PHONE = '919876543210'; 

  const quickPrompts = [
    'I want to inquire about purchasing a verified social account.',
    'How does the 100% safe payment and account transfer work?',
    'I want to ask a question regarding the engineering internship.',
    'I need a custom quote for Full Stack / UI/UX development services.',
  ];

  const handleSend = (text) => {
    const messageToSend = text || customMsg || 'Hello! I have an inquiry regarding Modern Teams.';
    const encoded = encodeURIComponent(messageToSend);
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* Expanded Quick Query Window */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-88 rounded-3xl glass-panel bg-white/95 dark:bg-obsidian-900/95 shadow-2xl border border-slate-200 dark:border-white/10 p-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Modern Teams WhatsApp Desk</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online • Avg reply &lt; 5m</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 mb-2">
            Select a quick topic or type your query:
          </p>

          <div className="space-y-1 mb-3">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-50 dark:bg-obsidian-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/20 leading-relaxed"
              >
                👉 {prompt}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Type message..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(customMsg)}
              className="flex-1 text-[11px] px-3 py-2 rounded-xl bg-slate-100 dark:bg-obsidian-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSend(customMsg)}
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center"
              aria-label="Send via WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button (More Compact & Shifted Up) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="whatsapp-query-btn"
        className="relative group flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Ask query on WhatsApp"
      >
        <span className="relative flex h-2 w-2 sm:hidden">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">
          Quick Inquiry
        </span>
      </button>
    </div>
  );
};

export default WhatsAppButton;
