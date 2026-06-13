import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const SupportScreen: React.FC = () => {
  const navigate = useNavigate();
  const [gerenteUrl, setGerenteUrl] = useState<string | null>(null);
  const [grupoUrl, setGrupoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupportLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('support_link')
          .select('whatsapp_gerente_url, whatsapp_grupo')
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching support links:', error);
          return;
        }

        if (data) {
          setGerenteUrl(data.whatsapp_gerente_url);
          setGrupoUrl(data.whatsapp_grupo);
        }
      } catch (err) {
        console.error('Error in fetchSupportLinks:', err);
      }
    };

    fetchSupportLinks();
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/meu');
    }
  };

  return (
    <div className="pb-24 bg-[#f4f6f9] min-h-screen animate-fadeIn font-sans select-none">
      
      {/* Header */}
      <div className="bg-white flex items-center px-2 py-3 border-b border-neutral-200">
        <button 
          type="button" 
          onClick={handleBack} 
          className="w-10 h-10 flex items-center justify-center text-[#475569] active:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <div className="flex-1 text-center pr-10 text-[17px] font-normal text-[#111827]">
          Suporte
        </div>
      </div>

      {/* Support Links Section */}
      <div className="bg-white mt-3">
        {/* Title Bar matching HomeTab style */}
        <div className="bg-[#dbe4f0] px-4 py-2 border-b border-neutral-200 select-none">
          <h2 className="text-[12.5px] text-neutral-600 tracking-wide font-medium">
            Canais de Atendimento
          </h2>
        </div>

        <div className="px-4 py-2 flex flex-col">
          
          {/* Link 1 */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <a 
              href={gerenteUrl || '#'} 
              target={gerenteUrl ? "_blank" : undefined} 
              rel="noreferrer" 
              className="text-[#2563eb] text-[14px] leading-snug flex-1 pr-4"
            >
              Centro de suporte e atendimento ao cliente
            </a>
            <span 
              className="text-[#059669] font-bold text-[12px] underline whitespace-nowrap cursor-pointer active:opacity-70"
              onClick={() => gerenteUrl && window.open(gerenteUrl, '_blank')}
            >
              Abrir
            </span>
          </div>

          {/* Link 2 */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <a 
              href={grupoUrl || '#'} 
              target={grupoUrl ? "_blank" : undefined} 
              rel="noreferrer" 
              className="text-[#2563eb] text-[14px] leading-snug flex-1 pr-4"
            >
              Falar com suporte técnico especializado
            </a>
            <span 
              className="text-[#059669] font-bold text-[12px] underline whitespace-nowrap cursor-pointer active:opacity-70"
              onClick={() => grupoUrl && window.open(grupoUrl, '_blank')}
            >
              Abrir
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};

