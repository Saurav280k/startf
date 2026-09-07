import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

/**
 * AdminRoute Guard
 * - If user is logged in as a normal user (role !== 'admin'), strictly blocks access,
 *   displays an explicit Access Denied screen, and redirects back to storefront.
 * - If user is not logged in, allows AdminPage to render its secure admin login form.
 */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const isNormalUser = isAuthenticated && user?.role !== 'admin';

  useEffect(() => {
    if (isNormalUser) {
      addToast({
        message: 'Access Denied: You do not have administrator permissions to access /admin.',
        type: 'error',
      });
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isNormalUser, navigate, addToast]);

  if (isNormalUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-obsidian-900 border border-red-500/30 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              Access Restricted
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You are signed in as <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span> (Standard User). The <code className="text-red-500 font-mono">/admin</code> console is strictly restricted to verified platform administrators.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              replace
              className="w-full py-3 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
