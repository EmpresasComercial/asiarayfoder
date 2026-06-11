import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const SupportScreen: React.FC = () => {
  const navigate = useNavigate();
  const groupLink = 'https://chat.whatsapp.com/SEU_GRUPO_DE_SUPORTE';
  const managerLink = 'https://api.whatsapp.com/send?phone=244922342885&text=Ol%C3%A1%2C%20preciso%20de%20suporte%20da%20Asiaray';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold">Suporte</h1>
          <p className="text-xs text-slate-500">Grupo e gerente WhatsApp</p>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="rounded-[20px] border border-slate-200 bg-white overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => window.open(groupLink, '_blank')}
            className="w-full px-4 py-4 text-left bg-white hover:bg-slate-50 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">Grupo WhatsApp</p>
                <p className="mt-2 text-sm text-slate-900">Link de suporte do grupo</p>
              </div>
              <span className="text-slate-400">›</span>
            </div>
          </button>
          <div className="border-t border-slate-200" />
          <button
            type="button"
            onClick={() => window.open(managerLink, '_blank')}
            className="w-full px-4 py-4 text-left bg-white hover:bg-slate-50 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">Gerente</p>
                <p className="mt-2 text-sm text-slate-900">Contato direto no WhatsApp</p>
              </div>
              <span className="text-slate-400">›</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
