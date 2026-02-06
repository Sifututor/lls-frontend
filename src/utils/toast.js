// src/utils/toast.js
import { toast } from 'react-toastify';

// ===== TOAST HELPER FUNCTIONS =====
// Use these everywhere instead of alert()

export const showSuccess = (message) => {
  toast.success(message, {
    icon: '✅',
  });
};

export const showError = (message) => {
  toast.error(message || 'Something went wrong', {
    icon: '❌',
    autoClose: 5000,
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    icon: '⚠️',
    autoClose: 4000,
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    icon: 'ℹ️',
  });
};

// Loading toast — returns an ID you can use to update it later
export const showLoading = (message = 'Please wait...') => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

// Update a loading toast to success
export const updateToSuccess = (toastId, message) => {
  toast.update(toastId, {
    render: message,
    type: 'success',
    isLoading: false,
    icon: '✅',
    autoClose: 3000,
    closeOnClick: true,
    draggable: true,
  });
};

// Update a loading toast to error
export const updateToError = (toastId, message) => {
  toast.update(toastId, {
    render: message || 'Something went wrong',
    type: 'error',
    isLoading: false,
    icon: '❌',
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
  });
};

// Promise-based toast — shows loading, then success or error automatically
export const showPromise = (promise, { loading, success, error }) => {
  return toast.promise(promise, {
    pending: {
      render: loading || 'Processing...',
      icon: '⏳',
    },
    success: {
      render: success || 'Done!',
      icon: '✅',
    },
    error: {
      render: error || 'Failed!',
      icon: '❌',
    },
  });
};
