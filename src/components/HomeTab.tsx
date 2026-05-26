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

  // Live tickers list
  const tickerItems = [
    "congratulations to new users: 594****529 join 🎉🎉🎉",
    "congratulations to VIP 2 user 244921****45 earned KZ 25,600.00 today! 💸",
    "congratulations to VIP 1 user 244933****91 completed Facebook task rewards! 🚀",
    "congratulations to VIP 4 user 244944****10 withdraw KZ 150,000.00 successfully! 🏦",
    "congratulations to new users: 244925****67 join 🎉🎉🎉",
    "congratulations to VIP 3 user 244939****34 earned KZ 48,000.00 on Amazon reviews! 🛍️"
  ];

  // Horizontal Member scrolling simulator
  const members = [
    { id: 1, phone: '244922****85', level: 'WS2', earning: 'KZ 11,500.00', pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
    { id: 2, phone: '244934****62', level: 'WS1', earning: 'KZ 4,500.00', pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
    { id: 3, phone: '244941****55', level: 'WS5', earning: 'KZ 105,000.00', pic: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120' },
    { id: 4, phone: '244944****19', level: 'WS3', earning: 'KZ 48,000.00', pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' },
    { id: 5, phone: '244912****03', level: 'WS0', earning: 'KZ 300.00', pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
    { id: 6, phone: '244925****12', level: 'WS2', earning: 'KZ 9,200.00', pic: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120' }
  ];

  return (
    <div id="home-tab-container" className="pb-24 space-y-0 bg-transparent min-h-screen animate-fadeIn font-sans">
      
      {/* 1. Header Media Trailer Widget */}
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
      <div className="bg-[#fffde7] text-xs py-2 px-3 overflow-hidden select-none flex items-center gap-2 border-b border-gray-200" id="marquee-banner">
        <svg className="w-4 h-4 text-orange-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <div className="flex-1 w-full overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap font-normal text-gray-600">
            congratulations to new users:594****529 join 📣📣📣 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; congratulations to new users:244922****85 join 📣📣📣 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; congratulations to template tester join 📣📣📣
          </div>
        </div>
      </div>

      {/* 3. Income View dashboard layout */}
      <div className="bg-white" id="income-view-board">
        {/* Full width flat grey-blue title bar */}
        <div className="bg-[#dbe4f0] px-3 py-2 flex items-center select-none border-b border-gray-200 mt-2 mx-2">
          <h2 className="text-[13px] text-gray-700 tracking-wide font-sans">
            Income view ( It's not instant data)
          </h2>
        </div>

        <div className="relative mx-2">
          {/* 3x3 Metrics layout with flat styling and red numbers */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 py-3 px-2 text-left bg-white select-none gap-y-5 border border-t-0 border-gray-100">
            
            {/* Row 1 */}
            <div className="pl-1">
              <div className="text-[9px] text-gray-500 font-normal leading-normal">Balance (KZ)</div>
              <div className="text-[13px] font-normal text-[#ef4444] mt-0.5">
                {stats.balance.toFixed(2)}
              </div>
            </div>
            <div className="pl-2">
              <div className="text-[9px] text-gray-500 font-normal leading-normal font-sans">Ontem (KZ)</div>
              <div className="text-[13px] font-normal text-[#ef4444] mt-0.5">
                +{stats.incomeYesterday.toFixed(2)}
              </div>
            </div>
            <div className="pl-2">
              <div className="text-[9px] text-gray-500 font-normal leading-normal font-sans">Hoje (KZ)</div>
              <div className="text-[13px] font-normal text-[#ef4444] mt-0.5">
                {stats.incomeToday.toFixed(2)}
              </div>
            </div>

            {/* Row 2 */}
            <div className="pl-1">
              <div className="text-[9px] text-gray-500 font-normal leading-normal">Esta semana (KZ)</div>
              <div className="text-[13px] font-normal text-[#ef4444] mt-0.5">
                {stats.incomeThisWeek.toFixed(2)}
              </div>
            </div>
            <div className="pl-2">
              <div className="text-[9px] text-gray-500 font-normal leading-normal">Este mês (KZ)</div>
              <div className="text-[13px] font-normal text-[#ef4444] mt-0.5">
                +{stats.incomeThisMonth.toFixed(2)}
              </div>
            </div>
            <div className="pl-2">
              <div className="text-[9px] text-gray-500 font-normal leading-normal">No mês passado (KZ)</div>
              <div className="text-[13px] font-normal text-[#ef4444] mt-0.5">
                {stats.incomeLastMonth.toFixed(2)}
              </div>
            </div>

            {/* Row 3 */}
            <div className="pl-1">
              <div className="text-[9px] text-gray-500 font-normal leading-normal">Total das receitas (KZ)</div>
              <div className="text-[13px] font-normal text-[#ef4444] mt-0.5">
                {stats.incomeTotal.toFixed(2)}
              </div>
            </div>
            <div className="pl-2">
              <div className="text-[9px] text-gray-500 font-normal leading-normal">Terminado hoje</div>
              <div className="text-[13px] font-normal text-[#ef4444] mt-0.5">
                {stats.completedTodayCount}
              </div>
            </div>
            <div className="pl-2">
              <div className="text-[9px] text-gray-500 font-normal leading-normal">Tarefa inacabada</div>
              <div className="text-[13px] font-normal text-[#ef4444] mt-0.5">
                {stats.unfinishedCount}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4. Sala de Tarefas Layout */}
      <div className="bg-white mt-1" id="home-tasks-region">
        <div className="bg-[#dbe4f0] px-3 py-2 border-b border-gray-200 select-none mx-2">
          <h3 className="text-[13px] text-gray-700 tracking-wide font-sans">
            Sala de Tarefas
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-2 px-3 py-4 select-none mx-2 border border-t-0 border-gray-100" id="task-room-grid">
          {/* Room 1: Amazónia with yellow/orange bg */}
          <div 
            onClick={() => handleTaskRoomClick('Amazon')}
            className="rounded-[6px] overflow-hidden cursor-pointer flex flex-col justify-center h-[60px] bg-gradient-to-r from-[#ffd166] to-[#ffb703] relative"
          >
            <div className="px-2 z-10 text-center flex flex-col justify-center items-center h-full">
              <div className="text-[13px] font-bold text-gray-900 leading-tight">Amazónia</div>
              <div className="text-[9px] text-gray-800 font-normal">(fazer tarefa)</div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 opacity-20 pointer-events-none w-1/2 overflow-hidden flex justify-end items-center">
              <svg className="h-[40px] w-[40px] mr-1" viewBox="0 0 24 24" fill="white">
                <path d="M12 15.2l-4.5 2.8 1.2-5.1L5 9.4l5.2-.4L12 4.3l1.8 4.7 5.2.4-3.7 3.5 1.2 5.1z" />
              </svg>
            </div>
          </div>

          {/* Room 2: Facebook with blue bg */}
          <div 
            onClick={() => handleTaskRoomClick('Facebook')}
            className="rounded-[6px] overflow-hidden cursor-pointer flex flex-col justify-center h-[60px] bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] relative"
          >
            <div className="px-2 z-10 text-center flex flex-col justify-center items-center h-full">
              <div className="text-[13px] font-bold text-gray-900 leading-tight">Facebook</div>
              <div className="text-[9px] text-gray-800 font-normal">(Anúncio de imagem)</div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 opacity-20 pointer-events-none w-1/2 overflow-hidden flex justify-end items-center">
              <svg className="h-[40px] w-[40px] mr-1" viewBox="0 0 24 24" fill="white">
                <path d="M12 15.2l-4.5 2.8 1.2-5.1L5 9.4l5.2-.4L12 4.3l1.8 4.7 5.2.4-3.7 3.5 1.2 5.1z" />
              </svg>
            </div>
          </div>

          {/* Room 3: YouTube with grey bg */}
          <div 
            onClick={() => handleTaskRoomClick('YouTube')}
            className="rounded-[6px] overflow-hidden cursor-pointer flex flex-col justify-center h-[60px] bg-gradient-to-r from-[#e5e7eb] to-[#d1d5db] relative"
          >
            <div className="px-1 z-10 text-center flex flex-col justify-center items-center h-full">
              <div className="text-[13px] font-bold text-gray-900 leading-tight">YouTube</div>
              <div className="text-[8px] text-gray-800 font-normal leading-tight text-center">download app para ganh ar recompensa</div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 opacity-40 pointer-events-none w-1/2 overflow-hidden flex justify-end items-center">
              <svg className="h-[40px] w-[40px] mr-1" viewBox="0 0 24 24" fill="white">
                <path d="M12 15.2l-4.5 2.8 1.2-5.1L5 9.4l5.2-.4L12 4.3l1.8 4.7 5.2.4-3.7 3.5 1.2 5.1z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Lista de membros layout */}
      <div className="bg-white mt-1 mb-24">
        <div className="bg-[#dbe4f0] px-3 py-2 border-b border-gray-200 select-none mx-2">
          <h3 className="text-[13px] text-gray-700 tracking-wide font-sans">
            Lista de membros
          </h3>
        </div>

        <div className="py-3 px-3 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth mx-2 border border-t-0 border-gray-100" id="home-members-rail">
          {members.map(mbr => (
            <div 
              key={mbr.id}
              className="bg-[#f8fafc] w-[60px] h-[60px] shrink-0 flex items-center justify-center border border-gray-100 select-none"
            >
              <img 
                referrerPolicy="no-referrer"
                src={mbr.pic} 
                alt="avatar" 
                className="h-[34px] w-[34px] rounded-full object-cover"
              />
            </div>
          ))}

          {/* Fill extra placeholders using the simple avatar layout in the image */}
          {[1, 2, 3, 4].map(placeholderId => (
            <div 
              key={`ph-${placeholderId}`}
              className="bg-[#f8fafc] w-[60px] h-[60px] shrink-0 flex items-center justify-center border border-gray-100 select-none"
            >
              <div className="h-[34px] w-[34px] rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
