import React from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskType } from '../types';
import { Headphones } from 'lucide-react';

interface TaskTabProps {
  selectedCategory: TaskType;
  setSelectedCategory: (category: TaskType) => void;
  setActiveTab: (tab: string) => void;
}

// High-fidelity Inline SVGs for the Category Selection Header from image

const WhatsappWordmark: React.FC = () => (
  <div className="flex flex-col items-center select-none pt-0.5">
    <div className="flex items-center justify-center h-8">
      <svg className="h-[21px] shrink-0" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.27 0 0 6.27 0 14C0 17.07 1 19.92 2.68 22.3L0.9 27.9L6.7 26.2C8.98 27.53 11.4 28 14 28C21.73 28 28 21.73 28 14C28 6.27 21.73 0 14 0Z" fill="#25D366" />
        <path d="M21.5 19.1C21.1 20.2 19.6 21 18.3 21C17.3 21 16 20.7 14.5 20.1C11.5 18.8 8.9 16 8.3 15.3C7.6 14.4 6 12.3 6 9.8C6 7.3 7.3 6.1 7.8 5.6C8.3 5.1 9.1 4.9 9.6 4.9C9.8 4.9 10 4.9 10.2 5C10.5 5.1 10.7 5.1 11 5.8C11.3 6.6 12 8.3 12.1 8.5C12.2 8.7 12.3 9 12.1 9.3C12 9.6 11.9 9.8 11.6 10.1C11.4 10.3 11.1 10.7 10.9 10.9C10.7 11.1 10.4 11.3 10.7 11.8C11 12.3 11.7 13.5 12.8 14.4C14.2 15.6 15.3 16 15.8 16.2C16.3 16.4 16.6 16.4 16.9 16.1C17.2 15.8 17.7 15.2 18.1 14.6C18.4 14.1 18.8 14.2 19.3 14.4C19.8 14.6 21.3 15.3 21.6 15.5C21.9 15.6 22.1 15.8 22.2 16.1C22.2 16.4 22.2 17.6 21.5 19.1Z" fill="white" />
        <text x="35" y="20" fill="#000000" fontSize="18" fontWeight="bold" fontFamily="sans-serif">Whatsapp</text>
      </svg>
    </div>
    <span className="text-[12px] font-semibold text-zinc-500 mt-1 select-none font-sans">Whatsapp</span>
  </div>
);

const TiktokLogo: React.FC = () => (
  <div className="flex flex-col items-center select-none pt-0.5">
    <div className="flex items-center justify-center h-8">
      <svg className="h-[21px] shrink-0" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C16 2 16.5 6 22 6V10C19 10 16 8.5 16 8.5V18.5C16 22.6 12.6 26 8.5 26C4.4 26 1 22.6 1 18.5C1 14.4 4.4 11 8.5 11C9.2 11 9.8 11.1 10.4 11.3V15.5C9.8 15.2 9.2 15 8.5 15C6.6 15 5 16.6 5 18.5C5 20.4 6.6 22 8.5 22C10.4 22 12 20.4 12 18.5V2H16Z" fill="#000000" />
        <path d="M16 2C16 2 16.5 6 22 6V10C19 10 16 8.5 16 8.5V18.5C16 22.6 12.6 26 8.5 26C4.4 26 1 22.6 1 18.5C1 14.4 4.4 11 8.5 11C9.2 11 9.8 11.1 10.4 11.3V15.5C9.8 15.2 9.2 15 8.5 15C6.6 15 5 16.6 5 18.5C5 20.4 6.6 22 8.5 22C10.4 22 12 20.4 12 18.5V2H16Z" stroke="#00f2fe" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <text x="30" y="20" fill="#000000" fontSize="18" fontWeight="bold" fontFamily="sans-serif">Tik tok</text>
      </svg>
    </div>
    <span className="text-[12px] font-semibold text-zinc-500 mt-1 select-none font-sans">Tik tok</span>
  </div>
);

const FacebookLogo: React.FC = () => (
  <div className="flex flex-col items-center select-none pt-0.5">
    <div className="flex items-center justify-center h-8">
      <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="5" fill="#1877F2" />
        <path d="M16 8.5H14.5C13.8 8.5 13.5 8.9 13.5 9.6V11H16L15.5 13H13.5V19.5H11V13H9.5V11H11V9.5C11 7.6 12.1 6.5 14 6.5C14.9 6.5 15.6 6.6 16 6.7V8.5Z" fill="white" />
      </svg>
    </div>
    <span className="text-[12px] font-semibold text-zinc-500 mt-1 select-none font-sans">Facebook</span>
  </div>
);

