import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const SupportScreen: React.FC = () => {
  const navigate = useNavigate();

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
  };

  const pageInnerStyle: React.CSSProperties = {
    maxWidth: 540,
    margin: '0 auto',
    width: '100%',
    padding: '24px 16px',
  };

  const headerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottom: '1px solid #e5e7eb',
  };

  const backButtonStyle: React.CSSProperties = {
    width: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#475569',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  };

  const titleStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 400,
    color: '#111827',
  };

  const supportLinksStyle: React.CSSProperties = {
    marginTop: 28,
    display: 'grid',
    gap: 18,
  };

  const supportItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  };

  const linkStyle: React.CSSProperties = {
    color: '#2563eb',
    textDecoration: 'none',
    flex: 1,
    fontSize: 14,
    lineHeight: 1.5,
    wordBreak: 'break-word',
  };

  const actionStyle: React.CSSProperties = {
    color: '#059669',
    fontWeight: 700,
    fontSize: 12,
    textDecoration: 'underline',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  };

  return (
    <div style={pageStyle}>
      <div style={pageInnerStyle}>
        <div style={headerStyle}>
          <button type="button" onClick={() => navigate(-1)} style={backButtonStyle}>
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div style={titleStyle}>Suporte</div>
        </div>

        <div style={supportLinksStyle}>
          <div style={supportItemStyle}>
            <a href="#" style={linkStyle}>
              Centro de suporte e atendimento ao cliente
            </a>
            <span style={actionStyle}>Abrir</span>
          </div>
          <div style={supportItemStyle}>
            <a href="#" style={linkStyle}>
              Falar com suporte técnico especializado
            </a>
            <span style={actionStyle}>Abrir</span>
          </div>
        </div>
      </div>
    </div>
  );
};
