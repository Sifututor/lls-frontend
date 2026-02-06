// src/pages/StudentRegistrationStep2.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../store/api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import { showSuccess, showError, showWarning } from '../utils/toast';
import '../assets/css/auth.css';

function StudentRegistrationStep2() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();
  
  // Get step 1 data from localStorage
  const [signupData, setSignupData] = useState(null);
  
  const [formData, setFormData] = useState({
    formLevel: '',
    schoolName: '',
    state: '',
    birthDay: '',
    birthMonth: '',
    birthYear: ''
  });

  const [agreements, setAgreements] = useState({
    termsOfService: false,
    parentPermission: false
  });

  useEffect(() => {
    const savedData = localStorage.getItem('studentSignupData');
    if (!savedData) {
      navigate('/create-account/student');
      return;
    }
    setSignupData(JSON.parse(savedData));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAgreementChange = (e) => {
    setAgreements({
      ...agreements,
      [e.target.name]: e.target.checked
    });
  };

  // Form levels
  const formLevels = ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'];

  // Malaysian states
  const malaysianStates = [
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
    'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah',
    'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'
  ];

  // Days, months, years for birthday
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 - i);

  // Function to call /me API
  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://10.0.0.232:8000'}/api/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();

      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('userType', data.user.user_type || 'student');
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
    
    if (!formData.formLevel) {
      showWarning('Please select your Form Level');
      return;
    }

    if (!agreements.termsOfService) {
      showWarning('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    try {
      // Prepare birthday
      let date_of_birth = null;
      if (formData.birthDay && formData.birthMonth && formData.birthYear) {
        const monthIndex = months.indexOf(formData.birthMonth) + 1;
        date_of_birth = `${formData.birthYear}-${String(monthIndex).padStart(2, '0')}-${String(formData.birthDay).padStart(2, '0')}`;
      }

      const registerPayload = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        password_confirmation: signupData.password_confirmation,
        user_type: 'student',
        form_level: formData.formLevel,
        school_name: formData.schoolName || null,
        state: formData.state || null,
        date_of_birth: date_of_birth,
        pdpa_terms: true,
        pdpa_privacy: true,
        pdpa_consent: true
      };

      const result = await register(registerPayload).unwrap();

      // If registration successful and we have token
      if (result.token) {
        // Store token
        localStorage.setItem('authToken', result.token);
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('tokenExpiry', expiryTime.toString());

        // Call /me API to get user data
        await fetchUserData(result.token);
      }

      // Store for success page
      localStorage.setItem('pendingVerificationEmail', signupData.email);
      localStorage.setItem('pendingVerificationName', signupData.name);
      
      // Clear signup data
      localStorage.removeItem('studentSignupData');

      // Navigate to success
      navigate('/create-account/student/success');
      
    } catch (err) {
      if (err.data?.errors) {
        const errorMessages = Object.values(err.data.errors).flat().join('\n');
        showError(errorMessages);
      } else if (err.data?.message) {
        showError(err.data.message);
      } else {
        showError('Registration failed. Please try again.');
      }
    }
  };

  if (!signupData) {
    return null; // Loading or redirecting
  }

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
            <button className="btn-back-icon" onClick={() => navigate('/create-account/student')}>
              <img src="/assets/images/icons/material-symbols_arrow-back.svg" alt="back" />
            </button>

            <div className="auth-title-text">
              <h2 className="auth-title">Student Details</h2>
              <p className="auth-subtitle">Step 2 of 2 - Academic Information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
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

            {/* Form Level - Required */}
            <div className="form-group">
              <label htmlFor="formLevel"></label>
              <select
                id="formLevel"
                name="formLevel"
                value={formData.formLevel}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Form Level *</option>
                {formLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* School Name - Optional */}
            <div className="form-group">
              <label htmlFor="schoolName"></label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                placeholder="School Name (Optional)"
                value={formData.schoolName}
                onChange={handleChange}
              />
            </div>

            {/* State - Optional */}
            <div className="form-group">
              <label htmlFor="state"></label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">State (Optional)</option>
                {malaysianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Birthday - Optional */}
            <div className="form-group">
              <div className="birth-date-row">
                <select 
                  name="birthDay" 
                  value={formData.birthDay} 
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>

                <select 
                  name="birthMonth" 
                  value={formData.birthMonth} 
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>

                <select 
                  name="birthYear" 
                  value={formData.birthYear} 
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <p className="field-hint">
                <img src="/assets/images/icons/080-info.svg" alt="info" />
                We use this for birthday rewards and age-appropriate content
              </p>
            </div>

            {/* Agreements */}
            <div className="agreements-section">
              <label className="checkbox-label agreement-item">
                <input
                  type="checkbox"
                  name="termsOfService"
                  checked={agreements.termsOfService}
                  onChange={handleAgreementChange}
                  required
                />
                <span>
                  I agree to the <a href="/terms-of-service" target="_blank" className="link-terms">Terms of Service</a> and{' '}
                  <a href="/privacy-policy" target="_blank" className="link-terms">Privacy Policy</a> <span className="required-star">*</span>
                </span>
              </label>

              <label className="checkbox-label agreement-item">
                <input
                  type="checkbox"
                  name="parentPermission"
                  checked={agreements.parentPermission}
                  onChange={handleAgreementChange}
                />
                <span>
                  I have my parent/guardian's permission to use this platform
                </span>
              </label>
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
              disabled={isLoading || !formData.formLevel || !agreements.termsOfService}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
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

export default StudentRegistrationStep2;