// src/pages/ParentLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../store/api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import '../assets/css/auth.css';

function ParentLogin({ onLogin }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // FIX 3: Validate before API call
    if (!formData.email || !formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!formData.password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      }).unwrap();

      if (response.token && response.user) {
        // 1. Dispatch to Redux (authApi already saved to localStorage)
        dispatch(setCredentials({
          user: response.user,
          token: response.token
        }));

        // 2. Call onLogin callback if provided
        if (onLogin) {
          onLogin('parent', response.user || response);
        }

        // FIX 3: Show success toast
        toast.success('Login successful! Redirecting...', {
          autoClose: 1000,
        });

        // 3. Force immediate navigation without delay
        // Use window.location for clean redirect (no flash/jerk)
        setTimeout(() => {
          window.location.href = '/select-student';
        }, 1000);
      }
    } catch (err) {
      // FIX 3: PROPER ERROR TOAST
      const errorMessage = err?.data?.message || err?.data?.error || 'Invalid email or password';
      
      // Show toast error
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      
      // Also set local error state if shown in UI
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container parent-login-page">
      <div className="login-selection">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        <div className="login-title-section">
          <h1 className="login-main-title">Welcome Back!</h1>
          <p className="login-subtitle">Login to manage your family's learning journey.</p>
        </div>

        <div className="parent-login-card-container">
          <div className="auth-card-white parent-login-card">
            <div className="auth-title-section">
              <button className="btn-back-icon" onClick={() => navigate('/login')}>
                <img src="/assets/images/icons/material-symbols_arrow-back.svg" alt="back" />
              </button>
              <h2 className="card-title">Parent Login</h2>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
              <div className="form-group">
                <label htmlFor="parent-email"></label>
                <input
                  type="email"
                  id="parent-email"
                  name="email"
                  placeholder='Email Address'
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="parent-password"></label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="parent-password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
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
                      <img src="/assets/images/icons/059-eye.svg" alt="show password" />
                    ) : (
                      <img src="/assets/images/icons/075-hide.svg" alt="hide password" />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label-inline">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span>Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => navigate('/forgot-password')} 
                  className="link-forgot"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              <button 
                type="submit" 
                className="btn-primary btn-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="divider-or">
              <span>Or</span>
            </div>

            <button 
              className="btn-secondary btn-full" 
              onClick={() => navigate('/login/student')}
              disabled={isLoading}
            >
              Login as Student Instead
            </button>

            <div className="auth-switch">
              <p>New to Learnest? <button type="button" onClick={() => navigate('/register')} className="link-switch" disabled={isLoading}>Create Account</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentLogin;