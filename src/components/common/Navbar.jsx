import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layers, Briefcase, ShoppingBag, X, Sparkles, ShoppingCart } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import CurrencyToggle from './CurrencyToggle';
import MobileBottomBar from './MobileBottomBar';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const cartCount = items.length;

  const navLinks = [
    { name: 'Accounts', path: '/accounts', icon: Layers },
    { name: 'Services', path: '/services', icon: Sparkles },
    { name: 'Internships', path: '/internships', icon: Briefcase },
    { name: 'My Orders', path: '/my-orders', icon: ShoppingBag },
  ];

  const isActive = (path) => location.pathname === path;

  // Hide top header on cart, checkout, and profile pages as requested
  const hideHeader = ['/cart', '/checkout', '/profile'].some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  return (
    <>
      {!hideHeader && (
        <header className="sticky top-0 z-40 w-full transition-all duration-300 glass-panel border-b border-slate-200/80 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-600/25 group-hover:scale-105 transition-transform">
              ▲
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                APEX
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                Digital Assets & Services
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-obsidian-850/80 p-1.5 rounded-full border border-slate-200/60 dark:border-white/5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'bg-white dark:bg-obsidian-700 text-brand-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right side controls: Cart + Currency + Theme + Auth (NO SIGNOUT BUTTON) */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              to="/cart"
              id="nav-cart-link"
              className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-obsidian-850 dark:hover:bg-obsidian-800 dark:text-white transition-colors duration-200 border border-slate-200/80 dark:border-white/10"
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            <CurrencyToggle />
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  id="nav-profile-link"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 hover:border-brand-500/50 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200"
                  title="View Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{user?.username || 'Profile'}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  id="nav-login-link"
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-850 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  id="nav-signup-link"
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-md shadow-brand-600/25 hover:shadow-brand-600/40"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Header: ONLY Website Name + Currency Toggle + Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <CurrencyToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>
      )}

      {/* Mobile Drawer (Always rendered via Portal across all pages, including when header is hidden) */}
      {typeof document !== 'undefined' &&
        mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] md:hidden">
            {/* Solid Dark Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Solid Right Slide Panel */}
            <div className="fixed inset-y-0 right-0 w-72 sm:w-80 h-full bg-white dark:bg-[#0c0c10] shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col justify-between p-6 z-[10000] animate-in slide-in-from-right duration-300">
              <div className="space-y-6">
                {/* Drawer Header with Logo & Close Button */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white font-black text-sm">
                      ▲
                    </div>
                    <span className="text-lg font-black font-display text-slate-900 dark:text-white">
                      APEX
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart link in mobile drawer */}
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-500/20 text-xs font-bold text-brand-600 dark:text-brand-400"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Shopping Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-black">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Navigation Links with High-Contrast Elegant Active State */}
                <div className="space-y-1.5">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-850 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Auth / Profile Section (NO SIGNOUT BUTTON) */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user?.username}
                      </div>
                      <div className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">
                        View Profile
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3 text-center rounded-2xl text-xs font-bold bg-slate-100 dark:bg-obsidian-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-obsidian-750"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3 text-center rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/25"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar onOpenMenu={() => setMobileMenuOpen(true)} />
    </>
  );
};

export default Navbar;

