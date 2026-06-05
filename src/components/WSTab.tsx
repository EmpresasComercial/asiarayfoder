import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Crown, Sparkles, ShieldCheck, Check, ArrowUpRight, User } from 'lucide-react';
import { motion } from 'motion/react';
import { GATEWAY_URL, getAccessToken } from '../lib/supabase';

// Custom high-fidelity credit card SVG resembling a standard blue bank card with golden chip
const BlueCardIcon: React.FC = () => (
  <svg className="w-[30px] h-[21px] rounded-[3px] shadow-xs select-none shrink-0" viewBox="0 0 30 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="21" rx="2.5" fill="#1b4d89" />
    <path d="M2 13C8 16 14 10.5 17 12.5C21 14.5 25.5 17 28 15.5" stroke="#4a86cf" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M1 16C10 20 18 15 29 17.5" stroke="#71a9ee" strokeWidth="0.6" strokeLinecap="round" />
    <rect x="3.5" y="6.5" width="5" height="4" rx="0.5" fill="#fbbf24" />
    <line x1="6" y1="6.5" x2="6" y2="10.5" stroke="#92400e" strokeWidth="0.4" />
    <line x1="3.5" y1="8.5" x2="8.5" y2="8.5" stroke="#92400e" strokeWidth="0.4" />
    <circle cx="23" cy="14" r="2" fill="white" fillOpacity="0.4" />
    <circle cx="25" cy="14" r="2" fill="white" fillOpacity="0.2" />
  </svg>
);

// Custom high-fidelity Tether/USDT gold coin icon resembling the cryptocurrency symbol from the screenshot
const GoldCoinIcon: React.FC = () => (
  <svg className="w-[26px] h-[26px] select-none shrink-0" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="13" r="11.5" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2.2" />
    <circle cx="13" cy="13" r="8.2" fill="#fef08a" stroke="#d97706" strokeWidth="1.2" />
    <text x="13.2" y="16.5" fill="#a16207" fontSize="10.5" fontWeight="950" textAnchor="middle" fontFamily="sans-serif">B</text>
    <line x1="11.5" y1="3.5" x2="11.5" y2="5" stroke="#d97706" strokeWidth="0.8" />
    <line x1="14.5" y1="3.5" x2="14.5" y2="5" stroke="#d97706" strokeWidth="0.8" />
  </svg>
);

