import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const SignupPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: api.signup,
    onSuccess: (res) => {
      setAuth(res.user, res.token);
      addToast({
        message: `Welcome to Modern Teams, ${res.user.username}!`,
        type: 'success',
      });
      navigate('/');
    },
    onError: (err) => {
      addToast({
        message: err.message || 'Failed to create account.',
        type: 'error',
      });
    },
  });

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  const validate = () => {
    const errs = {};
    if (!username.trim() || username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Valid email is required';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({ username, email, password, phone });
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-3xl p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30">
            ▲
          </div>
          <h1 className="text-2xl font-black font-display text-slate-900 dark:text-white">
            Create Your Modern Teams Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Buy verified accounts, track safe orders, and apply for engineering roles.
          </p>
        </div>

        {/* Google One-Click Sign Up */}
        <div className="space-y-4">
          <GoogleAuthButton mode="signup" />

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
          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Username *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                id="signup-username"
                placeholder="e.g. alex_developer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.username ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                }`}
              />
            </div>
            {errors.username && <p className="text-[11px] text-red-500">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                id="signup-email"
                placeholder="alex@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.email ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
          </div>

          {/* Phone (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Phone / WhatsApp (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                id="signup-phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                id="signup-password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.password ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                }`}
              />
            </div>
            {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}

            {/* Password strength bar */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="h-1.5 w-full bg-slate-200 dark:bg-obsidian-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength <= 25
                        ? 'bg-red-500 w-1/4'
                        : strength <= 50
                        ? 'bg-amber-500 w-2/4'
                        : strength <= 75
                        ? 'bg-blue-500 w-3/4'
                        : 'bg-emerald-500 w-full'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Security Strength</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {strength <= 25
                      ? 'Weak'
                      : strength <= 50
                      ? 'Moderate'
                      : strength <= 75
                      ? 'Strong'
                      : 'Very Strong'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            id="signup-submit-btn"
            disabled={mutation.isPending}
            className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{mutation.isPending ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
