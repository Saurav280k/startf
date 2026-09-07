import { create } from 'zustand';

export const useModalStore = create((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'danger', // 'danger' | 'info' | 'success'
  onConfirm: null,
  onCancel: null,

  openConfirmation: ({
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    onConfirm,
    onCancel,
  }) => {
    set({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm,
      onCancel,
    });
  },

  closeModal: () => {
    set({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null,
    });
  },
}));