export const WSTab: React.FC = () => {
  const { user, stats, upgradeMembership, addRecharge, setIsFullScreenActive, isSessionExpired } = useApp();

  const [selectedTierForPayment, setSelectedTierForPayment] = useState<any | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [uploadProofFile, setUploadProofFile] = useState<string>('');
  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const [msgLength, setMsgLength] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // States for USDT Manual Transfer (matching "Cobrança da moeda digital" page precisely!)
  const [usdtReqAmount, setUsdtReqAmount] = useState<string>('58.10');
  const [usdtFileName, setUsdtFileName] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    if (isSessionExpired) return; // Block data fetching when session expired

    const loadProducts = async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const resp = await fetch(GATEWAY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ op: 512, data: {} })
        });

        // Intercept 401/force_logout from gateway
        if (resp.status === 401) {
          const errData = await resp.json().catch(() => ({}));
          const msg = errData?.error || 'Sessão inválida. Faça login novamente.';
          window.dispatchEvent(new CustomEvent('force-logout', { detail: { message: msg } }));
          return;
        }

        if (resp.ok) {
          const res = await resp.json();
          if (res?.success && Array.isArray(res.result)) {
            setDbProducts(res.result);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    };
    loadProducts();
  }, [isSessionExpired]);

  React.useEffect(() => {
    if (selectedTierForPayment) {
      setIsFullScreenActive(true);
    } else {
      setIsFullScreenActive(false);
    }
    return () => {
      setIsFullScreenActive(false);
    };
  }, [selectedTierForPayment, setIsFullScreenActive]);

  const visualMap: Record<string, { dailyTasks: number; bgStyle: string }> = {
    WS0: { dailyTasks: 1, bgStyle: 'linear-gradient(135deg, #a1a1aa 0%, #e4e4e7 15%, #a1a1aa 30%, #d4d4d8 45%, #f4f4f5 60%, #a1a1aa 75%, #d4d4d8 90%, #e4e4e7 100%)' },
    WS1: { dailyTasks: 2, bgStyle: 'linear-gradient(135deg, #3b608c 0%, #c0d1e5 15%, #3b608c 30%, #517ca8 45%, #e1ecf7 60%, #3b608c 75%, #517ca8 90%, #5d8dc2 100%)' },
    WS2: { dailyTasks: 4, bgStyle: 'linear-gradient(135deg, #5c6773 0%, #d1dbe5 15%, #5c6773 30%, #7d8b9c 45%, #eef3f7 60%, #5c6773 75%, #7d8b9c 90%, #8b99a6 100%)' },
    WS3: { dailyTasks: 6, bgStyle: 'linear-gradient(135deg, #4c2254 0%, #dab5dc 15%, #4c2254 30%, #7b4382 45%, #f6eff7 60%, #4c2254 75%, #7b4382 90%, #8c5294 100%)' },
    WS4: { dailyTasks: 10, bgStyle: 'linear-gradient(135deg, #946916 0%, #f6e3bd 15%, #946916 30%, #ca9b3b 45%, #fffbf2 60%, #946916 75%, #ca9b3b 90%, #dbac4d 100%)' },
    WS5: { dailyTasks: 20, bgStyle: 'linear-gradient(135deg, #a82424 0%, #fcdcdd 15%, #a82424 30%, #d44848 45%, #fff5f5 60%, #a82424 75%, #d44848 90%, #e05e5e 100%)' }
  };

  const defaultStyle = 'linear-gradient(135deg, #5c6773 0%, #d1dbe5 15%, #5c6773 30%, #7d8b9c 45%, #eef3f7 60%, #5c6773 75%, #7d8b9c 90%, #8b99a6 100%)';

  const tiers = dbProducts.map(dbP => {
    const vis = visualMap[dbP.name] || { dailyTasks: 1, bgStyle: defaultStyle };
    return {
      level: dbP.name,
      dbId: dbP.id,
      price: Number(dbP.price),
      dailyTasks: Number(dbP.tarefa_por_dia) || vis.dailyTasks,
      payPerTask: Number(dbP.daily_income),
      bgStyle: vis.bgStyle
    };
  }).sort((a, b) => a.price - b.price);

  // Get current user's VIP config details
  const currentTier = tiers.find(t => t.level === user.level) || tiers[0] || { dailyTasks: 0 };

  // Render navigation to Payment Subviews
  if (selectedTierForPayment) {
    const usdtAmount = (selectedTierForPayment.price / 805).toFixed(1);

    if (selectedMethod) {
      const ibanMap: Record<string, string> = {
        'BIC': 'AO06 0005 0622 9312 4210 1785 4',
        'BFA': 'AO06 0006 1145 9312 4224 5013 7',
        'Atlântico': 'AO06 0055 3514 9312 4211 4058 9',
        'BCI': 'AO06 0009 0081 9312 4235 1251 2',
        'BAI': 'AO06 0005 0000 1579 1775 1010 5', // precision-matched with second screenshot
        'USDT-TRC20': 'TQdoJo3s13AtTPY1NZsnxrnLdLWFSCqT1' // precision-matched with first screenshot
      };

      const currentAddress = ibanMap[selectedMethod] || ibanMap['BAI'];

      const handleConfirmPayment = async () => {
        if (!usdtFileName) {
          alert("Por favor, selecione e envie o comprovativo clicando no botão 'Credenciais'.");
          return;
        }

        if (selectedMethod === 'USDT-TRC20') {
          const amt = parseFloat(usdtReqAmount);
          if (isNaN(amt) || amt <= 0) {
            alert("Por favor, introduza um requisito (montante USDT) válido.");
            return;
          }

          const amtKwanza = Math.round(amt * 430);
          addRecharge(amtKwanza, `Cobrança Moeda Digital USDT TRC20 [Pedido: ${orderId}]`);
          const success = await upgradeMembership(selectedTierForPayment.level, selectedTierForPayment.price, selectedTierForPayment.dbId);

          if (success) {
            alert(`Sucesso! Recarga de ${amt} USDT (${amtKwanza.toLocaleString('pt-AO')} KZ) submetida. Conta atualizada para ${selectedTierForPayment.level}.`);
            setSelectedTierForPayment(null);
            setSelectedMethod(null);
            setUsdtFileName('');
          } else {
            alert('Falha na ativação: Verifique seu saldo ou contate o suporte.');
          }
        } else {
          addRecharge(selectedTierForPayment.price, `Recarga ${selectedTierForPayment.level} via ${selectedMethod} [Pedido: ${orderId}]`);
          const success = await upgradeMembership(selectedTierForPayment.level, selectedTierForPayment.price, selectedTierForPayment.dbId);

          if (success) {
            alert(`Sucesso: Pagamento via ${selectedMethod} registado. Conta estendida para ${selectedTierForPayment.level}.`);
            setSelectedTierForPayment(null);
            setSelectedMethod(null);
            setUsdtFileName('');
          } else {
            alert('Falha na ativação: Verifique seu saldo ou contate o suporte.');
          }
        }
      };

      const isCrypto = selectedMethod === 'USDT-TRC20';
      const pageTitle = 'Detalhes de Gateway';
      const tipoValue = isCrypto ? 'USDT' : 'BANCO';
      const walletLabel = isCrypto ? 'Número da carteira' : 'Número do IBAN';
      const requisitoValue = isCrypto ? usdtReqAmount : `${selectedTierForPayment.price.toLocaleString('pt-AO')} KZ`;

      return (
        <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans animate-fadeIn">
          {/* Header matches identical text from screenshot */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 select-none" style={{ height: '48px' }}>
            <button 
              onClick={() => setSelectedMethod(null)} 
              className="text-neutral-500 hover:text-neutral-800 select-none cursor-pointer focus:outline-none flex items-center p-1"
              id="payment-details-back-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-[15px] font-bold text-neutral-850 tracking-tight text-center flex-1 translate-x-[-10px]">{pageTitle}</span>
            <div className="w-6"></div>
          </div>

          <div className="flex-1 p-3 space-y-4 bg-white overflow-y-auto">
            
            {/* Box 1: Manual Transfer Box Resembling Screenshot #1 */}
            <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
              <div className="bg-white py-2.5 px-2 border-b border-gray-200 text-center text-[#e1251b] font-bold text-[12px]">
                Por favor, transfira fundos manualmente para a seguinte conta
              </div>
              
              {/* Tipo */}
              <div className="border-b border-gray-200">
                <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Tipo</div>
                <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] font-mono border-t border-gray-200">
                  {tipoValue}
                </div>
              </div>

              {/* Nome do banco */}
              <div className="border-b border-gray-200">
                <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Nome do banco</div>
                <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] font-mono border-t border-gray-200">
                  {selectedMethod}
                </div>
              </div>

              {/* conta bancária */}
              <div className="border-b border-gray-200">
                <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">conta bancária</div>
                <div className="bg-[#f5f5f5] text-gray-600 px-3 py-1.5 text-[11px] font-mono border-t border-gray-200 break-all select-all">
                  {currentAddress}
                </div>
              </div>

              {/* Número da carteira / IBAN */}
              <div className="border-b border-gray-200">
                <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">{walletLabel}</div>
                <div className="bg-[#f5f5f5] border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 text-gray-600 px-3 py-1.5 text-[11px] font-mono break-all select-all">
                    {currentAddress}
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentAddress);
                      alert("Copiado com sucesso!");
                    }}
                    className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white px-4 py-1.5 text-[11px] font-bold cursor-pointer transition-all active:scale-95 shrink-0 select-none border-l border-gray-200"
                  >
                    cópia
                  </button>
                </div>
              </div>
            </div>

            {/* Box 2: Query Info Box Resembling Screenshot #1 */}
            <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
              <div className="bg-white py-2.5 px-2 border-b border-gray-200 text-center text-[#e1251b] font-bold text-[12px]">
                Informação sobre a procura
              </div>

              {/* Número do pedido */}
              <div className="border-b border-gray-200">
                <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Número do pedido</div>
                <div className="bg-[#f5f5f5] text-gray-600 px-3 py-1.5 text-[11px] font-mono border-t border-gray-200 select-all">
                  {orderId}
                </div>
              </div>

              {/* número da conta */}
              <div className="border-b border-gray-200">
                <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">número da conta</div>
                <div className="bg-[#f5f5f5] text-gray-600 px-3 py-1.5 text-[11px] font-mono border-t border-gray-200 select-all font-bold">
                  {user.phone || '244922342885'}
                </div>
              </div>

              {/* requisito */}
              <div>
                <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">requisito</div>
                <div className="bg-[#f5f5f5] text-gray-600 px-3 py-1.5 text-[11px] font-mono border-t border-gray-200 select-all">
                  {requisitoValue}
                </div>
              </div>
            </div>

            {/* Box 3: Form interactive bottom buttons (Credenciais & Confirmar) */}
            <div className="flex flex-col items-center justify-center pt-2 gap-1 text-center select-none">
              <div className="flex justify-center items-center gap-3 w-full">
                {/* Native Upload Button labeled 'Credenciais' */}
                <label className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white font-bold text-[12px] py-1.5 px-4 rounded-sm cursor-pointer transition-colors flex items-center gap-1.5">
                  {/* Cloud icon */}
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <span>Credenciais</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUsdtFileName(e.target.files[0].name);
                      }
                    }} 
                    className="hidden" 
                  />
                </label>

                {/* Confirmar Button */}
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white font-bold text-[12px] py-1.5 px-6 rounded-sm cursor-pointer transition-colors"
                >
                  Confirmar
                </button>
              </div>
              
              {/* File status label directly underneath matching Screenshot */}
              <div className="text-[10px] text-neutral-500 font-sans mt-0.5">
                {usdtFileName ? (
                  <span className="text-[#3b82f6] font-bold">{usdtFileName}</span>
                ) : (
                  "Nenhum arquivo escolhido"
                )}
              </div>
            </div>

          </div>
        </div>
      );
    }

    // Payment Methods Selection list directly following Image 1!
    const methods = [
      { name: 'BIC', type: 'bank' },
      { name: 'BFA', type: 'bank' },
      { name: 'Atlântico', type: 'bank' },
      { name: 'BCI', type: 'bank' },
      { name: 'BAI', type: 'bank' },
      { name: 'USDT-TRC20', type: 'crypto' }
    ];

    return (
      <div className="bg-white min-h-screen flex flex-col font-sans animate-fadeIn">
        {/* Top Header Bar */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 select-none" style={{ height: '54px' }}>
          <button 
            onClick={() => setSelectedTierForPayment(null)} 
            className="text-neutral-500 hover:text-neutral-800 select-none cursor-pointer focus:outline-none flex items-center p-1"
            id="payment-back-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span className="text-[17px] font-semibold text-neutral-800 tracking-wide translate-x-[-11px] select-none">Métodos pagamentos</span>
          
          <div></div>
        </div>

        {/* Purple prompt label from Image */}
        <div className="px-5 pt-7 pb-3.5 text-center select-none">
          <h2 className="text-[#6d28d9] font-semibold text-[15px] tracking-wide leading-snug">
            Seleccione por favor o método de pagamento
          </h2>
        </div>

        {/* High contrast table list rows */}
        <div className="flex-1 overflow-y-auto" id="payment-methods-list">
          {methods.map((method, idx) => (
            <div 
              key={method.name}
              onClick={() => setSelectedMethod(method.name)}
              className="flex items-center justify-between px-5 py-4.5 border-b border-slate-100 hover:bg-neutral-50/55 cursor-pointer active:scale-[0.99] transition-all"
              id={`payment-method-row-${idx}`}
            >
              {/* Card visual and label */}
              <div className="flex items-center gap-4 select-none">
                {method.type === 'crypto' ? (
                  <GoldCoinIcon />
                ) : (
                  <BlueCardIcon />
                )}
                <span className="text-[14px] font-semibold text-stone-700 tracking-wide">{method.name}</span>
              </div>

              {/* Arrow navigation indicators with USDT converter aligned */}
              <div className="flex items-center select-none">
                <span className="text-[12.5px] font-semibold text-neutral-350 pr-1 select-none tracking-tight">
                  &gt;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle standard level clicks -> now sets selected tier
  const handleUpgradeClick = (tier: any) => {
    const isActive = user.level === tier.level;
    const levelIndex = (l: string) => parseInt(l.slice(-1) || '0');
    const isEligible = levelIndex(tier.level) > levelIndex(user.level);

    if (isActive) {
      alert('Aviso: Nível de membro já se encontra ativo nesta conta.');
      return;
    }
    if (!isEligible) {
      alert('Erro de Atribuição: Esta conta possui graduação superior.');
      return;
    }

    // Set up high fidelity mock metadata matching first screenshot
    const now = new Date();
    const dateStr = now.getFullYear().toString() + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getDate().toString().padStart(2, '0');
    // Generates 8 random digits
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    setOrderId(`${dateStr}0508${randomDigits}`); // mimics "202308060508708470" nicely
    
    // Equivalent is price / 430 rounded to 2 decimal places (e.g., 58.10 or 348.80)
    const calculatedUSDT = (tier.price / 430).toFixed(2);
    setUsdtReqAmount(calculatedUSDT);
    setUsdtFileName('');

    // Opens the beautiful provided payment select screen
    setSelectedTierForPayment(tier);
    setSelectedMethod(null);
    setUploadProofFile('');
    setPaymentMessage('');
  };

  return (
    <div id="member-tab-container" className="pb-24 bg-neutral-50 min-h-screen">
      
      {/* 1. Yellow convex dome header background */}
      <div className="relative w-full h-[150px] bg-gradient-to-b from-[#ffea30] to-[#f5cb14] flex flex-col items-center">
        {/* The arched white wave clipping of the yellow area */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-neutral-50 rounded-t-[140%]" />
      </div>

      {/* 2. User dynamic avatar card layout overlapping the arch perfectly */}
      <div className="relative -mt-16 px-4 flex flex-col items-center text-center pb-6">
        {/* Grey Circular user silhouette avatar icon */}
        <div className="w-[52px] h-[52px] bg-neutral-300 border-[1.5px] border-white rounded-full flex items-center justify-center relative shadow-none">
          <User className="text-slate-800 h-7 w-7" />
        </div>

        {/* Dynamic metadata layout styled down to human labels */}
        <div className="mt-2 text-center text-neutral-800 space-y-0.5">
          <div className="text-[13px] font-black tracking-widest text-[#1c1c1a]/95 select-all uppercase">
            {user.level}
          </div>

          <div className="inline-block bg-[#2962ff]/10 text-[#0039cb] text-xs font-extrabold px-3 py-0.5 rounded-sm select-none">
            {currentTier.dailyTasks} tarefas por dia
          </div>

          <div className="text-[10px] text-neutral-500 font-medium select-all mt-1">
            Código de convite: {user.inviteCode || '931242'}
          </div>
        </div>

        {/* Motivational Headings block */}
        <div className="mt-5 select-none space-y-1">
          <h2 className="text-lg font-black text-neutral-800 tracking-wide">
            Junte-se a nós
          </h2>
          <p className="text-xs font-bold text-neutral-600 tracking-wider">
            Obter mais tarefas
          </p>
        </div>
      </div>

      {/* 3. Horizontal wavy reflection list of tiers (WS1, WS2, WS3...) */}
      <div className="px-4 space-y-4" id="member-tiers-list">
        {tiers.filter(t => t.level !== 'WS0').map((tier) => {
          const isActive = user.level === tier.level;
          const levelIndex = (l: string) => parseInt(l.slice(-1) || '0');
          const isEligible = levelIndex(tier.level) > levelIndex(user.level);
          
          return (
            <div 
              key={tier.level}
              onClick={() => handleUpgradeClick(tier)}
              style={{ backgroundImage: tier.bgStyle }}
              className="relative w-full h-[120px] rounded-[24px] border-2 border-white/95 overflow-hidden flex flex-col justify-between p-4 cursor-pointer text-slate-800 shadow-none transition-all active:scale-[0.98]"
              id={`tier-card-${tier.level}`}
            >
              {/* Top Row: VIP name and target price badge */}
              <div className="flex justify-between items-start">
                <div className="pl-2">
                  <h3 className="text-3xl font-display font-black tracking-widest leading-none">
                    {tier.level}
                  </h3>
                  <p className="text-[15px] font-bold tracking-wider mt-1 text-slate-800/95">
                    {tier.price.toLocaleString('pt-AO')} KZ
                  </p>
                </div>

                {/* Right side circle status radio/selector */}
                <div className="pr-1 pt-1">
                  <div className={`h-[28px] w-[28px] rounded-full border-[2.5px] border-white/60 flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-emerald-500 border-white' 
                      : !isEligible 
                        ? 'bg-neutral-800/40 border-neutral-400/55' 
                        : 'bg-black/30 border-white/40'
                  }`}>
                    {isActive ? (
                      <Check size={14} className="text-slate-800 stroke-[4px]" />
                    ) : !isEligible ? (
                      <ShieldCheck size={12} className="text-neutral-300" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-white/45" />
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Darkened translucent footer strip inside card */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/15 py-1.5 px-6 flex justify-between items-center text-[11px] font-bold select-none border-t border-white/5">
                <span className="tracking-wide">
                  {tier.dailyTasks} tarefas por dia
                </span>
                
                <span className="text-slate-800/80 font-mono text-[10px] font-normal">
                  Rendimento p/ tarefa: KZ {tier.payPerTask.toLocaleString('pt-AO')}
                </span>
              </div>
              
            </div>
          );
        })}
      </div>

    </div>
  );
};
