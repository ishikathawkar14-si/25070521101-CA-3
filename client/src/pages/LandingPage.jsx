import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  ArrowRightLeft,
  Users,
  ShieldCheck,
  Zap,
  CheckCircle2,
  GraduationCap,
  Search,
  Code,
  Palette,
  BrainCircuit,
  MessageCircle,
} from 'lucide-react';
import { api } from '../services/api';
import SkillCard from '../components/SkillCard';
import SkillDetailModal from '../components/SkillDetailModal';
import ExchangeModal from '../components/ExchangeModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalSkills: 12,
    totalStudents: 6,
    totalExchanges: 4,
    pendingExchanges: 2,
  });
  const [featuredSkills, setFeaturedSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Fetch stats
    api.getOverviewStats()
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch(() => {});

    // Fetch featured skills
    api.getSkills()
      .then((res) => {
        if (res.success && res.skills) {
          setFeaturedSkills(res.skills.slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSkills(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
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

  return (
    <div>
      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          padding: '4.5rem 0 5rem',
          borderBottom: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            {/* Pill tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                backgroundColor: '#e0e7ff',
                color: '#4338ca',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '1.75rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              <Sparkles style={{ width: '16px', height: '16px' }} />
              <span>Campus Skill Exchange Network</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#0f172a',
                marginBottom: '1.5rem',
                letterSpacing: '-0.03em',
              }}
            >
              Share What You Know.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Learn What You Love.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '1.2rem',
                lineHeight: 1.6,
                color: '#475569',
                marginBottom: '2.5rem',
                maxWidth: '680px',
                margin: '0 auto 2.5rem',
              }}
            >
              SkillSwap Campus is the peer-to-peer student platform where you teach skills
              you know (like Python or UI Design) and learn skills you want from fellow students.
              100% free, collaborative, and campus-friendly.
            </p>

            {/* Quick Hero Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                maxWidth: '600px',
                margin: '0 auto 2rem',
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                padding: '6px 8px 6px 16px',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #cbd5e1',
              }}
            >
              <Search style={{ width: '20px', height: '20px', color: '#94a3b8', marginRight: '8px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="What skill do you want to learn? (e.g. Python, Figma, React, Spanish)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#0f172a',
                  background: 'transparent',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                Search Skills
              </button>
            </form>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <Link to="/explore" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
                Explore Skills Catalog
                <ArrowRight style={{ width: '18px', height: '18px' }} />
              </Link>
              {isAuthenticated ? (
                <Link to="/skills/new" className="btn btn-secondary" style={{ padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
                  Post What You Can Teach
                </Link>
              ) : (
                <Link to="/register" className="btn btn-secondary" style={{ padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
                  Join Campus Network
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Metric Stats Banner */}
      <section
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '2.5rem 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#4f46e5' }}>
                {stats.totalSkills}+
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                Skills Ready for Exchange
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#06b6d4' }}>
                {stats.totalStudents}+
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                Active Student Learners
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#10b981' }}>
                {stats.totalExchanges}+
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                Successful Swaps Completed
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#8b5cf6' }}>
                100%
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                Free Peer Knowledge
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simple 3-Step Process
            </span>
            <h2 style={{ fontSize: '2.25rem', color: '#0f172a', marginTop: '0.5rem', marginBottom: '1rem' }}>
              How SkillSwap Works
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.5 }}>
              No money required. Swap your existing expertise for skills you need in three clear steps.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Step 1 */}
            <div
              className="card"
              style={{
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#e0e7ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}
              >
                <BookOpen style={{ width: '28px', height: '28px' }} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', marginBottom: '4px' }}>
                Step 1
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                List What You Know
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Create a quick profile listing topics you can teach — coding, design, academic subjects, video editing, or languages — and what you'd like to learn in return.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="card"
              style={{
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#cffafe',
                  color: '#0891b2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}
              >
                <ArrowRightLeft style={{ width: '28px', height: '28px' }} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0891b2', textTransform: 'uppercase', marginBottom: '4px' }}>
                Step 2
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                Propose a Skill Swap
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Browse fellow students’ listings. When you find a match, send a swap request specifying what you can offer and your preferred meeting mode.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="card"
              style={{
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}
              >
                <GraduationCap style={{ width: '28px', height: '28px' }} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', marginBottom: '4px' }}>
                Step 3
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                Learn & Collaborate
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Once the owner accepts, exchange campus Discord or meet at the university library. Teach each other, build portfolio projects, and boost your resume!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '3rem',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Campus Listings
              </span>
              <h2 style={{ fontSize: '2.25rem', color: '#0f172a', marginTop: '0.35rem' }}>
                Featured Skills Ready for Exchange
              </h2>
            </div>
            <Link to="/explore" className="btn btn-secondary">
              View All Skills ({stats.totalSkills})
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>

          {loadingSkills ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
              Loading campus listings...
            </div>
          ) : featuredSkills.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {featuredSkills.map((skill) => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
                  onViewDetails={handleOpenDetail}
                  onRequestExchange={handleOpenExchange}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b' }}>
              No skills listed yet. Be the first student to list a skill!
            </div>
          )}
        </div>
      </section>

      {/* Student Benefits Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Why SkillSwap?
            </span>
            <h2 style={{ fontSize: '2.25rem', color: '#0f172a', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Benefits for College Students
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.5 }}>
              Designed to help students overcome paywalls, build real-world skills, and meet driven peers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Zap style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Completely Free Education
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Never pay \$1,000s for online courses. Exchange your current talents for the exact skills you want to learn.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#e0e7ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Users style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Cross-Discipline Networking
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Engineers connect with designers, business majors connect with coders. Build relationships that lead to hackathons and startup ideas.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Resume & Portfolio Boost
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Teaching solidifies your own understanding, and learning from peers gives you tangible projects to showcase to campus recruiters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section
        style={{
          padding: '5rem 0',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Ready to Start Swapping Skills on Campus?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2rem' }}>
            Join your fellow students today. Post your first skill in less than two minutes and discover peers ready to learn and teach.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <Link
              to="/register"
              className="btn btn-primary"
              style={{
                backgroundColor: '#ffffff',
                color: '#4f46e5',
                padding: '0.85rem 2rem',
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              Get Started for Free
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
            <Link
              to="/explore"
              className="btn"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.85rem 2rem',
                fontSize: '1rem',
              }}
            >
              Browse Skills First
            </Link>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default LandingPage;
