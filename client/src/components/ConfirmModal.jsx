import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        style={{ maxWidth: '440px', padding: '1.75rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: isDanger ? '#fee2e2' : '#e0e7ff',
              color: isDanger ? '#dc2626' : '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle style={{ width: '22px', height: '22px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
              {title}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '4px',
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            style={isDanger ? { backgroundColor: '#dc2626', color: '#fff' } : {}}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
