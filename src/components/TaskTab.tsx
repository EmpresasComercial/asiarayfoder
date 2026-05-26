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

const YouTubeWordmark: React.FC = () => (
  <div className="flex flex-col items-center select-none pt-0.5">
    <div className="flex items-center justify-center h-8">
      <svg className="h-[21px] shrink-0" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Play Icon */}
        <path d="M26.3 3.4C29.4 3.4 32.2 4.2 32.2 4.2C32.2 4.2 34.8 4.4 36.3 5.4C37.2 6.1 37.5 7.6 37.5 7.6C37.5 7.6 37.8 9.9 37.8 12.3V14.4C37.8 16.8 37.5 19.1 37.5 19.1C37.5 19.1 37.2 20.6 36.3 21.3C34.8 22.3 32.2 22.5 32.2 22.5C32.2 22.5 29.4 23.3 26.3 23.3H11.7C8.6 23.3 5.8 22.5 5.8 22.5C5.8 22.5 3.2 22.3 1.7 21.3C0.8 20.6 0.5 19.1 0.5 19.1C0.5 19.1 0.2 16.8 0.2 14.4V12.3C0.2 9.9 0.5 7.6 0.5 7.6C0.5 7.6 0.8 6.1 1.7 5.4C3.2 4.4 5.8 4.2 5.8 4.2C5.8 4.2 8.6 3.4 11.7 3.4H26.3Z" fill="#FF0000" />
        <polygon points="15.2,8.8 24.3,13.7 15.2,18.7" fill="white" />
        {/* 'YouTube' Letters */}
        <text x="43" y="19" fill="#000000" fontSize="17.2" fontWeight="950" fontFamily="sans-serif" letterSpacing="-0.6">YouTube</text>
      </svg>
    </div>
    <span className="text-[12px] font-semibold text-zinc-500 mt-1 select-none font-sans">YouTube</span>
  </div>
);

const AmazonLogo: React.FC = () => (
  <div className="flex flex-col items-center select-none pt-0.5">
    <div className="flex flex-col items-center justify-center h-8">
      <span className="font-sans font-black text-[18px] text-zinc-900 leading-none tracking-tight">amazon</span>
      <svg className="w-[48px] h-[7px] mt-[1.2px]" viewBox="0 0 49 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 1C12 7 36 7 47 1" stroke="#FF9900" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M43.5 1.5C44 2.5 45 4.5 47 5C45.5 5.5 44 6.5 43 8.5" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
    <span className="text-[12px] font-semibold text-zinc-500 mt-1 select-none font-sans">Amazónia</span>
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
  if (type === 'YouTube') {
    return (
      <div className="flex flex-col items-center justify-center shrink-0 w-[84px] p-2 bg-slate-50 border-r border-zinc-150 select-none">
        <span className="text-[11px] text-zinc-400 font-sans mb-1.5 font-bold">YouTube</span>
        <svg className="h-[20px] w-[38px]" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="24" rx="6" fill="#FF0000" />
          <polygon points="16,7 26,12 16,17" fill="white" />
        </svg>
      </div>
    );
  }
  if (type === 'Amazon') {
    return (
      <div className="flex flex-col items-center justify-center shrink-0 w-[84px] p-2 bg-slate-50 border-r border-zinc-150 select-none">
        <span className="text-[11px] text-zinc-400 font-sans mb-1.5 font-bold">YouTube</span>
        <div className="flex flex-col items-center">
          <span className="font-extrabold text-[12.5px] text-zinc-950 leading-none">amazon</span>
          <svg className="w-[30px] h-[5px] mt-[1.5px]" viewBox="0 0 49 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 1C12 7 36 7 47 1" stroke="#FF9900" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center shrink-0 w-[84px] p-2 bg-slate-50 border-r border-zinc-150 select-none">
      <span className="text-[11px] text-zinc-400 font-sans mb-1.5 font-bold">YouTube</span>
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
        
        {/* YouTube Selector */}
        <div 
          onClick={() => setSelectedCategory('YouTube')}
          className={`cursor-pointer pb-2 flex flex-col items-center justify-center transition-all ${
            selectedCategory === 'YouTube' ? 'border-b-[3px] border-red-500 scale-[1.02]' : 'opacity-65 hover:opacity-100'
          }`}
          id="tab-btn-youtube"
        >
          <YouTubeWordmark />
        </div>

        {/* Amazon/Amazónia Selector */}
        <div 
          onClick={() => setSelectedCategory('Amazon')}
          className={`cursor-pointer pb-2 flex flex-col items-center justify-center transition-all ${
            selectedCategory === 'Amazon' ? 'border-b-[3px] border-yellow-500 scale-[1.02]' : 'opacity-65 hover:opacity-100'
          }`}
          id="tab-btn-amazon"
        >
          <AmazonLogo />
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
