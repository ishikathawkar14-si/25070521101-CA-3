import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        backgroundColor: type === 'error' ? '#fef2f2' : type === 'info' ? '#eef2ff' : '#ecfdf5',
        color: type === 'error' ? '#991b1b' : type === 'info' ? '#3730a3' : '#065f46',
        borderRadius: '12px',
        border: `1px solid ${type === 'error' ? '#fecaca' : type === 'info' ? '#c7d2fe' : '#a7f3d0'}`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        maxWidth: '420px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '✅'}
      </div>
      <div style={{ fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>{message}</div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          color: 'currentColor',
          opacity: 0.6,
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
