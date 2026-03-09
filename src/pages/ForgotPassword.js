// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/apiConfig';
import '../assets/css/auth.css';
import authBg from '../assets/images/landing-page-bg.png';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state - email sent
  if (success) {
    return (
      <div className="auth-container forgot-password-page" style={{ '--auth-bg': `url(${authBg})` }}>
        <div className="login-selection">
          <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
            <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
          </div>

          <div className="login-title-section">
            <h1 className="login-main-title">Check Your Email</h1>
            <p className="login-subtitle">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and spam folder.
            </p>
          </div>

          <div className="parent-login-card-container">
            <div className="auth-card-white parent-login-card">
              <button 
                onClick={() => navigate('/login')} 
                className="btn-primary btn-full"
              >
                Back to Log In
              </button>

              <div className="auth-switch">
                <p>Didn't receive email? <button type="button" onClick={() => setSuccess(false)} className="link-switch">Resend</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container forgot-password-page" style={{ '--auth-bg': `url(${authBg})` }}>
      <div className="login-selection">
        {/* Logo */}
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        {/* Title Section */}
        <div className="login-title-section">
          <h1 className="login-main-title">Forgot Password?</h1>
          <p className="login-subtitle">Don't worry! Enter your email and we'll send you a reset link.</p>
        </div>

        {/* Forgot Password Card */}
        <div className="parent-login-card-container">
          <div className="auth-card-white parent-login-card">
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email"></label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary btn-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Email'}
              </button>
            </form>

            <div className="auth-switch">
              <p>Back to <button type="button" onClick={() => navigate('/login')} className="link-switch">Log In</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;