import { useEffect } from 'react';
import { useToastStore } from '../../store/toastStore';

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => removeToast(toasts[0].id), 3000);
    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow text-white ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
