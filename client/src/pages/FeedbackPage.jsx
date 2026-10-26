import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bug,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Star,
  Send,
  AlertCircle,
  Inbox,
  LogIn,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const CATEGORIES = [
  { value: 'Bug Report', description: 'Something is broken or confusing', icon: Bug },
  { value: 'Feature Request', description: 'An idea that would make SkillSwap better', icon: Lightbulb },
  { value: 'Skill Suggestion', description: 'A skill you would like to see on campus', icon: BookOpen },
  { value: 'General Feedback', description: 'Anything else you want to share', icon: MessageSquare },
];

const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 1000;

const STATUS_STYLES = {
  new: { label: 'New', background: '#eef2ff', color: '#3730a3' },
  reviewed: { label: 'Reviewed', background: '#fffbeb', color: '#92400e' },
  resolved: { label: 'Resolved', background: '#ecfdf5', color: '#065f46' },
};

const emptyForm = {
  category: 'General Feedback',
  rating: 0,
  name: '',
  email: '',
  message: '',
};

const NO_TOAST = { message: '', type: 'success' };

export const FeedbackPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(NO_TOAST);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Pre-fill name and email from the signed-in student's account (never overwrites what they typed)
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.name || '',
      email: prev.email || user.email || '',
    }));
  }, [user]);

  // Load this student's previous feedback from the backend
  useEffect(() => {
    if (!isAuthenticated) {
      setSubmissions([]);
      return;
    }

    let cancelled = false;
    const loadSubmissions = async () => {
      try {
        setLoadingSubmissions(true);
        const res = await api.getMyFeedback();
        if (!cancelled && res.success) {
          setSubmissions(res.feedbacks || []);
        }
      } catch (err) {
        console.error('Failed to load your feedback:', err.message);
      } finally {
        if (!cancelled) setLoadingSubmissions(false);
      }
    };

    loadSubmissions();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Hide the success message after a few seconds
  useEffect(() => {
    if (!toast.message) return undefined;
    const timer = setTimeout(() => setToast(NO_TOAST), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const refreshSubmissions = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getMyFeedback();
      if (res.success) setSubmissions(res.feedbacks || []);
    } catch (err) {
      console.error('Failed to refresh your feedback:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const message = form.message.trim();

    if (!form.name.trim()) {
      setError('Please tell us your name so we know who sent this.');
      return;
    }

    if (message.length < MIN_MESSAGE_LENGTH) {
      setError(`Please write at least ${MIN_MESSAGE_LENGTH} characters so we understand your feedback.`);
      return;
    }

    try {
      setSubmitting(true);
      await api.submitFeedback({
        name: form.name.trim(),
        email: form.email.trim(),
        category: form.category,
        rating: form.rating || null,
        message,
      });

      // Clear the message and rating but keep name and email for the next submission
      setForm((prev) => ({ ...emptyForm, name: prev.name, email: prev.email }));
      setToast({ message: 'Thank you! Your feedback has been saved.', type: 'success' });
      refreshSubmissions();
    } catch (err) {
      setError(err.message || 'Could not send your feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 0 3.5rem' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        {/* Page header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Help Us Improve
          </span>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', marginTop: '0.25rem' }}>Send Feedback</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Found a bug, have an idea, or want a skill taught on campus? Tell us below. Every message is saved to the SkillSwap database.
          </p>
        </div>

        {/* Feedback form */}
        <div
          className="card"
          style={{
            padding: 'clamp(1.25rem, 4vw, 2.25rem)',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {error && (
            <div
              role="alert"
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

          <form onSubmit={handleSubmit} noValidate>
            {/* Category */}
            <div className="form-group">
              <span className="form-label">What is this about?</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
                {CATEGORIES.map(({ value, description, icon: Icon }) => {
                  const selected = form.category === value;
                  return (
                    <label
                      key={value}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        border: `2px solid ${selected ? '#4f46e5' : '#e2e8f0'}`,
                        backgroundColor: selected ? '#eef2ff' : '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={value}
                        checked={selected}
                        onChange={(e) => updateField('category', e.target.value)}
                        style={{ marginTop: '4px' }}
                      />
                      <Icon
                        style={{
                          width: '18px',
                          height: '18px',
                          flexShrink: 0,
                          marginTop: '2px',
                          color: selected ? '#4f46e5' : '#64748b',
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.925rem' }}>{value}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Rating */}
            <div className="form-group">
              <span className="form-label">
                How is SkillSwap working for you?{' '}
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>(optional)</span>
              </span>
              <div role="radiogroup" aria-label="Rating" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= form.rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={form.rating === star}
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      onClick={() => updateField('rating', form.rating === star ? 0 : star)}
                      style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer' }}
                    >
                      <Star
                        style={{
                          width: '28px',
                          height: '28px',
                          color: active ? '#f59e0b' : '#cbd5e1',
                          fill: active ? '#f59e0b' : 'none',
                        }}
                      />
                    </button>
                  );
                })}
                {form.rating > 0 && (
                  <span style={{ marginLeft: '8px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    {form.rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Name and email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="feedback-name">Your name</label>
                <input
                  id="feedback-name"
                  className="form-input"
                  type="text"
                  maxLength={80}
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g. Alex Chen"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="feedback-email">
                  Email <span style={{ color: '#94a3b8', fontWeight: 500 }}>(optional)</span>
                </label>
                <input
                  id="feedback-email"
                  className="form-input"
                  type="email"
                  maxLength={120}
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@campus.edu"
                />
              </div>
            </div>

            {/* Message */}
            <div className="form-group">
              <label className="form-label" htmlFor="feedback-message">Your feedback</label>
              <textarea
                id="feedback-message"
                className="form-textarea"
                rows={5}
                maxLength={MAX_MESSAGE_LENGTH}
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Describe the bug, the idea, or the skill you have in mind..."
                style={{ resize: 'vertical', minHeight: '120px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                <span>Minimum {MIN_MESSAGE_LENGTH} characters</span>
                <span>{form.message.length}/{MAX_MESSAGE_LENGTH}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '0.85rem', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              <Send style={{ width: '18px', height: '18px' }} />
              {submitting ? 'Sending...' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        {/* Previous submissions */}
        <div
          className="card"
          style={{
            marginTop: '1.5rem',
            padding: 'clamp(1.25rem, 4vw, 2rem)',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <Inbox style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
            <h2 style={{ fontSize: '1.2rem', color: '#0f172a' }}>Your Submissions</h2>
          </div>

          {!isAuthenticated ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingTop: '0.5rem' }}>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Log in to see the feedback you have sent before.
              </p>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn style={{ width: '16px', height: '16px' }} />
                Log In
              </Link>
            </div>
          ) : loadingSubmissions && submissions.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem', paddingTop: '0.5rem' }}>Loading your submissions...</p>
          ) : submissions.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem', paddingTop: '0.5rem' }}>
              You have not sent any feedback yet. Your messages will appear here after you submit them.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {submissions.map((item) => {
                const status = STATUS_STYLES[item.status] || STATUS_STYLES.new;
                return (
                  <li
                    key={item._id}
                    style={{ padding: '1rem 0', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-primary">{item.category}</span>
                        {item.rating ? (
                          <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>★ {item.rating}/5</span>
                        ) : null}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            background: status.background,
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {item.message}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast(NO_TOAST)} />
    </div>
  );
};

export default FeedbackPage;
