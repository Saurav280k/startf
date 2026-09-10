import React, { useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Mail,
  ExternalLink,
  MessageCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { ShimmerList } from '../components/common/ShimmerCard';
import RequestRefundModal from '../components/orders/RequestRefundModal';

const MyOrdersPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isRefundMode = searchParams.get('action') === 'refund' || location.pathname === '/request-refund';

  const { user, isAuthenticated } = useAuthStore();
  const { formatAmount } = useCurrencyStore();
  const [lookupEmail, setLookupEmail] = useState(user?.email || '');
  const [queriedEmail, setQueriedEmail] = useState(user?.email || '');
  const [selectedRefundOrder, setSelectedRefundOrder] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-orders', queriedEmail],
    queryFn: () => api.getMyOrders(queriedEmail),
    enabled: isAuthenticated || !!queriedEmail,
    refetchInterval: 4000,
  });

  const orders = data?.orders || [];

  const handleLookup = (e) => {
    e.preventDefault();
    if (lookupEmail) setQueriedEmail(lookupEmail.trim());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            My Purchases & Orders
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track ownership handovers, credential vaults, and buyer protection refunds
          </p>
        </div>

        <Link
          to="/refund-policy"
          className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Buyer Protection Policy</span>
        </Link>
      </div>

      {/* Refund Claims Mode Alert Banner */}
      {isRefundMode && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 font-bold">
            <RotateCcw className="w-4 h-4 shrink-0 animate-pulse" />
            <span>Refund Mode: Select your purchase below and click "Request Refund" to submit your claim.</span>
          </div>
        </div>
      )}

      {/* Guest Email Lookup Bar if not logged in */}
      {!isAuthenticated && (
        <form
          onSubmit={handleLookup}
          className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row gap-3 items-center"
        >
          <div className="relative flex-1 w-full">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="Enter checkout email to find your orders..."
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md shadow-brand-600/20"
          >
            Find My Orders
          </button>
        </form>
      )}

      {/* Orders List */}
      {isLoading ? (
        <ShimmerList count={3} />
      ) : orders.length === 0 ? (
        <div className="rounded-3xl p-10 sm:p-12 text-center bg-slate-50 dark:bg-obsidian-900/40 border border-slate-200/80 dark:border-white/5 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No active or past purchases found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isAuthenticated
              ? 'You have not acquired any social accounts or services yet. Explore our verified listings.'
              : 'Enter the email you provided at checkout above to display your transactions.'}
          </p>
          <div className="pt-2">
            <Link
              to="/accounts"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/25"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord._id}
              className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 hover:border-brand-500/30 transition-all shadow-sm space-y-4"
            >
              {/* Card Top: Order Number, Date & Status Pills (Responsive flex-wrap) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full">
                    {ord.orderNumber}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(ord.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Verification Status */}
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      ord.verificationStatus === 'Approved & Verified'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : ord.verificationStatus === 'Rejected'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                    }`}
                  >
                    {ord.verificationStatus || 'Pending Approval'}
                  </span>

                  {/* Transfer Status */}
                  {ord.transferStatus && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        ord.transferStatus === 'Transfer Complete'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : ord.transferStatus === 'Credentials Sent to Email'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-slate-100 dark:bg-obsidian-850 text-slate-500'
                      }`}
                    >
                      {ord.transferStatus}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Product Information */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {ord.itemSnapshot?.title || 'Modern Teams Digital Asset'}
                </h3>
              </div>

              {/* Responsive Metadata Grid for Mobile & Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/50 dark:border-white/5 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Credentials Destination Email
                  </span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white truncate block">
                    {ord.transferDestinationEmail}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/50 dark:border-white/5 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Payment Method / UTR
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {ord.paymentMethod}
                    </span>
                    {ord.upiTransactionId && (
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px] truncate">
                        UTR: {ord.upiTransactionId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Refund Request Status Banner (if applicable) */}
              {ord.refund?.status === 'requested' && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Refund Requested (UPI: {ord.refund.upiId})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Pending Admin Review</span>
                </div>
              )}

              {ord.refund?.status === 'approved' && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Refund Approved to UPI ID: {ord.refund.upiId}</span>
                </div>
              )}

              {/* Bottom Row: Amount & Actions (Full width on Mobile) */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                  <span className="text-lg sm:text-xl font-black font-display text-slate-900 dark:text-white">
                    {formatAmount(ord.amount)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Request Refund button if eligible */}
                  {(!ord.refund || ord.refund.status === 'rejected') && (
                    <button
                      type="button"
                      onClick={() => setSelectedRefundOrder(ord)}
                      id={`request-refund-btn-${ord.orderNumber}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm shadow-red-600/25 transition-all active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request Refund</span>
                    </button>
                  )}

                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Hi Modern Teams Support, I am inquiring about order ${ord.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                    title="Support Chat"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <Link
                    to={`/order-tracker/${ord._id}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm shadow-brand-600/20"
                  >
                    <span>Track Status</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Refund Modal */}
      <RequestRefundModal
        isOpen={!!selectedRefundOrder}
        onClose={() => setSelectedRefundOrder(null)}
        order={selectedRefundOrder}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default MyOrdersPage;
