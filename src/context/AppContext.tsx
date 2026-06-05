import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, UserProfile, FinancialStats, LogRecord, TeamReferral, TaskType } from '../types';
import { supabase, getAccessToken, GATEWAY_URL } from '../lib/supabase';

const normalizeBankName = (bankName?: string) => {
  if (!bankName) return 'Banco BAI';
  const normalized: Record<string, string> = {
    'BAI (Banco Angolano de Investimentos)': 'Banco BAI',
    'BFA (Banco de Fomento Angola)': 'Banco BFA',
    'BIC (Banco BIC)': 'Banco BIC',
    'BCI (Banco de Comércio e Indústria)': 'Banco BCI',
    'Millennium Atlântico': 'Banco ATL',
    'Banco Sol': 'Banco Sol',
    'Standard Bank Angola': 'Standard Bank Angola'
  };
  return normalized[bankName] || bankName;
};

export interface AlertConfig {
  message: string;
  title?: string;
  isOpen: boolean;
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm';
  onConfirm?: () => void;
}

export interface ToastConfig {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface AppContextProps {
  isLoggedIn: boolean;
  user: UserProfile;
  stats: FinancialStats;
  tasks: Task[];
  logs: LogRecord[];
  team: TeamReferral[];
  login: (phone: string, pin: string) => boolean;
  logout: () => void;
  registerUser: (phone: string, pin: string, inviteCode: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  claimTask: (taskId: string) => boolean;

  approvePendingTasks: () => void;
  addRecharge: (amount: number, txId: string, proofFileName?: string) => void;
  addWithdrawal: (amount: number) => { success: boolean; error?: string };
  convertUsdToKz: (usdAmount: number) => Promise<{ success: boolean; message: string }>;
  updateBankInfo: (bankName: string, bankAccount: string, holderName: string) => void;
  upgradeMembership: (level: string, cost: number, productId?: string) => Promise<boolean>;
  increaseCreditScore: (points: number) => void;
  updateUserPaymentPin: (newPin?: string) => void;
  resetAll: () => void;
  showAlert: (message: string, title?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  showConfirm: (message: string, onConfirm: () => void, title?: string) => void;
  alertConfig: AlertConfig | null;
  closeAlert: () => void;
  toasts: ToastConfig[];
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error', duration?: number) => void;
  removeToast: (id: string) => void;
  isFullScreenActive: boolean;
  setIsFullScreenActive: (active: boolean) => void;
  isLoading: boolean;
  loadingMessage?: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  fetchWithdrawalRecords: () => Promise<LogRecord[]>;
  isSessionExpired: boolean;
  setIsSessionExpired: (expired: boolean) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const INITIAL_TASKS: Task[] = [
  // WS0 Tasks - Free (Membro de Teste)
  { id: 't0_1', title: 'Curtir Post do Facebook', type: 'Facebook', reward: 100, requiredLevel: 'WS0', desc: 'Curta e comente na publicação indicada para receber a recompensa diária de iniciante.', status: 'disponivel' },
  { id: 't0_2', title: 'Seguir Canal do YouTube', type: 'Whatsapp', reward: 100, requiredLevel: 'WS0', desc: 'Inscreva-se no canal do parceiro e ative as notificações.', status: 'disponivel' },
  { id: 't0_3', title: 'Avaliar Produto Amazónia', type: 'Tiktok', reward: 100, requiredLevel: 'WS0', desc: 'Dê 5 estrelas ao produto listado no carrinho da Amazon parceira.', status: 'disponivel' },
  
  // WS1 Tasks
  { id: 't1_1', title: 'Seguir Página Facebook Premium', type: 'Facebook', reward: 450, requiredLevel: 'WS1', desc: 'Siga a página da marca parceira de cosméticos e compartilhe uma postagem pública.', status: 'disponivel' },
  { id: 't1_2', title: 'Vídeo Promocional YouTube AS', type: 'Whatsapp', reward: 450, requiredLevel: 'WS1', desc: 'Assista a 2 minutos deste anúncio de produto e curta.', status: 'disponivel' },
  { id: 't1_3', title: 'Adicionar Item ao Carrinho Amazon', type: 'Tiktok', reward: 450, requiredLevel: 'WS1', desc: 'Adicione ao seu carrinho de interesse e tire um print screen.', status: 'disponivel' },
  { id: 't1_4', title: 'Avaliação Positiva de Loja Amazon', type: 'Tiktok', reward: 450, requiredLevel: 'WS1', desc: 'Deixe um feedback positivo na loja do vendedor verificado.', status: 'disponivel' },
  { id: 't1_5', title: 'Compartilhar Post de Evento FB', type: 'Facebook', reward: 450, requiredLevel: 'WS1', desc: 'Publique o link do evento parceiro em seu perfil social publicamente.', status: 'disponivel' },

  // WS2 Tasks (User matches this in image!)
  { id: 't2_1', title: 'Avaliar Gadget de Alta Tecnologia', type: 'Tiktok', reward: 1150, requiredLevel: 'WS2', desc: 'Escreva um comentário curto e objetivo de 5 estrelas sobre o fone de ouvido de última geração.', status: 'disponivel' },
  { id: 't2_2', title: 'Fazer Compartilhamento Viral FB', type: 'Facebook', reward: 1150, requiredLevel: 'WS2', desc: 'Compartilhe o anúncio oficial do aplicativo com texto recomendado e tire screenshot.', status: 'disponivel' },
  { id: 't2_3', title: 'Subir Review Vídeo YouTube', type: 'Whatsapp', reward: 1150, requiredLevel: 'WS2', desc: 'Dê feedback em vídeo comentado, curta e comente na live stream oficial.', status: 'disponivel' },
  { id: 't2_4', title: 'Comentário em Post no Facebook', type: 'Facebook', reward: 1150, requiredLevel: 'WS2', desc: 'Escreva um comentário focado nas vantagens da marca parceira de vestuários.', status: 'disponivel' },
  { id: 't2_5', title: 'Visualizar Shorts de Viagem YT', type: 'Whatsapp', reward: 1150, requiredLevel: 'WS2', desc: 'Assista a 3 shorts seguidos de nossa rede de entretenimento parceira e favorite.', status: 'disponivel' },
  { id: 't2_6', title: 'Check-in de Compras de Moda Amazon', type: 'Tiktok', reward: 1150, requiredLevel: 'WS2', desc: 'Visite a vitrine de vestuário e clique em simular interesse para validar cupom.', status: 'disponivel' },
  { id: 't2_7', title: 'Inscrição em Canal de Finanças YT', type: 'Whatsapp', reward: 1150, requiredLevel: 'WS2', desc: 'Inscreva-se no canal financeiro parceiro e curta o último vídeo publicado.', status: 'disponivel' },
  { id: 't2_8', title: 'Engajamento no Grupo de FB', type: 'Facebook', reward: 1150, requiredLevel: 'WS2', desc: 'Faça um post construtivo em grupo público parceiro sobre oportunidades de home-office.', status: 'disponivel' },

  // WS3 Tasks
  { id: 't3_1', title: 'Avaliação de Notebook Gamer Amazon', type: 'Tiktok', reward: 3200, requiredLevel: 'WS3', desc: 'Revisão profissional simulada de produto premium com descrição técnica de compra.', status: 'disponivel' },
  { id: 't3_2', title: 'Campanha de Divulgação YouTube', type: 'Whatsapp', reward: 3200, requiredLevel: 'WS3', desc: 'Assista ao vídeo corporativo de inovação tecnológica de 10 min e valide código oculto.', status: 'disponivel' },
  { id: 't3_3', title: 'Compartilhamento em Grupo FB', type: 'Facebook', reward: 3200, requiredLevel: 'WS3', desc: 'Compartilhe em 5 grupos de classificados locais o banner de recrutamento.', status: 'disponivel' },

  // WS4 Tasks
  { id: 't4_1', title: 'Promoção de Dropshipping Amazon', type: 'Tiktok', reward: 10000, requiredLevel: 'WS4', desc: 'Divulgue o portfólio de fornecedores globais de alto giro no mercado regional.', status: 'disponivel' },
  { id: 't4_2', title: 'Vídeo Patrocinado de Investimento YT', type: 'Whatsapp', reward: 10000, requiredLevel: 'WS4', desc: 'Engaje na campanha oficial da corretora internacional com curtida, comentário e compartilhamento.', status: 'disponivel' },

  // WS5 Tasks
  { id: 't5_1', title: 'Parceria de Mídia Estruturada YT', type: 'Whatsapp', reward: 35000, requiredLevel: 'WS5', desc: 'Geração de visualizações orgânicas patrocinadas por parceiros multilaterais de anúncios.', status: 'disponivel' },
  { id: 't5_2', title: 'Promoção de Marca Principal Amazon', type: 'Tiktok', reward: 35000, requiredLevel: 'WS5', desc: 'Classificação máxima e divulgação do hub principal de eletrônicos no e-commerce.', status: 'disponivel' }
];

const INITIAL_STATS: FinancialStats = {
  balance: 0,
  balanceUSDT: 0,
  incomeYesterday: 0,
  incomeToday: 0,
  incomeThisWeek: 0,
  incomeThisMonth: 0,
  incomeLastMonth: 0,
  incomeTotal: 0,
  completedTodayCount: 0,
  unfinishedCount: 0
};

const INITIAL_LOGS: LogRecord[] = [
  { id: 'rec_1', type: 'recarga', amount: 30000, date: '2026-05-18 10:14', status: 'aprovado', details: 'Depósito Multicaixa Express' },
  { id: 'rec_2', type: 'recarga', amount: 10000, date: '2026-05-15 14:22', status: 'aprovado', details: 'Banco BAI' },
  { id: 'ret_1', type: 'retirada', amount: 15260, date: '2023-06-26 11:15', status: 'aprovado', details: 'Retirada solicitada por IBAN' },
  { id: 'tr_1', type: 'recompensa', amount: 1150, date: '2026-05-20 18:41', status: 'aprovado', details: 'Tarefa Amazon Concluída' },
  { id: 'tr_2', type: 'recompensa', amount: 1150, date: '2026-05-20 19:12', status: 'aprovado', details: 'Tarefa Facebook Concluída' }
];

const INITIAL_REFERRALS: TeamReferral[] = [
  { phone: '244933****12', level: 'WS1', joinDate: '2026-05-10', contribution: 12000 },
  { phone: '244941****55', level: 'WS2', joinDate: '2026-05-18', contribution: 48000 },
  { phone: '244925****67', level: 'WS0', joinDate: '2026-05-19', contribution: 0 },
  { phone: '244937****89', level: 'WS1', joinDate: '2026-05-20', contribution: 6500 }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [toasts, setToasts] = useState<ToastConfig[]>([]);
  const [isLoading, setIsLoadingState] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Carregando...');
  const [isFullScreenActive, setIsFullScreenActive] = useState<boolean>(false);

  const showLoading = (message: string = 'Carregando...') => {
    setLoadingMessage(message);
    setIsLoadingState(true);
  };

  const hideLoading = () => {
    setIsLoadingState(false);
  };

  const addToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showAlert = (message: string, title?: string, type?: 'info' | 'success' | 'warning' | 'error') => {
    // Show as a high-fidelity toast notification instead of a blocking modal center layout!
    addToast(message, type || 'info', 5000);
  };

  const showConfirm = (message: string, onConfirm: () => void, title?: string) => {
    setAlertConfig({ message, title, type: 'confirm', onConfirm, isOpen: true });
  };

  const closeAlert = () => {
    setAlertConfig(null);
  };

  // Intercept window.alert for absolute sandboxing safety in iframes
  useEffect(() => {
    window.alert = (msg: any) => {
      const rawText = String(msg);
      let type: 'info' | 'success' | 'warning' | 'error' = 'info';
      
      const lower = rawText.toLowerCase();
      if (
        lower.includes('sucesso') || 
        lower.includes('adquirida') || 
        lower.includes('recebido') || 
        lower.includes('promovida') || 
        lower.includes('vinculada') ||
        lower.includes('concluido') ||
        lower.includes('adicionado') ||
        lower.includes('registado') ||
        lower.includes('parabens') ||
        lower.includes('excelente')
      ) {
        type = 'success';
      } else if (
        lower.includes('erro') || 
        lower.includes('falha') || 
        lower.includes('insuficiente') || 
        lower.includes('incorreto') || 
        lower.includes('obrigatório') ||
        lower.includes('limite') ||
        lower.includes('inacabada') ||
        lower.includes('excedeu') ||
        lower.includes('já foi reivindicada')
      ) {
        type = 'error';
      } else if (
        lower.includes('requer') || 
        lower.includes('carregue') || 
        lower.includes('comprovativo') ||
        lower.includes('atenção') ||
        lower.includes('antes de salvar') ||
        lower.includes('aviso') ||
        lower.includes('indique o iban')
      ) {
        type = 'warning';
      }
      addToast(rawText, type, 5000);
    };
  }, []);

  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);

  // Try loading from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('asiaray_logged') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('asiaray_user');
    if (saved) {
      const parsed = JSON.parse(saved) as UserProfile;
      return {
        ...parsed,
        bankName: normalizeBankName(parsed.bankName)
      };
    }
    return {
      phone: '244922342885', // Matches Image 1!
      id: '13793',
      level: 'WS2', // Matches WS2 Level in image
      creditScore: 95, // bom rating
      inviteCode: '931242',
      bankName: 'Banco BAI',
      bankAccount: 'RIB004000009570177510185',
      holderName: 'Mateus Santos',
      paymentPin: undefined
    };
  });