const CardLeftLogo: React.FC<{ type: TaskType }> = ({ type }) => {
  if (type === 'Whatsapp') {
    return (
      <div className="flex flex-col items-center justify-center shrink-0 w-[84px] p-2 bg-slate-50 border-r border-zinc-150 select-none">
        <span className="text-[11px] text-zinc-400 font-sans mb-1.5 font-bold">Whatsapp</span>
        <svg className="h-[24px] w-[24px]" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 0C6.27 0 0 6.27 0 14C0 17.07 1 19.92 2.68 22.3L0.9 27.9L6.7 26.2C8.98 27.53 11.4 28 14 28C21.73 28 28 21.73 28 14C28 6.27 21.73 0 14 0Z" fill="#25D366" />
          <path d="M21.5 19.1C21.1 20.2 19.6 21 18.3 21C17.3 21 16 20.7 14.5 20.1C11.5 18.8 8.9 16 8.3 15.3C7.6 14.4 6 12.3 6 9.8C6 7.3 7.3 6.1 7.8 5.6C8.3 5.1 9.1 4.9 9.6 4.9C9.8 4.9 10 4.9 10.2 5C10.5 5.1 10.7 5.1 11 5.8C11.3 6.6 12 8.3 12.1 8.5C12.2 8.7 12.3 9 12.1 9.3C12 9.6 11.9 9.8 11.6 10.1C11.4 10.3 11.1 10.7 10.9 10.9C10.7 11.1 10.4 11.3 10.7 11.8C11 12.3 11.7 13.5 12.8 14.4C14.2 15.6 15.3 16 15.8 16.2C16.3 16.4 16.6 16.4 16.9 16.1C17.2 15.8 17.7 15.2 18.1 14.6C18.4 14.1 18.8 14.2 19.3 14.4C19.8 14.6 21.3 15.3 21.6 15.5C21.9 15.6 22.1 15.8 22.2 16.1C22.2 16.4 22.2 17.6 21.5 19.1Z" fill="white" />
        </svg>
      </div>
    );
  }
  if (type === 'Tiktok') {
    return (
      <div className="flex flex-col items-center justify-center shrink-0 w-[84px] p-2 bg-slate-50 border-r border-zinc-150 select-none">
        <span className="text-[11px] text-zinc-400 font-sans mb-1.5 font-bold">Tik tok</span>
        <svg className="h-[24px] w-[24px]" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C16 2 16.5 6 22 6V10C19 10 16 8.5 16 8.5V18.5C16 22.6 12.6 26 8.5 26C4.4 26 1 22.6 1 18.5C1 14.4 4.4 11 8.5 11C9.2 11 9.8 11.1 10.4 11.3V15.5C9.8 15.2 9.2 15 8.5 15C6.6 15 5 16.6 5 18.5C5 20.4 6.6 22 8.5 22C10.4 22 12 20.4 12 18.5V2H16Z" fill="#000000" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center shrink-0 w-[84px] p-2 bg-slate-50 border-r border-zinc-150 select-none">
      <span className="text-[11px] text-zinc-400 font-sans mb-1.5 font-bold">Facebook</span>
      <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#1877F2" />
        <path d="M16 8.5H14.5C13.8 8.5 13.5 8.9 13.5 9.6V11H16L15.5 13H13.5V19.5H11V13H9.5V11H11V9.5C11 7.6 12.1 6.5 14 6.5C14.9 6.5 15.6 6.6 16 6.7V8.5Z" fill="white" />
      </svg>
    </div>
  );
};

export const TaskTab: React.FC<TaskTabProps> = ({ selectedCategory, setSelectedCategory, setActiveTab }) => {
  const { tasks, user, claimTask, showConfirm } = useApp();

  // Helper level index comparison
  const levelIndex = (lvl: string) => parseInt(lvl.slice(-1) || '0');

  // Filter tasks matching active selectedCategory
  const filteredTasks = tasks.filter(t => t.type === selectedCategory);

  const handleClaim = (task: Task) => {
    // Assert level eligibility
    const reqIndex = levelIndex(task.requiredLevel);
    const userIndex = levelIndex(user.level);

    if (userIndex < reqIndex) {
      alert(`Limitado: Requer nível ${task.requiredLevel} ou superior. Atualize a sua conta sob o painel de Membros.`);
      return;
    }

    if (task.status !== 'disponivel') {
      alert('Operação Negada: Esta tarefa já se encontra em progresso.');
      return;
    }

    const success = claimTask(task.id);
    if (success) {
      alert('Sucesso: Tarefa atribuída. Redirecionando para o painel "Gravar".');
      setActiveTab('Gravar');
    } else {
      alert('Controlo de Fluxo: Limite diário de tarefas atingido. Conclua pendências em "Gravar".');
    }
  };

  return (
    <div id="tasks-screen-wrapper" className="min-h-screen bg-stone-100/60 pb-20 relative font-sans">
      
      {/* 1. Header Channel Selector Category from Image */}
      <div className="bg-white grid grid-cols-3 border-b border-zinc-200 shadow-xs px-3 py-3 gap-2" id="tasks-filter-selection-grid">
        
        {/* Whatsapp Selector */}
        <div 
          onClick={() => setSelectedCategory('Whatsapp')}
          className={`cursor-pointer pb-2 flex flex-col items-center justify-center transition-all ${
            selectedCategory === 'Whatsapp' ? 'border-b-[3px] border-green-500 scale-[1.02]' : 'opacity-65 hover:opacity-100'
          }`}
          id="tab-btn-whatsapp"
        >
          <WhatsappWordmark />
        </div>

        {/* Tiktok Selector */}
        <div 
          onClick={() => setSelectedCategory('Tiktok')}
          className={`cursor-pointer pb-2 flex flex-col items-center justify-center transition-all ${
            selectedCategory === 'Tiktok' ? 'border-b-[3px] border-black scale-[1.02]' : 'opacity-65 hover:opacity-100'
          }`}
          id="tab-btn-tiktok"
        >
          <TiktokLogo />
        </div>

        {/* Facebook Selector */}
        <div 
          onClick={() => setSelectedCategory('Facebook')}
          className={`cursor-pointer pb-2 flex flex-col items-center justify-center transition-all ${
            selectedCategory === 'Facebook' ? 'border-b-[3px] border-blue-600 scale-[1.02]' : 'opacity-65 hover:opacity-100'
          }`}
          id="tab-btn-facebook"
        >
          <FacebookLogo />
        </div>

      </div>

      {/* 2. Tasks Grid List matching layout & content */}
      <div className="p-3.5 space-y-3" id="tasks-list-cards-viewport">
        {filteredTasks.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg border border-zinc-200 text-zinc-400 text-sm select-none">
            Nenhuma tarefa disponível nesta categoria no momento. Excedeu o limite ou já foram todas concluídas.
          </div>
        ) : (
          filteredTasks.map((task, idx) => {
            const reqIdx = levelIndex(task.requiredLevel);
            const userIdx = levelIndex(user.level);
            const canWork = userIdx >= reqIdx;
            
            // Generate authentic random or index-based names like ad****, **min
            const randomUsers = ['ad****', '**min', 'sh****', 'ru****', 'me****', 'li****'];
            const targetedUser = randomUsers[idx % randomUsers.length];

            // Alternate reward texts like "300.00 KZ" vs "300.00 (KZ300.00)" for maximum fidelity
            const isAlternateType = idx % 2 === 1;
            const rewardText = isAlternateType 
              ? `${task.reward.toFixed(2)} (KZ${task.reward.toFixed(2)})`
              : `${task.reward.toFixed(2)} KZ`;

            // Remaining numbers matching 99992, 99993, 99995 from image
            const remainingCount = 99990 + (idx % 6);

            return (
              <div 
                key={task.id}
                className="bg-white rounded-sm border border-zinc-200/85 shadow-xs overflow-hidden flex min-h-[105px]"
                id={`task-card-item-${task.id}`}
              >
                {/* Left side logo column */}
                <CardLeftLogo type={task.type} />

                {/* Central meta information column */}
                <div className="flex-1 p-3 flex flex-col justify-between text-left select-none pr-1">
                  
                  {/* Row 1: Demander and 'pago' indicator */}
                  <div className="text-[12.5px] text-zinc-500 font-sans tracking-tight leading-none">
                    demander: <span className="font-semibold text-zinc-700">{targetedUser}</span>{' '}
                    <span className="text-[#d97706] font-extrabold text-[11px] ml-1 uppercase">pago</span>
                  </div>

                  {/* Row 2: Reward currency rate */}
                  <div className="text-[13px] font-black text-[#27272a] font-sans tracking-wide leading-tight mt-1">
                    {rewardText}
                  </div>

                  {/* Row 3: Remaining tasks amount */}
                  <div className="text-[11px] text-zinc-400 font-sans mt-0.5">
                    restante: <span className="text-zinc-900 font-extrabold text-[12px]">{remainingCount}</span>
                  </div>

                  {/* Row 4: Static Objective line */}
                  <div className="text-[11.5px] text-zinc-500 font-sans mt-1">
                    Objectivo da tarefa: <span className="text-zinc-700 font-medium">Gosto disso</span>
                  </div>

                </div>

                {/* Right actions column containing gradient orange button */}
                <div className="p-3 flex items-center justify-center shrink-0">
                  {task.status === 'disponivel' ? (
                    <button
                      id={`get-task-btn-${task.id}`}
                      onClick={() => handleClaim(task)}
                      className={`h-[28px] px-3 text-[11.5px] font-black text-slate-800 bg-gradient-to-b from-[#f97316] to-[#ea580c] hover:brightness-[1.05] active:brightness-[0.95] rounded-xs shadow-sm cursor-pointer select-none transition-all outline-none border-none border-orange-600/25`}
                    >
                      Obter a tarefa
                    </button>
                  ) : (
                    <span className="text-[10.5px] font-bold text-zinc-400 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded select-none">
                      Reivindicada
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
