import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { HomeTab } from './components/HomeTab';
import { WSTab } from './components/WSTab';
import { TaskTab } from './components/TaskTab';
import { GravarTab } from './components/GravarTab';
import { MeuTab } from './components/MeuTab';
import { RetirarPage } from './components/RetirarPage';
import { CustomAlert } from './components/CustomAlert';
import { CustomToast } from './components/CustomToast';
import { CustomSpinner } from './components/CustomSpinner';
import { SessionExpiredModal } from './components/SessionExpiredModal';
import { Home, Shield, Sparkles, ClipboardCheck, User, Headphones } from 'lucide-react';
import supportIcon from '../assets/icons8-support-fluente64.png';
import { TaskType } from './types';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

function MainAppLayout() {
  const { isLoggedIn, user, stats, showConfirm, isFullScreenActive, isSessionExpired, sessionExpiredMessage } = useApp();
  
  // Page route definitions — route name === page name
  const PAGE_ROUTES: Record<string, string> = {
    inicial: 'Página Inicial',
    ws:      'WS',
    tarefa:  'Tarefa',
    gravar:  'Gravar',
    meu:     'Meu',
  };

  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTabFromPath = (pathname: string): string => {
    if (pathname === '/ws') return 'ws';
    if (pathname === '/tarefa') return 'tarefa';
    if (pathname === '/gravar') return 'gravar';
    if (pathname === '/meu') return 'meu';
    return 'inicial';
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  // Keep document.title in sync with routing
  useEffect(() => {
    document.title = 'Asiaray group';
  }, []);

  const setActiveTab = (tab: string) => {
    const key = tab.toLowerCase();
    if (key === 'ws') navigate('/ws');
    else if (key === 'tarefa') navigate('/tarefa');
    else if (key === 'gravar') navigate('/gravar');
    else if (key === 'meu') navigate('/meu');
    else navigate('/');
  };

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
    <div className="min-h-screen bg-transparent font-sans">
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <LoginScreen /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isLoggedIn ? <LoginScreen /> : <Navigate to="/" replace />} />
        <Route path="/retirar" element={isLoggedIn ? <RetirarPage /> : <Navigate to="/login" replace />} />
        <Route 
          path="/*" 
          element={
            isLoggedIn ? (
              <div className="h-[100dvh] overflow-hidden bg-transparent flex flex-col max-w-md mx-auto relative border-x border-slate-200 backdrop-blur-sm">
                
                {/* Main viewport area */}
                <main id="main-scroll-area" className="flex-1 overflow-y-auto bg-transparent no-scrollbar p-2">
                  {renderActiveTabContent()}
                </main>
 
                {/* Quick floating chatbot action to talk to helpline (Draggable) */}
                {!isFullScreenActive && (
                  <div className="fixed inset-0 max-w-md mx-auto pointer-events-none z-40">
                      <img
                        id="quick-support-btn"
                        src={supportIcon}
                        alt="Support"
                        className={`pointer-events-auto ${supportPos ? 'absolute' : 'absolute bottom-[84px] right-4'} h-[36px] w-[36px] object-contain animate-float`}
                        style={{
                          ...(supportPos ? { left: `${supportPos.x}px`, top: `${supportPos.y}px` } : {}),
                          touchAction: 'none',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={handleSupportClick}
                      />
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
                  <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center px-3 py-6 font-sans animate-fadeIn">
                    <div className="relative w-full max-w-[388px]">
                      <div className="overflow-hidden border border-[#f59e0b] bg-[#fbbf24] shadow-[0_32px_90px_rgba(251,191,36,0.22)]">
                        <div className="px-5 pt-4 pb-3 text-center select-none">
                          <div className="text-[12px] font-semibold uppercase tracking-[0.3em] text-slate-900">
                            Shut down after {noticeCountdown} seconds
                          </div>
                          <div className="mt-2 flex items-center justify-center gap-1 text-[24px] font-black text-slate-900 tracking-[0.18em]">
                            <span>💧</span>
                            <span>~Notice~</span>
                            <span>🍂</span>
                            <span>🍃</span>
                            <span>💠</span>
                          </div>
                        </div>
                        <div className="bg-white px-4 pb-4 pt-3 border-t border-[#fcd34d]/40 shadow-sm text-[14px] text-slate-700 leading-7 max-h-[58vh] overflow-y-auto no-scrollbar">
                          <p className="mb-3 font-semibold text-slate-900">Documento n.º 20230501701</p>
                          <p className="mb-3">Relativamente ao apoio total da empresa à rápida expansão do mercado angolano, a primeira decisão é: convidar outras pessoas para trabalhar, podendo o convidante como gestor obter um bónus de 10% do seguinte salário do empregado.</p>
                          <p className="mb-3">Exemplo: O seu equipe tem 100 pessoas, todos no WS5, quanto dinheiro você pode ganhar todos os dias com isso.</p>
                          <p className="text-xs text-slate-400">Leia com atenção e siga as regras de convite para garantir as melhores recompensas.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsNoticeVisible(false)}
                        className="absolute -top-3 -right-3 w-[36px] h-[36px] bg-[#f97316] flex items-center justify-center shadow-[0_10px_20px_rgba(249,115,22,0.35)] cursor-pointer border-2 border-white hover:bg-[#ea580c] transition-colors focus:outline-none"
                        id="notice-close-btn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
 
              </div>
            ) : (
              <Navigate to="/register" replace />
            )
          } 
        />
      </Routes>

      {/* Global state-driven custom notifications overlay */}
      <CustomAlert />
      <CustomToast />
      <CustomSpinner />
      <SessionExpiredModal isOpen={isSessionExpired} message={sessionExpiredMessage} />
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
