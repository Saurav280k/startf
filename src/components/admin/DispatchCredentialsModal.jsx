import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, Mail } from 'lucide-react';

const DispatchCredentialsModal = ({ isOpen, onClose, order, onSubmit, isPending }) => {
  const [formData, setFormData] = useState({
    loginUsername: '',
    password: '',
    originalEmail: '',
    securityNotes: '1. Log into the account immediately with provided credentials.\n2. Go to Security > Password and change the password.\n3. Update the linked phone number and recovery email to your own.\n4. Enable Two-Factor Authentication (2FA) via Google Authenticator or SMS.',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        loginUsername: order.transferCredentials?.loginUsername || order.itemSnapshot?.handle || '',
        password: order.transferCredentials?.password || '',
        originalEmail: order.transferCredentials?.originalEmail || 'Clean Original Email (OGE) Included',
        securityNotes:
          order.transferCredentials?.securityNotes ||
          '1. Log into the account immediately with provided credentials.\n2. Go to Security > Password and change the password.\n3. Update the linked phone number and recovery email to your own.\n4. Enable Two-Factor Authentication (2FA) via Google Authenticator or SMS.',
      });
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: order._id,
      credentials: {
        loginUsername: formData.loginUsername.trim(),
        password: formData.password.trim(),
        originalEmail: formData.originalEmail.trim(),
        securityNotes: formData.securityNotes.trim(),
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
                Dispatch Credentials
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

        <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-700 dark:text-brand-300 flex items-center gap-2.5">
          <Mail className="w-4 h-4 shrink-0" />
          <span>
            Credentials will be safely delivered to destination email{' '}
            <strong className="font-mono">{order.transferDestinationEmail}</strong> and unlocked in the buyer's live Status Tracker Vault.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Login Username / Handle *</label>
            <input
              type="text"
              required
              value={formData.loginUsername}
              onChange={(e) => setFormData({ ...formData, loginUsername: e.target.value })}
              placeholder="e.g. @modern_tech_daily"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Temporary Login Password *</label>
            <input
              type="text"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="e.g. ModernTeams#Pass2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Original Email (OGE) Details</label>
            <input
              type="text"
              value={formData.originalEmail}
              onChange={(e) => setFormData({ ...formData, originalEmail: e.target.value })}
              placeholder="e.g. Clean OGE linked to original creation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Security & Transfer Instructions</label>
            <textarea
              rows="4"
              value={formData.securityNotes}
              onChange={(e) => setFormData({ ...formData, securityNotes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-[11px]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-obsidian-850 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-600/30 cursor-pointer disabled:opacity-50"
            >
              {isPending ? 'Dispatching...' : 'Dispatch to Buyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispatchCredentialsModal;
