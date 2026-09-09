import React, { useState } from 'react';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useToastStore } from '../../store/useToastStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';

const RequestRefundModal = ({ isOpen, onClose, order, onSuccess }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { formatAmount } = useCurrencyStore();

  const [reason, setReason] = useState('Account details could not be accessed');
  const [upiId, setUpiId] = useState('');
  const [notes, setNotes] = useState('');

  const refundMutation = useMutation({
    mutationFn: (data) => api.requestRefund(order._id, data),
    onSuccess: (res) => {
      addToast({
        message: res.message || 'Refund request submitted to admin for review.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['order', order._id] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (err) => {
      addToast({
        message: err.message || 'Failed to submit refund request',
        type: 'error',
      });
    },
  });

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!upiId.trim()) {
      addToast({ message: 'Please provide a valid UPI ID for refund processing', type: 'error' });
      return;
    }
    refundMutation.mutate({
      reason,
      upiId: upiId.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
                Request Order Refund
              </h3>
              <p className="text-xs text-slate-500 font-mono">Order #{order.orderNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Pill */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              {order.itemSnapshot?.title || 'Purchased Asset'}
            </span>
            <span className="text-[11px] text-slate-400">Escrow Protected Refund</span>
          </div>
          <div className="text-right font-black font-display text-slate-900 dark:text-white text-sm">
            {formatAmount(order.amount)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Reason for Refund *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Account details could not be accessed">Account details could not be accessed</option>
              <option value="Credentials mismatch with listing">Credentials mismatch with listing</option>
              <option value="Accidental duplicate purchase">Accidental duplicate purchase</option>
              <option value="Service deliverables delayed past SLA">Service deliverables delayed past SLA</option>
              <option value="Other / Support Inquiry">Other / Support Inquiry</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">
              Receiving UPI ID for Refund Disbursement *
            </label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. yourname@oksbi or 9876543210@paytm"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-[11px] text-slate-400">
              Approved refunds will be transferred directly to this UPI address.
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">
              Additional Details / Explanation
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain any details to help admin review and approve your refund request faster..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-obsidian-850 text-slate-700 dark:text-slate-300 font-bold transition-all hover:bg-slate-200 dark:hover:bg-obsidian-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={refundMutation.isPending}
              className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {refundMutation.isPending && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{refundMutation.isPending ? 'Submitting...' : 'Submit Refund Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestRefundModal;
