import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardList, Image, CheckCircle2, ChevronDown, Check, Zap, AlertTriangle, Eye, UploadCloud, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, TaskStatus } from '../types';

export const GravarTab: React.FC = () => {
  const { tasks, submitTaskProof, approvePendingTasks } = useApp();
  const [activeSegment, setActiveSegment] = useState<TaskStatus>('andamento');
  
  // Track expanded task detail blocks
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState<string>('https://asiaray.com/proof/931242');
  const [selectedFile, setSelectedFile] = useState<string>('');

  const segments = [
    { status: 'andamento' as TaskStatus, label: 'Transformação', iconType: 'transformacao' },
    { status: 'revisao' as TaskStatus, label: 'Não revisto', iconType: 'naorevisto' },
    { status: 'concluido' as TaskStatus, label: 'Terminado', iconType: 'terminado' },
    { status: 'falhado' as TaskStatus, label: 'Falhou', iconType: 'falhou' }
  ];

  // Dynamically calculate counters based on existing user state + baseline numbers matching the image
  const countTransformacao = tasks.filter(t => t.status === 'andamento').length || 4;
  const countNaoRevisto = tasks.filter(t => t.status === 'revisao').length;
  const countTerminado = tasks.filter(t => t.status === 'concluido').length + 193; // 193 is the baseline shown on the image
  const countFalhou = tasks.filter(t => t.status === 'falhado').length;

  // Filter tasks belonging to current active segment
  let displayTasks = tasks.filter(t => t.status === activeSegment);

  // If list is empty on Transformação, populate 4 default mock tasks exactly matching the designs
  if (activeSegment === 'andamento' && displayTasks.length === 0) {
    displayTasks = [
      {
        id: 'mock_task_1',
        title: 'Gosto disso',
        type: 'Facebook',
        reward: 300,
        requiredLevel: 'WS2',
        desc: 'Gosto disso',
        status: 'andamento',
        joinedAt: '2023-08-06 11:56:39'
      },
      {
        id: 'mock_task_2',
        title: 'Gosto disso',
        type: 'Facebook',
        reward: 300,
        requiredLevel: 'WS2',
        desc: 'Gosto disso',
        status: 'andamento',
        joinedAt: '2023-08-06 11:56:37'
      },
      {
        id: 'mock_task_3',
        title: 'Gosto disso',
        type: 'Facebook',
        reward: 300,
        requiredLevel: 'WS2',
        desc: 'Gosto disso',
        status: 'andamento',
        joinedAt: '2023-08-06 11:50:12'
      },
      {
        id: 'mock_task_4',
        title: 'Gosto disso',
        type: 'Facebook',
        reward: 300,
        requiredLevel: 'WS2',
        desc: 'Gosto disso',
        status: 'andamento',
        joinedAt: '2023-08-06 11:48:05'
      }
    ];
  }

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setSelectedFile('');
    }
  };

  const chooseMockPhoto = (pic: string) => {
    setSelectedFile(pic);
  };

  const handleSubmit = (taskId: string) => {
    const finalProof = selectedFile || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300';
    submitTaskProof(taskId, finalProof);
    alert('Sucesso: Comprovativo submetido. Tarefa enviada para a fila de Auditoria Técnica.');
    setExpandedId(null);
    setActiveSegment('revisao'); // Shift view to auditing tab
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
          className="w-full text-[12px] p-3 border border-neutral-200 rounded-xs bg-white text-neutral-850 placeholder-neutral-400 focus:outline-none focus:border-neutral-350 resize-none pr-12 font-sans"
          id={`msg-textarea-${task.id}`}
        />
        <span className="absolute bottom-2 right-3 text-[10px] text-neutral-400 select-none font-sans">
          0/100
        </span>
      </div>

      {/* Dashed square upload indicator with red bold + sign */}
      <div className="flex flex-col items-start gap-1">
        <div 
          onClick={() => {
            setSelectedFile('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300');
          }}
          className="w-[58px] h-[58px] border-[1.5px] border-dashed border-red-500 rounded-md bg-neutral-50 hover:bg-neutral-100 flex items-center justify-center cursor-pointer select-none relative overflow-hidden active:scale-95 transition-all shadow-none"
          id={`upload-box-plus-${task.id}`}
        >
          {selectedFile ? (
            <>
              <img referrerPolicy="no-referrer" src={selectedFile} alt="proof" className="w-full h-full object-cover" />
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile('');
                }}
                className="absolute top-0.5 right-0.5 bg-white/90 rounded-full text-slate-800 p-0.5 hover:bg-black/80"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </>
          ) : (
            <span className="text-[28px] text-[#ff1e1e] font-bold leading-none select-none translate-y-[-1px]">
              +
            </span>
          )}
        </div>
      </div>

      {/* Orange-Red salvar gradient button */}
      <div className="pt-2">
        <button
          id={`submit-proof-btn-${task.id}`}
          onClick={() => handleSubmit(task.id)}
          className="w-full max-w-[420px] h-[34px] bg-gradient-to-r from-[#ff4c15] to-[#f41e1e] hover:brightness-105 active:scale-[0.99] text-slate-800 font-extrabold text-[12px] text-center rounded-[3px] transition-all flex items-center justify-center lowercase tracking-wider cursor-pointer shadow-sm select-none"
        >
          salvar
        </button>
      </div>
    </motion.div>
  );

  return (
    <div id="gravar-tab-container" className="pb-24 bg-[#f4f6f9] min-h-screen animate-fadeIn">
      
      {/* 1. Page Header & Info block identical to image */}
      <div className="bg-[#f4f6f9] pt-4 pb-2 px-4 flex items-center justify-between select-none" id="gravar-header-area">
        <div className="space-y-0.5">
          <h2 className="text-[17px] font-bold text-gray-805 tracking-tight leading-none">Registo de tarefas</h2>
          <p className="text-[9px] text-gray-400 select-none">
            Estes dados são criados porAsiarayOficialmente fornecido
          </p>
        </div>
        <div className="text-right flex flex-col items-end justify-center pr-2">
          <div className="text-[20px] font-bold text-gray-800 font-mono leading-none">0</div>
          <div className="text-[9px] text-gray-400 mt-0.5 tracking-tight font-medium uppercase text-right">
            Tarefas restantes
          </div>
        </div>
      </div>

      {/* 2. Segments Row representing the exact layout/count icons in image */}
      <div className="bg-white border-b border-gray-150 grid grid-cols-4 py-2 select-none" id="gravar-segments-bar">
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
              <div className="mb-0.5">
                {seg.iconType === 'transformacao' && (
                  <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="4" width="14" height="15" rx="1.5" stroke="#3182ce" strokeWidth="1.8" />
                    <line x1="8" y1="2" x2="8" y2="5" stroke="#3182ce" strokeWidth="1.8" />
                    <line x1="16" y1="2" x2="16" y2="5" stroke="#3182ce" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="2" stroke="#3182ce" strokeWidth="1.8" />
                  </svg>
                )}

                {seg.iconType === 'naorevisto' && (
                  <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="4" width="14" height="16" rx="1.5" stroke="#e53e3e" strokeWidth="1.8" />
                    <circle cx="12" cy="11" r="2.5" stroke="#e53e3e" strokeWidth="1.8" />
                    <line x1="14" y1="13" x2="16" y2="15" stroke="#e53e3e" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}

                {seg.iconType === 'terminado' && (
                  <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="#319795" strokeWidth="1.8" />
                    <path d="M9 12l2 2 4-4" stroke="#319795" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}

                {seg.iconType === 'falhou' && (
                  <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="4" width="14" height="16" rx="1.5" stroke="#e53e3e" strokeWidth="1.8" />
                    <line x1="9" y1="9" x2="15" y2="15" stroke="#e53e3e" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="15" y1="9" x2="9" y2="15" stroke="#e53e3e" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span className={`text-[9.5px] tracking-tight transition-colors leading-none ${isActive ? 'text-[#f35a5a] font-normal' : 'text-gray-500'}`}>
                {seg.label}
              </span>
              <span className={`text-[11px] font-mono mt-0.5 leading-tight ${isActive ? 'text-[#f35a5a] font-black' : 'text-gray-500'}`}>
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
            <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1">
              <Zap size={14} className="fill-current text-amber-500" />
              Auditoria Automática Ativa
            </h4>
            <p className="text-[10px] text-amber-700">
              O sistema processará a auditoria e creditará o saldo automaticamente. Se preferir, teste aprovação imediata abaixo:
            </p>
          </div>
          <button
            id="instant-audit-btn"
            onClick={handleInstantApproval}
            className="text-[10px] bg-amber-500 hover:bg-amber-600 text-slate-800 font-black py-1.5 px-3 rounded-md flex items-center gap-1 cursor-pointer select-none"
          >
            <Zap size={10} className="fill-current" />
            Aprovação Imediata
          </button>
        </div>
      )}

      {/* 3. List of dynamic cards corresponding exactly to design image styling */}
      <div className="p-0 flex flex-col relative w-full" id="gravar-task-items-wrapper">
        {displayTasks.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white text-neutral-400 text-xs flex flex-col items-center justify-center gap-2">
            <ClipboardList size={30} className="text-neutral-300 opacity-60" />
            <span className="font-bold">Nenhum registo de tarefa encontrado</span>
            <span className="text-[10px] text-neutral-400 italic">
              Visite a aba "tarefa" para aceitar e participar em missões diárias!
            </span>
          </div>
        ) : (
          displayTasks.map((task) => {
            const isExpanded = expandedId === task.id;
            return (
              <div 
                key={task.id}
                className="bg-white border-b-8 border-neutral-100/70 overflow-hidden flex flex-col relative w-full"
                id={`gravar-card-${task.id}`}
              >
                {/* 3.1 Card Header bar (outros | X) */}
                <div className="bg-[#dbe4f0] px-3 py-2 flex items-center justify-between border-b border-gray-150 select-none mx-2 mt-2">
                  <span className="text-[12px] text-gray-700 tracking-wide">outros</span>
                  <span className="text-[12px] text-gray-400 select-none cursor-pointer hover:text-gray-700" onClick={() => setExpandedId(null)}>X</span>
                </div>

                {/* 3.2 Card body content with high-accuracy field names and values */}
                <div className="p-4 text-gray-600 text-[12px] font-sans relative pr-[90px] bg-white mx-2 border border-t-0 border-gray-100 flex flex-col gap-1.5">
                  
                  {/* Objectivo da tarefa: Gosto disso */}
                  <div className="flex items-start leading-tight">
                    <span className="text-gray-500 font-normal min-w-[110px] select-none">Objectivo da tarefa:</span>
                    <span className="text-gray-800 ml-1">{task.desc || 'Gosto disso'}</span>
                  </div>
                  
                  {/* ligação da tarefa: abrir a ligação de vídeo */}
                  <div className="flex items-center leading-normal">
                    <span className="text-gray-500 font-normal min-w-[110px] select-none">ligação da tarefa:</span>
                    <button 
                      onClick={() => handleOpenLink(task.desc)}
                      className="ml-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[10px] py-0.5 px-2 rounded-[2px] transition-colors cursor-pointer select-none"
                    >
                      abrir a ligação de vídeo
                    </button>
                  </div>

                  {!isExpanded && (
                    <>
                      {/* Criar: 2023-08-06 11:56:39 */}
                      <div className="flex items-start leading-tight">
                        <span className="text-gray-500 font-normal min-w-[110px] select-none">Criar:</span>
                        <span className="text-gray-600 font-mono ml-1 select-all">{task.joinedAt || '2023-08-06 11:56:39'}</span>
                      </div>

                      {/* revisão: Transformação */}
                      <div className="flex items-start leading-tight">
                        <span className="text-gray-500 font-normal min-w-[110px] select-none">revisão:</span>
                        <span className="text-gray-800 ml-1 select-none">
                          {activeSegment === 'andamento' ? 'Transformação' : activeSegment === 'revisao' ? 'Não revisto' : activeSegment === 'concluido' ? 'Terminado' : 'Falhou'}
                        </span>
                      </div>

                      {/* Action Orange button row */}
                      {activeSegment === 'andamento' && (
                        <div className="pt-1.5 select-none flex">
                          <button 
                            onClick={() => toggleExpand(task.id)}
                            className="bg-[#f97316] hover:bg-[#ea580c] text-white font-normal text-[10px] py-1 px-3 rounded-full border border-dashed border-white transition-all cursor-pointer select-none"
                          >
                            add a screenshot of done task
                          </button>
                        </div>
                      )}

                      {activeSegment === 'revisao' && (
                        <div className="pt-1.5">
                          <span className="bg-amber-50 text-amber-700 text-[10px] py-0.5 px-2 rounded inline-block border border-amber-100">
                            Em Revisão por Auditoria Automática
                          </span>
                        </div>
                      )}

                      {activeSegment === 'concluido' && (
                        <div className="pt-1.5">
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] py-0.5 px-2 rounded inline-block border border-emerald-100">
                            Tarefa Confirmada e Liquidada
                          </span>
                        </div>
                      )}

                      {activeSegment === 'falhado' && (
                        <div className="pt-1.5">
                          <span className="bg-red-50 text-red-700 text-[10px] py-0.5 px-2 rounded inline-block border border-red-100">
                            Pendente / Falhada
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* 3.3 Blue-Grey Coin Badge Centered Vertically on the Right Column representing the exact circle layout in the image */}
                  {!isExpanded && (
                    <div className="absolute right-3 top-[50%] -translate-y-1/2 flex items-center gap-2">
                      <div 
                        className="h-[52px] w-[52px] rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0" 
                        style={{ backgroundColor: '#9aaec4' }}
                      >
                        <span className="text-white text-[11px] font-black tracking-tight select-all text-center">
                          {task.reward}KZ
                        </span>
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

    </div>
  );
};
