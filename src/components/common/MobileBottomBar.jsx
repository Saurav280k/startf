import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

const MobileBottomBar = ({ onOpenMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const cartCount = items.length;

  // Do not show bottom navbar on cart and admin pages
  if (location.pathname === '/cart' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      id: 'mobile-tab-home',
      label: 'Home',
      icon: Home,
      to: '/',
      active: isActive('/'),
    },
    {
      id: 'mobile-tab-search',
      label: 'Search',
      icon: Search,
      to: '/accounts',
      active: isActive('/accounts'),
    },
    {
      id: 'mobile-tab-cart',
      label: 'Cart',
      icon: ShoppingCart,
      to: '/cart',
      active: isActive('/cart'),
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      id: 'mobile-tab-profile',
      label: isAuthenticated ? 'Profile' : 'Login',
      icon: User,
      to: isAuthenticated ? '/profile' : '/login',
      active: isActive(isAuthenticated ? '/profile' : '/login'),
      isUserInitial: isAuthenticated && user?.username,
      initial: user?.username ? user.username.charAt(0).toUpperCase() : 'U',
    },
    {
      id: 'mobile-tab-menu',
      label: 'Menu',
      icon: Menu,
      onClick: onOpenMenu,
      isButton: true,
    },
  ];

  return (
    <nav
      id="mobile-bottom-navbar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0c10]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-[max(env(safe-area-inset-bottom,0px),8px)] pt-2"
    >
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.active;

          const content = (
            <div className="relative flex flex-col items-center justify-center py-1 w-full transition-transform active:scale-90">
              <div className="relative flex items-center justify-center w-8 h-8">
                {item.isUserInitial ? (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                      active
                        ? 'bg-brand-600 text-white ring-2 ring-brand-500/50 shadow-md shadow-brand-600/30'
                        : 'bg-slate-200 dark:bg-obsidian-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.initial}
                  </div>
                ) : (
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      active
                        ? 'text-brand-600 dark:text-brand-400 scale-110'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                )}

                {/* Cart Badge with pulse */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-black flex items-center justify-center shadow-md animate-in zoom-in">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                  active
                    ? 'font-bold text-brand-600 dark:text-brand-400'
                    : 'font-medium text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* Tiny active indicator pill */}
              {active && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-brand-600 dark:bg-brand-400" />
              )}
            </div>
          );

          if (item.isButton) {
            return (
              <button
                key={item.id}
                id={item.id}
                type="button"
                onClick={item.onClick}
                className="w-full flex items-center justify-center cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                aria-label={item.label}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              id={item.id}
              to={item.to}
              onClick={item.onClick}
              className="w-full flex items-center justify-center"
              aria-label={item.label}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomBar;
