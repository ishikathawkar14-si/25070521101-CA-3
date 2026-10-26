import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  PlusCircle,
  Inbox,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Poll or fetch pending exchange requests count when logged in
  useEffect(() => {
    let isMounted = true;
    const fetchPendingCount = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await api.getMyExchanges();
        if (isMounted && res.success && res.counts) {
          setPendingCount(res.counts.receivedPending || 0);
        }
      } catch (err) {
        // quiet error
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `nav-link ${isActive ? 'nav-link-active' : ''}`;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)',
            }}
          >
            <GraduationCap style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.025em',
              }}
            >
              SkillSwap
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#4f46e5',
                marginLeft: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: '#eef2ff',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              Campus
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/explore"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive ? '#4f46e5' : '#475569',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            })}
          >
            <Compass style={{ width: '16px', height: '16px' }} />
            Explore Skills
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.925rem',
                  fontWeight: 600,
                  color: isActive ? '#4f46e5' : '#475569',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                })}
              >
                <LayoutDashboard style={{ width: '16px', height: '16px' }} />
                Dashboard
              </NavLink>

              <NavLink
                to="/exchanges"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.925rem',
                  fontWeight: 600,
                  color: isActive ? '#4f46e5' : '#475569',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'color 0.15s ease',
                })}
              >
                <Inbox style={{ width: '16px', height: '16px' }} />
                Exchanges
                {pendingCount > 0 && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      padding: '1px 6px',
                      marginLeft: '2px',
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            </>
          ) : (
            <a
              href="/#how-it-works"
              style={{
                fontSize: '0.925rem',
                fontWeight: 600,
                color: '#475569',
                textDecoration: 'none',
              }}
            >
              How It Works
            </a>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.85rem',
          }}
          className="desktop-actions"
        >
          {isAuthenticated ? (
            <>
              <Link to="/skills/new" className="btn btn-primary btn-sm">
                <PlusCircle style={{ width: '16px', height: '16px' }} />
                List a Skill
              </Link>

              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                  }
                  alt={user?.name || 'User'}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                title="Log Out"
                style={{ color: '#ef4444' }}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#0f172a',
          }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X style={{ width: '24px', height: '24px' }} />
          ) : (
            <Menu style={{ width: '24px', height: '24px' }} />
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              color: '#1e293b',
              padding: '8px 0',
            }}
          >
            <Compass style={{ width: '18px', height: '18px', color: '#4f46e5' }} />
            Explore Skills
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  color: '#1e293b',
                  padding: '8px 0',
                }}
              >
                <LayoutDashboard style={{ width: '18px', height: '18px', color: '#4f46e5' }} />
                Dashboard
              </Link>

              <Link
                to="/exchanges"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  color: '#1e293b',
                  padding: '8px 0',
                }}
              >
                <Inbox style={{ width: '18px', height: '18px', color: '#4f46e5' }} />
                Exchange Requests
                {pendingCount > 0 && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      padding: '1px 6px',
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </Link>

              <Link
                to="/skills/new"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <PlusCircle style={{ width: '16px', height: '16px' }} />
                List a Skill
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <User style={{ width: '16px', height: '16px' }} />
                My Profile
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="btn btn-danger"
                style={{ width: '100%' }}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive media query helper for Navbar */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
