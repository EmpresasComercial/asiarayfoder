import React from 'react';
import { useApp } from '../context/AppContext';
import { TaskType } from '../types';

interface HomeTabProps {
  setActiveTab: (tab: string) => void;
  setSelectedTaskCategory: (category: TaskType) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab, setSelectedTaskCategory }) => {
  const { stats } = useApp();
  
  const handleTaskRoomClick = (category: TaskType) => {
    setSelectedTaskCategory(category);
    setActiveTab('tarefa');
  };

  // Alternating mock members matching the screenshot rail
  const members = [
    { id: 1, isReal: true, pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' }, // Man face 1
    { id: 2, isReal: false }, // Generic silhouette
    { id: 3, isReal: true, pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' }, // Man face 2
    { id: 4, isReal: false }, // Generic silhouette
    { id: 5, isReal: false }, // Generic silhouette
    { id: 6, isReal: true, pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' }, // Woman face 1
    { id: 7, isReal: true, pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' }  // Woman face 2
  ];

  return (
    <div id="home-tab-container" className="pb-24 bg-[#f4f6f9] min-h-screen animate-fadeIn font-sans select-none">
      
      {/* 1. Header Media Trailer Widget (Keep exact positioning) */}
      <div className="w-full bg-black" id="home-video-wrapper">
        <video
          src="https://weboss.asiaray.com/2025/06/Greater-Bay-Area-Video.mp4"
          autoPlay
          loop
          controls
          className="w-full"
          style={{ display: 'block' }}
        />
      </div>

      {/* 2. Horizontal Scrolling Marquee Notification */}
      <div className="bg-[#fffde7] text-xs py-2 px-3 overflow-hidden flex items-center gap-2 border-b border-neutral-200" id="marquee-banner">
        <svg className="w-4 h-4 text-orange-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <div className="flex-1 w-full overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap font-normal text-neutral-600">
            congratulations to new users:594****529 join 📣📣📣 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; congratulations to new users:244922****85 join 📣📣📣 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; congratulations to template tester join 📣📣📣
          </div>
        </div>
      </div>

      {/* 3. Income View dashboard layout */}
      <div className="bg-white border-b-[8px] border-[#f4f6f9]" id="income-view-board">
        {/* Full width flat grey-blue title bar (Edge to Edge) */}
        <div className="bg-[#dbe4f0] px-4 py-2 border-b border-neutral-200 select-none">
          <h2 className="text-[12.5px] text-neutral-600 tracking-wide font-medium">
            Income view ( It's not instant data)
          </h2>
        </div>

        {/* 3x3 Metrics layout exactly matching colors and values in the screenshot */}
        <div className="grid grid-cols-3 py-4 px-4 text-left bg-white select-none gap-x-2 gap-y-4">
          
          {/* Column 1 */}
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium leading-tight">Balance (KZ)</span>
            <span className="text-[14px] font-medium text-[#f35a5a] mt-0.5 font-sans leading-none">
              {stats.balance > 0 ? stats.balance.toFixed(2) : '40380.00'}
            </span>
          </div>
          
          {/* Column 2 */}
          <div className="flex flex-col border-l border-neutral-100 pl-3">
            <span className="text-[10px] text-gray-400 font-medium leading-tight">Ontem (KZ)</span>
            <span className="text-[14px] font-medium text-[#f35a5a] mt-0.5 font-sans leading-none">
              {stats.incomeYesterday > 0 ? `+${stats.incomeYesterday.toFixed(2)}` : '+2360.00'}
            </span>
          </div>
          
          {/* Column 3 */}
          <div className="flex flex-col border-l border-neutral-100 pl-3">
            <span className="text-[10px] text-gray-400 font-medium leading-tight">Hoje (KZ)</span>
            <span className="text-[14px] font-medium text-[#f35a5a] mt-0.5 font-sans leading-none">
              {stats.incomeToday > 0 ? stats.incomeToday.toFixed(2) : '260.00'}
            </span>
          </div>

          {/* Row 2 - Column 1 */}
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium leading-tight">Esta semana (KZ)</span>
            <span className="text-[14px] font-medium text-[#f35a5a] mt-0.5 font-sans leading-none">
              {stats.incomeThisWeek > 0 ? stats.incomeThisWeek.toFixed(2) : '18450.00'}
            </span>
          </div>
          
          {/* Row 2 - Column 2 */}
          <div className="flex flex-col border-l border-neutral-100 pl-3">
            <span className="text-[10px] text-gray-400 font-medium leading-tight">Este mês (KZ)</span>
            <span className="text-[14px] font-medium text-[#f35a5a] mt-0.5 font-sans leading-none">
              {stats.incomeThisMonth > 0 ? `+${stats.incomeThisMonth.toFixed(2)}` : '+76620.00'}
            </span>
          </div>
          
          {/* Row 2 - Column 3 */}
          <div className="flex flex-col border-l border-neutral-100 pl-3">
            <span className="text-[10px] text-gray-400 font-medium leading-tight">No mês passado (KZ)</span>
            <span className="text-[14px] font-medium text-[#f35a5a] mt-0.5 font-sans leading-none">
              {stats.incomeLastMonth > 0 ? stats.incomeLastMonth.toFixed(2) : '47620.00'}
            </span>
          </div>

          {/* Row 3 - Column 1 */}
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium leading-tight">Total das receitas (KZ)</span>
            <span className="text-[14px] font-medium text-[#f35a5a] mt-0.5 font-sans leading-none">
              {stats.incomeTotal > 0 ? stats.incomeTotal.toFixed(2) : '128000.00'}
            </span>
          </div>
          
          {/* Row 3 - Column 2 */}
          <div className="flex flex-col border-l border-neutral-100 pl-3">
            <span className="text-[10px] text-gray-400 font-medium leading-tight">Terminado hoje</span>
            <span className="text-[14px] font-medium text-[#f35a5a] mt-0.5 font-sans leading-none">
              {stats.completedTodayCount > 0 ? stats.completedTodayCount : '0'}
            </span>
          </div>
          
          {/* Row 3 - Column 3 */}
          <div className="flex flex-col border-l border-neutral-100 pl-3">
            <span className="text-[10px] text-gray-400 font-medium leading-tight">Tarefa inacabada</span>
            <span className="text-[14px] font-medium text-[#f35a5a] mt-0.5 font-sans leading-none">
              {stats.unfinishedCount > 0 ? stats.unfinishedCount : '4'}
            </span>
          </div>

        </div>
      </div>

      {/* 4. Sala de Tarefas Layout (Edge to Edge) */}
      <div className="bg-white border-b-[8px] border-[#f4f6f9]" id="home-tasks-region">
        <div className="bg-[#dbe4f0] px-4 py-2 border-b border-neutral-200 select-none">
          <h3 className="text-[12.5px] text-neutral-600 tracking-wide font-medium">
            Sala de Tarefas
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-2 px-3 py-4 select-none bg-white" id="task-room-grid">
          
          {/* Room 1: Amazónia with yellow/orange bg */}
          <div 
            onClick={() => handleTaskRoomClick('Amazon')}
            className="rounded-[4px] overflow-hidden cursor-pointer flex flex-col justify-center h-[76px] bg-[#ffe29b] relative shadow-none border border-amber-100/40"
          >
            {/* Top Left Tag */}
            <div className="absolute left-0 top-0 bg-[#f97316] text-[8px] text-white px-1.5 py-0.5 rounded-br font-black select-none">
              $
            </div>
            
            <div className="px-2 z-10 text-left flex flex-col justify-center h-full pt-2">
              <div className="text-[12px] font-bold text-gray-805 leading-none">Amazónia</div>
              <div className="text-[8px] text-gray-500 font-medium mt-1 leading-tight">(fazer tarefa)</div>
            </div>

            {/* Medal Icon on Right */}
            <div className="absolute right-1.5 top-0 bottom-0 pointer-events-none flex items-center justify-end">
              <svg className="h-[36px] w-[36px] text-amber-500 opacity-60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="0.8" />
                <path d="M12 7l1.2 2.5 2.8.3-2 1.9.5 2.8-2.5-1.5-2.5 1.5.5-2.8-2-1.9 2.8-.3L12 7z" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Room 2: Facebook with blue bg */}
          <div 
            onClick={() => handleTaskRoomClick('Facebook')}
            className="rounded-[4px] overflow-hidden cursor-pointer flex flex-col justify-center h-[76px] bg-[#adcbf7] relative shadow-none border border-blue-100/40"
          >
            {/* Top Left Tag */}
            <div className="absolute left-0 top-0 bg-[#3b82f6] text-[8px] text-white px-1.5 py-0.5 rounded-br font-black select-none">
              $
            </div>
            
            <div className="px-2 z-10 text-left flex flex-col justify-center h-full pt-2">
              <div className="text-[12px] font-bold text-gray-805 leading-none">Facebook</div>
              <div className="text-[8px] text-gray-500 font-medium mt-1 leading-tight">(Anúncio de imagem)</div>
            </div>

            {/* Medal Icon on Right */}
            <div className="absolute right-1.5 top-0 bottom-0 pointer-events-none flex items-center justify-end">
              <svg className="h-[36px] w-[36px] text-[#2563eb] opacity-60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="0.8" />
                <path d="M12 7l1.2 2.5 2.8.3-2 1.9.5 2.8-2.5-1.5-2.5 1.5.5-2.8-2-1.9 2.8-.3L12 7z" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Room 3: YouTube with grey bg */}
          <div 
            onClick={() => handleTaskRoomClick('YouTube')}
            className="rounded-[4px] overflow-hidden cursor-pointer flex flex-col justify-center h-[76px] bg-[#e2e8f0] relative shadow-none border border-gray-150"
          >
            {/* Top Left Tag */}
            <div className="absolute left-0 top-0 bg-[#f97316] text-[8px] text-white px-1.5 py-0.5 rounded-br font-black select-none">
              $
            </div>
            
            <div className="px-1.5 z-10 text-left flex flex-col justify-center h-full pt-2">
              <div className="text-[12px] font-bold text-gray-850 leading-none">YouTube</div>
              <div className="text-[7.5px] text-gray-500 font-medium mt-1 leading-none">download app para ganhar recompensa</div>
            </div>

            {/* Medal Icon on Right */}
            <div className="absolute right-1.5 top-0 bottom-0 pointer-events-none flex items-center justify-end">
              <svg className="h-[36px] w-[36px] text-gray-400 opacity-60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="0.8" />
                <path d="M12 7l1.2 2.5 2.8.3-2 1.9.5 2.8-2.5-1.5-2.5 1.5.5-2.8-2-1.9 2.8-.3L12 7z" fill="currentColor" />
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* 5. Lista de membros layout (Edge to Edge) */}
      <div className="bg-white border-b border-neutral-100 mb-24">
        <div className="bg-[#dbe4f0] px-4 py-2 border-b border-neutral-200 select-none">
          <h3 className="text-[12.5px] text-neutral-600 tracking-wide font-medium">
            Lista de membros
          </h3>
        </div>

        <div className="py-4 px-4 flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth bg-white" id="home-members-rail">
          {members.map(mbr => (
            <div 
              key={mbr.id}
              className="bg-[#f8fafc] w-[54px] h-[54px] rounded-full shrink-0 flex items-center justify-center border border-neutral-100 select-none overflow-hidden"
            >
              {mbr.isReal ? (
                <img 
                  referrerPolicy="no-referrer"
                  src={mbr.pic} 
                  alt="avatar" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[#f1f5f9] flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[28px] w-[28px] text-slate-350" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
