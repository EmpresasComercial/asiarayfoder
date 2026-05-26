import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { HomeTab } from './components/HomeTab';
import { WSTab } from './components/WSTab';
import { TaskTab } from './components/TaskTab';
import { GravarTab } from './components/GravarTab';
import { MeuTab } from './components/MeuTab';
import { CustomAlert } from './components/CustomAlert';
import { CustomToast } from './components/CustomToast';
import { CustomSpinner } from './components/CustomSpinner';
import { Home, Shield, Sparkles, ClipboardCheck, User, Headphones } from 'lucide-react';
import { TaskType } from './types';

function MainAppLayout() {
  const { isLoggedIn, user, stats, showConfirm, isFullScreenActive } = useApp();
  
  // Page route definitions — route name === page name
  const PAGE_ROUTES: Record<string, string> = {
    inicial: 'Página Inicial',
    ws:      'WS',
    tarefa:  'Tarefa',
    gravar:  'Gravar',
    meu:     'Meu',
  };
  const VALID_TABS = Object.keys(PAGE_ROUTES);

  // Read hash on first render; fall back to 'inicial'
  const [activeTab, setActiveTabRaw] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    return VALID_TABS.includes(hash) ? hash : 'inicial';
  });

  // Keep URL hash + document.title in sync on every tab change
  const setActiveTab = (tab: string) => {
    const key = tab.toLowerCase();
    setActiveTabRaw(key);
    window.location.hash = key;
    document.title = `Asiaray | ${PAGE_ROUTES[key] ?? key}`;
  };

  // Sync title on mount
  useEffect(() => {
    const key = activeTab.toLowerCase();
    document.title = `Asiaray | ${PAGE_ROUTES[key] ?? key}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (VALID_TABS.includes(hash)) {
        setActiveTabRaw(hash);
        document.title = `Asiaray | ${PAGE_ROUTES[hash]}`;
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedTaskCategory, setSelectedTaskCategory] = useState<TaskType>('Amazon');

  // Draggable customer support button states (starts at bottom-right CSS class naturally)
  const [supportPos, setSupportPos] = useState<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = React.useRef({ x: 0, y: 0 });
  const btnStart = React.useRef({ x: 0, y: 0 });
  const dragThreshold = 6;
  const wasDragged = React.useRef(false);

  // Boundary check on resize
  useEffect(() => {
    if (!supportPos) return;
    const handleResize = () => {
      setSupportPos(prev => {
        if (!prev) return null;
        return {
          x: Math.min(380, Math.max(10, prev.x)),
          y: Math.min(window.innerHeight - 120, Math.max(10, prev.y))
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [supportPos]);

  // Global mouse move and up handlers when dragging
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        wasDragged.current = true;
      }
      const newX = Math.min(380, Math.max(10, btnStart.current.x + deltaX));
      const newY = Math.min(window.innerHeight - 120, Math.max(10, btnStart.current.y + deltaY));
      setSupportPos({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const parent = btn.parentElement;
    if (parent) {
      const rect = btn.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const curX = rect.left - parentRect.left;
      const curY = rect.top - parentRect.top;
      
      dragStart.current = { x: e.clientX, y: e.clientY };
      btnStart.current = { x: curX, y: curY };
      setSupportPos({ x: curX, y: curY });
    }
    wasDragged.current = false;
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    const touch = e.touches[0];
    const btn = e.currentTarget;
    const parent = btn.parentElement;
    if (parent) {
      const rect = btn.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const curX = rect.left - parentRect.left;
      const curY = rect.top - parentRect.top;
      
      dragStart.current = { x: touch.clientX, y: touch.clientY };
      btnStart.current = { x: curX, y: curY };
      setSupportPos({ x: curX, y: curY });
    }
    wasDragged.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.current.x;
    const deltaY = touch.clientY - dragStart.current.y;
    if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
      wasDragged.current = true;
    }
    const newX = Math.min(380, Math.max(10, btnStart.current.x + deltaX));
    const newY = Math.min(window.innerHeight - 120, Math.max(10, btnStart.current.y + deltaY));
    setSupportPos({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleSupportClick = () => {
    if (wasDragged.current) return;
    showConfirm(
      'Deseja abrir o suporte via WhatsApp com um assessor da Asiaray Angola?',
      () => {
        window.open('https://api.whatsapp.com/send?phone=244922342885', '_blank');
      }
    );
  };

  // Announcement notice state
  const [isNoticeVisible, setIsNoticeVisible] = useState<boolean>(false);
  const [noticeCountdown, setNoticeCountdown] = useState<number>(15);

  // Trigger Notice popup when entering/returning to the home tab and reset scroll position
  useEffect(() => {
    // Reset scroll position to top when changing tabs
    const mainArea = document.getElementById('main-scroll-area');
    if (mainArea) {
      mainArea.scrollTop = 0;
    }

    if (activeTab === 'inicial') {
      setIsNoticeVisible(true);
      setNoticeCountdown(15);
    }
  }, [activeTab]);

  // Notice auto-shutdown timer
  useEffect(() => {
    if (isNoticeVisible && noticeCountdown > 0) {
      const timer = setTimeout(() => {
        setNoticeCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isNoticeVisible && noticeCountdown === 0) {
      setIsNoticeVisible(false);
    }
  }, [isNoticeVisible, noticeCountdown]);

  // If user is not authenticated, render registration/login dashboard
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  // Render components according to chosen active footer navigation bar tab
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'inicial':
        return (
          <HomeTab 
            setActiveTab={setActiveTab} 
            setSelectedTaskCategory={setSelectedTaskCategory} 
          />
        );
      case 'ws':
        return <WSTab />;
      case 'tarefa':
        return (
          <TaskTab 
            selectedCategory={selectedTaskCategory} 
            setSelectedCategory={setSelectedTaskCategory} 
            setActiveTab={setActiveTab} 
          />
        );
      case 'gravar':
        return <GravarTab />;
      case 'meu':
      default:
        return <MeuTab />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'inicial': return 'Página Inicial';
      case 'ws':      return 'WS';
      case 'tarefa':  return 'Tarefa';
      case 'gravar':  return 'Gravar';
      case 'meu':
      default:        return 'Meu';
    }
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-transparent flex flex-col max-w-md mx-auto relative border-x border-slate-200 backdrop-blur-sm">
      
      {/* Dynamic Header block removed to match the screenshot designs exactly */}

      {/* Main viewport area */}
      <main id="main-scroll-area" className="flex-1 overflow-y-auto bg-transparent no-scrollbar p-2">
        {renderActiveTabContent()}
      </main>

      {/* Quick floating chatbot action to talk to helpline (Draggable) */}
      {!isFullScreenActive && (
        <div className="fixed inset-0 max-w-md mx-auto pointer-events-none z-40">
          <button 
            id="quick-support-btn"
            className={`pointer-events-auto w-[52px] h-[52px] rounded-full bg-[#111827] border border-gray-800 flex items-center justify-center shadow-xl transition-transform duration-100 cursor-pointer select-none active:scale-95 ${supportPos ? 'absolute' : 'absolute bottom-[84px] right-4'}`}
            style={{ 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              ...(supportPos ? { left: `${supportPos.x}px`, top: `${supportPos.y}px` } : {}),
              touchAction: 'none'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleSupportClick}
          >
            {/* Beautiful premium custom glowing headset icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-[28px] w-[28px]" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path 
                d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9v3.5c0 1.38-1.12 2.5-2.5 2.5H16.5c-1.38 0-2.5-1.12-2.5-2.5V12c0-1.66-1.34-3-3-3s-3 1.34-3 3v3.5c0 1.38-1.12 2.5-2.5 2.5H5c-1.38 0-2.5-1.12-2.5-2.5V12z" 
                stroke="url(#headsetGlow)" 
                strokeWidth={2}
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M21 15.5c0 1.93-1.57 3.5-3.5 3.5H16" 
                stroke="#14ffec" 
                strokeWidth={1.8} 
                strokeLinecap="round" 
              />
              <defs>
                <linearGradient id="headsetGlow" x1="3" y1="3" x2="21" y2="18" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#14ffec" />
                  <stop offset="50%" stopColor="#0d7377" />
                  <stop offset="100%" stopColor="#14ffec" />
                </linearGradient>
              </defs>
            </svg>
          </button>
        </div>
      )}

      {/* Footer sticky navigations */}
      {!isFullScreenActive && (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-nav py-2.5 px-2 flex justify-around items-center text-center z-50 rounded-t-2xl pb-4">
          
          {/* Tab 1: Página inicial */}
          <button
            id="btn-nav-inicial"
            onClick={() => setActiveTab('inicial')}
            className={`flex-1 flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer hover-lift ${activeTab === 'inicial' ? 'text-[#0d7377] font-bold scale-110' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Home size={20} className={activeTab === 'inicial' ? 'stroke-[2.5] drop-shadow-[0_0_8px_rgba(13,115,119,0.3)]' : 'stroke-[1.5]'} />
            <span className="text-[10px] tracking-tight">Início</span>
          </button>

          {/* Tab 2: ws */}
          <button
            id="btn-nav-ws"
            onClick={() => setActiveTab('ws')}
            className={`flex-1 flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer hover-lift ${activeTab === 'ws' ? 'text-[#0d7377] font-bold scale-110' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Shield size={20} className={activeTab === 'ws' ? 'stroke-[2.5] text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'stroke-[1.5]'} />
            <span className="text-[10px] tracking-tight">WS</span>
          </button>

          {/* Tab 3: tarefa */}
          <button
            id="btn-nav-tarefa"
            onClick={() => setActiveTab('tarefa')}
            className={`flex-1 flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer hover-lift ${activeTab === 'tarefa' ? 'text-[#0d7377] font-bold scale-110' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Sparkles size={20} className={activeTab === 'tarefa' ? 'stroke-[2.5] drop-shadow-[0_0_8px_rgba(13,115,119,0.3)]' : 'stroke-[1.5]'} />
            <span className="text-[10px] tracking-tight font-bold">Tarefa</span>
          </button>

          {/* Tab 4: Gravar */}
          <button
            id="btn-nav-gravar"
            onClick={() => setActiveTab('gravar')}
            className={`flex-1 flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer hover-lift ${activeTab === 'gravar' ? 'text-[#0d7377] font-bold scale-110' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ClipboardCheck size={20} className={activeTab === 'gravar' ? 'stroke-[2.5] drop-shadow-[0_0_8px_rgba(13,115,119,0.3)]' : 'stroke-[1.5]'} />
            <span className="text-[10px] tracking-tight">Gravar</span>
          </button>

          {/* Tab 5: meu */}
          <button
            id="btn-nav-meu"
            onClick={() => setActiveTab('meu')}
            className={`flex-1 flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer hover-lift ${activeTab === 'meu' ? 'text-[#0d7377] font-bold scale-110' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <User size={20} className={activeTab === 'meu' ? 'stroke-[2.5] drop-shadow-[0_0_8px_rgba(13,115,119,0.3)]' : 'stroke-[1.5]'} />
            <span className="text-[10px] tracking-tight">Meu</span>
          </button>

        </footer>
      )}

      {/* Pop-up Notice / Anúncio de Início */}
      {isNoticeVisible && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center px-6 font-sans animate-fadeIn">
          <div className="relative w-full max-w-[360px]">

            {/* Outer amber gradient card */}
            <div className="bg-gradient-to-b from-[#fde68a] to-[#fbbf24] rounded-2xl pt-3 pb-5 px-4 shadow-2xl">

              {/* Countdown row */}
              <div className="text-center text-gray-700 text-[12px] font-semibold mb-2 select-none">
                Shut down after {noticeCountdown} seconds
              </div>

              {/* ~Notice~ title row */}
              <div className="flex items-center justify-center gap-2 mb-3 select-none">
                <span className="text-xl">💧🍂</span>
                <span className="text-[22px] font-black text-gray-800 tracking-wider">~Notice~</span>
                <span className="text-xl">🍃💠</span>
              </div>

              {/* White inner card */}
              <div className="bg-white rounded-xl px-4 py-4 text-[13px] text-gray-700 leading-[1.65] text-left font-normal max-h-[230px] overflow-y-auto no-scrollbar shadow-sm">
                Documento n.º 20230501701: Relativamente ao apoio total da empresa à rápida expansão do mercado angolano, a primeira decisão é: convidar outras pessoas para trabalhar, podendo o convidante como gestor obter um bónus de 10% do seguinte salário do empregado. Exemplo: O seu equipe tem 100 pessoas, todos no WS5, quanto dinheiro você pode ganhar todos os dias com isso.
              </div>

            </div>

            {/* Orange X close button — top-right outside card, exactly as in screenshot */}
            <button
              onClick={() => setIsNoticeVisible(false)}
              className="absolute -top-3 -right-3 w-[34px] h-[34px] rounded-full bg-[#f97316] flex items-center justify-center shadow-lg cursor-pointer border-2 border-white hover:bg-[#ea580c] transition-colors focus:outline-none"
              id="notice-close-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

          </div>
        </div>
      )}

      {/* Global state-driven custom notifications overlay */}
      <CustomAlert />
      <CustomToast />
      <CustomSpinner />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
