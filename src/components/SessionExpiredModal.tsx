import React, { useEffect, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';

interface SessionExpiredModalProps {
  isOpen: boolean;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ isOpen }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      // Auto-focus the button for accessibility
      setTimeout(() => {
        buttonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReLogin = async () => {
    try {
      // 1. Clear localStorage
      localStorage.clear();

      // 2. Clear sessionStorage
      sessionStorage.clear();

      // 3. Clear application caches
      if ('caches' in window) {
        try {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map(key => caches.delete(key)));
        } catch (err) {
          console.warn('Error clearing caches:', err);
        }
      }

      // 4. Clear cookies
      try {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
      } catch (err) {
        console.warn('Error clearing cookies:', err);
      }
    } catch (error) {
      console.error('Error in session cleanup:', error);
    } finally {
      // 5. Redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with dark overlay and intense blur to block rest of application */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Small, modern centered modal container */}
      <div 
        className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-2xl transition-all duration-300 border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Warning Icon with stylish animated gradient ring */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 border border-red-100 mb-4 animate-bounce">
          <ShieldAlert className="h-7 w-7 text-red-600" />
        </div>

        {/* Title */}
        <h3 
          id="modal-title" 
          className="text-lg font-bold font-display text-slate-900 tracking-tight"
        >
          Sessão Expirada
        </h3>

        {/* Message */}
        <div className="mt-2.5">
          <p className="text-sm text-slate-500 leading-relaxed">
            A sua sessão expirou por motivos de segurança. Por favor, inicie sessão novamente para continuar a utilizar a plataforma.
          </p>
        </div>

        {/* Button */}
        <div className="mt-6">
          <button
            ref={buttonRef}
            type="button"
            onClick={handleReLogin}
            className="w-full inline-flex justify-center items-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 active:scale-98 transition-all cursor-pointer"
          >
            Logar Novamente
          </button>
        </div>
      </div>
    </div>
  );
};
