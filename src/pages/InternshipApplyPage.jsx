import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Briefcase, ArrowLeft, Send, CheckCircle2, User, Mail, Phone, Link2, FileText, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useModalStore } from '../store/useModalStore';
import { useToastStore } from '../store/useToastStore';

const InternshipApplyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { openConfirmation } = useModalStore();
  const { addToast } = useToastStore();

  const [formData, setFormData] = useState({
    applicantName: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    experienceLevel: 'Student/Self-taught',
    portfolioUrl: '',
    githubUrl: '',
    whyJoin: '',
  });

  const [errors, setErrors] = useState({});
  const [submittedApp, setSubmittedApp] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['internship', id],
    queryFn: () => api.getInternshipById(id),
  });

  const internship = data?.internship;

  const mutation = useMutation({
    mutationFn: (payload) => api.applyForInternship(id, payload),
    onSuccess: (res) => {
      setSubmittedApp(res.application);
      addToast({
        message: 'Internship application submitted successfully!',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({
        message: err.message || 'Failed to submit application. Please verify details.',
        type: 'error',
      });
    },
  });

  const validate = () => {
    const errs = {};
    if (!formData.applicantName.trim()) errs.applicantName = 'Full Name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.whyJoin.trim() || formData.whyJoin.length < 20) {
      errs.whyJoin = 'Please provide at least 20 characters explaining your background & interest';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Use custom sleek confirmation modal
    openConfirmation({
      title: 'Submit Internship Application',
      message: `Are you ready to submit your formal application for the "${internship?.title}" position? Our hiring committee reviews profiles within 48 hours.`,
      confirmText: 'Submit Application',
      cancelText: 'Review Form',
      type: 'success',
      onConfirm: () => {
        mutation.mutate(formData);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="h-96 rounded-3xl shimmer-box" />
      </div>
    );
  }

  if (submittedApp) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="rounded-3xl p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Application Dispatched!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Thank you, <span className="font-semibold text-slate-900 dark:text-white">{submittedApp.applicantName}</span>. Your application for <span className="font-semibold text-brand-600">{internship?.title}</span> has been logged into our talent review pipeline.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-500">
              <span>Domain:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{submittedApp.domain}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Notification Email:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{submittedApp.email}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Status:</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold">
                {submittedApp.status}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/internships"
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-obsidian-800 hover:bg-slate-200 dark:hover:bg-obsidian-700 text-slate-800 dark:text-slate-200 font-bold text-xs text-center transition-all"
            >
              Back to Positions
            </Link>
            <Link
              to="/my-orders"
              className="flex-1 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs text-center transition-all shadow-md shadow-brand-600/25"
            >
              View My Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    const isDirty = Boolean(
      formData.portfolioUrl ||
      formData.githubUrl ||
      formData.whyJoin ||
      (formData.applicantName && formData.applicantName !== (user?.username || ''))
    );

    if (isDirty) {
      openConfirmation({
        title: 'Discard Application?',
        message: 'You have filled out some application fields. Leaving now will discard your progress. Do you want to go back?',
        confirmText: 'Discard & Go Back',
        cancelText: 'Stay Here',
        type: 'warning',
        onConfirm: () => navigate(-1),
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Smart Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Go Back</span>
      </button>

      {/* Role Summary Banner */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full">
            {internship?.domain}
          </span>
          <span className="text-xs font-bold text-emerald-500">{internship?.stipend}</span>
        </div>
        <h1 className="text-2xl font-black font-display text-slate-900 dark:text-white">
          Apply: {internship?.title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Duration: {internship?.duration} • Location: {internship?.location}
        </p>
        {internship?.summary && (
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-1">
            {internship.summary}
          </p>
        )}
      </div>

      {/* Application Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5"
      >
        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/5">
          Candidate Profile & Credentials
        </h3>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-900 dark:text-white">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="applicantName"
              placeholder="e.g. Alex Henderson"
              value={formData.applicantName}
              onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.applicantName ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
              }`}
            />
          </div>
          {errors.applicantName && <p className="text-[11px] text-red-500">{errors.applicantName}</p>}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.email ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Phone / WhatsApp *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone or WhatsApp number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.phone ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                }`}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-red-500">{errors.phone}</p>}
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-900 dark:text-white">
            Current Experience Level
          </label>
          <select
            value={formData.experienceLevel}
            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Student/Self-taught">Student / Self-taught Developer</option>
            <option value="1-2 Years">Early Professional (1 - 2 Years)</option>
            <option value="3+ Years">Experienced Professional (3+ Years)</option>
          </select>
        </div>

        {/* Links: GitHub & Portfolio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              GitHub Profile / Repo URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                placeholder="https://github.com/yourhandle"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Portfolio / Live Project Link
            </label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                placeholder="https://myportfolio.dev"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Statement of purpose */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-900 dark:text-white">
            Why do you want to join this fellowship? *
          </label>
          <textarea
            rows="4"
            placeholder="Tell us about what you have built, which tech stacks excite you, and what you want to achieve during this fellowship..."
            value={formData.whyJoin}
            onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
            className={`w-full p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed ${
              errors.whyJoin ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
            }`}
          />
          {errors.whyJoin && <p className="text-[11px] text-red-500">{errors.whyJoin}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{mutation.isPending ? 'Validating Application...' : 'Review & Submit Application'}</span>
        </button>
      </form>
    </div>
  );
};

export default InternshipApplyPage;
