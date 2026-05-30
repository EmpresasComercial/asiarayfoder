import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, QrCode, ClipboardList, Wallet, Sparkles, Building, Landmark, Users, ArrowUpRight, ArrowDownLeft, ShieldCheck, Heart } from 'lucide-react';
import { LogRecord } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

// 1. General Modal Wrapper — Full Screen
const ModalBase: React.FC<ModalProps & { children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  const { setIsFullScreenActive } = useApp();
  React.useEffect(() => {
    if (isOpen) {
      setIsFullScreenActive(true);
    }
    return () => {
      setIsFullScreenActive(false);
    };
  }, [isOpen, setIsFullScreenActive]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[50] bg-[#f5f5f5] flex flex-col font-sans animate-fadeIn" id={`modal-container-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 select-none" style={{ height: '48px' }}>
        <button 
          id="modal-close-btn"
          onClick={onClose} 
          className="text-neutral-500 hover:text-neutral-800 select-none cursor-pointer focus:outline-none flex items-center p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-[15px] font-bold text-neutral-850 tracking-tight text-center flex-1 translate-x-[-10px]">{title}</span>
        <div className="w-6"></div>
      </div>
      {/* Dynamic scrollable body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 bg-white">
        {children}
      </div>
    </div>
  );
};

// 2. BANK MODAL ("Banco associado")
export const BankModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { user, updateBankInfo, showLoading, hideLoading, setIsFullScreenActive } = useApp();

  React.useEffect(() => {
    if (isOpen) {
      setIsFullScreenActive(true);
    }
    return () => {
      setIsFullScreenActive(false);
    };
  }, [isOpen, setIsFullScreenActive]);
  const [bank, setBank] = useState(user.bankName || 'BAI (Banco Angolano de Investimentos)');
  const [account, setAccount] = useState(user.bankAccount || '');
  const [holder, setHolder] = useState(user.holderName || '');

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!account || !holder) {
      alert('Erro: Titular e IBAN são campos obrigatórios.');
      return;
    }
    
    showLoading('A processar e gravar os dados bancários...');
    
    try {
      await updateBankInfo(bank, account, holder);
      hideLoading();
      alert('Sucesso: Conta bancária vinculada para levantamentos.');
      onClose();
    } catch (err) {
      hideLoading();
      alert('Erro: Não foi possível gravar os dados. Tente novamente.');
    }
  };

  const banksList = [
    'BAI (Banco Angolano de Investimentos)',
    'BFA (Banco de Fomento Angola)',
    'BIC (Banco BIC)',
    'BCI (Banco de Comércio e Indústria)',
    'Banco Sol',
    'Millennium Atlântico',
    'Standard Bank Angola'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[50] bg-[#f5f5f5] flex flex-col font-sans animate-fadeIn">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 select-none" style={{ height: '48px' }}>
        <button 
          onClick={onClose} 
          className="text-neutral-500 hover:text-neutral-800 select-none cursor-pointer focus:outline-none flex items-center p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-[15px] font-bold text-neutral-850 tracking-tight text-center flex-1 translate-x-[-10px]">Banco Associado</span>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-3 space-y-4 bg-white overflow-y-auto">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
            <div className="bg-white py-2.5 px-2 border-b border-gray-200 text-center text-[#e1251b] font-bold text-[12px]">
              Associe a sua Conta Bancária
            </div>

            {/* Instituição Bancária */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Instituição Bancária</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200">
                <select 
                  value={bank} 
                  onChange={(e) => setBank(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-sans font-bold"
                >
                  {banksList.map((b, idx) => (
                    <option key={idx} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* IBAN */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">IBAN de Angola (AO06...)</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200">
                <input 
                  type="text"
                  placeholder="AO06 0000 0000 0000 0000 0000 0"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-sans font-bold"
                />
              </div>
            </div>

            {/* Titular */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Nome Completo do Titular</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200">
                <input 
                  type="text"
                  placeholder="Como consta na conta bancária"
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-sans font-bold"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
            <div className="bg-white py-2.5 px-2 border-b border-gray-200 text-center text-[#e1251b] font-bold text-[12px]">
              Aviso de Segurança
            </div>
            <div>
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Instruções</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] font-sans border-t border-gray-200">
                Certifique-se de que os dados estão totalmente corretos. Pagamentos de tarefas aprovadas da Asiaray são encaminhados via compensação direta em até 24 horas úteis.
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-2 select-none">
            <button
              type="submit"
              className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white font-bold text-[12px] py-2 px-6 rounded-sm cursor-pointer transition-colors w-full text-center uppercase tracking-wide"
            >
              Gravar Cartão Bancário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Custom high-fidelity credit card SVG resembling a standard bank card with golden chip
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

// 3-A. CURRENCY CONVERTER MODAL (USD → KZ at fixed rate 805 KZ/USD)
export const CurrencyConverterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { stats, convertUsdToKz, setIsFullScreenActive } = useApp();
  const [usdInput, setUsdInput] = useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setIsFullScreenActive(true);
      setUsdInput('');
    }
    return () => setIsFullScreenActive(false);
  }, [isOpen, setIsFullScreenActive]);

  if (!isOpen) return null;

  const RATE = 805;
  const usdVal = parseFloat(usdInput) || 0;
  const kzPreview = usdVal * RATE;

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await convertUsdToKz(usdVal);
    alert(result.message);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[50] bg-[#f5f5f5] flex flex-col font-sans animate-fadeIn" id="currency-converter-modal">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 select-none" style={{ height: '48px' }}>
        <button
          id="converter-back-btn"
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-800 select-none cursor-pointer focus:outline-none flex items-center p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-[15px] font-bold text-neutral-850 tracking-tight text-center flex-1 translate-x-[-10px]">Carteira</span>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-3 space-y-4 bg-white overflow-y-auto">
        <form onSubmit={handleConvert} className="space-y-4">

          <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
            <div className="bg-white py-2.5 px-2 border-b border-gray-200 text-center text-[#e1251b] font-bold text-[12px]">
              Converter USD para Kwanza
            </div>

            {/* Saldo USDT */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Saldo disponível (USDT)</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200 font-bold font-mono">
                {stats.balanceUSDT.toFixed(3)} USD
              </div>
            </div>

            {/* Input USD */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Valor a converter (USD)</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200">
                <input
                  id="usd-convert-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={usdInput}
                  onChange={e => setUsdInput(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-sans font-bold"
                />
              </div>
            </div>

            {/* KZ Preview */}
            <div>
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Receberá em Kwanza (KZ)</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200 font-bold font-mono">
                {usdVal > 0 ? kzPreview.toLocaleString('pt-AO') : '0'} KZ
              </div>
            </div>
          </div>

          {/* Taxa info */}
          <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
            <div className="bg-white py-2.5 px-2 border-b border-gray-200 text-center text-[#e1251b] font-bold text-[12px]">
              Taxa de Intercâmbio
            </div>
            <div>
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Taxa fixa aplicada</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] font-sans border-t border-gray-200">
                1 USD = 805 KZ. A conversão é creditada imediatamente na sua Moeda de Ouro após confirmação.
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-2 select-none">
            <button
              id="converter-confirm-btn"
              type="submit"
              className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white font-bold text-[12px] py-2 px-6 rounded-sm cursor-pointer transition-colors w-full text-center uppercase tracking-wide"
            >
              Confirmar Conversão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. RECHARGE AND WITHDRAWAL MODAL ("Carteira" / Transações)
interface WalletModalProps extends ModalProps {
  initialTab?: 'recharge' | 'withdraw';
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, initialTab = 'recharge' }) => {
  const { stats, user, addRecharge, showLoading, hideLoading, setIsFullScreenActive } = useApp();

  React.useEffect(() => {
    if (isOpen) {
      setIsFullScreenActive(true);
    }
    return () => {
      setIsFullScreenActive(false);
    };
  }, [isOpen, setIsFullScreenActive]);
  
  const [rechargeStep, setRechargeStep] = useState<'amount' | 'method' | 'instructions'>('amount');
  const [rechargeAmt, setRechargeAmt] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<'BIC' | 'BFA' | 'Atlântico' | 'BCI' | 'BAI' | 'USDT-TRC20'>('BFA');
  const [comprovativo, setComprovativo] = useState<string>('');
  const [fileLabel, setFileLabel] = useState<string>('Nenhum arquivo escolhido');
  const [ibanCopied, setIbanCopied] = useState(false);
  const [usdtCopied, setUsdtCopied] = useState(false);

  const IBAN = 'A086 8886 1145 9312 4224 5813 7';
  const USDT_ADDR = 'TQdoJo3s13AtTPY1NZsnxrnLdLwJFSCqT1';

  const copyIBAN = () => { navigator.clipboard.writeText(IBAN); setIbanCopied(true); setTimeout(() => setIbanCopied(false), 2000); };
  const copyUSDT = () => { navigator.clipboard.writeText(USDT_ADDR); setUsdtCopied(true); setTimeout(() => setUsdtCopied(false), 2000); };

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    showLoading('A submeter comprovativo de recarga...');
    setTimeout(() => {
      addRecharge(rechargeAmt, `Depósito via ${selectedMethod}`);
      hideLoading();
      alert('Comprovativo submetido. A auditoria Asiaray irá validar.');
      setRechargeStep('amount');
      setRechargeAmt(0);
      onClose();
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f1f4f8] overflow-y-auto font-sans" id="wallet-fullscreen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center sticky top-0 z-10 select-none h-12">
        <button 
          onClick={() => {
            if (rechargeStep === 'instructions') setRechargeStep('method');
            else if (rechargeStep === 'method') setRechargeStep('amount');
            else onClose();
          }} 
          className="mr-3 text-slate-700 cursor-pointer focus:outline-none" 
          id="wallet-back-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-[15px] text-slate-800 tracking-tight text-center flex-1 translate-x-[-10px]">
          {rechargeStep === 'instructions' && selectedMethod === 'USDT-TRC20' ? 'Cobrança da moeda digital' : 'Recarregar'}
        </span>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full p-4 space-y-3 bg-[#f1f4f8]">
        <div className="space-y-3">
          {rechargeStep === 'amount' && (
            <div className="space-y-4">
              {/* Input box styled exactly like Bank linkage card */}
              <div className="border border-gray-200 bg-white rounded-sm overflow-hidden shadow-xs">
                <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Montante a Recarregar (KZ)</div>
                <div className="bg-[#f5f5f5] text-gray-700 px-3 py-2.5 text-[12px] border-t border-gray-200">
                  <input 
                    type="number" 
                    placeholder="Introduza o valor do recarga"
                    value={rechargeAmt === 0 ? '' : rechargeAmt}
                    onChange={(e) => setRechargeAmt(Number(e.target.value))}
                    className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-sans font-bold placeholder-neutral-400"
                  />
                </div>
              </div>

              {/* Suggested values */}
              <div className="grid grid-cols-3 gap-2">
                {[10000, 20000, 50000, 100000, 150000, 300000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRechargeAmt(val)}
                    className={`py-2.5 px-1 text-center font-extrabold rounded-sm border text-[11px] cursor-pointer transition-all ${rechargeAmt === val ? 'bg-[#1e88e5] border-[#1e88e5] text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                  >
                    {val.toLocaleString('pt-AO')} KZ
                  </button>
                ))}
              </div>

              {/* Continuar button */}
              <button
                type="button"
                onClick={() => {
                  if (rechargeAmt <= 0) {
                    alert('Por favor, introduza um valor de recarga válido.');
                    return;
                  }
                  setRechargeStep('method');
                }}
                className="w-full bg-[#1e88e5] hover:bg-[#1565c0] text-white font-bold py-3 rounded-lg text-[13px] uppercase tracking-wider shadow-sm transition-colors cursor-pointer border-none outline-none mt-2"
              >
                Continuar
              </button>
            </div>
          )}

          {rechargeStep === 'method' && (
            <div className="space-y-3 bg-white rounded-xl shadow-xs p-3">
              <p className="text-center text-[14px] text-[#6d28d9] font-semibold py-2 select-none tracking-wide">
                Seleccione por favor o método de pagamento
              </p>

              <div className="divide-y divide-slate-100 overflow-hidden">
                {/* BIC, BFA, Atlântico, BCI, BAI, USDT-TRC20 */}
                {['BIC', 'BFA', 'Atlântico', 'BCI', 'BAI', 'USDT-TRC20'].map((methodName, idx) => {
                  const isUSDT = methodName === 'USDT-TRC20';
                  const usdtVal = (rechargeAmt / 430).toFixed(1);
                  return (
                    <div
                      key={methodName}
                      onClick={() => {
                        setSelectedMethod(methodName as any);
                        setRechargeStep('instructions');
                      }}
                      className="py-3.5 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition-colors"
                      id={`payment-method-row-${idx}`}
                    >
                      <div className="flex items-center gap-4 select-none">
                        {isUSDT ? (
                          <GoldCoinIcon />
                        ) : (
                          <BlueCardIcon />
                        )}
                        <span className="text-[13px] font-semibold text-stone-700 tracking-wide">{methodName}</span>
                      </div>
                      <div className="flex items-center text-neutral-400 text-xs font-semibold">
                        {isUSDT ? (
                          <span className="text-[12px] font-semibold text-stone-600 pr-1 tracking-tight">
                            {usdtVal}USDT&gt;
                          </span>
                        ) : (
                          <span className="text-[12px] font-semibold text-neutral-400 pr-1 tracking-tight">&gt;</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {rechargeStep === 'instructions' && (
            <div className="space-y-3">
              {selectedMethod !== 'USDT-TRC20' ? (
                <form onSubmit={handleRecharge} className="space-y-3">
                  {/* NÍVEL ALVO card */}
                  <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-neutral-400 tracking-widest">NÍVEL ALVO</span>
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">WS3</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[9px] font-bold text-neutral-400 mb-1">VALOR DO RECARGA</p>
                        <p className="text-[17px] font-black text-slate-800">{rechargeAmt.toLocaleString('pt-AO')} KZ</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-neutral-400 mb-1">EQUIVALENTE EM USDT</p>
                        <p className="text-[17px] font-black text-indigo-600">{(rechargeAmt / 430).toFixed(1)} USDT</p>
                      </div>
                    </div>
                  </div>

                  {/* INSTRUÇÕES card */}
                  <div className="bg-white rounded-xl p-4 border border-dashed border-indigo-300 space-y-2 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[11px] font-black text-indigo-700 tracking-wider">INSTRUÇÕES PARA DEPÓSITO</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400">Banco de Destino:</span>
                      <span className="font-extrabold text-slate-800">{selectedMethod}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400">Titular da Conta:</span>
                      <span className="font-extrabold text-slate-800">Asiaray Angola Media Lda.</span>
                    </div>
                    <div className="bg-[#f1f5f9] rounded-xl p-3 flex justify-between items-center mt-2">
                      <div>
                        <p className="text-[9px] font-bold text-neutral-400 mb-1">NÚMERO DO IBAN OFICIAL</p>
                        <p className="text-[13px] font-extrabold text-slate-800 font-mono">
                          {selectedMethod === 'BIC' ? 'AO06 0004 0000 1234 5678 1012 3' :
                           selectedMethod === 'BFA' ? 'AO86 8886 1145 9312 4224 5813 7' :
                           selectedMethod === 'Atlântico' ? 'AO06 0055 0000 8765 4321 1015 6' :
                           selectedMethod === 'BCI' ? 'AO06 0005 0000 9999 8888 1019 1' :
                           'AO06 0040 0000 9312 4224 1018 3'}
                        </p>
                      </div>
                      <button type="button" 
                        onClick={() => {
                          const currentIban = selectedMethod === 'BIC' ? 'AO06 0004 0000 1234 5678 1012 3' :
                           selectedMethod === 'BFA' ? 'AO86 8886 1145 9312 4224 5813 7' :
                           selectedMethod === 'Atlântico' ? 'AO06 0055 0000 8765 4321 1015 6' :
                           selectedMethod === 'BCI' ? 'AO06 0005 0000 9999 8888 1019 1' :
                           'AO06 0040 0000 9312 4224 1018 3';
                          navigator.clipboard.writeText(currentIban);
                          setIbanCopied(true);
                          setTimeout(() => setIbanCopied(false), 2000);
                        }}
                        className="bg-slate-200 text-blue-500 text-[10px] font-black px-3 py-1 rounded-full cursor-pointer border-none outline-none"
                      >
                        {ibanCopied ? 'COPIADO' : 'COPIAR'}
                      </button>
                    </div>
                  </div>

                  {/* COMPROVATIVO card */}
                  <div className="bg-white rounded-xl p-4 border border-neutral-200 space-y-3 shadow-sm">
                    <p className="text-[10px] font-bold text-neutral-400 tracking-widest">COMPROVATIVO DE TRANSFERÊNCIA</p>
                    <div className="relative">
                      <textarea maxLength={100} value={comprovativo} onChange={e => setComprovativo(e.target.value)}
                        placeholder="Se desejar, adicione uma mensagem de verificação para auditoria"
                        className="w-full text-xs border border-neutral-200 rounded-lg p-3 h-20 resize-none focus:outline-none placeholder-neutral-400" />
                      <span className="absolute bottom-2 right-2 text-[9px] text-neutral-400">{comprovativo.length}/100</span>
                    </div>
                    <div
                      onClick={() => setFileLabel('comprovativo.jpg')}
                      className="h-16 w-16 border-2 border-dashed border-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors">
                      {fileLabel !== 'Nenhum arquivo escolhido'
                        ? <Check size={20} className="text-green-500" />
                        : <span className="text-2xl font-black text-red-500">+</span>}
                    </div>
                    <button type="submit"
                      className="w-full bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold py-3.5 rounded-lg text-sm tracking-widest uppercase cursor-pointer border-none outline-none">
                      SALVAR
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRecharge} className="space-y-3">
                  <p className="text-center text-[11px] text-red-500 font-semibold">Por favor, transfira fundos manualmente para a seguinte conta</p>

                  <div className="border border-neutral-200 rounded-lg overflow-hidden">
                    {[['Tipo','USDT'],['Nome do banco','USDT-TRC20'],['conta bancária', USDT_ADDR]].map(([label, val]) => (
                      <div key={label} className="divide-y divide-neutral-200">
                        <div className="bg-white px-4 py-2 text-xs font-bold text-blue-600">{label}</div>
                        <div className="bg-slate-50 px-4 py-2 text-xs font-mono text-slate-700 break-all">{val}</div>
                      </div>
                    ))}
                    <div className="bg-white px-4 py-2 text-xs font-bold text-blue-600">Número da carteira</div>
                    <div className="bg-slate-50 px-4 py-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-slate-700 break-all flex-1">{USDT_ADDR}</span>
                      <button type="button" onClick={copyUSDT}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] px-3 py-1 rounded cursor-pointer border-none outline-none shrink-0 font-bold">
                        {usdtCopied ? 'Copiado' : 'cópia'}
                      </button>
                    </div>
                  </div>

                  <p className="text-center text-[11px] text-red-500 font-semibold">Informação sobre a procura</p>
                  <div className="border border-neutral-200 rounded-lg overflow-hidden">
                    {[['Número do pedido','202308060508708470'],['número da conta', user.phone || '244922342885'],['requisito', (rechargeAmt / 430).toFixed(2)]].map(([label, val]) => (
                      <div key={label}>
                        <div className="bg-white px-4 py-2 text-xs font-bold text-blue-600">{label}</div>
                        <div className="bg-slate-50 px-4 py-2 text-xs font-mono text-slate-700">{val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setFileLabel('comprovativo_usdt.png')}
                      className="flex-1 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-bold py-2.5 rounded text-xs flex items-center justify-center gap-1 cursor-pointer border-none outline-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      Credenciais
                    </button>
                    <button type="submit" className="flex-1 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-bold py-2.5 rounded text-xs cursor-pointer border-none outline-none">
                      Confirmar
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-slate-500 bg-white border border-neutral-200 rounded px-2 py-0.5 inline-block w-full">{fileLabel}</p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// 4. INVITE MODAL ("Convidar amigos")
export const InviteModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { user, setIsFullScreenActive } = useApp();
  const [copied, setCopied] = useState(false);

  const inviteUrl = `https://asiarays.asiarays.com/Public/reg/smid/${user.inviteCode || '931242'}`;

  React.useEffect(() => {
    if (isOpen) {
      setIsFullScreenActive(true);
    }
    return () => {
      setIsFullScreenActive(false);
    };
  }, [isOpen, setIsFullScreenActive]);

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col font-sans animate-fadeIn">
      {/* Header bar */}
      <div 
        className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-150 select-none relative" 
        style={{ height: '48px' }}
      >
        <button 
          onClick={onClose} 
          className="text-neutral-500 hover:text-neutral-800 select-none cursor-pointer focus:outline-none flex items-center p-1 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="absolute inset-x-0 text-center text-[15px] font-bold text-neutral-800 tracking-tight leading-[48px] pointer-events-none">
          convidar amigos
        </span>
        <div className="w-6"></div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-8 pb-10 flex flex-col items-center">
        
        {/* Title */}
        <span className="text-[12px] text-neutral-500 font-sans tracking-wide">Partilhar ligação</span>
        
        {/* Link */}
        <span className="text-[12px] text-neutral-700 font-sans font-medium mt-2.5 break-all text-center max-w-xs select-all">
          {inviteUrl}
        </span>

        {/* Buttons */}
        <div className="w-full max-w-[280px] mt-4 space-y-3 select-none">
          <button
            onClick={copyLink}
            className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white text-[13px] font-bold py-2.5 rounded-[5px] active:scale-95 transition-all cursor-pointer border-none outline-none shadow-sm block text-center"
          >
            {copied ? 'Copiado!' : 'cópia'}
          </button>
          
          <button
            onClick={() => alert('Imagem de convite guardada com sucesso na galeria do seu dispositivo!')}
            className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white text-[13px] font-bold py-2.5 rounded-[5px] active:scale-95 transition-all cursor-pointer border-none outline-none shadow-sm block text-center"
          >
            Gravar a imagem
          </button>
        </div>

        {/* Promotional Banner Image */}
        <div className="w-full max-w-[340px] mt-8">
          <img 
            src="/assets/invite_banner.png" 
            alt="Join Us Promotional Banner" 
            className="w-full h-auto object-contain"
          />
        </div>

      </div>
    </div>
  );
};

// 5. TEAM REPORT MODAL ("relatório da equipa")
export const TeamReportModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { team, setIsFullScreenActive } = useApp();
  const [activeTab, setActiveTab] = useState<'nivel_um' | 'secundario' | 'nivel_tres'>('nivel_um');

  React.useEffect(() => {
    if (isOpen) {
      setIsFullScreenActive(true);
    }
    return () => {
      setIsFullScreenActive(false);
    };
  }, [isOpen, setIsFullScreenActive]);

  if (!isOpen) return null;

  // Mock list matching the exact rows from the user's screenshot
  const levelUmMock = [
    { phone: '244929556335', date: '2023-06-06', amount: '88900.00' },
    { phone: '933513577', date: '2023-06-13', amount: '23440.00' },
    { phone: '923132970', date: '2023-06-06', amount: '42520.00' },
    { phone: '244923389942', date: '2023-07-24', amount: '3800.00' },
    { phone: '922867439', date: '2023-07-19', amount: '4020.00' },
    { phone: '924727491', date: '2023-07-15', amount: '2800.00' },
    { phone: '940975793', date: '2023-07-12', amount: '11100.00' },
    { phone: '244946907594', date: '2023-07-04', amount: '11000.00' },
    { phone: '244937949004', date: '2023-07-04', amount: '2600.00' },
    { phone: '932044640', date: '2023-06-30', amount: '9800.00' },
  ];

  const secundarioMock = [
    { phone: '244924883901', date: '2023-06-08', amount: '15000.00' },
    { phone: '931298475', date: '2023-06-14', amount: '5600.00' },
    { phone: '924102938', date: '2023-06-20', amount: '12800.00' },
    { phone: '244933928172', date: '2023-07-01', amount: '4500.00' },
  ];

  const nivelTresMock = [
    { phone: '925881029', date: '2023-06-10', amount: '2200.00' },
    { phone: '244941029384', date: '2023-06-11', amount: '1800.00' },
  ];

  const getMemberList = () => {
    switch (activeTab) {
      case 'nivel_um':
        return levelUmMock;
      case 'secundario':
        return secundarioMock;
      case 'nivel_tres':
        return nivelTresMock;
      default:
        return levelUmMock;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#f8f9fa] flex flex-col font-sans animate-fadeIn">
      {/* Header bar */}
      <div 
        className="bg-[#dbeafe]/40 px-4 py-3 flex items-center justify-between border-b border-gray-200 select-none relative" 
        style={{ height: '48px' }}
      >
        <button 
          onClick={onClose} 
          className="text-neutral-500 hover:text-neutral-800 select-none cursor-pointer focus:outline-none flex items-center p-1 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="absolute inset-x-0 text-center text-[15px] font-bold text-neutral-800 tracking-tight leading-[48px] pointer-events-none">
          Relatório da equipa
        </span>
        <div className="w-6"></div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        
        {/* Metric Grid Table */}
        <div className="bg-white border-b border-gray-150 text-[11px] text-neutral-500 font-sans">
          
          {/* Row 1 */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-3 border-r border-gray-100 flex flex-col justify-between min-h-[56px]">
              <span className="text-[10px] text-neutral-400 block scale-95 origin-left">saldo total da equipa (KZ)</span>
              <span className="text-[13px] font-semibold text-neutral-800 mt-1 font-mono">1618680.00</span>
            </div>
            <div className="p-3 flex flex-col justify-between min-h-[56px] text-right">
              <span className="text-[10px] text-neutral-400 block scale-95 origin-right">fluxo total da equipa (KZ)</span>
              <span className="text-[13px] font-semibold text-neutral-800 mt-1 font-mono">3560710.00</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-3 border-r border-gray-100 flex flex-col justify-between min-h-[56px]">
              <span className="text-[10px] text-neutral-400 block scale-95 origin-left">Recarga total da equipa (KZ)</span>
              <span className="text-[13px] font-semibold text-neutral-800 mt-1 font-mono">&nbsp;</span>
            </div>
            <div className="p-3 flex flex-col justify-between min-h-[56px] text-right">
              <span className="text-[10px] text-neutral-400 block scale-95 origin-right">retirada total da equipa (KZ)</span>
              <span className="text-[13px] font-semibold text-neutral-800 mt-1 font-mono">739270.00</span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-3 border-r border-gray-100 flex flex-col justify-between min-h-[56px]">
              <span className="text-[10px] text-neutral-400 block scale-95 origin-left">número de primeira carga</span>
              <span className="text-[12px] font-medium text-red-500 mt-1">
                <span className="font-bold">0</span> Pessoas
              </span>
            </div>
            <div className="p-3 flex flex-col justify-between min-h-[56px] text-right">
              <span className="text-[10px] text-neutral-400 block scale-95 origin-right">número de empurrões directos</span>
              <span className="text-[12px] font-medium text-red-500 mt-1">
                <span className="font-bold">836</span> Pessoas
              </span>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2">
            <div className="p-3 border-r border-gray-100 flex flex-col justify-between min-h-[56px]">
              <span className="text-[10px] text-neutral-400 block scale-95 origin-left">tamanho da equipa</span>
              <span className="text-[12px] font-medium text-red-500 mt-1">
                <span className="font-bold">3161</span> Pessoas
              </span>
            </div>
            <div className="p-3 flex flex-col justify-between min-h-[56px] text-right">
              <span className="text-[10px] text-neutral-400 block scale-95 origin-right">Novo número</span>
              <span className="text-[12px] font-medium text-red-500 mt-1">
                <span className="font-bold">5</span> Pessoas
              </span>
            </div>
          </div>

        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-250 bg-white select-none mt-4">
          <button 
            onClick={() => setActiveTab('nivel_um')}
            className={`flex-1 py-3 text-center text-[12px] font-bold transition-all relative ${
              activeTab === 'nivel_um' ? 'text-[#d24c3c]' : 'text-neutral-500'
            }`}
          >
            nível um (836)
            {activeTab === 'nivel_um' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d24c3c]" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('secundario')}
            className={`flex-1 py-3 text-center text-[12px] font-bold transition-all relative ${
              activeTab === 'secundario' ? 'text-[#d24c3c]' : 'text-neutral-500'
            }`}
          >
            secundário (1379)
            {activeTab === 'secundario' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d24c3c]" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('nivel_tres')}
            className={`flex-1 py-3 text-center text-[12px] font-bold transition-all relative ${
              activeTab === 'nivel_tres' ? 'text-[#d24c3c]' : 'text-neutral-500'
            }`}
          >
            nível três (946)
            {activeTab === 'nivel_tres' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d24c3c]" />
            )}
          </button>
        </div>

        {/* Members List Table */}
        <div className="bg-white divide-y divide-gray-100">
          {getMemberList().map((mbr, idx) => (
            <div key={idx} className="flex justify-between items-center px-6 py-3.5 text-[12px] text-neutral-600 font-sans">
              <span className="font-mono text-neutral-800 font-medium flex-1 text-left">{mbr.phone}</span>
              <span className="text-neutral-400 font-mono flex-1 text-center">{mbr.date}</span>
              <span className="font-mono text-neutral-800 font-medium flex-1 text-right">{mbr.amount}</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

// 6. RULES / "DEVE LER" MODAL
export const RulesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Guia Deve Ler">
      <div className="space-y-4 text-xs text-neutral-600 leading-relaxed font-sans pb-4">
        
        <h2 className="font-extrabold text-neutral-800 text-sm">Sobre a Asiaray Media Group Limited</h2>
        
        <p>
          A Asiaray Media Group Limited (código de ações na Bolsa de Valores de Hong Kong: 1993) é uma empresa de mídia exterior na região da Grande China, com foco estratégico na gestão de publicidade em grandes meios de transporte, como aeroportos, linhas de metrô e trens de alta velocidade.
        </p>

        <p className="italic pl-3 border-l-2 border-neutral-300 py-0.5 text-neutral-700">
          “Estabelecemos uma extensa rede em quase 40 grandes cidades da região da Grande China, baseada em mais de 30 anos de experiência e reputação.”
        </p>

        <p>
          A empresa possui direitos exclusivos de concessão em 22 aeroportos e em 15 linhas de metrô, incluindo a linha Thomson-East Coast do MRT de Singapura (TEL). Também administra direitos exclusivos de mídia em 16 estações ferroviárias, entre elas a Estação Ferroviária de Alta Velocidade Hong Kong West Kowloon e a Linha Ferroviária China–Laos–Yumo.
        </p>

        <p>
          Além disso, a Asiaray detém direitos exclusivos de concessão da Hong Kong–Zhuhai–Macau Bridge (Porto de Zhuhai), de mais de 500 pontos de ônibus da KMB em Hong Kong e da Travessia do Porto Leste de Hong Kong. A empresa também oferece mais de 350 soluções de publicidade de alta qualidade para outdoors e edifios.
        </p>

        <p>
          Com mais de 30 anos de experiência e um profundo conhecimento em gestão de espaços publicitários, a Asiaray tem fornecido soluções integradas e criativas de mídia exterior, desenvolvendo campanhas de grande impacto em locais estratégicos e de alta circulação.
        </p>

        <h2 className="font-extrabold text-neutral-800 text-sm pt-2">Nossa Visão</h2>
        
        <p>
          Ser uma empresa de comunicação exterior de classe mundial com origem asiática.
        </p>

        <h2 className="font-extrabold text-neutral-800 text-sm pt-2">Nossa Missão</h2>
        
        <p>
          Fornecer soluções ideais de comunicação Out-Of-Home (OOH), garantindo o mais alto retorno sobre investimento (ROI) e máxima eficácia. Promover excelência profissional na mídia publicitária exterior, desenvolver uma equipe harmoniosa, eficiente e produtiva e atuar como uma empresa consciente e comprometida com a comunidade.
        </p>

        <h2 className="font-extrabold text-neutral-800 text-sm pt-2">Nossos Valores</h2>

        <p>
          <strong>Integridade</strong><br />
          Agir com honestidade e transparência em todas as relações.
        </p>

        <p>
          <strong>Excelência</strong><br />
          Buscar melhoria contínua e excelência em cada projeto.
        </p>

        <p>
          <strong>Benevolência</strong><br />
          Assumir responsabilidades sociais e cuidar da comunidade.
        </p>

        <h2 className="font-extrabold text-neutral-800 text-sm pt-2">Reconhecimento e Conquistas</h2>

        <p>
          Em 2024, a Asiaray continuou se destacando em mais de 10 competições internacionais e nacionais de publicidade altamente reconhecidas, conquistando um total de 50 prêmios, incluindo ouro, prata, bronze e mérito.
        </p>

        <p>
          Todas essas conquistas foram alcançadas através do esforço conjunto entre a Asiaray, anunciantes, agências de publicidade e proprietários de mídia. A empresa continuará fortalecendo essa colaboração, juntamente com sua filosofia de “Gestão de Espaços”, criando experiências extraordinárias para passageiros e públicos, promovendo benefícios mútuos para todas as partes envolvidas.
        </p>

      </div>
    </ModalBase>
  );
};

// 7. DECLARAÇÃO DIÁRIA MODAL (Beautiful native financial performance charts)
export const DailyDeclarationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { stats } = useApp();

  // Create an elegant simulated chart using responsive SVGs
  const dataPoints = [
    { label: 'Seg', val: stats.incomeToday * 0.4 },
    { label: 'Ter', val: stats.incomeToday * 0.65 },
    { label: 'Qua', val: stats.incomeToday * 1.15 },
    { label: 'Qui', val: stats.incomeToday * 0.9 },
    { label: 'Sex', val: stats.incomeToday * 1.45 },
    { label: 'Sáb', val: stats.incomeToday * 2.1 },
    { label: 'Dom', val: stats.incomeToday }
  ];

  const maxVal = Math.max(...dataPoints.map(d => d.val)) || 1000;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Declaração Diária">
      <div className="space-y-4">
        <div className="text-center bg-neutral-50 p-4 border border-neutral-100 rounded-2xl relative overflow-hidden">
          <span className="text-[10px] uppercase font-bold text-neutral-400">Previsão Acumulada</span>
          <h3 className="text-xl font-mono font-extrabold text-green-600 mt-1">KZ {(stats.incomeThisMonth * 1.25).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</h3>
          <p className="text-[10px] text-neutral-550 mt-1">Simulação matemática de rendimento semanal residual baseada na sua associação.</p>
        </div>

        {/* Responsive Custom SVG financial chart */}
        <div className="space-y-1.5 p-2 bg-neutral-50 rounded-xl border border-neutral-150">
          <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide px-1">Curva de Ganhos Semanais (KZ)</h4>
          
          <div className="flex justify-between items-end h-32 pt-4 px-1" id="svg-graph-box">
            {dataPoints.map((dp, idx) => {
              const heightPct = Math.max(10, Math.min(100, (dp.val / maxVal) * 100));
              return (
                <div key={idx} className="flex flex-col items-center flex-1 space-y-1.5 h-full justify-end group">
                  <div className="text-[8px] font-mono text-green-700 bg-green-50 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity translate-y-2">
                    {Math.round(dp.val)}
                  </div>
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-5 bg-gradient-to-t from-[#0d7377] to-[#14ffec] rounded-t-sm transition-all duration-500 ease-out cursor-pointer hover:bg-neutral-800"
                  ></div>
                  <span className="text-[10px] font-bold text-neutral-400">{dp.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 text-xs text-neutral-600 leading-normal">
          <p className="font-bold text-neutral-700">📌 Resumo de Operação:</p>
          <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
            <div className="bg-neutral-50 p-2 rounded-xl">
              <span className="text-[9px] text-neutral-400 block uppercase">Média diária</span>
              <strong className="font-mono text-neutral-700 text-xs">KZ {(stats.incomeToday || 1150).toLocaleString()}</strong>
            </div>
            <div className="bg-neutral-50 p-2 rounded-xl">
              <span className="text-[9px] text-neutral-400 block uppercase">Média mensal</span>
              <strong className="font-mono text-neutral-700 text-xs">KZ {(stats.incomeThisMonth || 76620).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

// 8. GENERAL DATA LIST MODALS (Receitas / Depósitos / Retiradas)
interface ListModalProps extends ModalProps {
  type: 'receita' | 'recarga' | 'retirada';
}

export const LedgerLogsModal: React.FC<ListModalProps> = ({ isOpen, onClose, type }) => {
  const { logs, user, setIsFullScreenActive } = useApp();
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setIsFullScreenActive(true);
    }
    return () => {
      setIsFullScreenActive(false);
    };
  }, [isOpen, setIsFullScreenActive]);

  if (!isOpen) return null;

  // Filter logs corresponding to requested ledger
  const cleanType = type === 'receita' ? 'recompensa' : type;
  let filtered = logs.filter(l => l.type === cleanType);

  // Fallback to match image exactly if list is empty
  if (type === 'retirada' && filtered.length === 0) {
    filtered = [{
      id: 'ret_default',
      type: 'retirada',
      amount: 15260,
      date: '2023-06-26 11:15',
      status: 'aprovado',
      details: 'Retirada solicitada por IBAN'
    }];
  } else if (type === 'recarga' && filtered.length === 0) {
    filtered = [
      {
        id: 'rec_1',
        type: 'recarga',
        amount: 30000,
        date: '2026-05-18 18:14',
        status: 'aprovado',
        details: 'Depósito Multicaixa Express'
      },
      {
        id: 'rec_2',
        type: 'recarga',
        amount: 10000,
        date: '2026-05-15 14:22',
        status: 'aprovado',
        details: 'Banco BAI'
      }
    ];
  }

  const getStatusBadge = (status: 'pendente' | 'aprovado' | 'rejeitado') => {
    switch (status) {
      case 'aprovado':
        return <span className="bg-[#ccfbf1] text-[#0f766e] text-[10px] font-bold px-2.5 py-0.5 rounded-full">Aprovado</span>;
      case 'rejeitado':
        return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Rejeitado</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Pendente</span>;
    }
  };

  const getStatusText = (status: 'pendente' | 'aprovado' | 'rejeitado') => {
    switch (status) {
      case 'aprovado':
        return 'Sucesso';
      case 'rejeitado':
        return 'Rejeitado';
      default:
        return 'Pendente';
    }
  };

  const getStatusTextColorClass = (status: 'pendente' | 'aprovado' | 'rejeitado') => {
    switch (status) {
      case 'aprovado':
        return 'text-[#5cb85c]';
      case 'rejeitado':
        return 'text-red-500';
      default:
        return 'text-amber-500';
    }
  };

  // If type is retirada, render the layout identical to the uploaded image
  if (type === 'retirada') {
    const selectedLog = filtered.find(l => l.id === selectedLogId);

    const handleBackClick = () => {
      if (selectedLogId) {
        setSelectedLogId(null);
      } else {
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 bg-[#f5f5f5] flex flex-col z-[50] animate-fadeIn font-sans" id="retirada-modal-fullscreen">
        {/* Header with back button and Title on neutral slate-gray background */}
        <div className="bg-[#cbd5e1]/45 px-4 py-3 border-b border-neutral-200 flex items-center relative select-none shrink-0" style={{ height: '48px' }}>
          <button 
            id="retirada-back-arrow"
            onClick={handleBackClick}
            className="p-1 text-neutral-600 hover:text-neutral-900 bg-transparent hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer flex items-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] stroke-neutral-700" fill="none" viewBox="0 0 24 24" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="absolute inset-x-0 mx-auto w-max text-center font-bold text-neutral-800 text-[15px] tracking-wide select-none">
            Registo de retirada
          </div>
        </div>

        {/* Dynamic content container */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
          {!selectedLog ? (
            /* LIST VIEW: Exact mockup match */
            <div className="divide-y divide-neutral-150">
              {filtered.map((log) => {
                // Generate a stable numeric orderId based on log ID
                const orderId = log.id === 'ret_default' ? '260' : 
                  (Math.abs(log.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 900 + 100);
                
                const dateOnly = log.date.split(' ')[0] || '2023-06-26';

                return (
                  <div 
                    key={log.id} 
                    onClick={() => setSelectedLogId(log.id)}
                    className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
                  >
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-[12px] text-neutral-400">ID da encomenda: {orderId}</span>
                      <span className="text-[14px] font-bold text-neutral-800">Pedido {log.amount.toFixed(2)} KZ</span>
                      <span className="text-[12px] text-neutral-400">{dateOnly}</span>
                    </div>
                    <div className="flex items-center gap-1.5 select-none shrink-0">
                      <span className={`text-[13px] font-bold ${getStatusTextColorClass(log.status)}`}>
                        {getStatusText(log.status)}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* DETAILED VIEW: Exact mockup match */
            (() => {
              // Formatting bank initials
              let bankDisplay = 'BAI';
              if (user.bankName) {
                const match = user.bankName.match(/^([A-Za-z0-9]+)/);
                if (match) {
                  bankDisplay = match[1].toUpperCase();
                }
              }

              // Normalise the account display
              const acctDisplay = user.bankAccount 
                ? user.bankAccount.replace(/\s+/g, '') 
                : 'RI0004000009570177510185';

              const dateOnly = selectedLog.date.split(' ')[0] || '2023-06-26';

              return (
                <div className="bg-white px-5 pt-5 pb-8 animate-fadeIn" id={`ret_record_wrapper_${selectedLog.id}`}>
                  
                  {/* Row 1: Retirada do saldo | Date */}
                  <div className="flex justify-between items-center py-3.5">
                    <span className="text-neutral-500 text-sm select-none font-medium">Retirada do saldo</span>
                    <span className="text-neutral-400 font-mono text-sm select-none">{dateOnly}</span>
                  </div>
                  <div className="border-t border-neutral-100 w-full"></div>

                  {/* Row 2: Banco beneficiário | Initials */}
                  <div className="flex justify-between items-center py-3.5">
                    <span className="text-neutral-500 text-sm select-none font-medium">Banco beneficiário</span>
                    <span className="text-neutral-400 font-sans tracking-wide font-medium text-sm select-none">{bankDisplay}</span>
                  </div>
                  <div className="border-t border-neutral-100 w-full"></div>

                  {/* Row 3: Conta bancária | Value */}
                  <div className="flex justify-between items-start py-3.5">
                    <div className="flex flex-col text-neutral-500 text-sm leading-tight select-none font-medium">
                      <span>Conta</span>
                      <span>bancária</span>
                    </div>
                    <span className="text-neutral-400 font-mono text-sm break-all max-w-[70%] text-right font-medium">
                      {acctDisplay}
                    </span>
                  </div>
                  <div className="border-t border-neutral-100 w-full"></div>

                  {/* Row 4: Montante label and large flat text value */}
                  <div className="pt-5 pb-2 space-y-1">
                    <span className="text-[12px] text-neutral-400 select-none block font-semibold uppercase tracking-wider">Montante</span>
                    <div className="text-3xl font-display font-extrabold text-neutral-900 tracking-wide select-all">
                      KZ {selectedLog.amount.toFixed(2)}
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="h-12"></div>

                  {/* Process Tracker */}
                  <div className="relative px-2">
                    {/* Step connection bar */}
                    <div className="absolute top-[11.5px] left-[15%] right-[15%] h-[2.5px] bg-[#5cb85c]" style={{ zIndex: 0 }}></div>

                    <div className="flex justify-between w-full relative" style={{ zIndex: 1 }}>
                      {/* Status Check Unit 1 */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="h-[23px] w-[23px] rounded-full bg-[#5cb85c] text-white flex items-center justify-center font-bold text-xs ring-[3px] ring-white">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={4.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-neutral-800 mt-2 select-none">Pedido</span>
                        <span className="text-[10px] text-neutral-400 font-mono mt-0.5 select-none">{dateOnly}</span>
                      </div>

                      {/* Status Check Unit 2 */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="h-[23px] w-[23px] rounded-full bg-[#5cb85c] text-white flex items-center justify-center font-bold text-xs ring-[3px] ring-white">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={4.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-neutral-800 mt-2 select-none">Transformação</span>
                        <span className="text-[10px] text-neutral-400 font-mono mt-0.5 select-none">{dateOnly}</span>
                      </div>

                      {/* Status Check Unit 3 */}
                      <div className="flex flex-col items-center flex-1">
                        <div className={`h-[23px] w-[23px] rounded-full ${selectedLog.status === 'aprovado' ? 'bg-[#5cb85c]' : selectedLog.status === 'rejeitado' ? 'bg-red-500' : 'bg-amber-500'} text-white flex items-center justify-center font-bold text-xs ring-[3px] ring-white`}>
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={4.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-neutral-800 mt-2 select-none">
                          {getStatusText(selectedLog.status)}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono mt-0.5 select-none">{dateOnly}</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })()
          )}
        </div>
      </div>
    );
  }

  // Otherwise, render normal logs ledger content
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={`REGISTO DE ${type === 'receita' ? 'RECEITAS' : type === 'recarga' ? 'RECARGAS' : 'RETIRADAS'}`}>
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-neutral-400 text-xs flex flex-col justify-center items-center gap-2">
            <ClipboardList size={24} className="opacity-40" />
            <span>Nenhum registo de transação registrado sob este separador.</span>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar-y">
            {filtered.map((log) => (
              <div key={log.id} className="bg-[#f8f9fa] px-4 py-3.5 rounded-xl flex items-center justify-between text-xs shadow-sm shadow-neutral-100/50">
                <div className="space-y-1">
                  <div className="font-bold text-neutral-900 text-[13px]">{log.details || 'Transação Asiaray'}</div>
                  <div className="text-[11px] text-neutral-400 font-mono tracking-wider">{log.date}</div>
                </div>
                <div className="text-right space-y-1.5 shrink-0 ml-3">
                  <div className="font-mono font-bold text-neutral-900 text-[13px]">
                    {log.type === 'retirada' ? '-' : '+'}KZ {log.amount.toLocaleString('pt-AO').replace(',', ' ')}
                  </div>
                  <div>{getStatusBadge(log.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalBase>
  );
};