  const [stats, setStats] = useState<FinancialStats>(() => {
    const saved = localStorage.getItem('asiaray_stats');
    if (saved) return JSON.parse(saved);
    return INITIAL_STATS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('asiaray_tasks');
    if (saved) return JSON.parse(saved);
    return INITIAL_TASKS;
  });

  const [logs, setLogs] = useState<LogRecord[]>(() => {
    const saved = localStorage.getItem('asiaray_logs');
    if (saved) return JSON.parse(saved);
    return INITIAL_LOGS;
  });

  const [team, setTeam] = useState<TeamReferral[]>(() => {
    const saved = localStorage.getItem('asiaray_team');
    if (saved) return JSON.parse(saved);
    return INITIAL_REFERRALS;
  });

  // Save states instantly to local storage
  useEffect(() => {
    localStorage.setItem('asiaray_logged', String(isLoggedIn));
    localStorage.setItem('asiaray_user', JSON.stringify(user));
    localStorage.setItem('asiaray_stats', JSON.stringify(stats));
    localStorage.setItem('asiaray_tasks', JSON.stringify(tasks));
    localStorage.setItem('asiaray_logs', JSON.stringify(logs));
    localStorage.setItem('asiaray_team', JSON.stringify(team));
  }, [isLoggedIn, user, stats, tasks, logs, team]);


