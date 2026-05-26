import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Grid } from 'lucide-react';

export const RetirarPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, stats, addWithdrawal, addToast, setIsFullScreenActive } = useApp();

  // Mode state: 'amount' | 'tips' | 'pin'
  const [step, setStep] = useState<'amount' | 'tips' | 'pin'>('amount');
  const [amount, setAmount] = useState<number>(0);
  const [walletType, setWalletType] = useState<'pocket' | 'task'>('task'); // Default checked to Task Wallet as it has balance in screenshot
  
  // Pin inputs
  const [pin, setPin] = useState<string>('');

  // Auto-hide full screen footer layout
  useEffect(() => {
    setIsFullScreenActive(true);
    return () => {
      setIsFullScreenActive(false);
    };
  }, [setIsFullScreenActive]);

  // Derived values
  const displayBank = user.bankName || 'BAI (Banco Angolano de Investimentos)';
  const lastFourDigits = user.bankAccount ? user.bankAccount.replace(/\s+/g, '').slice(-4) : '0185';
  
  const pocketBalance = 0; // Pocket money is KZ 0 in the screenshot
  const taskWalletBalance = stats.balance; // Using stats.balance for task wallet
  
  const currentAvailableBalance = walletType === 'pocket' ? pocketBalance : taskWalletBalance;

  const commission = amount * 0.5;
  const accessFee = 0.00;
  const realAmount = amount - commission - accessFee;

  const handleConfirmAmount = () => {
    if (amount <= 0) {
      addToast('Por favor, introduza um valor de retirada válido.', 'warning');
      return;
    }
    if (amount > currentAvailableBalance) {
      addToast('Saldo insuficiente na carteira selecionada.', 'error');
      return;
    }
    if (amount < 2000) {
      addToast('O limite mínimo para retirada é de KZ 2.000,00.', 'warning');
      return;
    }
    setStep('tips');
  };

  const handlePinKeyPress = (val: string) => {
    if (val === 'backspace') {
      setPin(prev => prev.slice(0, -1));
    } else if (val === 'hide') {
      // Just ignore or close
    } else {
      if (pin.length < 6) {
        const newPin = pin + val;
        setPin(newPin);
        
        // Auto trigger validation on 6th digit
        if (newPin.length === 6) {
          validatePin(newPin);
        }
      }
    }
  };

  const validatePin = (finalPin: string) => {
    // Standard mock validation: any 6-digit pin is accepted for user convenience, or we can check against a dummy '123456'
    // Let's make it show a loading success and perform withdrawal.
    addToast('Verificando senha de pagamento...', 'info');
    
    setTimeout(() => {
      const res = addWithdrawal(amount);
      if (res.success) {
        addToast(`Retirada de KZ ${amount.toLocaleString('pt-AO')} solicitada com sucesso!`, 'success');
        navigate('/meu');
      } else {
        addToast(res.error || 'Erro ao processar retirada.', 'error');
        setPin('');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col font-sans max-w-md mx-auto border-x border-slate-200">
      
      {/* Header bar */}
      <div className="bg-[#e9eff6] px-4 py-3 flex items-center justify-between border-b border-slate-200 select-none h-12">
        <button 
          onClick={() => {
            if (step === 'tips') setStep('amount');
            else if (step === 'pin') setStep('tips');
            else navigate('/meu');
          }}
          className="text-neutral-600 hover:text-neutral-900 cursor-pointer focus:outline-none flex items-center justify-center w-8 h-8"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <span className="text-[16px] font-bold text-neutral-800 tracking-tight text-center flex-1">
          {step === 'pin' ? 'Confirme a senha' : 'Retirar'}
        </span>
        <div className="bg-slate-300/40 rounded-md p-1.5 flex items-center justify-center text-neutral-600 w-8 h-8">
          <Grid size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto bg-white flex flex-col no-scrollbar">
        
        {/* Step 1: Input amount */}
        {step === 'amount' && (
          <div className="flex flex-col flex-1">
            {/* Gateway Card (Grey block) */}
            <div className="bg-[#f0f3f6] p-4 flex flex-col justify-between border-b border-slate-200">
              <div className="flex justify-between items-center text-neutral-800 font-bold text-[13px] cursor-pointer">
                <span>Tipo de Gateway: {displayBank.split(' ')[0]} ({lastFourDigits})</span>
                <span className="text-neutral-400 text-lg font-light">&gt;</span>
              </div>
              <span className="text-[10px] text-neutral-500 text-right mt-3 self-end block max-w-[240px] leading-tight">
                * Diferentes tipos de métodos de pagamento têm taxas diferentes
              </span>
            </div>

            {/* Input area (White block) */}
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-[14px] font-bold text-neutral-800 mb-2">
                Montante de retirada:
              </span>

              {/* Big Currency input */}
              <div className="flex items-baseline border-b border-slate-200 pb-3 mb-6 mt-2">
                <span className="text-[34px] font-semibold text-neutral-900 mr-3 select-none">KZ</span>
                <input 
                  type="text" 
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={amount === 0 ? '' : amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setAmount(Number(val));
                  }}
                  placeholder="0"
                  className="text-[34px] font-semibold text-neutral-900 focus:outline-none w-full bg-transparent p-0 border-none outline-none"
                />
              </div>

              {/* Wallet options Checkboxes */}
              <div className="space-y-4">
                {/* Option 1: Pocket money */}
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={walletType === 'pocket'}
                      onChange={() => setWalletType('pocket')}
                      className="w-[18px] h-[18px] text-[#2563eb] rounded border-slate-300 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[13px] font-medium text-neutral-700">Pocket money</span>
                  </div>
                  <span className="text-[13px] text-neutral-800">KZ{pocketBalance}</span>
                </label>

                {/* Option 2: Task wallet */}
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={walletType === 'task'}
                      onChange={() => setWalletType('task')}
                      className="w-[18px] h-[18px] text-[#2563eb] rounded border-slate-300 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[13px] font-medium text-neutral-700">Task wallet</span>
                  </div>
                  <span className="text-[13px] text-neutral-800">KZ{taskWalletBalance.toFixed(2)}</span>
                </label>
              </div>

              {/* Confirm Button */}
              <div className="mt-auto pt-8">
                <button
                  onClick={handleConfirmAmount}
                  className="w-full bg-[#1e88e5] text-white py-3 rounded-lg text-[14px] font-bold shadow-md hover:bg-[#1565c0] transition-colors cursor-pointer"
                >
                  Confirmar Retirada
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Tips Overlay / View */}
        {step === 'tips' && (
          <div className="flex flex-col flex-1 bg-white relative">
            {/* Background Content (Disabled/Blurred Amount View) */}
            <div className="opacity-40 pointer-events-none flex flex-col flex-1">
              <div className="bg-[#f0f3f6] p-4 flex flex-col">
                <div className="flex justify-between items-center text-neutral-800 font-bold text-[13px]">
                  <span>Tipo de Gateway: {displayBank.split(' ')[0]} ({lastFourDigits})</span>
                </div>
              </div>
              <div className="p-5 flex-1">
                <span className="text-[14px] font-bold text-neutral-800 mb-2">Montante de retirada:</span>
                <div className="text-[34px] font-semibold text-neutral-900 border-b pb-3 mb-6">KZ {amount}</div>
              </div>
            </div>

            {/* Bottom sheet style / Center style Tips Modal precisely matching Image 2 */}
            <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center px-4">
              <div className="bg-white w-full max-w-[340px] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fadeIn pb-5 pt-3">
                {/* Tip Header */}
                <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
                  <button 
                    onClick={() => setStep('amount')}
                    className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  >
                    <span className="text-xl font-light">×</span>
                  </button>
                  <span className="text-[15px] font-bold text-neutral-800 text-center flex-1 translate-x-[-8px]">Dicas</span>
                  <div className="w-5"></div>
                </div>

                {/* Tips List */}
                <div className="p-4 space-y-3 text-[12px] text-neutral-600 leading-normal text-left font-medium">
                  <p>1. Hora de chegada: 0-72 horas;</p>
                  <p>2. Diferentes gateways podem ter taxas de serviço;</p>
                  <p>3. Confirme que as informações de pagamento estão corretas, caso contrário, os fundos serão perdidos e não poderão ser recuperados;</p>
                  <p>4. Se a retirada for rejeitada, seus fundos serão devolvidos para a carteira correspondente e você poderá retirar novamente.</p>
                </div>

                {/* Tip Buttons */}
                <div className="px-4 pt-3 flex gap-3">
                  <button
                    onClick={() => setStep('amount')}
                    className="flex-1 border border-[#1e88e5] text-[#1e88e5] bg-white py-2 rounded-lg text-[13px] font-bold text-center cursor-pointer"
                  >
                    cancelar
                  </button>
                  <button
                    onClick={() => setStep('pin')}
                    className="flex-1 bg-[#1e88e5] text-white py-2 rounded-lg text-[13px] font-bold text-center cursor-pointer hover:bg-[#1565c0]"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: PIN Input view precisely matching Image 3 */}
        {step === 'pin' && (
          <div className="flex flex-col flex-1 bg-white relative justify-between">
            
            {/* Top info summary */}
            <div className="p-4 flex flex-col items-center">
              <span className="text-[12px] text-neutral-500 font-bold mb-1">
                Tipo de Gateway: {displayBank.split(' ')[0]} ({lastFourDigits})
              </span>
              <span className="text-[28px] font-black text-neutral-900 mb-4">
                KZ {amount.toLocaleString('pt-AO')}
              </span>

              {/* Commission stats table */}
              <div className="w-full bg-[#f8fafc] border border-slate-100 rounded-xl p-4 text-[12px] text-neutral-600 space-y-2 mb-6 shadow-sm">
                <div className="flex justify-between">
                  <span>Comissão da plataforma:</span>
                  <span className="font-semibold text-neutral-800">- KZ{commission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarifas de acesso:</span>
                  <span className="font-semibold text-neutral-800">- KZ{accessFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/60 pt-2">
                  <span>Montante real:</span>
                  <span className="font-semibold text-neutral-800">- KZ{realAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Montante real: (KZ):</span>
                  <span className="font-bold text-neutral-900">KZ {realAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* 6 Digit PIN Fields */}
              <div className="flex gap-2 justify-center w-full max-w-[280px] my-3">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 border border-slate-300 rounded-md flex items-center justify-center text-lg font-bold text-neutral-900 bg-white"
                  >
                    {pin[i] ? (
                      <span className="w-2.5 h-2.5 bg-neutral-800 rounded-full"></span>
                    ) : (
                      i === pin.length ? <span className="animate-pulse text-neutral-400">|</span> : ''
                    )}
                  </div>
                ))}
              </div>

              {/* Forgot link */}
              <button 
                onClick={() => addToast('Entre em contato com o suporte para redefinir sua senha de pagamento.', 'info')}
                className="text-[11px] text-[#1e88e5] mt-4 font-bold focus:outline-none hover:underline cursor-pointer"
              >
                Esqueceu-se da senha do pagamento?
              </button>
            </div>

            {/* Custom On-Screen Numeric Keyboard */}
            <div className="bg-[#f0f3f6] border-t border-slate-200 p-2 grid grid-cols-3 gap-1 select-none">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(val => (
                <button
                  key={val}
                  onClick={() => handlePinKeyPress(val)}
                  className="bg-white text-neutral-950 font-medium py-3 rounded-lg text-lg flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-sm active:bg-slate-100"
                >
                  {val}
                </button>
              ))}

              {/* Keyboard hide icon */}
              <button
                onClick={() => setStep('tips')}
                className="bg-white/40 text-neutral-700 py-3 rounded-lg text-lg flex items-center justify-center hover:bg-slate-50 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 13h-4M9 13h-4m2-4H5m14 0h-4M9 9h-4m14-4h-4m2-4H5" />
                </svg>
              </button>

              <button
                onClick={() => handlePinKeyPress('0')}
                className="bg-white text-neutral-950 font-medium py-3 rounded-lg text-lg flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-sm active:bg-slate-100"
              >
                0
              </button>

              {/* Delete / Backspace key */}
              <button
                onClick={() => handlePinKeyPress('backspace')}
                className="bg-white/40 text-neutral-700 py-3 rounded-lg text-lg flex items-center justify-center hover:bg-slate-50 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                </svg>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
