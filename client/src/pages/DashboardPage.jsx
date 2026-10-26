import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Compass,
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  TrendingUp,
  User,
  AlertCircle,
  ExternalLink,
  Edit3,
  Trash2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import SkillDetailModal from '../components/SkillDetailModal';
import ExchangeModal from '../components/ExchangeModal';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getDashboardData();
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDeleteSkill = (skill) => {
    setSkillToDelete(skill);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    try {
      const res = await api.deleteSkill(skillToDelete._id);
      if (res.success) {
        setToastMessage('Skill listing removed successfully');
        fetchDashboard();
      }
    } catch (err) {
      setToastMessage(`Error: ${err.message}`);
    } finally {
      setDeleteModalOpen(false);
      setSkillToDelete(null);
    }
  };

  const handleOpenDetail = (skill) => {
    setSelectedSkill(skill);
    setDetailModalOpen(true);
  };

  const handleOpenExchange = (skill) => {
    setSelectedSkill(skill);
    setExchangeModalOpen(true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader text="Loading your campus exchange dashboard..." />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    mySkillsCount: 0,
    receivedPendingCount: 0,
    activeExchangesCount: 0,
    totalCompletedCount: 0,
  };

  const mySkills = dashboardData?.mySkills || [];
  const recentReceived = dashboardData?.recentReceived || [];
  const recentSent = dashboardData?.recentSent || [];
  const recommendedMatches = dashboardData?.recommendedMatches || [];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 0 4rem' }}>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      <div className="container">
        {/* Welcome Banner */}
        <div
          className="card"
          style={{
            padding: '2rem',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
              }
              alt={user?.name || 'Student'}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #e0e7ff',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="badge badge-primary">{user?.year || 'Campus Student'}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {user?.university || 'Campus University'}
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', color: '#0f172a' }}>
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Major: <strong>{user?.major || 'Undeclared'}</strong> • Active student exchange profile
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/explore" className="btn btn-secondary">
              <Compass style={{ width: '16px', height: '16px' }} />
              Explore Skills
            </Link>
            <Link to="/skills/new" className="btn btn-primary">
              <PlusCircle style={{ width: '16px', height: '16px' }} />
              List a Skill
            </Link>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: '12px',
              border: '1px solid #fecaca',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        {/* 4 Metric Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Card 1: My Skills */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BookOpen style={{ width: '26px', height: '26px' }} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {stats.mySkillsCount}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                Skills Listed by You
              </div>
            </div>
          </div>

          {/* Card 2: Pending Incoming */}
          <Link
            to="/exchanges"
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              textDecoration: 'none',
              border: stats.receivedPendingCount > 0 ? '1px solid #fcd34d' : '1px solid #e2e8f0',
              backgroundColor: stats.receivedPendingCount > 0 ? '#fffbeb' : '#ffffff',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: stats.receivedPendingCount > 0 ? '#fef3c7' : '#f1f5f9',
                color: stats.receivedPendingCount > 0 ? '#d97706' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Clock style={{ width: '26px', height: '26px' }} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: stats.receivedPendingCount > 0 ? '#b45309' : '#0f172a', lineHeight: 1 }}>
                {stats.receivedPendingCount}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                Pending Incoming Requests
              </div>
            </div>
          </Link>

          {/* Card 3: Active Exchanges */}
          <Link
            to="/exchanges"
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ArrowRightLeft style={{ width: '26px', height: '26px' }} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {stats.activeExchangesCount}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                Active Exchanges
              </div>
            </div>
          </Link>

          {/* Card 4: Total Completed */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#f3e8ff',
                color: '#7e22ce',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircle2 style={{ width: '26px', height: '26px' }} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {stats.totalCompletedCount}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                Completed Swaps
              </div>
            </div>
          </div>
        </div>

        {/* Intelligent Exchange Matches (Algorithmic Recommendations) */}
        {recommendedMatches.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Sparkles style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
              <h2 style={{ fontSize: '1.35rem', color: '#0f172a' }}>
                Smart Exchange Matches For You
              </h2>
              <span className="badge badge-primary">Direct Swaps</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {recommendedMatches.map(({ skill, reasons }, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid #c7d2fe',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="badge badge-primary">{skill.category}</span>
                      <span className="badge badge-secondary">{skill.level}</span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                      {skill.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                      <img
                        src={skill.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={skill.user?.name || 'Student'}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                        {skill.user?.name} ({skill.user?.major})
                      </span>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginBottom: '1rem' }}>
                      {reasons.map((r, i) => (
                        <div key={i} style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenDetail(skill)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleOpenExchange(skill)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1.2 }}
                    >
                      Propose Swap
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-Column Split: My Listed Skills & Recent Exchange Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Left Column: My Listed Skills */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#0f172a' }}>
                My Listed Skills ({mySkills.length})
              </h2>
              <Link to="/skills/new" className="btn btn-secondary btn-sm">
                <PlusCircle style={{ width: '14px', height: '14px' }} />
                Add Skill
              </Link>
            </div>

            {mySkills.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {mySkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                        <span className="badge badge-primary">{skill.category}</span>
                        <span className="badge badge-secondary">{skill.level}</span>
                        {skill.type === 'wanted' && (
                          <span className="badge badge-warning">Wanted</span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {skill.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Mode: {skill.mode || 'Flexible'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => navigate(`/skills/edit/${skill._id}`)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Skill"
                      >
                        <Edit3 style={{ width: '14px', height: '14px', color: '#4f46e5' }} />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill)}
                        className="btn btn-danger btn-sm"
                        title="Delete Skill"
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No skills listed yet"
                description="List your skills so peers can find you and propose exchanges!"
                actionText="List Your First Skill"
                actionLink="/skills/new"
              />
            )}
          </div>

          {/* Right Column: Recent Exchange Requests */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#0f172a' }}>
                Recent Incoming Requests
              </h2>
              <Link to="/exchanges" className="btn btn-secondary btn-sm">
                View All ({stats.receivedPendingCount} pending)
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>

            {recentReceived.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentReceived.map((req) => (
                  <div
                    key={req._id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      borderRadius: '14px',
                      backgroundColor: req.status === 'pending' ? '#fffdf5' : '#ffffff',
                      border: req.status === 'pending' ? '1px solid #fef3c7' : '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={req.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={req.sender?.name || 'Student'}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                            {req.sender?.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {req.sender?.major}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`badge ${
                          req.status === 'accepted'
                            ? 'badge-success'
                            : req.status === 'rejected'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem' }}>
                      Requested: <strong>{req.skillRequested?.title}</strong>
                      <br />
                      Offered: <strong style={{ color: '#059669' }}>{req.skillOffered}</strong>
                    </div>

                    <Link
                      to="/exchanges"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%' }}
                    >
                      Manage in Requests Tab
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ArrowRightLeft}
                title="No incoming requests yet"
                description="Once students find your skills in Explore, their exchange proposals will appear here."
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SkillDetailModal
        isOpen={detailModalOpen}
        skill={selectedSkill}
        onClose={() => setDetailModalOpen(false)}
        onRequestExchange={handleOpenExchange}
      />

      <ExchangeModal
        isOpen={exchangeModalOpen}
        skill={selectedSkill}
        onClose={() => setExchangeModalOpen(false)}
        onSuccess={(msg) => {
          setToastMessage(msg);
          fetchDashboard();
        }}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Skill"
        message={`Are you sure you want to delete "${skillToDelete?.title}"?`}
        confirmText="Delete"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSkillToDelete(null);
        }}
      />
    </div>
  );
};

export default DashboardPage;
