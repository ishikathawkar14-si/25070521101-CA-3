import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExploreSkillsPage from './pages/ExploreSkillsPage';
import SkillFormPage from './pages/SkillFormPage';
import DashboardPage from './pages/DashboardPage';
import ExchangeRequestsPage from './pages/ExchangeRequestsPage';
import ProfilePage from './pages/ProfilePage';
import FeedbackPage from './pages/FeedbackPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<ExploreSkillsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skills/new"
                element={
                  <ProtectedRoute>
                    <SkillFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skills/edit/:id"
                element={
                  <ProtectedRoute>
                    <SkillFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exchanges"
                element={
                  <ProtectedRoute>
                    <ExchangeRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
