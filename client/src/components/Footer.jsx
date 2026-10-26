import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Github, Globe, Shield, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        padding: '4rem 0 2rem',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <GraduationCap style={{ width: '22px', height: '22px' }} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                SkillSwap <span style={{ color: '#818cf8', fontSize: '0.9rem' }}>Campus</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '1.25rem' }}>
              The student-to-student skill exchange platform. Share what you know, learn what you love, and collaborate with peers across campus without high tuition fees.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', background: '#064e3b', padding: '4px 10px', borderRadius: '12px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }}></span>
              Built with MERN Stack • College Edition
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/explore" style={{ color: '#94a3b8', fontSize: '0.875rem', transition: 'color 0.15s' }}>
                  Explore All Skills
                </Link>
              </li>
              <li>
                <Link to="/skills/new" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Post What You Can Teach
                </Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/exchanges" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  My Exchange Requests
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Campus Profile
                </Link>
              </li>
              <li>
                <Link to="/feedback" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Send Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Top Learning Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/explore?category=Programming" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Programming & Web Dev
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Design%20%26%20Creative" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  UI/UX & Graphic Design
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Data%20%26%20AI" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Data Science & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Languages" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Foreign Languages
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Business%20%26%20Marketing" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Marketing & Public Speaking
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Student Community */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Campus Exchange Tips
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Shield style={{ width: '16px', height: '16px', color: '#6366f1', shrink: 0 }} />
                <span>Meet in public campus areas (Library, Student Center, or Campus Café).</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Sparkles style={{ width: '16px', height: '16px', color: '#f59e0b', shrink: 0 }} />
                <span>Agree on an exchange format (e.g. 1 hour of Python for 1 hour of Figma).</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Heart style={{ width: '16px', height: '16px', color: '#ec4899', shrink: 0 }} />
                <span>Keep it supportive, collaborative, and student-focused!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.825rem',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} SkillSwap Campus. Full-Stack Project using MongoDB, Express.js, React.js & Node.js.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Verified Peer-to-Peer</span>
            <span>•</span>
            <span>No Cost / 100% Free Knowledge Exchange</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
