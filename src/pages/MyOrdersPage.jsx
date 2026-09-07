import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingBag,
  ShieldCheck,
  Clock,
  ArrowRight,
  Mail,
  Search,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { ShimmerList } from '../components/common/ShimmerCard';

const MyOrdersPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { formatAmount } = useCurrencyStore();
  const [lookupEmail, setLookupEmail] = useState(user?.email || '');
  const [queriedEmail, setQueriedEmail] = useState(user?.email || '');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-orders', queriedEmail],
    queryFn: () => api.getMyOrders(queriedEmail),
    enabled: isAuthenticated || !!queriedEmail,
    refetchInterval: 3000,
  });

  const orders = data?.orders || [];

  const handleLookup = (e) => {
    e.preventDefault();
    if (lookupEmail) setQueriedEmail(lookupEmail.trim());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
          Order & Transfer Status
        </div>
        <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">
          My Purchases & Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
          Track real-time account transfer progress, UPI verification status, and view order receipts.
        </p>
      </div>

      {/* Guest Email Lookup Bar if not logged in */}
      {!isAuthenticated && (
        <form
          onSubmit={handleLookup}
          className="p-5 rounded-3xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row gap-3 items-center"
        >
          <div className="relative flex-1 w-full">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="Enter the email used during checkout..."
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shrink-0"
          >
            Find My Orders
          </button>
        </form>
      )}

      {/* Orders List */}
      {isLoading ? (
        <ShimmerList count={3} />
      ) : orders.length === 0 ? (
        <div className="rounded-3xl p-12 text-center bg-slate-50 dark:bg-obsidian-900/40 border border-slate-200/80 dark:border-white/5 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No active or past purchases found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isAuthenticated
              ? 'You have not acquired any social accounts or services yet. Explore our verified listings.'
              : 'Enter the email you provided at checkout above to display your transactions.'}
          </p>
          <Link
            to="/accounts"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/25"
          >
            <span>Explore Accounts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord._id}
              className="rounded-3xl p-6 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 hover:border-brand-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full">
                    {ord.orderNumber}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(ord.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      ord.verificationStatus === 'Approved & Verified'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : ord.verificationStatus === 'Rejected'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {ord.verificationStatus || 'Pending Admin Approval'}
                  </span>

                  {ord.transferStatus && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        ord.transferStatus === 'Transfer Complete'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : ord.transferStatus === 'Credentials Sent to Email'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-slate-100 dark:bg-obsidian-850 text-slate-500'
                      }`}
                    >
                      {ord.transferStatus}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {ord.itemSnapshot?.title || 'Modern Teams Digital Asset'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>
                      Delivery Email:{' '}
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {ord.transferDestinationEmail}
                      </span>
                    </span>
                    <span>•</span>
                    <span>Payment: {ord.paymentMethod}</span>
                    {ord.upiTransactionId && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-emerald-500 font-semibold">
                          UTR: {ord.upiTransactionId}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & View Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5">
                <div className="text-left md:text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Paid</div>
                  <div className="text-xl font-black font-display text-slate-900 dark:text-white">
                    {formatAmount(ord.amount)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Hi Modern Teams Support, I am tracking my order ${ord.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                    title="Ask on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <Link
                    to={`/order-success/${ord._id}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-brand-600 dark:bg-white dark:hover:bg-brand-400 text-white dark:text-slate-950 dark:hover:text-white text-xs font-bold transition-all"
                  >
                    <span>Status Tracker</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
