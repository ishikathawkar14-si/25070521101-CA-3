import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  PlusCircle,
  Sparkles,
  BookOpen,
  ArrowRightLeft,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SkillCard from '../components/SkillCard';
import SkillDetailModal from '../components/SkillDetailModal';
import ExchangeModal from '../components/ExchangeModal';
import ConfirmModal from '../components/ConfirmModal';
import { SkeletonCard } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

const CATEGORIES = [
  'All',
  'Programming',
  'Design & Creative',
  'Data & AI',
  'Academics & Science',
  'Languages',
  'Business & Marketing',
  'Media & Audio/Video',
  'Other',
];

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const ExploreSkillsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const level = searchParams.get('level') || 'All';
  const type = searchParams.get('type') || 'All';

  // Modals
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getSkills({ search, category, level, type });
      if (res.success) {
        setSkills(res.skills || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch skills catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [search, category, level, type]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handleOpenDetail = (skill) => {
    setSelectedSkill(skill);
    setDetailModalOpen(true);
  };

  const handleOpenExchange = (skill) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedSkill(skill);
    setExchangeModalOpen(true);
  };

  const handleEditSkill = (skill) => {
    navigate(`/skills/edit/${skill._id}`);
  };

  const handleDeletePrompt = (skill) => {
    setSkillToDelete(skill);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    try {
      const res = await api.deleteSkill(skillToDelete._id);
      if (res.success) {
        setToastMessage('Skill listing deleted successfully');
        setSkills(skills.filter((s) => s._id !== skillToDelete._id));
      }
    } catch (err) {
      setToastMessage(`Error deleting: ${err.message}`);
    } finally {
      setDeleteModalOpen(false);
      setSkillToDelete(null);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)', paddingBottom: '4rem' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      {/* Header Banner */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Campus Directory
              </span>
              <h1 style={{ fontSize: '2rem', color: '#0f172a', marginTop: '0.25rem' }}>
                Explore Campus Skills
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Discover what fellow students know, send exchange requests, and learn together.
              </p>
            </div>

            {isAuthenticated && (
              <button
                onClick={() => navigate('/skills/new')}
                className="btn btn-primary"
              >
                <PlusCircle style={{ width: '18px', height: '18px' }} />
                Post a Skill
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div
            style={{
              position: 'relative',
              maxWidth: '720px',
            }}
          >
            <input
              type="text"
              placeholder="Search by skill name, topic, or description (e.g. Python, UI Design, Calculus)..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '2.75rem',
                paddingRight: search ? '2.5rem' : '1rem',
                paddingTop: '0.85rem',
                paddingBottom: '0.85rem',
                borderRadius: '12px',
                fontSize: '0.95rem',
              }}
            />
            <Search
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#94a3b8',
              }}
            />
            {search && (
              <button
                onClick={() => updateParam('search', '')}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '2rem' }}>
        {/* Filter Controls Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Category Chips Scroll */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
              maxWidth: '100%',
            }}
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => updateParam('category', cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    border: '1px solid',
                    borderColor: active ? '#4f46e5' : '#e2e8f0',
                    backgroundColor: active ? '#4f46e5' : '#ffffff',
                    color: active ? '#ffffff' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Level and Type Dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={level}
              onChange={(e) => updateParam('level', e.target.value)}
              className="form-select"
              style={{ padding: '6px 12px', fontSize: '0.825rem', width: 'auto' }}
            >
              <option value="All">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={type}
              onChange={(e) => updateParam('type', e.target.value)}
              className="form-select"
              style={{ padding: '6px 12px', fontSize: '0.825rem', width: 'auto' }}
            >
              <option value="All">All Listings</option>
              <option value="offered">Offering to Teach</option>
              <option value="wanted">Looking to Learn</option>
            </select>

            {(search || category !== 'All' || level !== 'All' || type !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="btn btn-secondary btn-sm"
                title="Reset Filters"
              >
                <RotateCcw style={{ width: '14px', height: '14px' }} />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
          {!loading && (
            <span>
              Showing <strong>{skills.length}</strong> {skills.length === 1 ? 'skill' : 'skills'}
              {category !== 'All' && ` in ${category}`}
              {search && ` matching "${search}"`}
            </span>
          )}
        </div>

        {/* Error message */}
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

        {/* Grid or Loader */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : skills.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {skills.map((skill) => (
              <SkillCard
                key={skill._id}
                skill={skill}
                onViewDetails={handleOpenDetail}
                onRequestExchange={handleOpenExchange}
                onEdit={handleEditSkill}
                onDelete={handleDeletePrompt}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No skills found"
            description="We couldn't find any skill listings matching your criteria. Try loosening your search filters or list this skill yourself!"
            actionText={isAuthenticated ? 'Post This Skill' : 'Sign Up to Post'}
            actionLink={isAuthenticated ? '/skills/new' : '/register'}
          />
        )}
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
        onSuccess={(msg) => setToastMessage(msg)}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Skill Listing"
        message={`Are you sure you want to delete "${skillToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete Skill"
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

export default ExploreSkillsPage;
