import React from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div
      id="app-toast-notification"
      role="alert"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] rounded-full shadow-xl shadow-black/20 border border-white/10 dark:border-black/10 transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
    >
      {type === 'success' ? (
        <CheckCircle className="w-4 h-4 text-[#2997ff] dark:text-[#0066cc] shrink-0" />
      ) : (
        <Info className="w-4 h-4 text-[#2997ff] dark:text-[#0066cc] shrink-0" />
      )}
      <span className="text-sm font-medium pr-1">{message}</span>
      <button
        id="toast-close-btn"
        onClick={onClose}
        className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 text-neutral-400 hover:text-white dark:hover:text-black transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
