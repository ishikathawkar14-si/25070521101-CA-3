import React, { useState } from 'react';
import { X, Send, ArrowRightLeft, Sparkles, MapPin, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ExchangeModal = ({ isOpen, skill, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [skillOffered, setSkillOffered] = useState('');
  const [message, setMessage] = useState('');
  const [preferredMode, setPreferredMode] = useState('Flexible / Chat First');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !skill) return null;

  const isOwner = user && skill.user && (skill.user._id === user._id || skill.user === user._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isOwner) {
      setError('You cannot request an exchange on your own skill listing.');
      return;
    }

    if (!skillOffered.trim()) {
      setError('Please specify the skill or knowledge you can offer in return.');
      return;
    }

    if (!message.trim()) {
      setError('Please write a brief proposal note for the skill owner.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.sendExchangeRequest({
        skillRequestedId: skill._id,
        skillOffered: skillOffered.trim(),
        message: message.trim(),
        preferredMode,
      });

      if (res.success) {
        onSuccess && onSuccess(res.message || 'Exchange proposal sent successfully!');
        onClose();
      } else {
        setError(res.message || 'Failed to send request');
      }
    } catch (err) {
      setError(err.message || 'Could not send exchange request');
    } finally {
      setLoading(false);
    }
  };

  // Student's existing offered skills for quick-fill
  const myOfferedSkills = user?.skillsTeaching || user?.skillsOffered || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ padding: '2rem', maxWidth: '560px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4f46e5', fontSize: '0.825rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              <ArrowRightLeft style={{ width: '16px', height: '16px' }} />
              Skill Swap Request
            </div>
            <h2 style={{ fontSize: '1.35rem', color: '#0f172a' }}>
              Propose an Exchange
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
          >
            <X style={{ width: '22px', height: '22px' }} />
          </button>
        </div>

        {/* Skill Preview Card */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <img
            src={skill.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
            alt={skill.user?.name || 'Owner'}
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e7ff' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Learning from <strong style={{ color: '#0f172a' }}>{skill.user?.name || 'Student'}</strong> ({skill.user?.major || 'Campus'})
            </div>
            <h4 style={{ fontSize: '1rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {skill.title}
            </h4>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <span className="badge badge-primary">{skill.category}</span>
              <span className="badge badge-secondary">{skill.level}</span>
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              What skill can you teach or offer in return? *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Graphic Design with Figma, Python, Video Editing..."
              value={skillOffered}
              onChange={(e) => setSkillOffered(e.target.value)}
              required
            />
            {myOfferedSkills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Quick select:</span>
                {myOfferedSkills.map((sk, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSkillOffered(sk)}
                    style={{
                      border: '1px solid #cbd5e1',
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: '#4f46e5',
                    }}
                  >
                    + {sk}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Proposal Message & Study Plan *
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Hi! I saw your listing and would love to exchange 1-on-1 sessions. I'm free on weekends and weekday evenings..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Include your schedule availability and what specific topics you hope to master.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Exchange Mode</label>
            <select
              className="form-select"
              value={preferredMode}
              onChange={(e) => setPreferredMode(e.target.value)}
            >
              <option value="Flexible / Chat First">Flexible / Chat First</option>
              <option value="Online (Zoom/Google Meet)">Online (Zoom/Google Meet)</option>
              <option value="In-Person (Campus Library / Student Center)">
                In-Person (Campus Library / Student Center)
              </option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isOwner}
              className="btn btn-primary"
              style={{ opacity: loading || isOwner ? 0.7 : 1 }}
            >
              <Send style={{ width: '16px', height: '16px' }} />
              {loading ? 'Sending Request...' : 'Send Swap Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExchangeModal;
