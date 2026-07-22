"use client";
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

let toastCounter = 0;

export function showToast(type: 'success' | 'error' | 'info', message: string) {
  const id = (++toastCounter).toString();
  window.dispatchEvent(new CustomEvent('show-toast', { detail: { id, type, message } }));
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('hide-toast', { detail: { id } }));
  }, 3000);
  return id;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleShow = (e: Event) => {
      const { id, type, message } = (e as CustomEvent).detail;
      setToasts(prev => [...prev, { id, type, message }]);
    };
    const handleHide = (e: Event) => {
      const { id } = (e as CustomEvent).detail;
      setToasts(prev => prev.filter(t => t.id !== id));
    };
    const handleClose = (e: Event) => {
      const { id } = (e as CustomEvent).detail;
      setToasts(prev => prev.filter(t => t.id !== id));
    };

    window.addEventListener('show-toast', handleShow);
    window.addEventListener('hide-toast', handleHide);
    window.addEventListener('close-toast', handleClose);
    return () => {
      window.removeEventListener('show-toast', handleShow);
      window.removeEventListener('hide-toast', handleHide);
      window.removeEventListener('close-toast', handleClose);
    };
  }, []);

  return { toasts, closeToast: (id: string) => window.dispatchEvent(new CustomEvent('close-toast', { detail: { id } })) };
}

export default function ToastContainer() {
  const { toasts, closeToast } = useToast();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${bgColors[toast.type]} border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in`}
        >
          <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
          <p className={`flex-1 text-sm font-medium ${textColors[toast.type]}`}>{toast.message}</p>
          <button
            onClick={() => closeToast(toast.id)}
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
