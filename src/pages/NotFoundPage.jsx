import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft, Search, Layers } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-3xl p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto text-2xl font-black font-display">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black font-display text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The page you are looking for might have been moved, renamed, or does not exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-obsidian-800 hover:bg-slate-200 dark:hover:bg-obsidian-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <Link
            to="/"
            className="flex-1 py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/25 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Homepage</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-center gap-4 text-xs text-brand-600">
          <Link to="/accounts" className="hover:underline">Browse Accounts</Link>
          <span>•</span>
          <Link to="/services" className="hover:underline">Digital Services</Link>
          <span>•</span>
          <Link to="/internships" className="hover:underline">Internships</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
