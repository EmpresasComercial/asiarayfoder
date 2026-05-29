import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import spinnerImg from '../../assets/icons8-spinner-24.apng.png';

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
            {/* Simple spinner with thin 'Wait...' text */}
            <div className="flex flex-col items-center gap-2">
              <img src={spinnerImg} alt="Loading" className="h-10 w-10 animate-spin" />
              <span className="text-sm font-light text-slate-800">Wait...</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
