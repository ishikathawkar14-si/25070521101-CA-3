import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, GraduationCap, Eye, EyeOff, BookOpen, AlertCircle, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: 'State Campus University',
    major: 'Computer Science',
    year: 'Sophomore',
    skillsTeaching: '',
    skillsLearning: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        university: formData.university.trim(),
        major: formData.major.trim(),
        year: formData.year,
        skillsTeaching: formData.skillsTeaching
          ? formData.skillsTeaching.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        skillsLearning: formData.skillsLearning
          ? formData.skillsLearning.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
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
        padding: '3rem 1.25rem',
        backgroundColor: '#f8fafc',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '560px',
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
            <UserPlus style={{ width: '28px', height: '28px' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            Join SkillSwap Campus
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.925rem' }}>
            Create your student account to share skills and collaborate
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
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Alex Chen"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <User
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
            <label className="form-label">College Email Address *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="alex.chen@campus.edu"
                value={formData.email}
                onChange={handleChange}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.2rem' }}
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
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.5rem' }}
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
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Major / Department</label>
              <input
                type="text"
                name="major"
                className="form-input"
                placeholder="e.g. Computer Science, Design"
                value={formData.major}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Academic Year</label>
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

          {/* Skills quick preview */}
          <div className="form-group">
            <label className="form-label">
              Skills you can teach (optional)
            </label>
            <input
              type="text"
              name="skillsTeaching"
              className="form-input"
              placeholder="e.g. Python, Graphic Design, Spanish (comma-separated)"
              value={formData.skillsTeaching}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Skills you want to learn (optional)
            </label>
            <input
              type="text"
              name="skillsLearning"
              className="form-input"
              placeholder="e.g. React.js, Video Editing, Calculus (comma-separated)"
              value={formData.skillsLearning}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.75rem', fontSize: '1rem' }}
          >
            <UserPlus style={{ width: '18px', height: '18px' }} />
            {loading ? 'Creating Student Profile...' : 'Complete Registration'}
          </button>
        </form>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
