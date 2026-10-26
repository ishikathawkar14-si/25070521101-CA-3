import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Edit3,
  Save,
  X,
  PlusCircle,
  Trash2,
  Sparkles,
  MessageSquare,
  Globe,
  Share2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
];

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [mySkills, setMySkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    major: '',
    year: '',
    bio: '',
    avatar: '',
    skillsTeaching: '',
    skillsLearning: '',
    discord: '',
    telegram: '',
    linkedin: '',
    preferred: 'College Email',
  });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const fetchMySkills = async () => {
    try {
      setLoadingSkills(true);
      const res = await api.getMySkills();
      if (res.success) {
        setMySkills(res.skills || []);
      }
    } catch (err) {
      console.error('Error fetching my skills:', err);
    } finally {
      setLoadingSkills(false);
    }
  };

  useEffect(() => {
    fetchMySkills();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        university: user.university || 'Campus University',
        major: user.major || 'Computer Science',
        year: user.year || 'Sophomore',
        bio: user.bio || '',
        avatar: user.avatar || AVATAR_PRESETS[0],
        skillsTeaching: (user.skillsTeaching || user.skillsOffered || []).join(', '),
        skillsLearning: (user.skillsLearning || user.skillsWanted || []).join(', '),
        discord: user.contactInfo?.discord || '',
        telegram: user.contactInfo?.telegram || '',
        linkedin: user.contactInfo?.linkedin || '',
        preferred: user.contactInfo?.preferred || 'College Email',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);
      const payload = {
        name: formData.name.trim(),
        university: formData.university.trim(),
        major: formData.major.trim(),
        year: formData.year,
        bio: formData.bio.trim(),
        avatar: formData.avatar,
        skillsTeaching: formData.skillsTeaching
          ? formData.skillsTeaching.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        skillsLearning: formData.skillsLearning
          ? formData.skillsLearning.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        contactInfo: {
          discord: formData.discord.trim(),
          telegram: formData.telegram.trim(),
          linkedin: formData.linkedin.trim(),
          preferred: formData.preferred,
        },
      };

      const res = await api.updateProfile(payload);
      if (res.success) {
        await refreshUser();
        setIsEditing(false);
        setToastMessage('Profile updated successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkillPrompt = (skill) => {
    setSkillToDelete(skill);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    try {
      const res = await api.deleteSkill(skillToDelete._id);
      if (res.success) {
        setToastMessage('Skill listing deleted successfully');
        setMySkills(mySkills.filter((s) => s._id !== skillToDelete._id));
      }
    } catch (err) {
      setToastMessage(`Error: ${err.message}`);
    } finally {
      setDeleteModalOpen(false);
      setSkillToDelete(null);
    }
  };

  const offeredList = user?.skillsTeaching || user?.skillsOffered || [];
  const wantedList = user?.skillsLearning || user?.skillsWanted || [];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 0 4rem' }}>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Profile Card */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            marginBottom: '2rem',
            position: 'relative',
          }}
        >
          {/* Edit Button */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary btn-sm"
              style={{ position: 'absolute', top: '2rem', right: '2rem' }}
            >
              <Edit3 style={{ width: '14px', height: '14px' }} />
              Edit Profile
            </button>
          )}

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0f172a' }}>
                  Edit Student Profile
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost btn-sm"
                >
                  <X style={{ width: '16px', height: '16px' }} />
                  Cancel
                </button>
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
                  }}
                >
                  {error}
                </div>
              )}

              {/* Avatar Selector */}
              <div className="form-group">
                <label className="form-label">Choose Avatar Profile Picture</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {AVATAR_PRESETS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Preset"
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        objectFit: 'cover',
                        border: formData.avatar === url ? '3px solid #4f46e5' : '2px solid #e2e8f0',
                        opacity: formData.avatar === url ? 1 : 0.7,
                      }}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  name="avatar"
                  className="form-input"
                  placeholder="Or paste an image URL..."
                  value={formData.avatar}
                  onChange={handleChange}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              {/* Name, University, Major */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">University / College</label>
                  <input
                    type="text"
                    name="university"
                    className="form-input"
                    value={formData.university}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Major / Field</label>
                  <input
                    type="text"
                    name="major"
                    className="form-input"
                    value={formData.major}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <select
                    name="year"
                    className="form-select"
                    value={formData.year}
                    onChange={handleChange}
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div className="form-group">
                <label className="form-label">Bio & Study Goals</label>
                <textarea
                  name="bio"
                  className="form-textarea"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Share a bit about yourself, what you love building, and what you're excited to learn."
                ></textarea>
              </div>

              {/* Skills Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Skills You Can Teach (comma-separated)</label>
                  <input
                    type="text"
                    name="skillsTeaching"
                    className="form-input"
                    placeholder="Python, UI/UX, Graphic Design"
                    value={formData.skillsTeaching}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Skills You Want to Learn (comma-separated)</label>
                  <input
                    type="text"
                    name="skillsLearning"
                    className="form-input"
                    placeholder="React, Video Editing, Spanish"
                    value={formData.skillsLearning}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Contact Handles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Discord Tag</label>
                  <input
                    type="text"
                    name="discord"
                    className="form-input"
                    placeholder="username#1234 or @handle"
                    value={formData.discord}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telegram / Phone</label>
                  <input
                    type="text"
                    name="telegram"
                    className="form-input"
                    placeholder="@telegram_handle"
                    value={formData.telegram}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Exchange Venue</label>
                  <select
                    name="preferred"
                    className="form-select"
                    value={formData.preferred}
                    onChange={handleChange}
                  >
                    <option value="College Email">College Email</option>
                    <option value="Discord">Discord</option>
                    <option value="In-Person Library">In-Person Library</option>
                    <option value="Telegram">Telegram</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  <Save style={{ width: '16px', height: '16px' }} />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          ) : (
            /* Profile View */
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
                  }
                  alt={user?.name || 'Student'}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #e0e7ff',
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h1 style={{ fontSize: '1.85rem', color: '#0f172a' }}>
                      {user?.name}
                    </h1>
                    <span className="badge badge-primary">{user?.year}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GraduationCap style={{ width: '16px', height: '16px', color: '#4f46e5' }} />
                    <span>{user?.major} • {user?.university}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail style={{ width: '14px', height: '14px' }} />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {user?.bio && (
                <div style={{ marginBottom: '1.75rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                    About Me
                  </h4>
                  <p style={{ color: '#334155', fontSize: '0.925rem', lineHeight: 1.6 }}>
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Skills Offered & Wanted */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
                <div style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Skills I Offer / Teach
                  </div>
                  {offeredList.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {offeredList.map((s, idx) => (
                        <span key={idx} className="badge badge-success">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#15803d' }}>
                      None listed yet. Click edit to add your skills!
                    </span>
                  )}
                </div>

                <div style={{ background: '#eef2ff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #c7d2fe' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3730a3', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Skills I Want to Learn
                  </div>
                  {wantedList.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {wantedList.map((s, idx) => (
                        <span key={idx} className="badge badge-primary">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#4338ca' }}>
                      None listed yet. Click edit to specify skills you seek.
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info Overview */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.875rem', color: '#64748b', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <div>
                  Preferred Venue: <strong>{user?.contactInfo?.preferred || 'College Email'}</strong>
                </div>
                {user?.contactInfo?.discord && (
                  <div>
                    Discord: <strong>{user.contactInfo.discord}</strong>
                  </div>
                )}
                {user?.contactInfo?.telegram && (
                  <div>
                    Telegram: <strong>{user.contactInfo.telegram}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section: My Listed Skills */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#0f172a' }}>
                My Published Skill Listings ({mySkills.length})
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                These are public listings visible to all students on campus.
              </p>
            </div>
            <Link to="/skills/new" className="btn btn-primary btn-sm">
              <PlusCircle style={{ width: '16px', height: '16px' }} />
              Post New Skill
            </Link>
          </div>

          {loadingSkills ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <Loader text="Loading your published skills..." />
            </div>
          ) : mySkills.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {mySkills.map((skill) => (
                <div
                  key={skill._id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">{skill.category}</span>
                      <span className="badge badge-secondary">{skill.level}</span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.4rem' }}>
                      {skill.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.825rem',
                        color: '#64748b',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {skill.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      onClick={() => navigate(`/skills/edit/${skill._id}`)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Edit3 style={{ width: '14px', height: '14px' }} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSkillPrompt(skill)}
                      className="btn btn-danger btn-sm"
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
              title="You haven't listed any skills yet"
              description="Listing your skills lets other students find you in Explore and propose skill trades!"
              actionText="Post Your First Skill"
              actionLink="/skills/new"
            />
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
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

export default ProfilePage;
