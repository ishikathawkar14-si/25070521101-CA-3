import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles, GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail) => {
    setError('');
    try {
      setLoading(true);
      await demoLogin(demoEmail);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed. Make sure seed data has been loaded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem',
        backgroundColor: '#f8fafc',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '2.5rem',
          borderRadius: '20px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <GraduationCap style={{ width: '28px', height: '28px' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.925rem' }}>
            Sign in to manage your skills and exchange requests
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              border: '1px solid #fecaca',
            }}
          >
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: '#94a3b8',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <Lock
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: '#94a3b8',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 0,
                }}
              >
                {showPassword ? (
                  <EyeOff style={{ width: '18px', height: '18px' }} />
                ) : (
                  <Eye style={{ width: '18px', height: '18px' }} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', fontSize: '1rem' }}
          >
            <LogIn style={{ width: '18px', height: '18px' }} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast-Login Section */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
            ⚡ 1-Click Demo Evaluation Profiles
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('alex.chen@campus.edu')}
              className="btn btn-secondary btn-sm"
              disabled={loading}
              style={{ fontSize: '0.75rem', padding: '0.5rem' }}
            >
              👤 Alex (CS Major)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('maya.rodriguez@campus.edu')}
              className="btn btn-secondary btn-sm"
              disabled={loading}
              style={{ fontSize: '0.75rem', padding: '0.5rem' }}
            >
              🎨 Maya (Design Major)
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '6px' }}>
            Password for demo accounts: <code>password123</code>
          </div>
        </div>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have a student account?{' '}
          <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600 }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
