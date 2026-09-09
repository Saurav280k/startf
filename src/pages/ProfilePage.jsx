import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  User,
  Mail,
  Phone,
  Lock,
  KeyRound,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Edit3,
  Check,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassText, setShowPassText] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  // Fetch current user details
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['profile-me'],
    queryFn: api.getMe,
    enabled: isAuthenticated,
  });

  const currentUser = data?.user || user;

  const updateProfileMutation = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: (res) => {
      updateUser(res.user);
      refetch();
      setIsEditingPhone(false);
      addToast({ message: 'Phone number updated successfully!', type: 'success' });
    },
    onError: (err) => {
      addToast({ message: err.message || 'Failed to update phone number', type: 'error' });
    },
  });

  const handleStartEditPhone = () => {
    setPhoneInput(currentUser?.phone || '');
    setIsEditingPhone(true);
  };

  const handleSavePhone = (e) => {
    e.preventDefault();
    if (!phoneInput.trim()) {
      addToast({ message: 'Please enter a valid phone number', type: 'error' });
      return;
    }
    updateProfileMutation.mutate({ phone: phoneInput.trim() });
  };

  const changePasswordMutation = useMutation({
    mutationFn: api.changePassword,
    onSuccess: (res) => {
      addToast({
        message: res.message || 'Password changed successfully!',
        type: 'success',
      });
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      setPasswordError('');
    },
    onError: (err) => {
      setPasswordError(err.message || 'Failed to update password');
      addToast({
        message: err.message || 'Failed to update password',
        type: 'error',
      });
    },
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');
    changePasswordMutation.mutate(newPassword);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass-panel text-center space-y-4">
        <User className="w-12 h-12 text-brand-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In Required</h2>
        <p className="text-xs text-slate-500">
          Please log in to view your profile and manage your security settings.
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 rounded-2xl bg-brand-600 text-white text-xs font-bold"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Active Account
        </span>
      </div>

      {/* Profile Header Card with 2-Column Responsive Grid (NOT Stacked Vertically) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-6">
        {/* Top row: Avatar, Name & My Orders Action */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-brand-600/30 shrink-0">
              {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                  {currentUser?.username}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentUser?.email}</p>
            </div>
          </div>

          <Link
            to="/my-orders"
            id="profile-my-orders-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders</span>
          </Link>
        </div>

        {/* 2-Column Grid for Profile Details (Clean, balanced, non-vertical) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Full Name */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <User className="w-3.5 h-3.5 text-brand-500" />
              <span>Full Name</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {currentUser?.username}
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Mail className="w-3.5 h-3.5 text-brand-500" />
              <span>Email Address</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentUser?.email}
            </div>
          </div>

          {/* Card 3: Phone Number with Edit Feature */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Phone / WhatsApp</span>
              </div>
              {!isEditingPhone && (
                <button
                  type="button"
                  onClick={handleStartEditPhone}
                  id="edit-phone-toggle-btn"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditingPhone ? (
              <form onSubmit={handleSavePhone} className="space-y-2">
                <input
                  type="tel"
                  id="edit-phone-input"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Enter phone number (e.g. 9876543210)"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-obsidian-900 border border-brand-500/50 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    id="save-phone-btn"
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingPhone(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-obsidian-750 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {currentUser?.phone || <span className="text-slate-400 font-normal italic">No phone number added</span>}
              </div>
            )}
          </div>

          {/* Card 4: Member Status & Date */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Account Status</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{currentUser?.role === 'admin' ? 'Administrator' : 'Standard Member'}</span>
              <span className="text-xs text-slate-400 font-normal">• Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel Quick Card if Administrator */}
      {currentUser?.role === 'admin' && (
        <Link
          to="/admin"
          id="profile-admin-portal-card"
          className="p-5 rounded-3xl bg-gradient-to-r from-brand-900/60 via-obsidian-900 to-obsidian-950 border-2 border-brand-500/50 hover:border-brand-500 shadow-xl transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-brand-600/30">
              ⚡
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Modern Teams Admin Panel</span>
                <span className="text-[10px] uppercase font-black bg-brand-500 text-white px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Manage orders, approve UPI payments, add products & review internships
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-brand-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {/* Quick Navigation Cards: My Purchases & Explore Accounts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/my-orders"
          className="p-5 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 hover:border-brand-500/50 shadow-sm transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">My Purchases</div>
              <div className="text-xs text-slate-500">Track account handoffs & orders</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          to="/accounts"
          className="p-5 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 hover:border-brand-500/50 shadow-sm transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Explore Accounts</div>
              <div className="text-xs text-slate-500">Browse verified social properties</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Security & Change Password Section (Shifted below purchases & accounts) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Account Security & Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your account login credentials and security.
              </p>
            </div>
          </div>

          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              id="change-password-toggle-btn"
              className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all shadow-md shadow-brand-600/25 shrink-0 cursor-pointer"
            >
              Change Password
            </button>
          )}
        </div>

        {/* Change Password Form */}
        {showPasswordForm ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md animate-in fade-in">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Enter New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassText ? 'text' : 'password'}
                  id="profile-new-password-input"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassText(!showPassText)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassText ? 'text' : 'password'}
                  id="profile-confirm-password-input"
                  placeholder="Re-type your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>
            </div>

            {passwordError && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{passwordError}</span>
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                id="profile-save-password-btn"
                disabled={changePasswordMutation.isPending}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all shadow-md shadow-brand-600/25 disabled:opacity-50 cursor-pointer"
              >
                {changePasswordMutation.isPending ? 'Updating...' : 'Save New Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordError('');
                }}
                className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </div>

      {/* Sign Out Button (at the very bottom) */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={() => {
            logout();
            addToast({ message: 'Signed out successfully.', type: 'info' });
            navigate('/');
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/20 transition-all cursor-pointer hover:scale-105"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Modern Teams</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
