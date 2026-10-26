import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ text = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', gap: '0.75rem' }}>
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>{text}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '80px', height: '24px', background: '#f1f5f9', borderRadius: '12px' }}></div>
        <div style={{ width: '60px', height: '24px', background: '#f1f5f9', borderRadius: '12px' }}></div>
      </div>
      <div style={{ width: '75%', height: '24px', background: '#f1f5f9', borderRadius: '6px' }}></div>
      <div style={{ width: '100%', height: '48px', background: '#f8fafc', borderRadius: '6px' }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0' }}></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ width: '50%', height: '14px', background: '#f1f5f9', borderRadius: '4px' }}></div>
          <div style={{ width: '30%', height: '12px', background: '#f8fafc', borderRadius: '4px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
