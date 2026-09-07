import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[9999] flex flex-col gap-2.5 max-w-sm w-full px-4 md:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between p-4 rounded-2xl glass-panel shadow-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-obsidian-900/95 text-slate-800 dark:text-slate-100 transition-all duration-300 animate-in slide-in-from-top-3"
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-brand-500 shrink-0" />
            )}
            <p className="text-xs md:text-sm font-medium leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
