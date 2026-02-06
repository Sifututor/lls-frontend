import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      navigate('/register');
    }
  };

  return (
    <div className="auth-container landing-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo" onClick={() => navigate('/')}>
            <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
          </div>
          <div className="header-actions">
            <button 
              className="btn-text" 
              onClick={() => navigate('/register')}
            >
              Create Account →
            </button>
            <button 
              className="btn-text" 
              onClick={() => navigate('/login')}
            >
              Login →
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="landing-content">
          <h1 className="landing-title">Quality Education for Malaysian Students</h1>
          <p className="landing-subtitle">Form 1-5 curriculum, Free video courses, AI-powered tutoring.</p>

          <div className="landing-form-section">
            <p className="form-label">Ready to start? Enter your email to create or access your account</p>
            <form onSubmit={handleSubmit} className="email-form">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />
              <button type="submit" className="btn-get-started">
                Get Started →
              </button>
            </form>

            <div className="features-list">
              <span className="feature-badge">100% Free Forever</span>
              <span className="feature-badge">AI Tutor Powered</span>
              <span className="feature-badge">Malaysian SPM Syllabus</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>Are you a tutor? <a href="#tutor-portal">Go to Tutor Portal</a></p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;