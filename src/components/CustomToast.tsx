import React, { useEffect } from 'react';
import { useApp, ToastConfig } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastItemProps {
  toast: ToastConfig;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const { id, message, type, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // Determine styles, icons and accent left borders based on type for a refined translucent dark theme
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="h-[18px] w-[18px] text-emerald-400 shrink-0" />,
          borderColor: 'border-l-[4px] border-emerald-500',
          bgAccent: 'bg-emerald-950/40',
          progressBarColor: 'bg-emerald-500'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-[18px] w-[18px] text-rose-400 shrink-0" />,
          borderColor: 'border-l-[4px] border-rose-500',
          bgAccent: 'bg-rose-950/40',
          progressBarColor: 'bg-rose-500'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-[18px] w-[18px] text-amber-400 shrink-0" />,
          borderColor: 'border-l-[4px] border-amber-500',
          bgAccent: 'bg-amber-950/40',
          progressBarColor: 'bg-amber-500'
        };
      case 'info':
      default:
        return {
          icon: <Info className="h-[18px] w-[18px] text-cyan-400 shrink-0" />,
          borderColor: 'border-l-[4px] border-cyan-500',
          bgAccent: 'bg-[#066b75]/20',
          progressBarColor: 'bg-[#066b75]'
        };
    }
  };

  const styleConfig = getTypeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`pointer-events-auto w-full rounded-xl bg-slate-900/85 backdrop-blur-xl border border-slate-200 shadow-2xl ${styleConfig.borderColor} ${styleConfig.bgAccent} px-4 py-3.5 flex items-start gap-3 relative select-none overflow-hidden`}
      id={`toast-elem-${id}`}
    >
      {/* Icon */}
      <div className="pt-0.5">
        {styleConfig.icon}
      </div>

      {/* Message Content */}
      <div className="flex-1 pr-3">
        <p className="whitespace-pre-line text-[12px] font-bold text-slate-800 leading-relaxed tracking-wide font-sans text-left uppercase">
          {message}
        </p>
      </div>

      {/* Manual Dismiss Cross Button */}
      <button
        onClick={() => onClose(id)}
        className="text-neutral-400 hover:text-slate-800 active:scale-90 transition-all p-0.5 shrink-0 rounded-full hover:bg-slate-100 cursor-pointer outline-none border-none"
        id={`toast-close-btn-${id}`}
      >
        <X size={14} />
      </button>

      {/* Auto-Diminishing Animated Progress Bar Indicator on Bottom */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-[2.5px] ${styleConfig.progressBarColor}`}
      />
    </motion.div>
  );
};

export const CustomToast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div 
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] max-w-[340px] z-[10000] flex flex-col gap-2.5 pointer-events-none"
      id="asiaray-global-toast-viewport"
    >
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onClose={removeToast} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
