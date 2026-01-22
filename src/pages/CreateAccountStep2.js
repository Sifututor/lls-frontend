// src/pages/CreateAccountStep2.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation, useGetMeQuery } from '../store/api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import '../assets/css/auth.css';

function CreateAccountStep2({ signupData, childrenData, onComplete }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();
  
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    dataProcessing: false
  });

  const handleChange = (e) => {
    setAgreements({
      ...agreements,
      [e.target.name]: e.target.checked
    });
  };

  // Function to call /me API
  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://10.55.1.160:8000/api/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('/me API Response:', data);
      
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('userType', data.user.user_type || 'parent');
        localStorage.setItem('isPremium', data.user.is_premium || false);
        
        dispatch(setCredentials({
          user: data.user,
          token: token
        }));
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
      alert('Please agree to all required terms');
      return;
    }

    console.log('========== DEBUG: Registration Data ==========');
    console.log('signupData:', signupData);
    console.log('childrenData:', childrenData);

    try {
      const registerPayload = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        password_confirmation: signupData.password_confirmation,
        user_type: 'parent',
        pdpa_terms: agreements.termsOfService,
        pdpa_privacy: agreements.termsOfService,
        pdpa_consent: agreements.dataProcessing,
        children: childrenData || []
      };

      console.log('Register Payload:', registerPayload);

      const result = await register(registerPayload).unwrap();
      
      console.log('Register Response:', result);

      // If registration successful and we have token
      if (result.token) {
        // Store token first
        localStorage.setItem('authToken', result.token);
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('tokenExpiry', expiryTime.toString());

        // Call /me API to get user data
        console.log('Calling /me API with token...');
        await fetchUserData(result.token);
      }

      // Store for verification page
      localStorage.setItem('pendingVerificationEmail', signupData.email);
      localStorage.setItem('pendingVerificationName', signupData.name);

      // Navigate to success
      navigate('/create-account/success');
      
    } catch (err) {
      console.log('========== DEBUG: API Error ==========');
      console.log('Full error:', err);
      console.log('Error data:', err.data);
      
      if (err.data?.errors) {
        console.log('Validation errors:', err.data.errors);
      }

      if (err.data?.message) {
        alert(err.data.message);
      } else if (err.data?.errors) {
        const errorMessages = Object.values(err.data.errors).flat().join('\n');
        alert(errorMessages);
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container signup-step">
      <div className="mian-account-card">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>
        
        <div className="auth-card-white">
          <div className="progress-bars">
            <div className="progress-steps complete"></div>
            <div className="progress-steps active"></div>
          </div>

          <div className="auth-title-section">
            <button className="btn-back-icon" onClick={() => navigate('/create-account/add-child')}>
              <img src="/assets/images/icons/material-symbols_arrow-back.svg" alt="back" />
            </button>

            <div className="auth-title-text">
              <h2 className="auth-title">Terms & Consent</h2>
              <p className="auth-subtitle">Step 2 of 2 - Legal Agreements</p>
            </div>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="auth-form"
            autoComplete="on"
          >
            {/* Hidden fields for password manager */}
            <input 
              type="text" 
              name="email" 
              autoComplete="email"
              value={signupData?.email || ''} 
              readOnly
              style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
            />
            <input 
              type="password" 
              name="password" 
              autoComplete="new-password"
              value={signupData?.password || ''} 
              readOnly
              style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
            />

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
                  I agree to the <a href="#terms" className="link-terms">Terms of Service</a> and{' '}
                  <a href="#privacy" className="link-terms">Privacy Policy</a> *
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
                  I consent to LLS processing personal data (mine and my children's) for educational purposes *
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
              <div className="error-message" style={{ 
                background: '#FEF2F2', 
                border: '1px solid #DD4040', 
                borderRadius: '8px', 
                padding: '12px',
                marginBottom: '16px',
                color: '#DD4040'
              }}>
                {error.data?.message || 'Registration failed. Please try again.'}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="link-switch">
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountStep2;