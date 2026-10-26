import React from 'react';
import { X, Calendar, MapPin, User, BookOpen, CheckCircle, ArrowRightLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SkillDetailModal = ({ isOpen, skill, onClose, onRequestExchange }) => {
  const { user } = useAuth();

  if (!isOpen || !skill) return null;

  const isOwner = user && skill.user && (skill.user._id === user._id || skill.user === user._id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ padding: '2rem', maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-primary">{skill.category}</span>
              <span className="badge badge-secondary">{skill.level}</span>
              <span className={`badge ${skill.type === 'wanted' ? 'badge-warning' : 'badge-success'}`}>
                {skill.type === 'wanted' ? 'Looking to Learn' : 'Offering to Teach'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', lineHeight: 1.3 }}>
              {skill.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
          >
            <X style={{ width: '22px', height: '22px' }} />
          </button>
        </div>

        {/* Teacher profile card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.5rem',
          }}
        >
          <img
            src={skill.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
            alt={skill.user?.name || 'Student'}
            style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #c7d2fe' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              {skill.user?.name || 'Student Member'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {skill.user?.major || 'Undergrad'} • {skill.user?.year || 'Campus'} • {skill.user?.university || 'Campus University'}
            </div>
            {skill.user?.bio && (
              <p style={{ fontSize: '0.825rem', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>
                "{skill.user.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen style={{ width: '16px', height: '16px', color: '#4f46e5' }} />
            About This Skill
          </h4>
          <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {skill.description}
          </p>
        </div>

        {/* Syllabus / Key Highlights */}
        {skill.syllabus && skill.syllabus.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.65rem' }}>
              Key Topics & Takeaways
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
              {skill.syllabus.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    color: '#334155',
                    background: '#f1f5f9',
                    padding: '8px 12px',
                    borderRadius: '8px',
                  }}
                >
                  <CheckCircle style={{ width: '14px', height: '14px', color: '#10b981', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wanted in Return */}
        {skill.wantedSkills && skill.wantedSkills.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowRightLeft style={{ width: '16px', height: '16px', color: '#06b6d4' }} />
              Skills Wanted in Exchange
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skill.wantedSkills.map((wanted, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#ecfeff',
                    color: '#0e7490',
                    border: '1px solid #cffafe',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                  }}
                >
                  {wanted}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Logistics: Mode & Schedule */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            padding: '1rem',
            background: '#faf5ff',
            borderRadius: '12px',
            border: '1px solid #f3e8ff',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase' }}>
              <MapPin style={{ width: '14px', height: '14px' }} />
              Exchange Mode
            </div>
            <div style={{ fontSize: '0.875rem', color: '#3b0764', fontWeight: 600, marginTop: '2px' }}>
              {skill.mode || 'Flexible / Hybrid'}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase' }}>
              <Calendar style={{ width: '14px', height: '14px' }} />
              Availability
            </div>
            <div style={{ fontSize: '0.875rem', color: '#3b0764', fontWeight: 600, marginTop: '2px' }}>
              {skill.availability || 'Flexible schedule'}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          {!isOwner && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestExchange(skill);
              }}
              className="btn btn-primary"
            >
              <ArrowRightLeft style={{ width: '16px', height: '16px' }} />
              Request Exchange
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillDetailModal;
