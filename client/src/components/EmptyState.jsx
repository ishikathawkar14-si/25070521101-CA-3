import React from 'react';
import { Sparkles, Inbox, Search, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'Try adjusting your search criteria or create a new entry to get started.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px dashed #cbd5e1',
        maxWidth: '520px',
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#eef2ff',
          color: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <Icon style={{ width: '28px', height: '28px' }} />
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: '380px' }}>
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          <PlusCircle style={{ width: '18px', height: '18px' }} />
          {actionText}
        </Link>
      )}

      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
