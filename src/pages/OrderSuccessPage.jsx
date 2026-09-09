import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  MessageCircle,
  Copy,
  ArrowLeft,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  FileText,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { useToastStore } from '../store/useToastStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import RequestRefundModal from '../components/orders/RequestRefundModal';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { formatAmount } = useCurrencyStore();

  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.getOrderById(id),
    refetchInterval: 3000, // Poll every 3s for real-time status updates
  });

  const order = data?.order;

  const isPaymentApproved =
    order?.verificationStatus === 'Approved & Verified' || order?.paymentStatus === 'completed';
  const isPaymentRejected =
    order?.verificationStatus === 'Rejected' || order?.paymentStatus === 'failed';
  const hasCredentials = !!order?.transferCredentials?.loginUsername;
  const isTransferComplete = order?.transferStatus === 'Transfer Complete';

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    } catch (e) {}

    const handlePopState = () => {
      navigate('/my-orders', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const copyToClipboard = (text, keyName) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    addToast({ message: `Copied ${keyName} to clipboard`, type: 'info' });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="h-96 rounded-3xl shimmer-box" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl glass-panel text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
        <Link to="/" className="inline-block px-5 py-2.5 rounded-2xl bg-brand-600 text-white text-xs font-bold">
          Go to Marketplace
        </Link>
      </div>
    );
  }

  // Transfer stages for progress visualization
  const transferStages = [
    {
      stage: 1,
      title: 'Payment Verification',
      desc: 'Admin team verifies 12-digit UPI UTR against banking settlement.',
      isDone: isPaymentApproved,
      isActive: !isPaymentApproved && !isPaymentRejected,
      isError: isPaymentRejected,
      statusLabel: isPaymentRejected ? 'Rejected' : isPaymentApproved ? 'Verified' : 'Reviewing UTR',
    },
    {
      stage: 2,
      title: 'Security & Transfer Preparation',
      desc: 'Account credentials, OGE email, and 2FA settings are cleared for dispatch.',
      isDone: hasCredentials || isTransferComplete,
      isActive: isPaymentApproved && !hasCredentials && !isTransferComplete,
      isError: false,
      statusLabel: hasCredentials ? 'Ready' : isPaymentApproved ? 'In Progress' : 'Pending',
    },
    {
      stage: 3,
      title: 'Secure Credentials Vault',
      desc: 'Encrypted login details dispatched directly to your private vault below.',
      isDone: hasCredentials,
      isActive: hasCredentials && !isTransferComplete,
      isError: false,
      statusLabel: hasCredentials ? 'Dispatched' : 'Locked',
    },
    {
      stage: 4,
      title: 'Ownership Handover Complete',
      desc: 'Password updated by buyer. Full asset ownership permanently transferred.',
      isDone: isTransferComplete,
      isActive: isTransferComplete,
      isError: false,
      statusLabel: isTransferComplete ? 'Completed' : 'Awaiting Final Handshake',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation & Status Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              refetch();
              addToast({ message: 'Order status updated', type: 'info' });
            }}
            disabled={isFetching}
            className="text-xs font-semibold text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors flex items-center gap-1 cursor-pointer"
            title="Refresh order status"
          >
            <Clock className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-brand-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full flex items-center gap-1.5 border border-brand-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Buyer Protection Order</span>
          </span>
        </div>
      </div>

      {/* Main Order Header Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black text-brand-600 dark:text-brand-400">
                {order.orderNumber}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isPaymentApproved
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : isPaymentRejected
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                }`}
              >
                {order.verificationStatus}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
              {order.itemSnapshot?.title || 'Purchased Asset'}
            </h1>
          </div>

          <div className="flex flex-wrap sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total Amount
              </span>
              <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                {formatAmount(order.amount)}
              </span>
            </div>

            {/* Quick Request Refund button right at top */}
            {(!order.refund || order.refund.status === 'rejected') && (
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs transition-colors cursor-pointer"
              >
                Request Refund
              </button>
            )}
          </div>
        </div>

        {/* Highlight Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Credentials Destination Email</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 dark:text-white truncate">
                {order.transferDestinationEmail}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(order.transferDestinationEmail, 'Email')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                {copiedKey === 'Email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Submitted UPI UTR</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 select-all">
                {order.upiTransactionId}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(order.upiTransactionId, 'UTR')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                {copiedKey === 'UTR' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Refund Status Banner (if requested) */}
        {order.refund?.status === 'requested' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Refund Request Submitted Under Admin Review</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Reason: <span className="font-semibold">{order.refund.reason}</span> • Receiving UPI ID: <span className="font-mono font-bold">{order.refund.upiId}</span>
            </p>
          </div>
        )}

        {order.refund?.status === 'approved' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Refund Approved & Processed</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              The refund has been issued to your UPI ID: <span className="font-mono font-bold">{order.refund.upiId}</span>
            </p>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 🔐 SECURE CREDENTIALS VAULT */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
              hasCredentials
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-obsidian-850 text-slate-400'
            }`}>
              {hasCredentials ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Secure Credentials Vault
              </h2>
              <p className="text-[11px] text-slate-400">
                {hasCredentials
                  ? 'Decrypted credentials ready for your immediate access'
                  : 'Credentials will unlock here automatically once admin dispatches'}
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              hasCredentials
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-100 dark:bg-obsidian-850 text-slate-500 border border-slate-200/60 dark:border-white/5'
            }`}
          >
            {hasCredentials ? 'Unlocked' : 'Locked'}
          </span>
        </div>

        {hasCredentials ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Username / Handle */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Account Login Handle / Username</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white select-all">
                    {order.transferCredentials.loginUsername}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(order.transferCredentials.loginUsername, 'Username')}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-obsidian-700 text-slate-500"
                    title="Copy Username"
                  >
                    {copiedKey === 'Username' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Password</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white select-all">
                    {showPassword ? order.transferCredentials.password : '••••••••••••••••'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-obsidian-700 text-slate-500"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.transferCredentials.password, 'Password')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-obsidian-700 text-slate-500"
                      title="Copy Password"
                    >
                      {copiedKey === 'Password' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Original Email (OGE) */}
              {order.transferCredentials.originalEmail && (
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Original Email (OGE) / Recovery Info</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {order.transferCredentials.originalEmail}
                  </span>
                </div>
              )}
            </div>

            {/* Security Handover Checklist */}
            {order.transferCredentials.securityNotes && (
              <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20 space-y-2 text-xs">
                <span className="font-bold text-brand-600 dark:text-brand-400 uppercase text-[10px] tracking-wider block">
                  Mandatory Security Handover Steps:
                </span>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed text-[11px]">
                  {order.transferCredentials.securityNotes}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-obsidian-850 text-center space-y-2 text-xs text-slate-500">
            <Lock className="w-6 h-6 mx-auto text-slate-400" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Credentials are being verified and prepared.
            </p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              Our security system safeguards the credentials until payment verification is completed. Once dispatched, your username, password, and security instructions will unlock here immediately.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 🚀 STEP-BY-STEP HANDOFF TRACKER */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Handoff Progress Tracker
            </h2>
            <p className="text-[11px] text-slate-400">Step-by-step real-time fulfillment stages</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            {isTransferComplete ? '4 of 4' : hasCredentials ? '3 of 4' : isPaymentApproved ? '2 of 4' : '1 of 4'}
          </span>
        </div>

        <div className="space-y-3">
          {transferStages.map((step) => (
            <div
              key={step.stage}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                step.isError
                  ? 'bg-red-500/5 border-red-500/20'
                  : step.isDone
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : step.isActive
                  ? 'bg-brand-500/5 border-brand-500/30 ring-1 ring-brand-500/20'
                  : 'bg-slate-50/60 dark:bg-obsidian-850/60 border-slate-200/40 dark:border-white/5 opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  step.isError
                    ? 'bg-red-500 text-white'
                    : step.isDone
                    ? 'bg-emerald-600 text-white'
                    : step.isActive
                    ? 'bg-brand-600 text-white animate-pulse'
                    : 'bg-slate-200 dark:bg-obsidian-800 text-slate-500'
                }`}
              >
                {step.isError ? '✕' : step.isDone ? '✓' : step.stage}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      step.isError
                        ? 'bg-red-500/10 text-red-600'
                        : step.isDone
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : step.isActive
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 animate-pulse'
                        : 'text-slate-400 bg-slate-100 dark:bg-obsidian-800'
                    }`}
                  >
                    {step.statusLabel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 📜 DETAILED ACTIVITY & AUDIT TIMELINE */}
      {/* ========================================================= */}
      {order.transferTimeline && order.transferTimeline.length > 0 && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-white/5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Transfer Activity Log
            </h2>
            <p className="text-[11px] text-slate-400">Timestamped transfer and audit events</p>
          </div>

          <div className="space-y-3">
            {order.transferTimeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{item.stage}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Grid */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {/* Request Refund Trigger */}
          {(!order.refund || order.refund.status === 'rejected') && (
            <button
              type="button"
              onClick={() => setIsRefundModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl border border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs transition-colors cursor-pointer"
            >
              Request Refund
            </button>
          )}

          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(
              `Hi Modern Teams Support, regarding order ${order.orderNumber} (Asset: ${order.itemSnapshot?.title}). Please assist with transfer.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-2xl border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Support Chat</span>
          </a>
        </div>

        <Link
          to="/my-orders"
          className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-brand-600/20"
        >
          <span>All Purchases</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Request Refund Modal */}
      <RequestRefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        order={order}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default OrderSuccessPage;
