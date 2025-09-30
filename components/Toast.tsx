'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(toast.id), 300);
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: AlertCircle,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={`max-w-sm w-full border rounded-lg shadow-lg pointer-events-auto transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${colors[toast.type]}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{toast.title}</p>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => onClose(toast.id), 300);
                }}
                className="ml-4 flex-shrink-0 rounded-md hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {toast.message && (
              <p className="mt-1 text-sm opacity-90">{toast.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Listen for toast events
  useEffect(() => {
    function handleToastEvent(event: CustomEvent<Toast>) {
      const newToast = {
        ...event.detail,
        id: event.detail.id || Date.now().toString(),
      };
      setToasts((prev) => [...prev, newToast]);
    }

    window.addEventListener('show-toast' as any, handleToastEvent as any);
    return () => {
      window.removeEventListener('show-toast' as any, handleToastEvent as any);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

// Utility function to show toasts
export function showToast(type: ToastType, title: string, message?: string, duration?: number) {
  const event = new CustomEvent('show-toast', {
    detail: {
      id: Date.now().toString(),
      type,
      title,
      message,
      duration,
    },
  });
  window.dispatchEvent(event);
}

// Convenience functions
export const toast = {
  success: (title: string, message?: string, duration?: number) =>
    showToast('success', title, message, duration),
  error: (title: string, message?: string, duration?: number) =>
    showToast('error', title, message, duration),
  warning: (title: string, message?: string, duration?: number) =>
    showToast('warning', title, message, duration),
  info: (title: string, message?: string, duration?: number) =>
    showToast('info', title, message, duration),
};