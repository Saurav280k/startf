import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

const EditAccountModal = ({ isOpen, onClose, account, onSubmit, isPending }) => {
  const [formData, setFormData] = useState({
    title: '',
    platform: 'Instagram',
    handle: '',
    profileUrl: '',
    followersCount: '',
    engagementRate: '',
    niche: 'Tech & AI',
    price: '',
    originalPrice: '',
    verifiedBadge: false,
    monetizationEnabled: false,
    monthlyRevenue: '',
    accountAgeYears: 2,
    description: '',
    highlights: '',
    screenshots: '',
  });

  useEffect(() => {
    if (account) {
      setFormData({
        title: account.title || '',
        platform: account.platform || 'Instagram',
        handle: account.handle || '',
        profileUrl: account.profileUrl || '',
        followersCount: account.followersCount || '',
        engagementRate: account.engagementRate || '',
        niche: account.niche || 'Tech & AI',
        price: account.price || '',
        originalPrice: account.originalPrice || '',
        verifiedBadge: !!account.verifiedBadge,
        monetizationEnabled: !!account.monetizationEnabled,
        monthlyRevenue: account.monthlyRevenue || '',
        accountAgeYears: account.accountAgeYears || 2,
        description: account.description || '',
        highlights: Array.isArray(account.highlights) ? account.highlights.join('\n') : '',
        screenshots: Array.isArray(account.screenshots) ? account.screenshots.join(', ') : '',
      });
    }
  }, [account]);

  if (!isOpen || !account) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      followersCount: Number(formData.followersCount) || 0,
      engagementRate: Number(formData.engagementRate) || 0,
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || Number(formData.price) || 0,
      monthlyRevenue: Number(formData.monthlyRevenue) || 0,
      accountAgeYears: Number(formData.accountAgeYears) || 2,
      highlights: formData.highlights
        ? formData.highlights.split('\n').map((h) => h.trim()).filter(Boolean)
        : [],
      screenshots: formData.screenshots
        ? formData.screenshots.split(',').map((s) => s.trim()).filter(Boolean)
        : account.screenshots || [],
    };
    onSubmit({ id: account._id, data: payload });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
              Edit Account Listing
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{account.handle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Platform *</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              >
                {['Instagram', 'YouTube', 'TikTok', 'X/Twitter', 'Telegram', 'LinkedIn'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Handle (e.g. @username) *</label>
              <input
                type="text"
                required
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Live Profile URL</label>
              <input
                type="url"
                value={formData.profileUrl}
                onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                placeholder="https://instagram.com/handle"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Price (₹ INR) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Original Price (₹)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Followers Count *</label>
              <input
                type="number"
                required
                value={formData.followersCount}
                onChange={(e) => setFormData({ ...formData, followersCount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Engagement Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.engagementRate}
                onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Niche</label>
              <input
                type="text"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Monthly Revenue (₹)</label>
              <input
                type="number"
                value={formData.monthlyRevenue}
                onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-white">
              <input
                type="checkbox"
                checked={formData.verifiedBadge}
                onChange={(e) => setFormData({ ...formData, verifiedBadge: e.target.checked })}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <span>Verified Badge</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-white">
              <input
                type="checkbox"
                checked={formData.monetizationEnabled}
                onChange={(e) => setFormData({ ...formData, monetizationEnabled: e.target.checked })}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <span>Monetization Enabled</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Description *</label>
            <textarea
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Screenshot Image URLs (comma separated)</label>
            <input
              type="text"
              value={formData.screenshots}
              onChange={(e) => setFormData({ ...formData, screenshots: e.target.value })}
              placeholder="https://images.unsplash.com/..., https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
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
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccountModal;
