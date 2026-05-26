import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const CustomSpinner: React.FC = () => {
  const { isLoading, loadingMessage } = useApp();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[10001] flex flex-col items-center justify-center p-5 bg-black/55 backdrop-blur-[3px] select-none pointer-events-auto"
          id="global-spinner-overlay"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-neutral-100/50 flex flex-col items-center gap-4 max-w-[210px] w-full text-center"
            id="global-spinner-box"
          >
            {/* Highly customized rotating gradient spinner loader ring */}
            <div className="relative h-12 w-12 flex items-center justify-center">
              {/* Outer glowing pulsing background layer */}
              <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-pulse" />
              
              {/* Spinning SVG ring */}
              <svg 
                className="animate-spin h-10 w-10 text-indigo-600" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-20" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="3.5"
                />
                <path 
                  className="opacity-100" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>

            {/* Spinner Status Wording */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[13.5px] font-black text-slate-800 tracking-wide font-sans leading-none uppercase">
                {loadingMessage && loadingMessage.toLowerCase().includes('process') ? 'Processando' : 'Carregando'}
              </span>
              <p className="text-[11px] font-semibold text-zinc-500 font-sans tracking-wide leading-relaxed mt-1">
                {loadingMessage || 'Aguarde um momento...'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
