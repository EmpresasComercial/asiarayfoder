import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Shield, User, Wallet, Edit3 } from 'lucide-react';
import passwordLoginIcon from '../../assets/icons8-password-login-48.png';
import cardWithdrawalIcon from '../../assets/icons8-card-withdrawal-48.png';
import passwordRetiradaIcon from '../../assets/icons8-password-retirada-update-48.png';

interface MyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBank: () => void;
}

export const MyInfoModal: React.FC<MyInfoModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, resetAll, addToast, updateBankInfo, showLoading, hideLoading, setIsFullScreenActive } = useApp();
  
  // Sub-page state: 'none' (main menu), 'withdrawInfo', 'personalInfo', 'loginPassword', 'payPassword'
  const [activeSubPage, setActiveSubPage] = useState<'none' | 'withdrawInfo' | 'personalInfo' | 'loginPassword' | 'payPassword'>('none');
  
  // Password inputs
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Personal Info inputs
  const [realName, setRealName] = useState(user.holderName || '');
  const [nickName, setNickName] = useState('Asiaray VIP');

  // Bank Info inputs
  const [bank, setBank] = useState(user.bankName || 'BAI (Banco Angolano de Investimentos)');
  const [account, setAccount] = useState(user.bankAccount || '');
  const [holder, setHolder] = useState(user.holderName || '');
  
  React.useEffect(() => {
    if (isOpen) {
      setIsFullScreenActive(true);
    }
    return () => {
      setIsFullScreenActive(false);
    };
  }, [isOpen, setIsFullScreenActive]);

  if (!isOpen) return null;

  const handlePasswordReset = (type: 'login' | 'payment') => {
    if (!newPassword || !confirmPassword) {
      alert('Por favor preencha todos os campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }
    
    addToast('A processar segurança de chaves AES-256...', 'info');
    setTimeout(() => {
      addToast(`Senha de ${type === 'login' ? 'Login' : 'Pagamento'} alterada com sucesso!`, 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setActiveSubPage('none');
    }, 1200);
  };

  const handleSavePersonalInfo = () => {
    if (!realName) {
      alert('Deve preencher o Nome do Titular.');
      return;
    }
    addToast('Informações pessoais atualizadas!', 'success');
    setActiveSubPage('none');
  };

  const handleSaveBank = async () => {
    if (!account || !holder) {
      alert('Erro: Titular e IBAN são campos obrigatórios.');
      return;
    }
    showLoading('A processar e gravar os dados bancários...');
    try {
      await updateBankInfo(bank, account, holder);
      hideLoading();
      addToast('Sucesso: Conta bancária vinculada para levantamentos.', 'success');
      setActiveSubPage('none');
    } catch (err) {
      hideLoading();
      addToast('Erro: Não foi possível gravar os dados.', 'error');
    }
  };

  const handleDeleteAccount = () => {
    const doubleCheck = window.confirm(
      'ALERTA DE SEGURANÇA:\nTem a certeza que deseja apagar a sua conta permanentemente do protocolo WS2?'
    );
    if (doubleCheck) {
      alert('Conta apagada na rede local. Redirecionando para inscrição...');
      resetAll();
      logout();
      onClose();
    }
  };

  // 1. RENDERING SUB-PAGE: Informação de retirada (full-page, read-only display matching WSTab IBAN layout)
  if (activeSubPage === 'withdrawInfo') {
    const displayBank = user.bankName || 'BIC (Banco BIC)';
    const displayIBAN = user.bankAccount || '555555555';
    const displayHolder = user.holderName || '5555555';

    return (
      <div className="fixed inset-0 z-[50] bg-[#f5f5f5] flex flex-col font-sans animate-fadeIn">
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 select-none" style={{ height: '48px' }}>
          <button 
            onClick={() => setActiveSubPage('none')} 
            className="text-neutral-500 hover:text-neutral-800 select-none cursor-pointer focus:outline-none flex items-center p-1"
            id="withdraw-back-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-[15px] font-bold text-neutral-850 tracking-tight text-center flex-1 translate-x-[-10px]">Minha conta</span>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 p-3 space-y-4 bg-white overflow-y-auto">
          {/* Box 1: Read-only bank info display */}
          <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">

            {/* Tipo */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-medium text-[12px] px-3 py-1 bg-white">Tipo</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200 font-mono">
                BANCO
              </div>
            </div>

            {/* Instituição Bancária */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-medium text-[12px] px-3 py-1 bg-white">Instituição Bancária</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200 font-mono">
                {displayBank}
              </div>
            </div>

            {/* IBAN */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-medium text-[12px] px-3 py-1 bg-white">Número do IBAN</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200 font-mono">
                {displayIBAN}
              </div>
            </div>

            {/* Nome do Titular */}
            <div>
              <div className="text-[#0a52a3] font-medium text-[12px] px-3 py-1 bg-white">Nome Completo do Titular</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200 font-mono">
                {displayHolder}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDERING SUB-PAGE: Alterar a senha de Login
  if (activeSubPage === 'loginPassword') {
    return (
      <div className="fixed inset-0 z-[50] bg-[#f5f5f5] flex flex-col font-sans animate-fadeIn">
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 select-none" style={{ height: '48px' }}>
          <button 
            onClick={() => setActiveSubPage('none')} 
            className="text-neutral-500 hover:text-neutral-800 select-none cursor-pointer focus:outline-none flex items-center p-1"
            id="login-pass-back-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-[15px] font-normal text-neutral-850 tracking-tight text-center flex-1 translate-x-[-10px]">Alterar a senha de Login</span>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 p-3 space-y-4 bg-white overflow-y-auto">
          {/* Box 1: Inputs */}
          <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
            <div className="bg-white py-2.5 px-2 border-b border-gray-200 text-center text-[#e1251b] font-bold text-[12px]">
              Alterar credenciais de acesso
            </div>

            {/* Senha Antiga */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Senha Antiga</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200">
                <input 
                  type="password"
                  placeholder="Senha Antiga"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-sans font-bold"
                />
              </div>
            </div>

            {/* Nova Senha */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Nova Senha</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200">
                <input 
                  type="password"
                  placeholder="Nova Senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-sans font-bold"
                />
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Confirmar Nova Senha</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200">
                <input 
                  type="password"
                  placeholder="Confirmar Nova Senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-sans font-bold"
                />
              </div>
            </div>
          </div>

          {/* Box 2: Info */}
          <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
            <div className="bg-white py-2.5 px-2 border-b border-gray-200 text-center text-[#e1251b] font-bold text-[12px]">
              Requisitos de Segurança
            </div>

            <div>
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Recomendação</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] font-sans border-t border-gray-200">
                Mínimo de 6 caracteres ou mais
              </div>
            </div>
          </div>

          {/* Box 3: Button */}
          <div className="flex flex-col items-center justify-center pt-2 select-none">
            <button
              type="button"
              onClick={() => handlePasswordReset('login')}
              className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white font-bold text-[12px] py-2 px-6 rounded-sm cursor-pointer transition-colors w-full text-center uppercase tracking-wide"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. RENDERING SUB-PAGE: Gravar/ Alterar a Senha de Pagamento
  if (activeSubPage === 'payPassword') {
    return (
      <div className="fixed inset-0 z-[50] bg-[#f5f5f5] flex flex-col font-sans animate-fadeIn">
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 select-none" style={{ height: '48px' }}>
          <button 
            onClick={() => setActiveSubPage('none')} 
            className="text-neutral-500 hover:text-neutral-800 select-none cursor-pointer focus:outline-none flex items-center p-1"
            id="pay-pass-back-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-[15px] font-bold text-neutral-850 tracking-tight text-center flex-1 translate-x-[-10px]">Senha de pagamento</span>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 p-3 space-y-4 bg-white overflow-y-auto">
          {/* Inputs */}
          <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
            {/* PIN Antigo */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Código PIN Antigo (4 dígitos)</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200">
                <input 
                  type="password"
                  maxLength={4}
                  placeholder="PIN Antigo"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-mono font-bold tracking-widest"
                />
              </div>
            </div>

            {/* Novo PIN */}
            <div className="border-b border-gray-200">
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Novo PIN de 4 dígitos</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200">
                <input 
                  type="password"
                  maxLength={4}
                  placeholder="Novo PIN"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-mono font-bold tracking-widest"
                />
              </div>
            </div>

            {/* Confirmar PIN */}
            <div>
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Confirmar Novo PIN</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] border-t border-gray-200">
                <input 
                  type="password"
                  maxLength={4}
                  placeholder="Confirmar PIN"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 text-[12px] font-mono font-bold tracking-widest"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
            <div>
              <div className="text-[#0a52a3] font-bold text-[12px] px-3 py-1 bg-white">Onde é necessário?</div>
              <div className="bg-[#f5f5f5] text-gray-700 px-3 py-1.5 text-[12px] font-sans border-t border-gray-200">
                Será exigido em todas as solicitações de retirada
              </div>
            </div>
          </div>

          {/* Box 3: Button */}
          <div className="flex flex-col items-center justify-center pt-2 select-none">
            <button
              type="button"
              onClick={() => handlePasswordReset('payment')}
              className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white font-bold text-[12px] py-2 px-6 rounded-sm cursor-pointer transition-colors w-full text-center uppercase tracking-wide"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. OTHERWISE, RENDER MAIN "AS MINHAS INFORMAÇÕES" LIST
  return (
    <div 
      className="fixed inset-0 bg-white z-[50] flex flex-col animate-slideUp font-sans" 
      id="as-minhas-informacoes-page"
    >
      {/* Header Navigation exactly matching layout */}
      <div className="bg-[#edf2f7] py-4 px-4 flex items-center border-b border-neutral-200 select-none relative h-14">
        <button 
          id="back-profile-from-info"
          onClick={onClose}
          className="p-1 hover:bg-neutral-200 rounded-full cursor-pointer transition-colors absolute left-3 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-full text-center text-[15.5px] font-normal text-[#1a202c]">
          Configurações
        </div>
      </div>

      {/* Scrollable Rows Container */}
      <div className="flex-1 overflow-y-auto bg-white select-none">
        
        {/* Row 1: Imagem do perfil */}
        <div 
          onClick={() => alert('Para alterar a imagem do perfil do canal, use o painel VIP ou entre em contacto com o suporte.')}
          className="flex items-center justify-between py-4.5 px-4 cursor-pointer hover:bg-neutral-50 border-b border-slate-100"
          id="row-img-perfil"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-[#f6ad55] flex items-center justify-center border border-[#dd6b20]/30">
              <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
            </div>
            <span className="text-[13.5px] font-normal text-[#2d3748]">Imagem do perfil</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-10 w-10 rounded-full bg-[#e2e8f0] flex items-center justify-center border border-white overflow-hidden text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 translate-y-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Row 2: Informação: (Mobile Number) */}
        <div 
          onClick={() => alert(`Número verificado com o código do país: +${user.phone}`)}
          className="flex items-center justify-between py-4.5 px-4 cursor-pointer hover:bg-neutral-50 border-b border-slate-100"
          id="row-info-num"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 flex items-center justify-center">
              <img src={passwordLoginIcon} alt="Informação" className="w-full h-full object-contain" />
            </div>
            <span className="text-[13.5px] font-normal text-[#2d3748]">Informação:</span>
          </div>
          <div className="text-[13px] font-normal text-neutral-500 font-mono pr-1 select-text">
            {user.phone || '244922342885'}
          </div>
        </div>

        {/* Row 3: Informação de retirada */}
        <div 
          onClick={() => setActiveSubPage('withdrawInfo')}
          className="flex items-center justify-between py-4.5 px-4 cursor-pointer hover:bg-neutral-50 border-b border-slate-100"
          id="row-retira-info"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 flex items-center justify-center">
              <img src={cardWithdrawalIcon} alt="Informação de retirada" className="w-full h-full object-contain" />
            </div>
            <span className="text-[13.5px] font-normal text-[#2d3748]">Informação de retirada</span>
          </div>
          <div className="text-neutral-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Row 4: Alterar a senha de Login */}
        <div 
          onClick={() => setActiveSubPage('loginPassword')}
          className="flex items-center justify-between py-4.5 px-4 cursor-pointer hover:bg-neutral-50 border-b border-slate-100"
          id="row-alt-pass"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 flex items-center justify-center">
              <img src={passwordLoginIcon} alt="Alterar a senha de Login" className="w-full h-full object-contain" />
            </div>
            <span className="text-[13.5px] font-normal text-[#2d3748]">Alterar a senha de Login</span>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Row 6: Gravar/ Alterar a Senha de Pagamento */}
        <div 
          onClick={() => setActiveSubPage('payPassword')}
          className="flex items-center justify-between py-4.5 px-4 cursor-pointer hover:bg-neutral-50 border-b border-slate-100"
          id="row-alt-pay-pass"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 flex items-center justify-center">
              <img src={passwordRetiradaIcon} alt="Gravar/ Alterar a Senha de Pagamento" className="w-full h-full object-contain" />
            </div>
            <span className="text-[13.5px] font-normal text-[#2d3748]">Gravar/ Alterar a Senha de Pagamento</span>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>



      </div>
    </div>
  );
};
