// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../assets/css/auth.css';
import authBg from '../assets/images/landing-page-bg.png';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://10.0.0.178:8000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          email: email,
          password: formData.password,
          password_confirmation: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="auth-container reset-password-page" style={{ '--auth-bg': `url(${authBg})` }}>
        <div className="login-selection">
          <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
            <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
          </div>
          <div className="login-title-section">
            <h1 className="login-main-title">Invalid Reset Link</h1>
            <p className="login-subtitle">This password reset link is invalid or has expired.</p>
          </div>
          <div className="parent-login-card-container">
            <div className="auth-card-white parent-login-card">
              <button onClick={() => navigate('/forgot-password')} className="btn-primary btn-full">
                Request New Reset Link
              </button>
              <div className="auth-switch">
                <p>Back to <button type="button" onClick={() => navigate('/login')} className="link-switch">Log In</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container reset-password-page" style={{ '--auth-bg': `url(${authBg})` }}>
      <div className="login-selection">
        {/* Logo */}
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        {/* Title Section */}
        <div className="login-title-section">
          <h1 className="login-main-title">Reset Your Password</h1>
          <p className="login-subtitle">Create a new secure password for your account.</p>
        </div>

        {/* Reset Password Card */}
        <div className="parent-login-card-container">
          <div className="auth-card-white parent-login-card">
            {/* Password Requirements Box */}
            <div className="password-requirements-box">
              <p className="requirements-title">Be sure to include the following requirements</p>
              <ul className="requirements-list">
                <li>A minimum of 8 characters.</li>
                <li>Have both uppercase and lowercase letters.</li>
                <li>Must include a number.</li>
                <li>Include at least one special character.</li>
              </ul>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* New Password */}
              <div className="form-group">
                <label htmlFor="password"></label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="New password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <img src="/assets/images/icons/059-eye.svg" alt="show" />
                    ) : (
                      <img src="/assets/images/icons/075-hide.svg" alt="hide" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword"></label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <img src="/assets/images/icons/059-eye.svg" alt="show" />
                    ) : (
                      <img src="/assets/images/icons/075-hide.svg" alt="hide" />
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary btn-full"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;