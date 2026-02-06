// src/pages/StudentActivationSuccess.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

function StudentActivationSuccess() {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const savedInfo = localStorage.getItem('activatedStudentInfo');
    if (savedInfo) {
      setStudentInfo(JSON.parse(savedInfo));
    }
  }, []);

  const handleStartLearning = () => {
    // Clear temporary data
    localStorage.removeItem('activatedStudentInfo');
    
    // Navigate to dashboard
    navigate('/student/dashboard');
  };

  return (
    <div className="auth-container signup-step">
      <div className="mian-account-card">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        <div className="auth-card-white">
          {/* Success Header */}
          <div className="success-state" style={{ marginBottom: '20px' }}>
            <h2 className="success-title" style={{ marginBottom: '8px' }}>You're all set!</h2>
            <p className="success-message" style={{ color: '#6B7280', fontSize: '14px' }}>
              Your account is now activated and ready to use.
            </p>
          </div>

          {/* Student Profile Card */}
          <div className="student-profile-card">
            <div className="profile-avatar-img">
              <img 
                src={studentInfo?.avatar || '/assets/images/default-avatar.png'} 
                alt="Profile" 
                onError={(e) => { e.target.src = '/assets/images/default-avatar.png'; }}
              />
            </div>
            <div className="profile-details">
              <h3 className="profile-name">{studentInfo?.name || 'Student'}</h3>
              <p className="profile-meta">
                {studentInfo?.form_level || 'Form 4'} • {studentInfo?.school_name || 'SMK Damansara Jaya'}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="activation-stats-row">
            <div className="activation-stat-item">
              <span className="stat-label">Courses</span>
              <span className="stat-number">42</span>
              <span className="stat-desc">Available</span>
            </div>
            <div className="activation-stat-item">
              <span className="stat-label">Live Classes</span>
              <span className="stat-number infinity">∞</span>
              <span className="stat-desc">Unlimited</span>
            </div>
            <div className="activation-stat-item">
              <span className="stat-label">AI Tutor</span>
              <span className="stat-number infinity">∞</span>
              <span className="stat-desc">Unlimited</span>
            </div>
          </div>

          {/* Premium Badge */}
          <div className="premium-info-box">
            <div className="premium-header">
              <span className="premium-icons">
                <img src="/assets/images/icons/account-prem.svg" alt="premium" />
              </span>
              <strong>Premium Access</strong>
            </div>
            <p className="premium-text">
              Full access to all features
            </p>
          </div>

          {/* Start Learning Button */}
          <button onClick={handleStartLearning} className="btn-primary btn-full">
            Start learning now
          </button>

          {/* Footer Text */}
          <p style={{ 
            textAlign: 'center', 
            marginTop: '16px', 
            color: '#6B7280', 
            fontSize: '13px' 
          }}>
            You can now login anytime at{' '}
            <a href="https://learnest.com" style={{ color: '#2E7D32', textDecoration: 'none' }}>
              learnest.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentActivationSuccess;