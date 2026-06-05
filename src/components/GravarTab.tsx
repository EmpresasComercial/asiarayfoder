import React, { useState, useEffect } from 'react';
import { GATEWAY_URL, getAccessToken } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Task, TaskStatus } from '../types';
import { EmptyState } from './EmptyState';

import transformacaoIcon from '../../assets/task.transformacao.png';
import searchIcon from '../../assets/task-search.png';
import completedIcon from '../../assets/task-completed-64.png';
import failedIcon from '../../assets/icon-task-failed.png';

export const GravarTab: React.FC = () => {
  const { tasks, approvePendingTasks } = useApp();
  const [activeSegment, setActiveSegment] = useState<TaskStatus>('andamento');
  
  // Track expanded task detail blocks
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('');

  

  // New state for posts from post_tarefas_user
  const [posts, setPosts] = useState<any[]>([]);

  // Fetch posts via gateway on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const resp = await fetch(GATEWAY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ op: 513, data: {} })
        });
        if (resp.ok) {
          const res = await resp.json();
          if (res?.success && Array.isArray(res.result)) {
            setPosts(res.result);
          }
        }
      } catch (err) {
        console.error('Error loading posts:', err);
      }
    };
    loadPosts();
  }, []);

  const segments = [
    { status: 'andamento' as TaskStatus, label: 'Transformação', iconType: 'transformacao' },
    { status: 'revisao' as TaskStatus, label: 'Não revisto', iconType: 'naorevisto' },
    { status: 'concluido' as TaskStatus, label: 'Terminado', iconType: 'terminado' },
    { status: 'falhado' as TaskStatus, label: 'Falhou', iconType: 'falhou' }
  ];

  // Dynamically calculate counters based on existing user state + baseline numbers matching the image
  const countTransformacao = tasks.filter(t => t.status === 'andamento').length;
  const countNaoRevisto = tasks.filter(t => t.status === 'revisao').length;
  const countTerminado = tasks.filter(t => t.status === 'concluido').length + 193; // 193 is the baseline shown on the image
  const countFalhou = tasks.filter(t => t.status === 'falhado').length;

  // Filter tasks belonging to current active segment
  const displayTasks = tasks.filter(t => t.status === activeSegment);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setSelectedFile('');
    }
  };

  const handleSubmit = (taskId: string) => {
    alert('Operação desativada. As submissões agora são validadas automaticamente pelo sistema.');
    setExpandedId(null);
  };

  const handleInstantApproval = () => {
    approvePendingTasks();
    alert('Auditoria: Fila processada com sucesso. Crédito compensado na sua carteira.');
    setActiveSegment('concluido');
  };

  const handleOpenLink = (desc: string) => {
    alert(`Simulador: Directiva de parceiro aberta (${desc}). Capture o ecrã e submeta o ficheiro.`);
  };

  const renderTaskForm = (task: Task) => (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-white px-5 pb-6 pt-1 relative space-y-4"
      id={`task-form-panel-${task.id}`}
    >
      {/* Small grey X to close right above the message box */}
      <div className="flex justify-end pr-1">
        <button 
          onClick={() => setExpandedId(null)} 
          className="text-neutral-400 hover:text-neutral-600 select-none cursor-pointer p-1"
          id={`close-form-btn-${task.id}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Message textarea box */}
      <div className="relative">
        <textarea
          rows={3}
          placeholder="Please write a message (If you have nothing to say, you don't have to write anything.)"
          className="w-full text-[12px] p-3 border border-neutral-200 rounded-sm bg-white text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-300 resize-none pr-12 font-sans"
          id={`msg-textarea-${task.id}`}
        />
        <span className="absolute bottom-2 right-3 text-[10px] text-neutral-400 select-none font-sans">
          0/100
        </span>
      </div>



      {/* Orange-Red salvar gradient button */}
      <div className="pt-2">
        <button
          id={`submit-proof-btn-${task.id}`}
          onClick={() => handleSubmit(task.id)}
          className="w-full max-w-[420px] h-[34px] bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-[12px] text-center rounded-[3px] transition-all flex items-center justify-center lowercase tracking-wider cursor-pointer shadow-none select-none border-none outline-none"
        >
          salvar
        </button>
      </div>
    </motion.div>
  );

  return (
    <div id="gravar-tab-container" className="pb-24 bg-[#f4f6f9] min-h-screen animate-fadeIn font-sans">
      
      {/* 1. Page Header & Info block identical to image */}
      <div className="bg-[#f4f6f9] pt-4 pb-2 px-4 flex items-center justify-between select-none" id="gravar-header-area">
        <div className="space-y-0.5">
          <h2 className="text-[17px] font-bold text-neutral-800 tracking-tight leading-none">Registo de tarefas</h2>
          <p className="text-[9px] text-[#9ea3a9] font-medium select-none">
            Estes dados são criados porAsiarayOficialmente fornecido
          </p>
        </div>
        <div className="text-right flex flex-col items-end justify-center pr-2">
          <div className="text-[20px] font-semibold text-neutral-800 font-mono leading-none">0</div>
          <div className="text-[9px] text-[#9ea3a9] mt-0.5 tracking-tight font-semibold uppercase text-right">
            Tarefas restantes
          </div>
        </div>
      </div>

      {/* 2. Segments Row representing the exact layout/count icons in image */}
      <div className="bg-white border-b border-gray-200 grid grid-cols-4 py-2 select-none" id="gravar-segments-bar">
        {segments.map((seg) => {
          const isActive = activeSegment === seg.status;
          let countVal = 0;
          if (seg.status === 'andamento') {
            countVal = countTransformacao;
          } else if (seg.status === 'revisao') {
            countVal = countNaoRevisto;
          } else if (seg.status === 'concluido') {
            countVal = countTerminado;
          } else if (seg.status === 'falhado') {
            countVal = countFalhou;
          }

          return (
            <button
              id={`segment-btn-${seg.status}`}
              key={seg.status}
              onClick={() => { setActiveSegment(seg.status); setExpandedId(null); }}
              className="flex flex-col items-center justify-center text-center focus:outline-none transition-all cursor-pointer relative"
            >
              <div className="mb-1">
                {seg.iconType === 'transformacao' && (
                  <img src={transformacaoIcon} alt={seg.label} className="w-[20px] h-[20px] object-contain" />
                )}

                {seg.iconType === 'naorevisto' && (
                  <img src={searchIcon} alt={seg.label} className="w-[20px] h-[20px] object-contain" />
                )}

                {seg.iconType === 'terminado' && (
                  <img src={completedIcon} alt={seg.label} className="w-[20px] h-[20px] object-contain" />
                )}

                {seg.iconType === 'falhou' && (
                  <img src={failedIcon} alt={seg.label} className="w-[20px] h-[20px] object-contain" />
                )}
              </div>
              <span className={`text-[9.5px] tracking-tight transition-colors leading-none ${isActive ? 'text-[#f35a5a] font-semibold' : 'text-gray-500 font-medium'}`}>
                {seg.label}
              </span>
              <span className={`text-[11px] font-semibold font-mono mt-1 leading-tight ${isActive ? 'text-[#f35a5a]' : 'text-gray-500'}`}>
                {countVal}
              </span>
            </button>
          );
        })}
      </div>

      {/* Instant audit triggers helpful for testing and demo purposes */}
      {activeSegment === 'revisao' && countNaoRevisto > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center px-4" id="fast-approve-cue">
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-amber-800 flex items-center gap-1">
              Auditoria Automática Ativa
            </h4>
            <p className="text-[10px] text-amber-700 font-medium">
              O sistema processará a auditoria e creditará o saldo automaticamente. Se preferir, teste aprovação imediata abaixo:
            </p>
          </div>
          <button
            id="instant-audit-btn"
            onClick={handleInstantApproval}
            className="text-[10px] bg-amber-500 hover:bg-amber-600 text-neutral-800 font-semibold py-1.5 px-3 rounded flex items-center gap-1 cursor-pointer select-none border-none outline-none"
          >
            Aprovação Imediata
          </button>
        </div>
      )}

      {/* 3. List of dynamic cards corresponding exactly to design image styling */}
      <div className="p-0 flex flex-col relative w-full" id="gravar-task-items-wrapper">
        {displayTasks.length === 0 ? (
          <EmptyState
            className="py-20 bg-white"
            message="Sem dados"
            description="Nenhum registo de tarefa encontrado. Visite a aba 'tarefa' para aceitar e participar em missões diárias!"
          />
        ) : (
          displayTasks.map((task, idx) => {
            const isExpanded = expandedId === task.id;
            // The first card in active segment 'andamento' has a floating announcement icon exactly matching the screenshot
            const hasFloatingBadge = activeSegment === 'andamento' && idx === 0;

            return (
              <div 
                key={task.id}
                className="bg-white flex flex-col relative w-full border-b-[10px] border-[#f4f6f9]"
                id={`gravar-card-${task.id}`}
              >
                {/* 3.1 Card Header bar (outros | X) */}
                <div className="bg-[#dbe4f0] px-3.5 py-1.5 flex items-center justify-between border-b border-neutral-200 select-none w-full">
                  <span className="text-[11.5px] text-[#4a5568] font-medium tracking-wide">outros</span>
                  <span className="text-[11.5px] text-[#a0aec0] select-none cursor-pointer hover:text-[#4a5568] font-semibold" onClick={() => setExpandedId(null)}>X</span>
                </div>

                {/* 3.2 Card body content with high-accuracy field names and values */}
                <div className="p-4 text-[#4a5568] text-[11.5px] font-sans relative pr-[84px] bg-white flex flex-col gap-1 w-full">
                  
                  {/* Objectivo da tarefa: Gosto disso */}
                  <div className="flex items-start leading-tight">
                    <span className="text-gray-400 font-medium min-w-[124px] select-none">Objectivo da tarefa:</span>
                    <span className="text-neutral-850 font-medium">{task.desc || 'Gosto disso'}</span>
                  </div>
                  
                  {/* ligação da tarefa: abrir a ligação de vídeo */}
                  <div className="flex items-center leading-normal mt-0.5">
                    <span className="text-gray-400 font-medium min-w-[124px] select-none">ligação da tarefa:</span>
                    <button 
                      onClick={() => handleOpenLink(task.desc)}
                      className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[10px] py-0.5 px-2 rounded-[3px] transition-colors cursor-pointer select-none border-none outline-none font-medium"
                    >
                      abrir a ligação de vídeo
                    </button>
                  </div>

                  {!isExpanded && (
                    <>
                      {/* Criar: 2023-08-06 11:56:39 */}
                      <div className="flex items-start leading-tight mt-0.5">
                        <span className="text-gray-400 font-medium min-w-[124px] select-none">Criar:</span>
                        <span className="text-gray-600 font-mono ml-0.5 select-all">{task.joinedAt}</span>
                      </div>

                      {/* revisão: Transformação */}
                      <div className="flex items-start leading-tight mt-0.5">
                        <span className="text-gray-400 font-medium min-w-[124px] select-none">revisão:</span>
                        <span className="text-neutral-850 font-medium select-none">
                          {activeSegment === 'andamento' ? 'Transformação' : activeSegment === 'revisao' ? 'Não revisto' : activeSegment === 'concluido' ? 'Terminado' : 'Falhou'}
                        </span>
                      </div>

                      {/* Action Orange button row */}
                      {activeSegment === 'andamento' && (
                        <div className="pt-2 select-none flex">
                          <button 
                            onClick={() => toggleExpand(task.id)}
                            className="bg-[#ff4c15] hover:bg-[#ea3a00] text-white font-medium text-[9.5px] py-1 px-4 rounded-full border border-dashed border-white/90 transition-all cursor-pointer select-none active:scale-95 shadow-none"
                          >
                            add a screenshot of done task
                          </button>
                        </div>
                      )}

                      {activeSegment === 'revisao' && (
                        <div className="pt-2">
                          <span className="bg-amber-50 text-amber-700 text-[9.5px] py-0.5 px-2 rounded inline-block border border-amber-100 font-medium">
                            Em Revisão por Auditoria Automática
                          </span>
                        </div>
                      )}

                      {activeSegment === 'concluido' && (
                        <div className="pt-2">
                          <span className="bg-emerald-50 text-emerald-700 text-[9.5px] py-0.5 px-2 rounded inline-block border border-emerald-100 font-medium">
                            Tarefa Confirmada e Liquidada
                          </span>
                        </div>
                      )}

                      {activeSegment === 'falhado' && (
                        <div className="pt-2">
                          <span className="bg-red-50 text-red-700 text-[9.5px] py-0.5 px-2 rounded inline-block border border-red-100 font-medium">
                            Pendente / Falhada
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* 3.3 Blue-Grey Coin Badge Centered Vertically on the Right Column representing the exact circle layout in the image */}
                  {!isExpanded && (
                    <div className="absolute right-4 top-[50%] -translate-y-1/2 flex items-center select-none">
                      <div className="relative">
                        <div 
                          className="h-[52px] w-[52px] rounded-full border border-white/80 shadow-xs flex items-center justify-center shrink-0" 
                          style={{ backgroundColor: '#9aaec4' }}
                        >
                          <span className="text-white text-[11px] font-bold tracking-tight select-all text-center">
                            {task.reward}KZ
                          </span>
                        </div>

                        {/* Floating orange megaphone/speaker action badge on the first card matching the screenshot */}
                        {hasFloatingBadge && (
                          <div 
                            className="absolute -right-1 bottom-1 h-5 w-5 rounded-full bg-[#f97316] border border-white flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-transform"
                            onClick={() => alert('Dica: Envie a prova de captura para revisão para creditar de imediato os KZ 300!')}
                          >
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v.354L3.435 6.64A2 2 0 002 8.44V12.5a2.25 2.25 0 001.293 2.036L6 15.93V19a1 1 0 001 1h3a1 1 0 001-1v-2.28a1 1 0 00.304-.707l5.214-5.214A1 1 0 0017 9.5a1 1 0 001-1V3z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Expanded photo input area */}
                <AnimatePresence>
                  {isExpanded && activeSegment === 'andamento' && renderTaskForm(task)}
                </AnimatePresence>

              </div>
            );
          })
        )}
      </div>

{/* Posts Section */}
<div className="mt-4 p-4 bg-white rounded shadow">
  <h3 className="text-lg font-semibold mb-2">Posts</h3>
  {posts.length === 0 ? (
    <EmptyState
      className="py-12"
      message="Sem dados"
      description="Nenhum post encontrado"
    />
  ) : (
    posts.map((p) => (
      <div key={p.id} className="border-b py-2">
        <p><strong>ID:</strong> {p.id}</p>
        <p><strong>Whatsapp:</strong> {p.link_whatsap}</p>
        <p><strong>Facebook:</strong> {p.link_facebook}</p>
        <p><strong>Tik tok:</strong> {p.link_tiktok}</p>
        <p><strong>Criado em:</strong> {p.data_criada}</p>
      </div>
    ))
  )}
</div>

    </div>
  );
};
