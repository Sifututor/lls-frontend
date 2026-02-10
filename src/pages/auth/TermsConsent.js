// src/pages/auth/TermsConsent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { useRegistration } from '../../context/RegistrationContext';
import { showError, showWarning } from '../../utils/toast';
import '../../assets/css/auth.css';

function TermsConsent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { parentData, setTermsAccepted, setParentId } = useRegistration();
  const [register, { isLoading, error }] = useRegisterMutation();

  const [agreements, setAgreements] = useState({
    termsOfService: false,
    dataProcessing: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [name]: checked }));
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://10.0.0.178:8000/api'}/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('userType', data.user.user_type || 'parent');
        localStorage.setItem('isPremium', data.user.is_premium ? 'true' : 'false');
        dispatch(setCredentials({ user: data.user, token }));
      }
      return data;
    } catch (err) {
      console.error('/me API Error:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreements.termsOfService || !agreements.dataProcessing) {
      showWarning('Please agree to all required terms');
      return;
    }

    setTermsAccepted({
      pdpa_terms: agreements.termsOfService,
      pdpa_privacy: agreements.termsOfService,
      pdpa_consent: agreements.dataProcessing,
    });

    try {
      const payload = {
        name: parentData.name,
        email: parentData.email,
        password: parentData.password,
        password_confirmation: parentData.password_confirmation,
        user_type: 'parent',
        pdpa_terms: agreements.termsOfService,
        pdpa_privacy: agreements.termsOfService,
        pdpa_consent: agreements.dataProcessing,
        children: [],
      };

      const result = await register(payload).unwrap();

      if (result.user?.id) {
        setParentId(result.user.id);
      }
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiry', expiryTime.toString());
        await fetchUserData(result.token);
      }

      navigate('/register/success');
    } catch (err) {
      if (err.data?.message) {
        showError(err.data.message);
      } else if (err.data?.errors) {
        const msgs = Object.values(err.data.errors).flat().join('\n');
        showError(msgs);
      } else {
        showError('Registration failed. Please try again.');
      }
    }
  }

  return (
    <div className="auth-container signup-step">
      <div className="mian-account-card">
        <div className="auth-card-white">
          <div className="progress-bars">
            <div className="progress-steps complete"></div>
            <div className="progress-steps active"></div>
          </div>

          <div className="auth-title-section">
            <button type="button" className="btn-back-icon" onClick={() => navigate('/register')}>
              <img src="/assets/images/icons/material-symbols_arrow-back.svg" alt="back" />
            </button>
            <div className="auth-title-text">
              <h2 className="auth-title">Terms & Consent</h2>
              <p className="auth-subtitle">Step 2 of 2 - Legal Agreements</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
            <div className="agreements-section">
              <h3 className="section-title">Required Agreements</h3>

              <label className="checkbox-label agreement-item">
                <input
                  type="checkbox"
                  name="termsOfService"
                  checked={agreements.termsOfService}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="link-terms">Terms & Conditions</a> and{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="link-terms">Privacy Policy</a> *
                </span>
              </label>

              <label className="checkbox-label agreement-item">
                <input
                  type="checkbox"
                  name="dataProcessing"
                  checked={agreements.dataProcessing}
                  onChange={handleChange}
                  required
                />
                <span>
                  I consent to LLS processing personal data (mine and my children&apos;s) for educational purposes{' '}
                  <span style={{ color: '#DD4040' }}>*</span>
                </span>
              </label>
            </div>

            <div className="parental-consent-box">
              <h4 className="consent-box-title">Parental Consent</h4>
              <p className="consent-box-text">
                By creating student accounts, I confirm that I am the parent or legal guardian
                and consent to my children using this educational platform.
              </p>
            </div>

            {error && (
              <div
                className="error-message"
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #DD4040',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#DD4040',
                }}
              >
                {error.data?.message || 'Registration failed. Please try again.'}
              </div>
            )}

            <button type="submit" className="btn-primary btn-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/login')} className="link-switch">
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsConsent;
