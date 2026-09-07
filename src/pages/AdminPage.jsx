import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  Users,
  Briefcase,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Mail,
  Phone,
  ArrowUpRight,
  Lock,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import CurrencyToggle from '../components/common/CurrencyToggle';
import ThemeToggle from '../components/common/ThemeToggle';

const AdminPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();
  const { addToast } = useToastStore();
  const { formatAmount } = useCurrencyStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'products' | 'internships'
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [copiedUtr, setCopiedUtr] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Add Product Modal state
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    title: '',
    platform: 'Instagram',
    handle: '',
    followersCount: '',
    engagementRate: '',
    niche: 'Tech & AI',
    price: '',
    originalPrice: '',
    verifiedBadge: true,
    monetizationEnabled: true,
    monthlyRevenue: '',
    accountAgeYears: '2',
    description: '',
    highlights: '',
    screenshots: '',
  });

  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Quick fill helper for demo credentials
  const fillDemoCredentials = () => {
    setLoginEmail('admin@modernteams.com');
    setLoginPassword('Admin@2026');
    addToast({ message: 'Admin demo credentials filled! Click Sign In.', type: 'info' });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      addToast({ message: 'Please enter both email and password', type: 'error' });
      return;
    }
    setLoginLoading(true);
    try {
      const res = await api.login({ email: loginEmail, password: loginPassword });
      if (res.user.role !== 'admin') {
        addToast({ message: 'Access denied: This account does not have administrator privileges.', type: 'error' });
        setLoginLoading(false);
        return;
      }
      setAuth(res.user, res.token);
      addToast({ message: `Welcome back, ${res.user.username}! Admin access granted.`, type: 'success' });
    } catch (err) {
      addToast({ message: err.message || 'Invalid credentials', type: 'error' });
    } finally {
      setLoginLoading(false);
    }
  };

  // Queries
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: api.getAdminStats,
    enabled: isAdmin,
  });

  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['admin-orders', orderFilter, orderSearch],
    queryFn: () => api.getAllOrders({ status: orderFilter, search: orderSearch }),
    enabled: isAdmin,
  });

  const { data: accountsData, isLoading: accountsLoading, refetch: refetchAccounts } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => api.getAccounts({}),
    enabled: isAdmin,
  });

  const { data: applicationsData, isLoading: applicationsLoading, refetch: refetchApplications } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: () => api.getAllApplications({}),
    enabled: isAdmin,
  });

  // Mutations
  const verifyPaymentMutation = useMutation({
    mutationFn: ({ id, status, notes }) => api.verifyOrderPayment(id, { status, notes }),
    onSuccess: (data) => {
      addToast({ message: data.message || 'Payment status updated!', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => {
      addToast({ message: err.message || 'Failed to update payment status', type: 'error' });
    },
  });

  const updateTransferMutation = useMutation({
    mutationFn: ({ id, transferStatus }) => api.updateOrderTransfer(id, { transferStatus }),
    onSuccess: (data) => {
      addToast({ message: data.message || 'Transfer status updated!', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err) => {
      addToast({ message: err.message || 'Failed to update transfer status', type: 'error' });
    },
  });

  const createAccountMutation = useMutation({
    mutationFn: (accountData) => api.createAccount(accountData),
    onSuccess: () => {
      addToast({ message: 'New verified account added to marketplace!', type: 'success' });
      setIsAddAccountModalOpen(false);
      setNewAccount({
        title: '',
        platform: 'Instagram',
        handle: '',
        followersCount: '',
        engagementRate: '',
        niche: 'Tech & AI',
        price: '',
        originalPrice: '',
        verifiedBadge: true,
        monetizationEnabled: true,
        monthlyRevenue: '',
        accountAgeYears: '2',
        description: '',
        highlights: '',
        screenshots: '',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => {
      addToast({ message: err.message || 'Failed to create account product', type: 'error' });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (id) => api.deleteAccount(id),
    onSuccess: () => {
      addToast({ message: 'Account listing removed.', type: 'info' });
      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => {
      addToast({ message: err.message || 'Failed to delete account', type: 'error' });
    },
  });

  const updateApplicationMutation = useMutation({
    mutationFn: ({ id, status }) => api.updateApplicationStatus(id, { status }),
    onSuccess: (data) => {
      addToast({ message: data.message || 'Application updated!', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
    },
    onError: (err) => {
      addToast({ message: err.message || 'Failed to update application', type: 'error' });
    },
  });

  const handleCopyUtr = (utr) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    addToast({ message: `Copied UTR: ${utr}`, type: 'success' });
    setTimeout(() => setCopiedUtr(null), 2500);
  };

  const handleAddAccountSubmit = (e) => {
    e.preventDefault();
    if (!newAccount.title || !newAccount.handle || !newAccount.price) {
      addToast({ message: 'Please provide Title, Handle, and Price', type: 'error' });
      return;
    }

    const payload = {
      ...newAccount,
      followersCount: Number(newAccount.followersCount) || 10000,
      engagementRate: Number(newAccount.engagementRate) || 5.0,
      price: Number(newAccount.price),
      originalPrice: Number(newAccount.originalPrice) || Number(newAccount.price) * 1.25,
      monthlyRevenue: Number(newAccount.monthlyRevenue) || 0,
      accountAgeYears: Number(newAccount.accountAgeYears) || 1,
      highlights: newAccount.highlights
        ? newAccount.highlights.split('\n').filter((h) => h.trim())
        : [],
      screenshots: newAccount.screenshots
        ? newAccount.screenshots.split('\n').filter((s) => s.trim())
        : [],
    };

    createAccountMutation.mutate(payload);
  };

  // IF NOT AUTHENTICATED AS ADMIN: SHOW ADMIN LOGIN CARD
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full rounded-3xl p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-xl shadow-brand-600/30">
              ⚡
            </div>
            <h1 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              Modern Teams Admin Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restricted management area. Authenticate with your administrator credentials.
            </p>
          </div>

          {/* Quick 1-Click Demo Credentials Card */}
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Credentials Ready</span>
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                id="fill-admin-credentials-btn"
                className="px-2.5 py-1 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px] transition-all cursor-pointer shadow-sm active:scale-95"
              >
                1-Click Fill
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-0.5">
              <div>Email: <span className="font-bold text-slate-900 dark:text-white">admin@modernteams.com</span></div>
              <div>Password: <span className="font-bold text-slate-900 dark:text-white">Admin@2026</span></div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Admin Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  id="admin-login-email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@modernteams.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  id="admin-login-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-submit-btn"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <span>Authenticating Admin...</span>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ← Return to Marketplace Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = statsData?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    rejectedOrders: 0,
    totalAccounts: 0,
    availableAccounts: 0,
    soldAccounts: 0,
  };

  const orders = ordersData?.orders || [];
  const accounts = accountsData?.accounts || [];
  const applications = applicationsData?.applications || [];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-obsidian-950 pb-24">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-obsidian-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white font-black text-base flex items-center justify-center shadow-md">
                ⚡
              </div>
              <div>
                <span className="text-base font-black font-display tracking-tight text-slate-900 dark:text-white">
                  Modern Teams
                </span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  Admin Console
                </span>
              </div>
            </Link>

            <div className="sm:hidden flex items-center gap-2">
              <CurrencyToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Center Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-obsidian-850 p-1 rounded-2xl border border-slate-200/80 dark:border-white/5 overflow-x-auto max-w-full">
            <button
              type="button"
              id="admin-tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-obsidian-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              id="admin-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-white dark:bg-obsidian-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Orders & Payments</span>
              {stats.pendingOrders > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {stats.pendingOrders}
                </span>
              )}
            </button>
            <button
              type="button"
              id="admin-tab-products"
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-white dark:bg-obsidian-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Products ({accounts.length})
            </button>
            <button
              type="button"
              id="admin-tab-internships"
              onClick={() => setActiveTab('internships')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'internships'
                  ? 'bg-white dark:bg-obsidian-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Applications ({applications.length})
            </button>
          </div>

          {/* Right Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <CurrencyToggle />
            <ThemeToggle />
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              title="Open customer marketplace storefront"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                addToast({ message: 'Admin signed out.', type: 'info' });
                navigate('/');
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & KPIS */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Revenue */}
              <div className="p-6 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    💰
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-emerald-500">
                  {formatAmount(stats.totalRevenue)}
                </div>
                <p className="text-[11px] text-slate-500">From verified approved UPI orders</p>
              </div>

              {/* Pending Payment Approvals */}
              <div
                onClick={() => setActiveTab('orders')}
                className="p-6 rounded-3xl bg-white dark:bg-obsidian-900 border border-amber-500/30 hover:border-amber-500 shadow-sm space-y-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Pending UTR Checks</span>
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    ⏳
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-amber-500">
                  {stats.pendingOrders}
                </div>
                <p className="text-[11px] text-slate-500">Requires UTR verification & approval</p>
              </div>

              {/* Total Orders */}
              <div className="p-6 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Orders Placed
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
                    📦
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
                  {stats.totalOrders}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="text-emerald-500 font-semibold">{stats.approvedOrders} Approved</span>
                  <span>•</span>
                  <span className="text-red-500 font-semibold">{stats.rejectedOrders} Rejected</span>
                </div>
              </div>

              {/* Active Products */}
              <div className="p-6 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Inventory Status
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
                  {stats.availableAccounts} <span className="text-xs text-slate-400 font-normal">Available</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {stats.soldAccounts} sold • {stats.totalAccounts} total listings
                </p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-6 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Admin Quick Controls
                </h3>
                <p className="text-xs text-slate-500">Instant shortcuts to add inventory and review transactions</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  id="admin-add-account-btn"
                  onClick={() => setIsAddAccountModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Social Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-obsidian-850 hover:bg-slate-200 dark:hover:bg-obsidian-800 text-slate-900 dark:text-white font-bold text-xs border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Review Pending Payments ({stats.pendingOrders})</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Recent Incoming Orders
                  </h3>
                  <p className="text-xs text-slate-500">Live order stream across accounts and services</p>
                </div>
                <button
                  type="button"
                  onClick={() => refetchOrders()}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
                  title="Refresh Orders"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {orders.slice(0, 5).map((ord) => (
                <div
                  key={ord._id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.verificationStatus === 'Approved & Verified'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : ord.verificationStatus === 'Rejected'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {ord.verificationStatus}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold truncate">
                      {ord.itemSnapshot?.title || 'Order Asset'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Buyer: {ord.buyerEmail} • UTR: {ord.upiTransactionId}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-white/5">
                    <div className="text-right">
                      <div className="text-sm font-black font-display text-slate-900 dark:text-white">
                        {formatAmount(ord.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {ord.verificationStatus === 'Pending Admin Approval' ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            verifyPaymentMutation.mutate({
                              id: ord._id,
                              status: 'Approved & Verified',
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            verifyPaymentMutation.mutate({
                              id: ord._id,
                              status: 'Rejected',
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">Handled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ORDERS & PAYMENTS APPROVAL */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header, Search & Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">
                  Payment Approvals & Order Handoffs
                </h2>
                <p className="text-xs text-slate-500">
                  Inspect buyer UPI UTR numbers, approve payments, and update credential transfer status
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setOrderFilter(status)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      orderFilter === status
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                        : 'bg-slate-100 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders by Order Number, Buyer Email, Phone, or UPI UTR..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading incoming orders...</div>
            ) : orders.length === 0 ? (
              <div className="rounded-3xl p-12 text-center bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 text-slate-400 text-xs space-y-2">
                <Package className="w-8 h-8 mx-auto text-slate-400" />
                <p>No orders found matching the selected filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="p-6 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4"
                  >
                    {/* Top Row: ID, Time, Status Pills */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-black text-brand-600 dark:text-brand-400">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Verification Status Pill */}
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            ord.verificationStatus === 'Approved & Verified'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : ord.verificationStatus === 'Rejected'
                              ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
                          }`}
                        >
                          {ord.verificationStatus}
                        </span>

                        {/* Transfer Status Pill */}
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-obsidian-850 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5">
                          {ord.transferStatus}
                        </span>
                      </div>
                    </div>

                    {/* Middle Grid: Details & UPI UTR Highlight */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Product & Buyer Details */}
                      <div className="lg:col-span-7 space-y-2 text-xs">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {ord.itemSnapshot?.title || 'Purchased Asset'}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-600 dark:text-slate-400">
                          <div>
                            <span className="text-slate-400">Buyer Email:</span>{' '}
                            <span className="font-semibold text-slate-900 dark:text-white select-all">
                              {ord.buyerEmail}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Buyer Phone:</span>{' '}
                            <span className="font-semibold text-slate-900 dark:text-white select-all">
                              {ord.buyerPhone}
                            </span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-slate-400">Credentials Destination:</span>{' '}
                            <span className="font-semibold font-mono text-brand-600 dark:text-brand-400 select-all">
                              {ord.transferDestinationEmail}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Payment Highlight Box & UTR */}
                      <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Paid Amount
                          </span>
                          <span className="text-lg font-black font-display text-slate-900 dark:text-white">
                            {formatAmount(ord.amount)}
                          </span>
                        </div>

                        {/* UPI UTR Verification Box */}
                        <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-white/5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-semibold">UPI Transaction ID (UTR):</span>
                            <button
                              type="button"
                              onClick={() => handleCopyUtr(ord.upiTransactionId)}
                              className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              {copiedUtr === ord.upiTransactionId ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400 bg-white dark:bg-obsidian-900 p-2 rounded-xl border border-slate-200/80 dark:border-white/10 select-all text-center sm:text-left">
                            {ord.upiTransactionId}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                      {/* WhatsApp Buyer Direct */}
                      <a
                        href={`https://wa.me/${ord.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hi, Modern Teams support here regarding your order #${ord.orderNumber}. We have verified your payment for ${ord.itemSnapshot?.title}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat with Buyer on WhatsApp</span>
                      </a>

                      {/* Payment Verification & Transfer Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {ord.verificationStatus === 'Pending Admin Approval' && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                verifyPaymentMutation.mutate({
                                  id: ord._id,
                                  status: 'Approved & Verified',
                                })
                              }
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                            >
                              Approve Payment
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                verifyPaymentMutation.mutate({
                                  id: ord._id,
                                  status: 'Rejected',
                                  notes: 'Payment verification failed or UTR invalid.',
                                })
                              }
                              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {ord.verificationStatus === 'Approved & Verified' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateTransferMutation.mutate({
                                  id: ord._id,
                                  transferStatus: 'Credentials Sent to Email',
                                })
                              }
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                ord.transferStatus === 'Credentials Sent to Email'
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'bg-slate-100 dark:bg-obsidian-850 hover:bg-slate-200 dark:hover:bg-obsidian-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              Mark Credentials Sent
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateTransferMutation.mutate({
                                  id: ord._id,
                                  transferStatus: 'Transfer Complete',
                                })
                              }
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                ord.transferStatus === 'Transfer Complete'
                                  ? 'bg-emerald-600 text-white shadow-md'
                                  : 'bg-slate-100 dark:bg-obsidian-850 hover:bg-slate-200 dark:hover:bg-obsidian-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              Complete Handoff
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PRODUCTS INVENTORY (ACCOUNTS & SERVICES) */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">
                  Product Inventory Management
                </h2>
                <p className="text-xs text-slate-500">
                  Add, configure, or remove verified social media accounts and services
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddAccountModalOpen(true)}
                id="admin-add-product-main-btn"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Account Listing</span>
              </button>
            </div>

            {/* Accounts Table / Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((acc) => (
                <div
                  key={acc._id}
                  className="rounded-3xl p-5 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        {acc.platform}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          acc.status === 'sold'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}
                      >
                        {acc.status === 'sold' ? 'Sold' : 'Available'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        {acc.title}
                      </h3>
                      <div className="text-xs font-mono text-slate-400">{acc.handle}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-obsidian-850">
                        <span className="text-[10px] text-slate-400 block">Followers</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {acc.followersCount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-obsidian-850">
                        <span className="text-[10px] text-slate-400 block">Price</span>
                        <span className="font-bold text-brand-600 dark:text-brand-400">
                          {formatAmount(acc.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <Link
                      to={`/accounts/${acc._id}`}
                      target="_blank"
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${acc.title}?`)) {
                          deleteAccountMutation.mutate(acc._id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: INTERNSHIP CANDIDATE APPLICATIONS */}
        {/* ============================================================== */}
        {activeTab === 'internships' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">
                Internship Applications Talent Pool
              </h2>
              <p className="text-xs text-slate-500">
                Review candidate resumes, portfolios, statements of purpose, and manage hiring statuses
              </p>
            </div>

            {applicationsLoading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="rounded-3xl p-12 text-center bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 text-slate-400 text-xs space-y-2">
                <Briefcase className="w-8 h-8 mx-auto text-slate-400" />
                <p>No internship applications submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-6 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full">
                          {app.domain}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                          {app.applicantName}
                        </h3>
                        <div className="text-xs text-slate-500">
                          Applied for: <span className="font-semibold text-slate-800 dark:text-slate-200">{app.internshipTitle}</span> • {new Date(app.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Status Dropdown / Badge */}
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          app.status === 'Accepted'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : app.status === 'Shortlisted'
                            ? 'bg-blue-500/10 text-blue-500'
                            : app.status === 'Rejected'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* Contact & Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850">
                        <span className="text-[10px] text-slate-400 block">Email</span>
                        <span className="font-semibold text-slate-900 dark:text-white select-all">
                          {app.email}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850">
                        <span className="text-[10px] text-slate-400 block">Phone</span>
                        <span className="font-semibold text-slate-900 dark:text-white select-all">
                          {app.phone}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850">
                        <span className="text-[10px] text-slate-400 block">Experience Level</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {app.experienceLevel}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 flex items-center gap-3">
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-600 dark:text-brand-400 hover:underline font-bold"
                          >
                            Portfolio ↗
                          </a>
                        )}
                        {app.githubUrl && (
                          <a
                            href={app.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-900 dark:text-white hover:underline font-bold"
                          >
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Statement of Purpose */}
                    {app.whyJoin && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850/60 border border-slate-100 dark:border-white/5 space-y-1 text-xs">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Statement of Purpose:
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {app.whyJoin}
                        </p>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <a
                        href={`https://wa.me/${app.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hi ${app.applicantName}, Modern Teams talent team here regarding your application for the ${app.internshipTitle} position.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message on WhatsApp</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationMutation.mutate({ id: app._id, status: 'Shortlisted' })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                        >
                          Shortlist
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationMutation.mutate({ id: app._id, status: 'Accepted' })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
                        >
                          Hire / Accept
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationMutation.mutate({ id: app._id, status: 'Rejected' })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ADD ACCOUNT PRODUCT MODAL */}
      {/* ============================================================== */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Add New Verified Social Account
                </h3>
                <p className="text-xs text-slate-500">Publish a new digital property to the marketplace</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAccountModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAccountSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">Listing Title *</label>
                  <input
                    type="text"
                    id="new-account-title"
                    value={newAccount.title}
                    onChange={(e) => setNewAccount({ ...newAccount, title: e.target.value })}
                    placeholder="e.g. 120K AI & Tech Instagram Page"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">Platform *</label>
                  <select
                    value={newAccount.platform}
                    id="new-account-platform"
                    onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="X/Twitter">X / Twitter</option>
                    <option value="Telegram">Telegram</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">Handle / Username *</label>
                  <input
                    type="text"
                    id="new-account-handle"
                    value={newAccount.handle}
                    onChange={(e) => setNewAccount({ ...newAccount, handle: e.target.value })}
                    placeholder="@handle"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">Followers Count *</label>
                  <input
                    type="number"
                    id="new-account-followers"
                    value={newAccount.followersCount}
                    onChange={(e) => setNewAccount({ ...newAccount, followersCount: e.target.value })}
                    placeholder="e.g. 85000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">Selling Price (INR ₹) *</label>
                  <input
                    type="number"
                    id="new-account-price"
                    value={newAccount.price}
                    onChange={(e) => setNewAccount({ ...newAccount, price: e.target.value })}
                    placeholder="e.g. 19500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">Original / Strike Price</label>
                  <input
                    type="number"
                    value={newAccount.originalPrice}
                    onChange={(e) => setNewAccount({ ...newAccount, originalPrice: e.target.value })}
                    placeholder="e.g. 26000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">Niche</label>
                  <input
                    type="text"
                    value={newAccount.niche}
                    onChange={(e) => setNewAccount({ ...newAccount, niche: e.target.value })}
                    placeholder="e.g. Finance, Tech, Luxury"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">Engagement Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newAccount.engagementRate}
                    onChange={(e) => setNewAccount({ ...newAccount, engagementRate: e.target.value })}
                    placeholder="e.g. 7.4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Description</label>
                <textarea
                  rows="2"
                  value={newAccount.description}
                  onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                  placeholder="One-line summary about account audience and reach"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Screenshot URLs (1 per line)</label>
                <textarea
                  rows="2"
                  value={newAccount.screenshots}
                  onChange={(e) => setNewAccount({ ...newAccount, screenshots: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={newAccount.verifiedBadge}
                    onChange={(e) => setNewAccount({ ...newAccount, verifiedBadge: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Official Verified Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={newAccount.monetizationEnabled}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, monetizationEnabled: e.target.checked })
                    }
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Monetization Active</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-obsidian-850 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-new-account-btn"
                  disabled={createAccountMutation.isPending}
                  className="flex-1 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-600/30"
                >
                  {createAccountMutation.isPending ? 'Publishing...' : 'Publish Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
