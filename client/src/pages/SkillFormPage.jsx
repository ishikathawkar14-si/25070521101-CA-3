import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  Save,
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const CATEGORIES = [
  'Programming',
  'Design & Creative',
  'Data & AI',
  'Academics & Science',
  'Languages',
  'Business & Marketing',
  'Media & Audio/Video',
  'Other',
];

export const SkillFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Programming',
    level: 'Beginner',
    type: 'offered',
    description: '',
    syllabus: '',
    wantedSkills: '',
    mode: 'Flexible / Hybrid',
    availability: 'Flexible schedule',
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchSkill = async () => {
        try {
          setLoading(true);
          const res = await api.getSkillById(id);
          if (res.success && res.skill) {
            const skill = res.skill;
            // Check ownership
            const ownerId = skill.user?._id || skill.user;
            if (user && ownerId && ownerId !== user._id) {
              setError('You are not authorized to edit this skill.');
              return;
            }

            setFormData({
              title: skill.title || '',
              category: skill.category || 'Programming',
              level: skill.level || 'Beginner',
              type: skill.type || 'offered',
              description: skill.description || '',
              syllabus: Array.isArray(skill.syllabus) ? skill.syllabus.join(', ') : '',
              wantedSkills: Array.isArray(skill.wantedSkills) ? skill.wantedSkills.join(', ') : '',
              mode: skill.mode || 'Flexible / Hybrid',
              availability: skill.availability || 'Flexible schedule',
            });
          }
        } catch (err) {
          setError(err.message || 'Failed to load skill details');
        } finally {
          setLoading(false);
        }
      };
      fetchSkill();
    }
  }, [id, isEditing, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      setError('Please provide title, category, and a clear description.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        level: formData.level,
        type: formData.type,
        description: formData.description.trim(),
        syllabus: formData.syllabus
          ? formData.syllabus.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        wantedSkills: formData.wantedSkills
          ? formData.wantedSkills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        mode: formData.mode,
        availability: formData.availability.trim(),
      };

      if (isEditing) {
        await api.updateSkill(id, payload);
      } else {
        await api.createSkill(payload);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save skill listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader text="Loading skill listing..." />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 1.25rem' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#64748b',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back to Dashboard
          </Link>
        </div>

        {/* Card Form */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isEditing ? 'Update Listing' : 'Campus Knowledge Exchange'}
            </span>
            <h1 style={{ fontSize: '1.85rem', color: '#0f172a', marginTop: '0.25rem' }}>
              {isEditing ? 'Edit Skill Listing' : 'List a Skill to Teach or Learn'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.925rem' }}>
              Fill out the details below. Fellow students on campus will be able to discover this and propose exchanges.
            </p>
          </div>

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

          <form onSubmit={handleSubmit}>
            {/* Listing Type: Offered vs Wanted */}
            <div className="form-group">
              <label className="form-label">Listing Intent</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: `2px solid ${formData.type === 'offered' ? '#4f46e5' : '#e2e8f0'}`,
                    backgroundColor: formData.type === 'offered' ? '#eef2ff' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="offered"
                    checked={formData.type === 'offered'}
                    onChange={handleChange}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.925rem' }}>
                      Skill I Can Teach
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Offer your knowledge to peers
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: `2px solid ${formData.type === 'wanted' ? '#4f46e5' : '#e2e8f0'}`,
                    backgroundColor: formData.type === 'wanted' ? '#eef2ff' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="wanted"
                    checked={formData.type === 'wanted'}
                    onChange={handleChange}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.925rem' }}>
                      Skill I Want to Learn
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Look for a peer tutor
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Skill Title */}
            <div className="form-group">
              <label className="form-label">Skill Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Modern React.js & Web Development, Figma UI/UX Basics..."
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={120}
              />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Keep it concise and clear. Max 120 characters.
              </span>
            </div>

            {/* Category & Level */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Skill Level</label>
                <select
                  name="level"
                  className="form-select"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                rows={4}
                placeholder="Describe what you plan to teach or learn. Include what projects you could build together, prerequisites, and your experience level."
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={1500}
              ></textarea>
            </div>

            {/* Syllabus / Key Highlights */}
            <div className="form-group">
              <label className="form-label">
                Key Topics Covered (comma-separated)
              </label>
              <input
                type="text"
                name="syllabus"
                className="form-input"
                placeholder="e.g. Hooks, Component Architecture, State Management, Deploying with Vercel"
                value={formData.syllabus}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Separate each highlight with a comma.
              </span>
            </div>

            {/* Skills Wanted in Exchange */}
            <div className="form-group">
              <label className="form-label">
                Skills You Want in Return (comma-separated)
              </label>
              <input
                type="text"
                name="wantedSkills"
                className="form-input"
                placeholder="e.g. Graphic Design, Figma, Spanish Conversation, Calculus"
                value={formData.wantedSkills}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Helps the algorithm match you with reciprocal swap partners!
              </span>
            </div>

            {/* Exchange Logistics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Preferred Exchange Mode</label>
                <select
                  name="mode"
                  className="form-select"
                  value={formData.mode}
                  onChange={handleChange}
                >
                  <option value="Flexible / Hybrid">Flexible / Hybrid</option>
                  <option value="In-Person (Campus)">In-Person (Campus Library / Student Center)</option>
                  <option value="Online / Zoom / Discord">Online / Zoom / Discord</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Availability Schedule</label>
                <input
                  type="text"
                  name="availability"
                  className="form-input"
                  placeholder="e.g. Weekdays after 5 PM, Weekends"
                  value={formData.availability}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ minWidth: '160px' }}
              >
                <Save style={{ width: '18px', height: '18px' }} />
                {submitting ? 'Saving Skill...' : isEditing ? 'Update Skill' : 'Publish Skill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SkillFormPage;
