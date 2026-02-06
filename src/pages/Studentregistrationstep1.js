// src/pages/StudentRegistrationStep1.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

function StudentRegistrationStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save student info to localStorage for next step
    const studentSignupData = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password
    };
    localStorage.setItem('studentSignupData', JSON.stringify(studentSignupData));
    
    navigate('/create-account/student/details');
  };

  // Password validation
  const has8Chars = formData.password.length >= 8;
  const hasUpperLower = /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const isPasswordValid = has8Chars && hasUpperLower && hasNumber && hasSpecial;

  return (
    <div className="auth-container signup-step">
      <div className="mian-account-card">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>
        
        <div className="auth-card-white">
          <div className="progress-bars">
            <div className="progress-steps active"></div>
            <div className="progress-steps"></div>
          </div>

          <div className="auth-title-sections">
            <h2 className="auth-title">Create Student account</h2>
            <p className="auth-subtitle">Step 1 of 2 - Your Information</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
            <div className="form-group">
              <label htmlFor="fullName"></label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email"></label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              <p className="field-hint">
                <img src="/assets/images/icons/080-info.svg" alt="info" />
                We'll send a verification link to this email
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="password"></label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a password"
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
                    <img src="/assets/images/icons/059-eye.svg" alt="show password" />
                  ) : (
                    <img src="/assets/images/icons/075-hide.svg" alt="hide password" />
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

            <button 
              type="submit" 
              className="btn-primary btn-full"
              disabled={!formData.fullName || !formData.email || !isPasswordValid}
            >
              Continue
            </button>
          </form>

          <div className="auth-switch">
            <p>Already have an account? <button onClick={() => navigate('/login/student')} className="link-switch">Login</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRegistrationStep1;