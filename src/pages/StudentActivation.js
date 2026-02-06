// src/pages/StudentActivation.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useActivateStudentMutation, useGetStudentActivationInfoQuery } from '../store/api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import '../assets/css/auth.css';

function StudentActivation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  // Get student info from token
  const { data: studentInfo, isLoading: infoLoading, isError: infoError } = useGetStudentActivationInfoQuery(token, {
    skip: !token
  });
  
  const [activateStudent, { isLoading }] = useActivateStudentMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage('');
  };

  // Password validation
  const has8Chars = formData.password.length >= 8;
  const hasUpperLower = /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const isPasswordValid = has8Chars && hasUpperLower && hasNumber && hasSpecial;
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isPasswordValid) {
      setErrorMessage('Password does not meet all requirements');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const result = await activateStudent({
        token,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      }).unwrap();


      // Store auth data
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userData', JSON.stringify(result.user));
        localStorage.setItem('userType', 'student');
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('tokenExpiry', expiryTime.toString());

        dispatch(setCredentials({
          user: result.user,
          token: result.token
        }));
      }

      // Store student info for success page
      localStorage.setItem('activatedStudentInfo', JSON.stringify(result.user || studentInfo));

      // Navigate to success
      navigate('/activate-student/success');
      
    } catch (err) {
      console.error('Activation error:', err);
      setErrorMessage(err?.data?.message || 'Activation failed. Please try again.');
    }
  };

  // Loading state
  if (infoLoading) {
    return (
      <div className="auth-container signup-step">
        <div className="mian-account-card">
          <div className="auth-logo-center">
            <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
          </div>
          <div className="auth-card-white">
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p>Loading your account information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - Invalid or expired token
  if (infoError || !token) {
    return (
      <div className="auth-container signup-step">
        <div className="mian-account-card">
          <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
            <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
          </div>
          <div className="auth-card-white">
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '16px' }}>
                <img src="/assets/images/icons/charm_cross.svg" alt="error" style={{ width: '48px', height: '48px' }} />
              </div>
              <h2 className="auth-title">Invalid or Expired Link</h2>
              <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
                This activation link is invalid or has expired. Please contact your parent to resend the invitation.
              </p>
              <button onClick={() => navigate('/login')} className="btn-primary btn-full">
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container signup-step">
      <div className="mian-account-card">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>
        
        <div className="auth-card-white">
          {/* Welcome Header */}
          <div className="auth-title-sections">
            <h2 className="auth-title">Welcome, {studentInfo?.name || 'Student'}!</h2>
            <p className="auth-subtitle">
              Your parent has created an account for you. Set your password to start learning.
            </p>
          </div>

          {/* Account Info Section */}
          <div className="account-info-box">
            <h4 className="account-info-title">Your account</h4>
            <div className="account-info-item">
              <span className="account-info-label">Email</span>
              <span className="account-info-value">{studentInfo?.email || '-'}</span>
            </div>
            <div className="account-info-item">
              <span className="account-info-label">Form level</span>
              <span className="account-info-value">{studentInfo?.form_level || '-'}</span>
            </div>
            <div className="account-info-item">
              <span className="account-info-label">School</span>
              <span className="account-info-value">{studentInfo?.school_name || '-'}</span>
            </div>
            <div className="account-info-item">
              <span className="account-info-label">Parent account</span>
              <span className="account-info-value">{studentInfo?.parent_name || '-'}</span>
            </div>
          </div>

          {/* Premium Badge */}
          {studentInfo?.is_premium && (
            <div className="premium-info-box">
              <div className="premium-header">
                <span className="premium-icons">
                  <img src="/assets/images/icons/account-prem.svg" alt="premium" />
                </span>
                <strong>Premium Access</strong>
              </div>
              <p className="premium-text">
                Included with family subscription
              </p>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
            {/* Hidden email for password manager */}
            <input 
              type="text" 
              name="email" 
              autoComplete="email"
              value={studentInfo?.email || ''} 
              readOnly
              style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
            />

            <div className="form-group">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <img src="/assets/images/icons/059-eye.svg" alt="show" />
                  ) : (
                    <img src="/assets/images/icons/075-hide.svg" alt="hide" />
                  )}
                </button>
              </div>
              
              <div className="password-requirements">
                <p className={has8Chars ? 'valid' : (formData.password.length > 0 ? 'invalid' : '')}>
                  {has8Chars ? (
                    <img src="/assets/images/icons/mdi_tick.svg" alt="valid" />
                  ) : (
                    <img src="/assets/images/icons/charm_cross.svg" alt="invalid" />
                  )}
                  A minimum of 8 characters.
                </p>
                <p className={hasUpperLower ? 'valid' : (formData.password.length > 0 ? 'invalid' : '')}>
                  {hasUpperLower ? (
                    <img src="/assets/images/icons/mdi_tick.svg" alt="valid" />
                  ) : (
                    <img src="/assets/images/icons/charm_cross.svg" alt="invalid" />
                  )}
                  Have both uppercase and lowercase letters.
                </p>
                <p className={hasNumber ? 'valid' : (formData.password.length > 0 ? 'invalid' : '')}>
                  {hasNumber ? (
                    <img src="/assets/images/icons/mdi_tick.svg" alt="valid" />
                  ) : (
                    <img src="/assets/images/icons/charm_cross.svg" alt="invalid" />
                  )}
                  Must include a number.
                </p>
                <p className={hasSpecial ? 'valid' : (formData.password.length > 0 ? 'invalid' : '')}>
                  {hasSpecial ? (
                    <img src="/assets/images/icons/mdi_tick.svg" alt="valid" />
                  ) : (
                    <img src="/assets/images/icons/charm_cross.svg" alt="invalid" />
                  )}
                  Include at least one special character.
                </p>
              </div>
            </div>

            <div className="form-group">
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <img src="/assets/images/icons/059-eye.svg" alt="show" />
                  ) : (
                    <img src="/assets/images/icons/075-hide.svg" alt="hide" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p style={{ color: '#DD4040', fontSize: '13px', marginTop: '4px' }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {errorMessage && (
              <div style={{ 
                background: '#FEF2F2', 
                border: '1px solid #DD4040', 
                borderRadius: '8px', 
                padding: '12px',
                marginBottom: '16px',
                color: '#DD4040'
              }}>
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary btn-full"
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
            >
              {isLoading ? 'Activating...' : 'Activate my account'}
            </button>
          </form>

          <div className="auth-switch">
            <p>Already have a password? <button onClick={() => navigate('/login/student')} className="link-switch">Login</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentActivation;