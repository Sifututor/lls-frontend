// src/pages/StudentLogin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ButtonLoader } from '../components/ui/LoadingSpinner';
import { useLoginMutation } from '../store/api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import '../assets/css/auth.css';
import authBg from '../assets/images/landing-page-bg.png';

function StudentLogin({ onLogin }) {
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

  // On mount: restore remembered email and checkbox from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const isRemembered = localStorage.getItem('rememberMe') === 'true';
    if (isRemembered && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

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
        // 1. Handle remember me FIRST
        if (formData.rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberMe');
        }

        // 2. Dispatch to Redux (authApi already saved to localStorage)
        dispatch(setCredentials({
          user: response.user,
          token: response.token
        }));

        // 3. Call onLogin callback if provided
        if (onLogin) {
          onLogin('student', response.user || response);
        }

        toast.success('Login successful!', { autoClose: 800 });
        // SPA navigation to avoid full page reload / double load
        navigate('/student/dashboard', { replace: true });
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
    <div className="auth-container student-login-page" style={{ '--auth-bg': `url(${authBg})` }}>
      <div className="login-selection">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        <div className="login-title-section">
          <h1 className="login-main-title">Ready to Learn?</h1>
          <p className="login-subtitle">Login to continue your learning journey.</p>
        </div>

        <div className="parent-login-card-container">
          <div className="auth-card-white parent-login-card">
            <div className="auth-title-section">
              <button className="btn-back-icon" onClick={() => navigate('/login')}>
                <img src="/assets/images/icons/material-symbols_arrow-back.svg" alt="back" />
              </button>
              <h2 className="card-title">Student Login</h2>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
              <div className="form-group">
                <label htmlFor="student-email"></label>
                <input 
                  type="email" 
                  id="student-email" 
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
                <label htmlFor="student-password"></label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="student-password"
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
                {isLoading ? <ButtonLoader text="Signing in..." /> : 'Sign In'}
              </button>
            </form>

            <div className="divider-or">
              <span>Or</span>
            </div>

            <button 
              className="btn-secondary btn-full" 
              onClick={() => navigate('/login/parent')}
              disabled={isLoading}
            >
              Login as Parent Instead
            </button>

            <div className="auth-switch">
              <p>Don't have an account? <button type="button" onClick={() => navigate('/create-account/student')} className="link-switch" disabled={isLoading}>Sign Up for free</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;