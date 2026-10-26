import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, HelpCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem',
        backgroundColor: '#f8fafc',
        textAlign: 'center',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '3.5rem 2rem',
          borderRadius: '24px',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            fontSize: '5rem',
            fontWeight: 900,
            color: '#4f46e5',
            lineHeight: 1,
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)',
          }}
        >
          404
        </div>
        <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.75rem' }}>
          Classroom Not Found
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Looks like the campus page or skill exchange you're looking for doesn't exist or has moved to a new building.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary">
            <Home style={{ width: '16px', height: '16px' }} />
            Return Home
          </Link>
          <Link to="/explore" className="btn btn-primary">
            <Compass style={{ width: '16px', height: '16px' }} />
            Explore Campus Skills
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
