import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="auth-container forgot-password-success">
        
        <div className="auth-card-white">
          <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
            <img src="/assets/images/Learnest-logo.png" alt="Learnest" />
          </div>

          <div className="success-state">
            <div className="success-icon-large">S</div>
            <h2 className="success-title">Reset Your Password</h2>
            <p className="success-message">
              An email with reset password instructions has been sent to <strong>{email}</strong>. 
              Be sure to check your spam folder too.
            </p>
          </div>

          <button onClick={() => navigate('/login')} className="btn-primary btn-full">Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container forgot-password">
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
      <div className="auth-card-white">

       

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email"></label>
            <input type="email" id="email" name="email" placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary btn-full">Send Reset Link</button>
        </form>

          <div className="auth-switch">
          <p>Back to <button onClick={() => navigate('/login')} className="link-switch">Login</button></p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default ForgotPassword;