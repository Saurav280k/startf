import React from 'react';
import { HelpCircle, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useModalStore } from '../../store/useModalStore';

const ConfirmationModal = () => {
  const {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    type,
    onConfirm,
    onCancel,
    closeModal,
  } = useModalStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    closeModal();
  };

  const renderIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case 'success':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative transform scale-100 transition-all"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={handleCancel}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{renderIcon()}</div>
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
            {title || 'Please Confirm'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {message || 'Are you sure you want to proceed with this action?'}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={handleCancel}
              id="modal-cancel-btn"
              className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-transparent hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-700 dark:text-slate-300 font-medium text-sm transition-all"
            >
              {cancelText || 'Cancel'}
            </button>
            <button
              onClick={handleConfirm}
              id="modal-confirm-btn"
              className={`py-3 px-4 rounded-2xl font-semibold text-sm text-white transition-all shadow-lg ${
                type === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-600/25'
                  : type === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                  : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/25'
              }`}
            >
              {confirmText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
