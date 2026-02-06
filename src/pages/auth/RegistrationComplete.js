// src/pages/auth/RegistrationComplete.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/auth.css';

function RegistrationComplete() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/select-student');
  };

  return (
    <div className="auth-container signup-step">
      <div className="mian-account-card">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        <div className="auth-card-white">
          <div className="success-state">
            <div className="success-icon-check">
              <img src="/assets/images/icons/landing-page-icon.svg" alt="check" />
            </div>
            <div className="success-text">
              <h2 className="success-title">Registration Complete</h2>
              <p className="success-message">
                You're all set! Select who's learning today to get started.
              </p>
            </div>
          </div>

          <button type="button" onClick={handleContinue} className="btn-primary btn-full">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationComplete;
