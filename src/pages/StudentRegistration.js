// src/pages/StudentRegistration.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation, useGetFormsQuery } from '../store/api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { validatePassword } from '../utils/passwordValidation';
import '../assets/css/auth.css';
import authBg from '../assets/images/landing-page-bg.png';

function StudentRegistration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  
  // Fetch forms dynamically from API
  const { data: formsData, isLoading: formsLoading } = useGetFormsQuery();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    form_level: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pdpaConsent, setPdpaConsent] = useState(false);

  // Dynamic form levels from API (with fallback)
  const forms = formsData || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation || !formData.form_level) {
      setError('All fields are required');
      return;
    }

    // Validate password BEFORE proceeding
    const passwordValidation = validatePassword(formData.password);
    
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(', '));
      return; // STOP HERE - don't proceed
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return; // STOP HERE
    }

    if (!pdpaConsent) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    try {
      // Format form_level: "Form 1" -> "form_1" or keep as is based on API requirements
      const formattedFormLevel = formData.form_level.toLowerCase().replace(/\s+/g, '_');
      
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        form_level: formattedFormLevel,
        user_type: 'student',
        pdpa_consent_at: new Date().toISOString(),
      }).unwrap();

      // Store credentials
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
      }

      if (response.user) {
        localStorage.setItem('userData', JSON.stringify(response.user));
        localStorage.setItem('userType', response.user.user_type || 'student');
        dispatch(setCredentials({
          user: response.user,
          token: response.token
        }));
      }

      // Navigate to student dashboard
      navigate('/student/dashboard');

    } catch (err) {
      setError(err.data?.message || err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container student-login-page" style={{ '--auth-bg': `url(${authBg})` }}>
      <div className="login-selection">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        <div className="login-title-section">
          <h1 className="login-main-title">Create Student Account</h1>
          <p className="login-subtitle">Sign up to start your learning journey.</p>
        </div>

        <div className="parent-login-card-container">
          <div className="auth-card-white parent-login-card">
            <div className="auth-title-section">
              <button className="btn-back-icon" onClick={() => navigate('/login')}>
                <img src="/assets/images/icons/material-symbols_arrow-back.svg" alt="back" />
              </button>
              <h2 className="card-title">Student Registration</h2>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
              <div className="form-group">
                <label htmlFor="student-name">Full Name</label>
                <input 
                  type="text" 
                  id="student-name" 
                  name="name" 
                  placeholder="Full Name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  autoComplete="name"
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="student-email">Email Address</label>
                <input 
                  type="email" 
                  id="student-email" 
                  name="email" 
                  placeholder="Email Address" 
                  value={formData.email} 
                  onChange={handleChange} 
                  autoComplete="email"
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="student-form-level">Form Level</label>
                <select
                  id="student-form-level"
                  name="form_level"
                  value={formData.form_level}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px' }}
                >
                  <option value="">
                    {formsLoading ? 'Loading form levels...' : 'Select Form Level'}
                  </option>
                  {forms.length === 0 && !formsLoading && (
                    <>
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                      <option value="Form 5">Form 5</option>
                    </>
                  )}
                  {forms.map((form) => (
                    <option key={form.id} value={form.name || form.title || `Form ${form.level}`}>
                      {form.name || form.title || `Form ${form.level}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="student-password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="student-password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    minLength={8}
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
                <p className="field-hint" style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  Must be at least 8 characters
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="student-confirm-password">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="student-confirm-password"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    autoComplete="new-password"
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
                    checked={pdpaConsent} 
                    onChange={(e) => setPdpaConsent(e.target.checked)}
                    disabled={isLoading}
                    required
                  />
                  <span>I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="link-terms">Terms & Conditions</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="link-terms">Privacy Policy</a></span>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn-primary btn-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="divider-or">
              <span>Or</span>
            </div>

            <div className="auth-switch">
              <p>Already have an account? <button type="button" onClick={() => navigate('/login/student')} className="link-switch" disabled={isLoading}>Sign In</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRegistration;

