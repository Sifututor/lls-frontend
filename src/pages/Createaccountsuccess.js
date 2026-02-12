// src/pages/Createaccountsuccess.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import '../assets/css/auth.css';
import authBg from '../assets/images/landing-page-bg.png';

function CreateAccountSuccess() {
  const navigate = useNavigate();
  const { parentData } = useRegistration();
  const userName = parentData?.name || '';
  const userEmail = parentData?.email || '';

  const handleContinue = () => {
    navigate('/register/add-children');
  };

  return (
    <div className="auth-container signup-step" style={{ '--auth-bg': `url(${authBg})` }}>
      <div className="mian-account-card">
        {/* Logo */}
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>
        
        <div className="auth-card-white">
          {/* Success State */}
          <div className="success-state">
            <div className="success-icon-check">
              <img src="/assets/images/icons/landing-page-icon.svg" alt="check box" />
            </div>

            <div className="success-text">
              <h2 className="success-title">Family Account Created</h2>
              <p className="success-message">
                {userName ? `Hi ${userName}!` : ''} Your account has been created successfully.
              </p>
            </div>
          </div>

          {/* Admin Verification Pending */}
          <div className="verification-pending-box">
            <div className="verification-pending-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#F59E0B"/>
                <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#F59E0B"/>
              </svg>
            </div>
            <div className="verification-pending-content">
              <h4 className="verification-pending-title">Admin Verification Pending</h4>
              <p className="verification-pending-text">
                Your account is under review. An administrator will verify your account within 24-48 hours.
              </p>
            </div>
          </div>

          {/* Email Info */}
          {userEmail && (
            <div className="registered-email-box">
              <span className="email-label">Registered Email:</span>
              <span className="email-value">{userEmail}</span>
            </div>
          )}

          {/* Premium Access Info */}
          <div className="premium-info-box">
            <div className="premium-header">
              <span className="premium-icons">
                <img src="/assets/images/icons/account-prem.svg" alt="check box" />
              </span>
              <strong>Premium Access</strong>
            </div>
            <p className="premium-text">
              As a Sifututor customer, your family has Premium access. All students you add will enjoy live classes, unlimited AI tutor, and more!
            </p>
          </div>

          {/* Verification Email Notice */}
          <div className="info-box">
            <p>Once approved, you'll receive a confirmation email. You can then login and start learning!</p>
          </div>

          <button type="button" onClick={handleContinue} className="btn-primary btn-full">
            Continue
          </button>

          <p className="helper-text" style={{ textAlign: 'center', marginTop: '16px', color: '#6B7280', fontSize: '13px' }}>
            Didn't receive any email? Check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountSuccess;