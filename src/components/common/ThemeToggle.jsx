import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label="Toggle theme"
      className={`relative p-2.5 rounded-2xl bg-slate-100 dark:bg-obsidian-850 hover:bg-slate-200 dark:hover:bg-obsidian-700 text-slate-700 dark:text-slate-200 transition-all duration-300 border border-slate-200/80 dark:border-white/10 ${className}`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 text-brand-600 transition-transform duration-300 -rotate-12 hover:rotate-0" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
