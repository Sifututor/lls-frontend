// src/pages/auth/TutorLogin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ButtonLoader } from '../../components/ui/LoadingSpinner';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import '../../assets/css/auth.css';

function TutorLogin({ onLogin }) {
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

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      }).unwrap();

      const user = response.user || response;
      const userType = (user.user_type || '').toLowerCase();

      if (userType !== 'tutor') {
        setError('Invalid tutor credentials. Please use your tutor account.');
        return;
      }

      dispatch(setCredentials({
        user,
        token: response.token
      }));

      if (onLogin) {
        onLogin('tutor', user);
      }

      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
      }

      navigate('/tutor/dashboard');
    } catch (err) {
      setError(err.data?.message || err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-container tutor-login-page">
      <div className="login-selection">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        <div className="login-title-section">
          <h1 className="login-main-title">Ready to Teach?</h1>
          <p className="login-subtitle">Login to continue your teaching journey.</p>
        </div>

        <div className="parent-login-card-container">
          <div className="auth-card-white parent-login-card">
            <div className="auth-title-section">
              <button className="btn-back-icon" onClick={() => navigate('/login')}>
                <img src="/assets/images/icons/material-symbols_arrow-back.svg" alt="back" />
              </button>
              <h2 className="card-title">Tutor Login</h2>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
              <div className="form-group">
                <label htmlFor="tutor-email"></label>
                <input 
                  type="email" 
                  id="tutor-email" 
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
                <label htmlFor="tutor-password"></label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="tutor-password"
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
                {isLoading ? <ButtonLoader text="Signing in..." /> : 'Tutor Login'}
              </button>
            </form>

           
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorLogin;