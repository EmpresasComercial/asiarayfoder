import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle, Info, HelpCircle, AlertTriangle } from 'lucide-react';

export const CustomAlert: React.FC = () => {
  const { alertConfig, closeAlert } = useApp();

  if (!alertConfig || !alertConfig.isOpen) return null;

  const { message, title, type, onConfirm } = alertConfig;

  // Choose colors/icons based on type
  const getHeaderStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600',
          icon: <CheckCircle className="h-6 w-6 stroke-[2.5]" />,
          defaultTitle: 'Sucesso'
        };
      case 'error':
        return {
          bg: 'bg-red-500/10 text-red-600',
          icon: <ShieldAlert className="h-6 w-6 stroke-[2.5]" />,
          defaultTitle: 'Alerta de Segurança'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 text-amber-600',
          icon: <AlertTriangle className="h-6 w-6 stroke-[2.5]" />,
          defaultTitle: 'Aviso Importante'
        };
      case 'confirm':
        return {
          bg: 'bg-blue-500/10 text-blue-600',
          icon: <HelpCircle className="h-6 w-6 stroke-[2.5]" />,
          defaultTitle: 'Confirmação'
        };
      case 'info':
    default:
        return {
          bg: 'bg-indigo-500/10 text-[#0d7377]',
          icon: <Info className="h-6 w-6 stroke-[2.5]" />,
          defaultTitle: 'Mensagem Asiaray'
        };
    }
  };

  const config = getHeaderStyle();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && type !== 'confirm') {
      closeAlert();
    }
  };

  return (
    <AnimatePresence>
      <div 
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/55 backdrop-blur-[1.5px] flex items-center justify-center p-5 z-[9999] select-none"
        id="custom-alert-backdrop"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white w-full max-w-[316px] rounded-[18px] border border-neutral-100 shadow-2xl flex flex-col overflow-hidden text-center"
          id="custom-alert-card"
        >
          {/* Top visual representation */}
          <div className="pt-5.5 pb-2 flex flex-col items-center gap-2">
            <div className={`h-[50px] w-[50px] rounded-full flex items-center justify-center ${config.bg}`}>
              {config.icon}
            </div>
            <h3 className="px-5 text-[15.5px] font-black text-slate-800 tracking-wide leading-tight font-sans">
              {title || config.defaultTitle}
            </h3>
          </div>

          {/* Core message text */}
          <div className="px-5 py-3 max-h-[220px] overflow-y-auto no-scrollbar">
            <p className="whitespace-pre-line text-[12.5px] text-zinc-650 font-sans font-semibold leading-relaxed tracking-wide">
              {message}
            </p>
          </div>

          {/* Action Footer Buttons Grid */}
          <div className="mt-4.5 border-t border-neutral-100 bg-neutral-50/50 p-3.5 flex gap-2 justify-center">
            {type === 'confirm' ? (
              <>
                <button
                  id="custom-alert-cancel-btn"
                  onClick={closeAlert}
                  className="flex-1 h-[36px] bg-white border border-neutral-200 hover:bg-neutral-50 active:scale-[0.98] text-neutral-500 transition-all font-extrabold text-[12px] uppercase tracking-wider rounded-[6px] cursor-pointer outline-none border-none shadow-xs"
                >
                  cancelar
                </button>
                <button
                  id="custom-alert-confirm-btn"
                  onClick={() => {
                    closeAlert();
                    if (onConfirm) onConfirm();
                  }}
                  className="flex-1 h-[36px] bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] hover:brightness-105 active:scale-[0.98] text-slate-800 transition-all font-extrabold text-[12px] uppercase tracking-wider rounded-[6px] cursor-pointer outline-none border-none shadow-md"
                >
                  confirmar
                </button>
              </>
            ) : (
              <button
                id="custom-alert-ok-btn"
                onClick={closeAlert}
                className="w-full h-[38px] bg-gradient-to-r from-[#ff5a00] to-[#e42200] hover:brightness-[1.03] active:scale-[0.98] text-slate-800 transition-all font-extrabold text-[12.5px] uppercase tracking-widest rounded-[6px] cursor-pointer outline-none border-none shadow-md"
              >
                entendido
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