  // Sync session state with Supabase Auth state changes
  useEffect(() => {
    let wasLoggedIn = localStorage.getItem('asiaray_logged') === 'true';
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('onAuthStateChange:', event, session);
      if (session) {
        setIsLoggedIn(true);
        localStorage.setItem('asiaray_logged', 'true');
        wasLoggedIn = true;
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem('asiaray_logged');
        if (wasLoggedIn) {
          window.dispatchEvent(new Event('force-logout'));
        }
        wasLoggedIn = false;
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load real-time financial stats from Database via Gateway (OP: 102)
  const fetchFinancialStats = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const resp = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          op: 102,
          data: {}
        })
      });

      if (resp.ok) {
        const resData = await resp.json();
        if (resData?.success && resData?.result) {
          const rawResult = resData.result;
          const r = Array.isArray(rawResult) ? rawResult[0] : rawResult;
          if (r) {
            const parseNum = (val: any, fallback: number = 0) => {
              const n = Number(val);
              return isNaN(n) ? fallback : n;
            };
            setStats(prev => ({
              ...prev,
              balance: r.balance !== undefined && r.balance !== null ? parseNum(r.balance, prev.balance) : prev.balance,
              incomeYesterday: parseNum(r.income_yesterday, 0),
              incomeToday: parseNum(r.income_today, 0),
              incomeThisWeek: parseNum(r.income_this_week, 0),
              incomeThisMonth: parseNum(r.income_this_month, 0),
              incomeLastMonth: parseNum(r.income_last_month, 0),
              incomeTotal: parseNum(r.income_total, 0),
              completedTodayCount: parseNum(r.completed_today_count, 0),
              unfinishedCount: parseNum(r.unfinished_count, 0)
            }));
          }
        }
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas financeiras:', err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    refreshUserProfile();
    fetchFinancialStats();
    
    // Opcional: Atualiza a cada 30 segundos como fallback secundário
    const interval = setInterval(() => {
      refreshUserProfile();
      fetchFinancialStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Setup Supabase Realtime subscriptions for profiles and tarefas_diarias
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const channel = supabase
      .channel(`realtime_db_changes_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Realtime profile change:', payload);
          refreshUserProfile();
          fetchFinancialStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tarefas_diarias',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Realtime tarefa change:', payload);
          refreshUserProfile();
          fetchFinancialStats();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    const handleForceLogout = () => {
      setIsSessionExpired(true);
      // Immediately wipe sensitive bank data and session indicators
      setUser(prev => ({
        ...prev,
        bankName: '',
        bankAccount: '',
        holderName: ''
      }));
      localStorage.removeItem('asiaray_user');
      localStorage.removeItem('asiaray_logged');
    };
    window.addEventListener('force-logout', handleForceLogout);
    return () => window.removeEventListener('force-logout', handleForceLogout);
  }, []);

  // Auth: Login real via Supabase Auth
  const login = async (phone: string, pin: string): Promise<boolean> => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const email = `${cleanPhone}@user.com`;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pin
      });
      if (error) throw new Error(error.message);
      if (!data.session || !data.user) throw new Error('Sessão não criada');

      // Buscar perfil real do utilizador via gateway OP 101
      const token = data.session.access_token;
      let profileData: any = null;
      try {
        const resp = await fetch(GATEWAY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ op: 101, data: {} })
        });
        if (resp.ok) {
          const res = await resp.json();
          if (res?.success) {
            const raw = res.result;
            profileData = Array.isArray(raw) ? raw[0] : raw;
          }
        }
      } catch (_) { /* perfil será carregado depois */ }

      const loggedUser: UserProfile = {
        phone: profileData?.phone || cleanPhone,
        id: profileData?.id || data.user.id,
        level: profileData?.level || 'WS0',
        creditScore: 85,
        inviteCode: profileData?.invite_code || '',
        bankName: profileData?.bank_name || '',
        bankAccount: profileData?.bank_account || '',
        holderName: profileData?.holder_name || '',
        paymentPin: profileData?.payment_pin ?? undefined,
        idChaveUnica: profileData?.id_chave_unica ?? undefined
      };
      setUser(loggedUser);
      // Set real balances from profile
      if (profileData) {
        const parseNum = (val: any, fallback: number = 0) => {
          const n = Number(val);
          return isNaN(n) ? fallback : n;
        };
        setStats(prev => ({
          ...prev,
          balance: profileData.balance !== undefined && profileData.balance !== null ? parseNum(profileData.balance, prev.balance) : prev.balance,
          balanceUSDT: profileData.balance_correte_usdt20 !== undefined && profileData.balance_correte_usdt20 !== null ? parseNum(profileData.balance_correte_usdt20, prev.balanceUSDT) : prev.balanceUSDT,
        }));
      }
      setIsLoggedIn(true);
      return true;
    } catch (e) {
      addToast((e as Error).message, 'error');
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  // Registro real via Supabase Auth — triggers do banco fazem o resto
  const registerUser = async (phone: string, pin: string, inviteCode: string): Promise<void> => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const email = `${cleanPhone}@user.com`;

    // 1. Cadastro no Supabase Auth (signUp)
    // Os triggers do banco (handle_new_user, credita_bonus_cadastro_limitado, generate_invite_code)
    // são acionados automaticamente após a criação em auth.users
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pin,
      options: {
        data: {
          phone: cleanPhone,
          referred_by: inviteCode || ''
        }
      }
    });

    if (error) {
      addToast(error.message, 'error');
      throw new Error(error.message);
    }

    if (!data.user) {
      addToast('Erro ao criar conta.', 'error');
      throw new Error('Erro ao criar conta.');
    }

    // 2. Se retornou sessão, o utilizador já está autenticado
    if (data.session) {
      // Buscar perfil criado pelo trigger via gateway OP 101
      const token = data.session.access_token;
      let profileData: any = null;
      try {
        // Pequeno delay para dar tempo ao trigger executar
        await new Promise(resolve => setTimeout(resolve, 1500));
        const resp = await fetch(GATEWAY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ op: 101, data: {} })
        });
        if (resp.ok) {
          const res = await resp.json();
          if (res?.success) {
            const raw = res.result;
            profileData = Array.isArray(raw) ? raw[0] : raw;
          }
        }
      } catch (_) { /* perfil será carregado depois */ }

      const newUser: UserProfile = {
        phone: profileData?.phone || cleanPhone,
        id: profileData?.id || data.user.id,
        level: profileData?.level || 'WS0',
        creditScore: 80,
        inviteCode: profileData?.invite_code || '',
        bankName: profileData?.bank_name || '',
        bankAccount: profileData?.bank_account || '',
        holderName: profileData?.holder_name || '',
        paymentPin: profileData?.payment_pin ?? undefined,
        idChaveUnica: profileData?.id_chave_unica ?? undefined
      };
      setUser(newUser);
      // Set real balances from profile
      if (profileData) {
        const parseNum = (val: any, fallback: number = 0) => {
          const n = Number(val);
          return isNaN(n) ? fallback : n;
        };
        setStats(prev => ({
          ...prev,
          balance: profileData.balance !== undefined && profileData.balance !== null ? parseNum(profileData.balance, prev.balance) : prev.balance,
          balanceUSDT: profileData.balance_correte_usdt20 !== undefined && profileData.balance_correte_usdt20 !== null ? parseNum(profileData.balance_correte_usdt20, prev.balanceUSDT) : prev.balanceUSDT,
        }));
      }
      setIsLoggedIn(true);
    }
  };

  // Claim (Join) task
  const claimTask = (taskId: string): boolean => {
    // Check if user reached maximum tasks allowed for their level today
    const maxTasksByLevel: Record<string, number> = {
      WS0: 3,
      WS1: 5,
      WS2: 10,
      WS3: 15,
      WS4: 20,
      WS5: 30
    };
    
    const allowed = maxTasksByLevel[user.level] || 3;
    const currentClaimedAndDoneToday = tasks.filter(t => 
      t.status !== 'disponivel' && 
      (t.requiredLevel === user.level || t.id.startsWith(`t${user.level.slice(-1)}`))
    ).length;

    const activeCount = tasks.filter(t => t.status === 'andamento' || t.status === 'revisao').length;
    if (activeCount >= allowed) {
      return false; // Limit exceeded for concurrent tasks
    }

    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.status === 'disponivel') {
        return { ...t, status: 'andamento', joinedAt: new Date().toISOString() };
      }
      return t;
    }));

    setStats(prev => ({
      ...prev,
      unfinishedCount: prev.unfinishedCount + 1
    }));

    // Auto-approve task after 7 seconds for interactive simulation
    setTimeout(() => {
      approveTask(taskId);
    }, 7000);

    return true;
  };

  // Support direct approval
  const approveTask = (taskId: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task || task.status !== 'revisao') return prev;

      // Reward points!
      const rewardVal = task.reward;
      
      // Update stats inside transaction
      setStats(currentStats => {
        const newBalance = currentStats.balance + rewardVal;
        const newToday = currentStats.incomeToday + rewardVal;
        const newWeek = currentStats.incomeThisWeek + rewardVal;
        const newMonth = currentStats.incomeThisMonth + rewardVal;
        const newTotal = currentStats.incomeTotal + rewardVal;
        const completedToday = currentStats.completedTodayCount + 1;
        const unfinished = Math.max(0, currentStats.unfinishedCount - 1);

        return {
          ...currentStats,
          balance: newBalance,
          incomeToday: newToday,
          incomeThisWeek: newWeek,
          incomeThisMonth: newMonth,
          incomeTotal: newTotal,
          completedTodayCount: completedToday,
          unfinishedCount: unfinished
        };
      });

      // Add a reward log
      const newLog: LogRecord = {
        id: 'rwd_' + String(Math.floor(10000 + Math.random() * 900000)),
        type: 'recompensa',
        amount: rewardVal,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'aprovado',
        details: `Recompensa ${task.type} (${task.title})`
      };
      setLogs(prevLogs => [newLog, ...prevLogs]);

      // Move task to 'concluido'
      return prev.map(t => t.id === taskId ? { ...t, status: 'concluido' } : t);
    });
  };

  const approvePendingTasks = () => {
    const pending = tasks.filter(t => t.status === 'revisao');
    pending.forEach(t => {
      approveTask(t.id);
    });
  };

  // Recharge trigger (mock)
  const addRecharge = (amount: number, txId: string, proofFileName?: string) => {
    const proofDetails = proofFileName ? `${txId} • ${proofFileName}` : txId || 'Depósito Bancário';
    const newLog: LogRecord = {
      id: 'rec_' + String(Math.floor(10000 + Math.random() * 90000)),
      type: 'recarga',
      amount: amount,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'aprovado', // Immediately approve for simulation speed
      details: proofDetails
    };

    setLogs(prev => [newLog, ...prev]);
    setStats(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
  };

  // Withdraw simulation
  const addWithdrawal = (amount: number) => {
    if (stats.balance < amount) {
      return { success: false, error: 'Saldo de Kwanza (KZ) insuficiente para esta retirada.' };
    }
    if (amount < 2000) {
      return { success: false, error: 'O limite mínimo para retirada é de KZ 2.000,00.' };
    }
    if (!user.bankAccount) {
      return { success: false, error: 'Por favor, registre sua informação bancária primeiro em "Banco associado" para poder retirar.' };
    }

    const newLog: LogRecord = {
      id: 'ret_' + String(Math.floor(10000 + Math.random() * 90000)),
      type: 'retirada',
      amount: amount,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pendente', // Leaves it pending so it looks realistic!
      details: `Banco: ${user.bankName} - IBAN: ${user.bankAccount}`
    };

    setLogs(prev => [newLog, ...prev]);
    setStats(prev => ({
      ...prev,
      balance: prev.balance - amount
    }));

    // Auto-approve after 30 seconds for nice visuals
    setTimeout(() => {
      setLogs(currLogs => currLogs.map(l => {
        if (l.id === newLog.id) {
          return { ...l, status: 'aprovado', details: l.details + ' (Processado e pago)' };
        }
        return l;
      }));
    }, 30000);

    return { success: true };
  };

  // Convert USDT balance to KZ via Gateway OP 310 calling transfer_reproducao_to_balance
  const convertUsdToKz = async (usdAmount: number): Promise<{ success: boolean; message: string }> => {
    try {
      const token = await getAccessToken();
      if (!token) {
        return { success: false, message: 'Sessão expirada. Faça login novamente.' };
      }

      const resp = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          op: 310,
          data: { amount_usd: usdAmount }
        })
      });

      if (resp.ok) {
        const resData = await resp.json();
        if (resData?.success && resData?.result) {
          const r = resData.result;
          if (r.success) {
            // Refresh stats and profile in real-time
            await refreshUserProfile();
            await fetchFinancialStats();
          }
          return { success: r.success, message: r.message };
        } else {
          return { success: false, message: resData?.error || 'Erro ao converter saldo.' };
        }
      } else {
        const errData = await resp.json().catch(() => ({}));
        return { success: false, message: errData?.error || 'Falha na comunicação com o servidor.' };
      }
    } catch (err) {
      console.error('Erro na conversão:', err);
      return { success: false, message: 'Erro de rede. Tente novamente mais tarde.' };
    }
  };

  // Update bank
  // Atualiza banco via gateway OP 412 (add_bank_account)
  const updateBankInfo = async (bankName: string, bankAccount: string, holderName: string): Promise<{success: boolean; message: string}> => {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    const resp = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        op: 412,
        data: {
          bank_name: bankName,
          holder_name: holderName,
          iban: bankAccount
        }
      })
    });
    const resData = await resp.json();
    if (!resp.ok || !resData.success) {
      throw new Error(resData.error || 'Erro desconhecido');
    }
    // Só atualizar estado local após confirmação do backend
    setUser(prev => ({
      ...prev,
      bankName,
      bankAccount,
      holderName
    }));
    const resultMsg = resData.result?.message || 'Operação concluída.';
    return { success: true, message: resultMsg };
  };
  // Fetch withdrawal records from backend (gateway op 311)
  const fetchWithdrawalRecords = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return [];
      const resp = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ op: 311, data: {} })
      });
      if (resp.ok) {
        const res = await resp.json();
        if (res?.success === false) {
           alert("Gateway Error (Stats): " + JSON.stringify(res.raw_error || res.error));
        }
        if (res?.success && res?.result) {
          return Array.isArray(res.result) ? res.result : [res.result];
        }
      }
    } catch (e) {
      console.error('Failed to fetch withdrawal records', e);
    }
    return [];
  };

  // Refresh user profile from backend (gateway op 101 → get_user_profile)
  // Returns: id, phone, balance, invite_code, balance_correte
  const refreshUserProfile = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const resp = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ op: 101, data: {} })
      });
      const res = await resp.json();
      if (!resp.ok || res?.success === false) {
         alert("Gateway Error (UserProfile): " + JSON.stringify(res?.raw_error || res?.error || "Unknown Error"));
      }
      if (res?.success && res?.result) {
        // result can be an array (RETURNS TABLE) or single object
        const p = Array.isArray(res.result) ? res.result[0] : res.result;
        if (!p) return;

        // Update user profile fields
        setUser(prev => ({
          ...prev,
          phone: p.phone || prev.phone,
          id: p.id || prev.id,
          inviteCode: p.invite_code || prev.inviteCode,
          idChaveUnica: p.id_chave_unica ?? prev.idChaveUnica,
          bankName: p.bank_name || prev.bankName,
          bankAccount: p.bank_account || prev.bankAccount,
          holderName: p.holder_name || prev.holderName,
          level: p.level || prev.level
        }));

        // Update financial stats with real balance from profiles.balance
        // and USDT balance from tarefas_diarias.balance_correte
        const parseNum = (val: any, fallback: number = 0) => {
          const n = Number(val);
          return isNaN(n) ? fallback : n;
        };
        setStats(prev => ({
          ...prev,
          balance: p.balance !== undefined && p.balance !== null ? parseNum(p.balance, prev.balance) : prev.balance,
          balanceUSDT: p.balance_correte_usdt20 !== undefined && p.balance_correte_usdt20 !== null ? parseNum(p.balance_correte_usdt20, prev.balanceUSDT) : prev.balanceUSDT,
        }));
      }
    } catch (e) {
      console.error('Failed to refresh user profile', e);
    }
  };

  // Upgrade membership level
  const upgradeMembership = async (level: string, cost: number, productId?: string): Promise<boolean> => {
    if (productId) {
      try {
        const token = await getAccessToken();
        if (!token) return false;
        
        const resp = await fetch(GATEWAY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            op: 511,
            data: { product_id: productId }
          })
        });
        
        if (resp.ok) {
          const res = await resp.json();
          if (res?.success && res.result?.success) {
            addToast(res.result?.message || 'Ativação realizada com sucesso!', 'success');
            await refreshUserProfile();
            return true;
          } else {
            addToast(res?.error || res?.result?.message || 'Falha na ativação', 'error');
            return false;
          }
        }
      } catch (err) {
        console.error('Erro ao ativar VIP no backend:', err);
        addToast('Erro ao processar ativação.', 'error');
        return false;
      }
    }

    if (stats.balance < cost) {
      return false;
    }

    setUser(prev => ({
      ...prev,
      level: level
    }));

    setStats(prev => ({
      ...prev,
      balance: prev.balance - cost
    }));

    const newLog: LogRecord = {
      id: 'upg_' + String(Math.floor(10000 + Math.random() * 90000)),
      type: 'retirada',
      amount: cost,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'aprovado',
      details: `Upgrade de Membro para nível ${level}`
    };

    setLogs(prev => [newLog, ...prev]);
    return true;
  };

  // Increase credit
  const increaseCreditScore = (points: number) => {
    setUser(prev => ({
      ...prev,
      creditScore: Math.min(100, prev.creditScore + points)
    }));
  };

  const updateUserPaymentPin = (newPin?: string) => {
    setUser(prev => ({
      ...prev,
      paymentPin: newPin
    }));
  };

  const resetAll = () => {
    setIsLoggedIn(true);
    setUser({
      phone: '244922342885',
      id: '13793',
      level: 'WS2',
      creditScore: 95,
      inviteCode: '931242',
      bankName: 'Banco BAI',
      bankAccount: 'AO06 0040 0000 9312 4224 1018 3',
      holderName: 'Mateus Santos',
      paymentPin: undefined
    });
    setStats(INITIAL_STATS);
    setTasks(INITIAL_TASKS.map(t => ({ ...t, status: 'disponivel' })));
    setLogs(INITIAL_LOGS);
    setTeam(INITIAL_REFERRALS);
  };

  return <AppContext.Provider value={{ isLoggedIn, user, stats, tasks, logs, team, login, logout, registerUser, refreshUserProfile, claimTask, approvePendingTasks, addRecharge, addWithdrawal, convertUsdToKz, updateBankInfo, upgradeMembership, increaseCreditScore, updateUserPaymentPin, resetAll, fetchWithdrawalRecords, showAlert, showConfirm, alertConfig, closeAlert, toasts, addToast, removeToast, isFullScreenActive, setIsFullScreenActive, isLoading, loadingMessage, showLoading, hideLoading, isSessionExpired, setIsSessionExpired }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
