import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: api.login,
    onSuccess: (res) => {
      setAuth(res.user, res.token);
      addToast({
        message: `Welcome back, ${res.user.username}!`,
        type: 'success',
      });
      navigate('/');
    },
    onError: (err) => {
      addToast({
        message: err.message || 'Invalid credentials. Please check your email & password.',
        type: 'error',
      });
    },
  });

  const validate = () => {
    const errs = {};
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Valid email is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-3xl p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30">
            ▲
          </div>
          <h1 className="text-2xl font-black font-display text-slate-900 dark:text-white">
            Sign In to Modern Teams
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your orders, tracked asset handoffs, and fellowship status.
          </p>
        </div>

        {/* Google One-Click Auth */}
        <div className="space-y-4">
          <GoogleAuthButton mode="signin" />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or with email
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                id="login-email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.email ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Password *
              </label>
              <span className="text-[11px] text-brand-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                id="login-password"
                placeholder="Your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.password ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                }`}
              />
            </div>
            {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            disabled={mutation.isPending}
            className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{mutation.isPending ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-brand-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
