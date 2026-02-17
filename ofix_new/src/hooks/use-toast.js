import { useState } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ title, description, variant = 'default' }) => {
    const id = Date.now();
    
    const toastOptions = {
      id,
      duration: 4000,
      className: variant === 'destructive' 
        ? 'bg-red-500 text-white border border-red-400 rounded-xl shadow-lg'
        : variant === 'success'
        ? 'bg-emerald-500 text-white border border-emerald-400 rounded-xl shadow-lg'
        : 'bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg',
      style: {},
    };

    if (variant === 'destructive') {
      toast.error(title || description, toastOptions);
    } else if (variant === 'success') {
      toast.success(title || description, toastOptions);
    } else {
      toast(title || description, toastOptions);
    }

    const newToast = { id, title, description, variant };
    setToasts(prev => [...prev, newToast]);

    // Remove o toast após o timeout
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);

    return id;
  };

  const dismissToast = (id) => {
    toast.dismiss(id);
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    toast: showToast,
    dismiss: dismissToast,
    toasts
  };
};
