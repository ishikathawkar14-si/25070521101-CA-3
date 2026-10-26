import React from 'react';
import { ArrowRightLeft, Eye, Edit3, Trash2, MapPin, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SkillCard = ({
  skill,
  onViewDetails,
  onRequestExchange,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();

  const isOwner = user && skill.user && (
    (typeof skill.user === 'object' && skill.user._id === user._id) ||
    skill.user === user._id
  );

  const ownerName = skill.user?.name || 'Fellow Student';
  const ownerMajor = skill.user?.major || 'Campus Member';
  const ownerAvatar =
    skill.user?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Card Header Badges */}
      <div style={{ padding: '1.25rem 1.25rem 0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="badge badge-primary">{skill.category}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className="badge badge-secondary">{skill.level}</span>
          {skill.type === 'wanted' && (
            <span className="badge badge-warning">Wanted</span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div style={{ padding: '0.5rem 1.25rem', flex: 1 }}>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '0.5rem',
            lineHeight: 1.35,
          }}
        >
          {skill.title}
        </h3>
        <p
          style={{
            color: '#64748b',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '1rem',
          }}
        >
          {skill.description}
        </p>

        {/* Desired Skills In Return Preview */}
        {skill.wantedSkills && skill.wantedSkills.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
              Interested in:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {skill.wantedSkills.slice(0, 2).map((wanted, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    background: '#f8fafc',
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontWeight: 500,
                  }}
                >
                  {wanted}
                </span>
              ))}
              {skill.wantedSkills.length > 2 && (
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '2px 4px' }}>
                  +{skill.wantedSkills.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mode Tag */}
      <div style={{ padding: '0 1.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
        <MapPin style={{ width: '14px', height: '14px', color: '#6366f1' }} />
        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {skill.mode || 'Flexible / Hybrid'}
        </span>
      </div>

      {/* Card Footer: Owner Info & Actions */}
      <div
        style={{
          borderTop: '1px solid #f1f5f9',
          padding: '1rem 1.25rem',
          backgroundColor: '#fafbfc',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {/* Owner meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={ownerAvatar}
            alt={ownerName}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid #e2e8f0',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ownerName}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ownerMajor}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(skill)}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            <Eye style={{ width: '14px', height: '14px' }} />
            Details
          </button>

          {isOwner ? (
            <>
              <button
                type="button"
                onClick={() => onEdit && onEdit(skill)}
                className="btn btn-secondary btn-sm"
                title="Edit Skill"
              >
                <Edit3 style={{ width: '14px', height: '14px', color: '#4f46e5' }} />
              </button>
              <button
                type="button"
                onClick={() => onDelete && onDelete(skill)}
                className="btn btn-danger btn-sm"
                title="Delete Skill"
              >
                <Trash2 style={{ width: '14px', height: '14px' }} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onRequestExchange && onRequestExchange(skill)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1.2 }}
            >
              <ArrowRightLeft style={{ width: '14px', height: '14px' }} />
              Swap Skill
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
