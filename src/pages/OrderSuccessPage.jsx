import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  MessageCircle,
  Mail,
  Copy,
  ArrowLeft,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { useToastStore } from '../store/useToastStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { formatAmount } = useCurrencyStore();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.getOrderById(id),
    refetchInterval: 2500, // Poll every 2.5 seconds for instant admin updates
  });

  const order = data?.order;

  const isPaymentApproved =
    order?.verificationStatus === 'Approved & Verified' || order?.paymentStatus === 'completed';
  const isPaymentRejected =
    order?.verificationStatus === 'Rejected' || order?.paymentStatus === 'failed';
  const isCredentialsSent =
    order?.transferStatus === 'Credentials Sent to Email' || order?.transferStatus === 'Transfer Complete';
  const isTransferComplete =
    order?.transferStatus === 'Transfer Complete';

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    } catch (e) {}

    // Prevent accidental browser back button from re-submitting payment
    const handlePopState = () => {
      navigate('/my-orders', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast({ message: 'Copied to clipboard!', type: 'info' });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="h-96 rounded-3xl shimmer-box" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass-panel text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
        <Link to="/" className="px-5 py-2.5 rounded-2xl bg-brand-600 text-white text-xs font-bold">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Top back navigation safely pointing to My Orders */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>View All My Orders</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              refetch();
              addToast({ message: 'Order status refreshed.', type: 'info' });
            }}
            disabled={isFetching}
            className="text-xs font-semibold text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors flex items-center gap-1 cursor-pointer"
            title="Refresh order status"
          >
            <Clock className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-brand-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Safe Buyer Guarantee
          </span>
        </div>
      </div>

      {/* Success Badge & Headline */}
      <div className="text-center space-y-3">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl ${
          isPaymentRejected
            ? 'bg-red-500/10 text-red-500 shadow-red-500/10'
            : isPaymentApproved
            ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10'
            : 'bg-amber-500/10 text-amber-500 shadow-amber-500/10'
        }`}>
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isPaymentApproved
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                : isPaymentRejected
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {isPaymentApproved
              ? 'Payment Approved & Verified'
              : isPaymentRejected
              ? 'Payment Verification Rejected'
              : (order.verificationStatus || 'Pending Admin Approval')}
          </span>

          {order.transferStatus && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-obsidian-850 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5">
              {order.transferStatus}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-950 dark:text-white">
          {isTransferComplete
            ? 'Asset Handoff Complete!'
            : isCredentialsSent
            ? 'Credentials Sent to Your Email!'
            : isPaymentApproved
            ? 'Payment Verified & Approved!'
            : isPaymentRejected
            ? 'Payment Verification Issue'
            : 'Payment Details Submitted!'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          {isTransferComplete
            ? 'The account credentials have been verified and transferred. You now have full ownership.'
            : isCredentialsSent
            ? `Your login credentials and security details have been sent to ${order.transferDestinationEmail}. Please check your inbox.`
            : isPaymentApproved
            ? `Your payment has been verified by the admin team! Credentials are being prepared for dispatch to ${order.transferDestinationEmail}.`
            : isPaymentRejected
            ? 'Your payment could not be verified automatically. Please contact support via WhatsApp with your UPI screenshot.'
            : 'Your UPI payment has been received. Our team will verify your 12-digit transaction UTR and transfer your account details within 1-2 hours.'}
        </p>
      </div>

      {/* Primary Receipt Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6">
        {/* Top Order Details */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Order Number
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                {order.orderNumber}
              </span>
              <button
                onClick={() => copyToClipboard(order.orderNumber)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Copy Order Number"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Amount
            </span>
            <div className="text-2xl font-black font-display text-slate-900 dark:text-white mt-1">
              {formatAmount(order.amount)}
            </div>
          </div>
        </div>

        {/* Transfer Destination Highlight Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Credentials Destination:
            </span>
            <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
              {order.transferDestinationEmail}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Your login username, password, and security codes will be delivered to this email within{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {order.transferEta || '1 - 2 Hours'}
            </span>.
          </p>
        </div>

        {/* UPI UTR Verification Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Submitted UPI Transaction ID (UTR):</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {order.upiTransactionId || 'Under verification'}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              isPaymentApproved
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                : isPaymentRejected
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
            }`}
          >
            {isPaymentApproved
              ? 'Payment Approved & Verified'
              : isPaymentRejected
              ? 'Payment Rejected'
              : (order.verificationStatus || 'Pending Admin Approval')}
          </span>
        </div>

        {/* Step-by-Step Delivery Tracker */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Handoff Progress Tracker
          </h4>
          <div className="space-y-2.5">
            {/* Step 1: Payment Verification */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isPaymentRejected
                    ? 'bg-red-500 text-white'
                    : isPaymentApproved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white animate-pulse'
                }`}
              >
                {isPaymentRejected ? '✕' : isPaymentApproved ? '✓' : '1'}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isPaymentRejected
                    ? 'Payment Verification Rejected'
                    : isPaymentApproved
                    ? 'Payment Verified & Approved'
                    : 'Payment Submitted by Buyer'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isPaymentApproved
                    ? `UTR: ${order.upiTransactionId} — Approved by Admin`
                    : isPaymentRejected
                    ? `UTR: ${order.upiTransactionId} — Invalid or rejected`
                    : `UTR: ${order.upiTransactionId}`}
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isPaymentRejected
                    ? 'text-red-500 bg-red-500/10'
                    : isPaymentApproved
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : 'text-amber-500 bg-amber-500/10'
                }`}
              >
                {isPaymentRejected ? 'Rejected' : isPaymentApproved ? 'Approved' : 'Submitted'}
              </span>
            </div>

            {/* Step 2: Credentials Dispatch */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isCredentialsSent
                    ? 'bg-emerald-500 text-white'
                    : isPaymentApproved
                    ? 'bg-brand-600 text-white animate-pulse'
                    : 'bg-slate-300 dark:bg-obsidian-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isCredentialsSent ? '✓' : '2'}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isCredentialsSent
                    ? 'Credentials Sent to Email'
                    : isPaymentApproved
                    ? 'Admin Preparing Credentials Dispatch'
                    : 'Admin Verification & Credentials Dispatch'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isCredentialsSent
                    ? `Sent to ${order.transferDestinationEmail}`
                    : isPaymentApproved
                    ? `Preparing transfer to ${order.transferDestinationEmail}`
                    : `Awaiting payment approval`}
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isCredentialsSent
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : isPaymentApproved
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10 animate-pulse'
                    : 'text-slate-400 bg-slate-100 dark:bg-white/5'
                }`}
              >
                {isCredentialsSent
                  ? 'Sent'
                  : isPaymentApproved
                  ? 'In Progress'
                  : 'Pending'}
              </span>
            </div>

            {/* Step 3: Order Complete */}
            <div
              className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 ${
                isTransferComplete ? '' : isCredentialsSent ? '' : 'opacity-60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isTransferComplete
                    ? 'bg-emerald-500 text-white'
                    : isCredentialsSent
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-slate-300 dark:bg-obsidian-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isTransferComplete ? '✓' : '3'}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isTransferComplete
                    ? 'Buyer Verification & Order Complete'
                    : isCredentialsSent
                    ? 'Verify Login & Change Password'
                    : 'Buyer Verification & Order Complete'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isTransferComplete
                    ? 'All credentials transferred. Order marked complete!'
                    : isCredentialsSent
                    ? `Check inbox at ${order.transferDestinationEmail} to log in`
                    : 'Log in, change password, and enjoy your new account'}
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isTransferComplete
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : isCredentialsSent
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-slate-400'
                }`}
              >
                {isTransferComplete
                  ? 'Complete'
                  : isCredentialsSent
                  ? 'Action Required'
                  : 'Next Step'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-3">
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(
              `Hi Modern Teams Support, I have submitted UPI payment for order ${order.orderNumber} (UTR: ${order.upiTransactionId}). Please verify and transfer details.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 px-4 rounded-2xl border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Support</span>
          </a>

          <Link
            to="/my-orders"
            className="flex-1 py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-600/25"
          >
            <span>My Orders & Purchases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
