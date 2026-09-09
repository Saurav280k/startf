import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditInternshipModal = ({ isOpen, onClose, internship, onSubmit, isPending }) => {
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Frontend',
    stipend: '₹25,000 / month',
    duration: '3 Months',
    location: 'Remote / Global',
    openings: 3,
    summary: '',
    skills: '',
    requirements: '',
    responsibilities: '',
  });

  useEffect(() => {
    if (internship) {
      setFormData({
        title: internship.title || '',
        domain: internship.domain || 'Frontend',
        stipend: internship.stipend || '',
        duration: internship.duration || '3 Months',
        location: internship.location || 'Remote / Global',
        openings: internship.openings || 3,
        summary: internship.summary || '',
        skills: Array.isArray(internship.skills) ? internship.skills.join(', ') : '',
        requirements: Array.isArray(internship.requirements) ? internship.requirements.join('\n') : '',
        responsibilities: Array.isArray(internship.responsibilities) ? internship.responsibilities.join('\n') : '',
      });
    }
  }, [internship]);

  if (!isOpen || !internship) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      openings: Number(formData.openings) || 1,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      requirements: formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      responsibilities: formData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean),
    };
    onSubmit({ id: internship._id, data: payload });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
              Edit Internship Opening
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{internship.title}</p>
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
              <label className="font-bold text-slate-900 dark:text-white">Role Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Domain *</label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              >
                {[
                  'Frontend',
                  'Backend',
                  'Full Stack',
                  'UI/UX Design',
                  'AI & Machine Learning',
                  'Cloud & DevOps',
                  'Digital Marketing',
                ].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Monthly Stipend *</label>
              <input
                type="text"
                required
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Duration *</label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Openings Count</label>
              <input
                type="number"
                value={formData.openings}
                onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Summary (1 line) *</label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900 dark:text-white">Required Skills (comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Requirements (1 per line)</label>
              <textarea
                rows="3"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">Responsibilities (1 per line)</label>
              <textarea
                rows="3"
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
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
              className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInternshipModal;
