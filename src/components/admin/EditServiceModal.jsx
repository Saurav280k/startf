import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditServiceModal = ({ isOpen, onClose, service, onSubmit, isPending }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Development',
    tag: 'Popular',
    turnaroundDays: 5,
    shortDesc: '',
    description: '',
    pricingTiers: [
      { tierName: 'Starter', price: '', features: '' },
      { tierName: 'Growth', price: '', features: '', isPopular: true },
      { tierName: 'Enterprise', price: '', features: '' },
    ],
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        category: service.category || 'Development',
        tag: service.tag || 'Popular',
        turnaroundDays: service.turnaroundDays || 5,
        shortDesc: service.shortDesc || '',
        description: service.description || '',
        pricingTiers: service.pricingTiers?.length
          ? service.pricingTiers.map((t) => ({
              tierName: t.tierName || '',
              price: t.price || '',
              features: Array.isArray(t.features) ? t.features.join(', ') : '',
              isPopular: !!t.isPopular,
            }))
          : [
              { tierName: 'Starter', price: '', features: '' },
              { tierName: 'Growth', price: '', features: '', isPopular: true },
              { tierName: 'Enterprise', price: '', features: '' },
            ],
      });
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      turnaroundDays: Number(formData.turnaroundDays) || 5,
      pricingTiers: formData.pricingTiers.map((t) => ({
        tierName: t.tierName,
        price: Number(t.price) || 0,
        features: t.features.split(',').map((f) => f.trim()).filter(Boolean),
        isPopular: !!t.isPopular,
      })),
    };
    onSubmit({ id: service._id, data: payload });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
              Edit Digital Service
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{service.title}</p>
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
              <label className="font-bold text-slate-900 dark:text-white">Service Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              >
                {['Development', 'Growth', 'SEO', 'Design', 'Cloud & DevOps'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Badge Tag</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Turnaround (Days)</label>
              <input
                type="number"
                value={formData.turnaroundDays}
                onChange={(e) => setFormData({ ...formData, turnaroundDays: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Short Summary (1 line) *</label>
            <input
              type="text"
              required
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Full Scope & Deliverables *</label>
            <textarea
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            />
          </div>

          {/* Pricing Tiers */}
          <div className="space-y-3 pt-2">
            <label className="font-bold text-slate-900 dark:text-white block">Pricing Package Tiers</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {formData.pricingTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 space-y-2.5"
                >
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{tier.tierName}</span>
                    {tier.isPopular && <span className="text-[10px] text-brand-500 font-bold">Popular</span>}
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="Price (₹)"
                    value={tier.price}
                    onChange={(e) => {
                      const updated = [...formData.pricingTiers];
                      updated[idx].price = e.target.value;
                      setFormData({ ...formData, pricingTiers: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Features (comma sep)"
                    value={tier.features}
                    onChange={(e) => {
                      const updated = [...formData.pricingTiers];
                      updated[idx].features = e.target.value;
                      setFormData({ ...formData, pricingTiers: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              ))}
            </div>
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
              className="flex-1 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;
