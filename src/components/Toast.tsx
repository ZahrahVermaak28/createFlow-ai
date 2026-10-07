import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 ${
              isError
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : isSuccess
                ? 'bg-white border-[#8B6FE8]/30 text-[#1F1F2E] shadow-[#5B3FD6]/10'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {isError ? (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : isSuccess ? (
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <Info className="w-5 h-5 text-[#5B3FD6] shrink-0" />
              )}
              <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1 shrink-0 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
