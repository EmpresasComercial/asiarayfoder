import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Lock, Shield, ArrowRightLeft, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LoginScreen: React.FC = () => {
  const { login, registerUser, showLoading, hideLoading } = useApp();
  
  // Set default view to 'cadastro' (registration/signup) to match the requested image as default, but allow toggling
  const [currentView, setCurrentView] = useState<'cadastro' | 'login'>('cadastro');
  
  const [phone, setPhone] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [convite, setConvite] = useState<string>('931242'); // default invite code
  const [verificacao, setVerificacao] = useState<string>('');
  
  const [captchaText, setCaptchaText] = useState<string>('FyPAE');
  const [validationError, setValidationError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Generates randomized authentic security captcha codes
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
  };

  useEffect(() => {
    generateCaptcha();
  }, [currentView]);

  const handleSubmitCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');

    if (!phone) {
      setValidationError('Por favor, informe seu número de telefone.');
      return;
    }
    if (!senha) {
      setValidationError('Por favor, digite sua senha de segurança.');
      return;
    }
    if (!convite) {
      setValidationError('Por favor, informe o código de convite obrigatório.');
      return;
    }
    if (verificacao.toLowerCase() !== captchaText.toLowerCase()) {
      setValidationError('Código de verificação incorreto.');
      generateCaptcha();
      setVerificacao('');
      return;
    }

    showLoading('Criando e registando a sua conta Asiaray...');

    setTimeout(() => {
      try {
        registerUser(phone, senha, convite);
        setSuccessMsg('Conta registrada com sucesso! Carregando painel...');
      } catch (err) {
        setValidationError('Erro ao registrar conta.');
      } finally {
        hideLoading();
      }
    }, 1200);
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');

    if (!phone) {
      setValidationError('Por favor, informe seu número de telefone.');
      return;
    }
    if (!senha) {
      setValidationError('Por favor, digite sua senha.');
      return;
    }

    showLoading('A validar credenciais de conta...');

    setTimeout(() => {
      const ok = login(phone, senha);
      hideLoading();
      if (ok) {
        setSuccessMsg('Conectado com sucesso!');
      } else {
        setValidationError('Falha ao aceder. Verifique os dados ou registe uma nova conta se ainda não o fez.');
      }
    }, 1000);
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 select-none overflow-hidden gradient-bg"
      id="auth-screen-root"
    >
      {/* 
        High-fidelity realistic Airplane Background Overlays matching the original image!
        Includes dynamic stylized airliners hovering in the background with realistic cockpit/turbine outlines.
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-45 z-0">
        
        {/* Top-Left Jet Airliner */}
        <svg className="absolute top-[3%] left-[2%] w-[42%] max-w-[400px] h-auto text-slate-800/10" viewBox="0 0 400 200" fill="currentColor">
          <path d="M50,120 L150,110 L280,40 L300,43 L210,112 L350,115 C370,116 390,125 390,135 C390,145 370,148 350,148 L220,150 L260,190 L240,195 L170,151 L50,155 C30,155 10,145 10,135 C10,125 30,120 50,120 Z" />
          {/* Jet engines details */}
          <ellipse cx="160" cy="140" rx="15" ry="5" fill="rgba(255,255,255,0.2)" />
          <ellipse cx="200" cy="140" rx="12" ry="4" fill="rgba(255,255,255,0.2)" />
        </svg>

        {/* Right Edge Airfoil Tail/Cockpit Silhouette */}
        <svg className="absolute right-[-4%] top-[10%] w-[25%] max-w-[280px] h-auto text-black/15" viewBox="0 0 200 600" fill="currentColor">
          <path d="M150,0 C170,100 190,250 190,400 C190,550 160,600 130,600 L110,600 C110,600 140,510 140,400 C140,290 100,100 80,0 Z" />
        </svg>

        {/* Diagonal Soft Clouds / Navigation Trails */}
        <div className="absolute top-[40%] left-[-10%] w-[120%] h-[3px] bg-slate-100 rotate-12"></div>
        <div className="absolute top-[48%] left-[-10%] w-[120%] h-[1.5px] bg-white/15 rotate-12"></div>
        <div className="absolute top-[65%] left-[-10%] w-[120%] h-[2px] bg-white/5 -rotate-6"></div>
      </div>

      {/* Floating Gold/Orange Right Action Icon (Support Headset Bubble) from original image */}
      <div 
        onClick={() => {
          alert('Suporte: WhatsApp/Telegram Geral Asiaray Angola +244 922 342 885.');
        }}
        className="fixed right-4 top-[40%] -translate-y-1/2 bg-[#f57c00] border border-white/20 text-slate-800 p-2.5 rounded-full shadow-lg z-50 cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center justify-center animate-bounce"
        id="auth-right-floating-support"
        style={{ animationDuration: '3s' }}
      >
        <Headphones size={22} className="text-slate-800" />
      </div>

      {/* Main card box with translucent wrapper to match the exact spacing and design */}
      <div 
        className="w-full max-w-[382px] p-[6px] rounded-[14px] glass shadow-2xl z-10 animate-float"
        id="auth-card-border-outer"
      >
        <div 
          className="bg-[#0f172a]/40 backdrop-blur-md rounded-[10px] p-5 flex flex-col items-stretch space-y-3.5 border border-slate-200"
          id="auth-card-body-inner"
        >
          {/* App title header inside auth */}
          <div className="text-center pt-1 pb-1">
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-widest leading-none font-sans drop-shadow-[0_0_15px_rgba(20,255,236,0.6)]">
              Asiaray Group
            </h1>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">
              {currentView === 'cadastro' ? 'Registo de Nova Conta' : 'Aceder ao Escritório'}
            </p>
          </div>

          {/* Validation alerts rendering elegantly inside the card */}
          {validationError && (
            <div className="text-[11.5px] bg-red-50 text-red-650 px-3 py-2 rounded-sm border border-red-200/90 font-medium tracking-tight">
              ⚠️ {validationError}
            </div>
          )}

          {successMsg && (
            <div className="text-[11.5px] bg-emerald-50 text-emerald-700 px-3 py-2 rounded-sm border border-emerald-200 font-medium tracking-tight animate-pulse">
              ✓ {successMsg}
            </div>
          )}

          {/* 
            FORM VIEW CONTROLLERS 
            1. Registration view matches the original image.
            2. Login view is optimized and aligned in identical fashion.
          */}
          <AnimatePresence mode="wait">
            {currentView === 'cadastro' ? (
              <motion.form 
                key="cadastro-form"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmitCadastro}
                className="space-y-3 flex flex-col"
                id="form-cadastro-asiaray"
              >
                {/* Input 1: Phone Element */}
                <div className="relative glass border border-white/20 rounded-[8px] h-[48px] flex items-center px-3 hover-lift transition-all">
                  <div className="flex items-center text-slate-300 shrink-0 font-sans text-[13.5px]">
                    <User size={16} className="text-[#0d7377] mr-1.5" />
                    <span className="text-slate-800/20 font-light mx-1 select-none">|</span>
                    <span className="ml-1 text-slate-800 font-bold">+ Mobile</span>
                  </div>
                  <input 
                    id="cadastro-phone-field"
                    type="tel" 
                    placeholder="9XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ''))}
                    className="flex-1 bg-transparent pl-3 text-slate-800 font-sans text-[13.5px] font-bold focus:outline-none placeholder-white/40"
                  />
                </div>

                {/* Input 2: Senha (Password) */}
                <div className="relative glass border border-white/20 rounded-[8px] h-[48px] flex items-center px-3 hover-lift transition-all">
                  <div className="flex items-center text-slate-300 shrink-0 font-sans text-[13.5px]">
                    <Lock size={16} className="text-[#0d7377] mr-1.5" />
                    <span className="text-slate-800/20 font-light mx-1 select-none">|</span>
                  </div>
                  <input 
                    id="cadastro-senha-field"
                    type="password" 
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="flex-1 bg-transparent pl-3 text-slate-800 font-sans text-[13.5px] font-bold focus:outline-none placeholder-white/40"
                  />
                </div>

                {/* Input 3: Invitation Code (Código do convite) */}
                <div className="relative glass border border-white/20 rounded-[8px] h-[48px] flex items-center px-3 hover-lift transition-all">
                  <div className="flex items-center text-slate-300 shrink-0 font-sans text-[13.5px]">
                    <Lock size={16} className="text-[#0d7377] mr-1.5" />
                    <span className="text-slate-800/20 font-light mx-1 select-none">|</span>
                  </div>
                  <input 
                    id="cadastro-invitation-field"
                    type="text" 
                    placeholder="Código do convite"
                    value={convite}
                    onChange={(e) => setConvite(e.target.value)}
                    className="flex-1 bg-transparent pl-3 text-slate-800 font-sans text-[13.5px] font-bold focus:outline-none placeholder-white/40"
                  />
                </div>

                {/* Input 4: Captcha Verification Code Block */}
                <div className="flex gap-2">
                  <div className="flex-1 glass border border-white/20 rounded-[8px] h-[48px] flex items-center px-3 hover-lift transition-all">
                    <div className="flex items-center text-slate-300 shrink-0 font-sans text-[13.5px]">
                      <Shield size={16} className="text-[#0d7377] mr-1.5" />
                      <span className="text-slate-800/20 font-light mx-1 select-none">|</span>
                    </div>
                    <input 
                      id="cadastro-verificacao-field"
                      type="text" 
                      placeholder="Código de verificação"
                      value={verificacao}
                      onChange={(e) => setVerificacao(e.target.value.replace(/\s+/g, ''))}
                      className="flex-1 bg-transparent pl-3 text-slate-800 font-sans text-[13px] font-bold focus:outline-none placeholder-white/40"
                    />
                  </div>

                  {/* 
                    Simulated Wavy Green Custom Captcha, built via high-fidelity SVGs 
                    to look completely real in every aspect! Clicking it re-rolls code.
                  */}
                  <div 
                    onClick={generateCaptcha}
                    className="w-[110px] bg-slate-100 rounded-[4px] border border-neutral-300 h-[48px] relative overflow-hidden flex items-center justify-center cursor-pointer select-none group"
                    title="Toque para reconfigurar código"
                    id="cadastro-verification-captcha-box"
                  >
                    {/* Wavy lines layers */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="#f1f5f9" />
                      {/* Organic wave paths */}
                      <path d="M-10,30 Q30,12 60,34 T130,15" stroke="#4caf50" strokeWidth="1.2" fill="none" opacity="0.4" />
                      <path d="M-20,15 Q25,40 70,18 T140,35" stroke="#2e7d32" strokeWidth="1.6" fill="none" opacity="0.65" />
                      <path d="M0,24 Q45,8 85,28 T150,20" stroke="#81c784" strokeWidth="1.0" fill="none" opacity="0.5" />
                      <path d="M-5,10 C40,40 60,-10 120,25" stroke="#1b5e20" strokeWidth="1.5" fill="none" opacity="0.4" />
                    </svg>

                    {/* Highly authentic rotated captcha lettering */}
                    <div className="relative font-mono text-[16px] font-black text-[#2e7d32] tracking-wider flex items-center justify-center gap-[4px] select-none uppercase">
                      {captchaText.split('').map((char, index) => {
                        const rot = (index % 2 === 0 ? 1 : -1) * (15 + index * 4);
                        const transY = (index % 3 === 0 ? -2 : index % 3 === 1 ? 3 : 0);
                        return (
                          <span 
                            key={index}
                            style={{ 
                              display: 'inline-block',
                              transform: `rotate(${rot}deg) translateY(${transY}px)` 
                            }}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Primary Teal Action Buttons conforming exactly to the Image Layout! */}
                <div className="pt-2.5 space-y-3 flex flex-col">
                  {/* Submit Registration button */}
                  <button 
                    id="submit-register-action-btn"
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#0d7377] to-[#14ffec] text-[#0f172a] font-bold h-[48px] rounded-[8px] tracking-wide text-[14px] transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(20,255,236,0.5)] hover:scale-[1.02]"
                  >
                    Registar
                  </button>

                  {/* Switch to login mode button */}
                  <button 
                    id="toggle-to-login-view-btn"
                    type="button"
                    onClick={() => {
                      setCurrentView('login');
                      setValidationError('');
                      setSuccessMsg('');
                    }}
                    className="w-full glass text-slate-800 font-bold h-[48px] rounded-[8px] tracking-wide text-[14px] transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-slate-100"
                  >
                    Login
                  </button>
                </div>

              </motion.form>
            ) : (
              /* LOGIN TAB VIEW (Renders when switched) */
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmitLogin}
                className="space-y-3.5 flex flex-col"
                id="form-login-asiaray"
              >
                {/* Input 1: Phone */}
                <div className="relative glass border border-white/20 rounded-[8px] h-[48px] flex items-center px-3 hover-lift transition-all">
                  <div className="flex items-center text-slate-300 shrink-0 font-sans text-[13.5px]">
                    <User size={16} className="text-[#0d7377] mr-1.5" />
                    <span className="text-slate-800/20 font-light mx-1 select-none">|</span>
                    <span className="ml-1 text-slate-800 font-bold">+ Mobile</span>
                  </div>
                  <input 
                    id="login-phone-field"
                    type="tel" 
                    placeholder="Seu telemóvel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ''))}
                    className="flex-1 bg-transparent pl-3 text-slate-800 font-sans text-[13.5px] font-bold focus:outline-none placeholder-white/40"
                  />
                </div>

                {/* Input 2: Senha (Password) */}
                <div className="relative glass border border-white/20 rounded-[8px] h-[48px] flex items-center px-3 hover-lift transition-all">
                  <div className="flex items-center text-slate-300 shrink-0 font-sans text-[13.5px]">
                    <Lock size={16} className="text-[#0d7377] mr-1.5" />
                    <span className="text-slate-800/20 font-light mx-1 select-none">|</span>
                  </div>
                  <input 
                    id="login-senha-field"
                    type="password" 
                    placeholder="Sua senha de acesso"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="flex-1 bg-transparent pl-3 text-slate-800 font-sans text-[13.5px] font-bold focus:outline-none placeholder-white/40"
                  />
                </div>

                {/* Action buttons (Styled identically for clean consistency) */}
                <div className="pt-2 px-0.5 space-y-3 flex flex-col">
                  {/* Primary Login Button */}
                  <button 
                    id="submit-login-action-btn"
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#0d7377] to-[#14ffec] text-[#0f172a] font-bold h-[48px] rounded-[8px] tracking-wide text-[14px] transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(20,255,236,0.5)] hover:scale-[1.02]"
                  >
                    Login
                  </button>

                  {/* Switch to register mode button */}
                  <button 
                    id="toggle-to-cadastro-view-btn"
                    type="button"
                    onClick={() => {
                      setCurrentView('cadastro');
                      setValidationError('');
                      setSuccessMsg('');
                    }}
                    className="w-full glass text-slate-800 font-bold h-[48px] rounded-[8px] tracking-wide text-[14px] transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-slate-100"
                  >
                    Não tem conta? Registar
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Footer labels */}
      <div className="mt-7 text-slate-800/55 text-[11px] text-center z-10 font-sans tracking-wide">
        <p>© 2026 Asiaray Angola. Todos os direitos reservados.</p>
        <p className="mt-0.5 opacity-70">Certificação de segurança WS2 ativa e encriptada.</p>
      </div>

    </div>
  );
};
