// src/pages/auth/StudentTerms.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../../context/RegistrationContext';
import { showWarning } from '../../utils/toast';
import '../../assets/css/auth.css';

function StudentTerms() {
  const navigate = useNavigate();
  const { setRegistrationComplete } = useRegistration();
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accepted) {
      showWarning('Please accept the student terms to continue.');
      return;
    }
    setRegistrationComplete(true);
    navigate('/register/complete');
  };

  return (
    <div className="auth-container signup-step">
      <div className="mian-account-card">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        <div className="auth-card-white">
          <div className="auth-title-section">
            <button type="button" className="btn-back-icon" onClick={() => navigate('/register/add-children')}>
              <img src="/assets/images/icons/material-symbols_arrow-back.svg" alt="back" />
            </button>
            <div className="auth-title-text">
              <h2 className="auth-title">Student Terms and Consent</h2>
              <p className="auth-subtitle">Terms acceptance for student accounts</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="agreements-section">
              <p className="section-title">
                By continuing, you confirm that the student profiles you added are under your guardianship and that they may use this educational platform in accordance with our Student Terms.
              </p>
              <label className="checkbox-label agreement-item">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  required
                />
                <span>I accept the Student Terms and Consent for the added students *</span>
              </label>
            </div>

            <button type="submit" className="btn-primary btn-full">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentTerms;
