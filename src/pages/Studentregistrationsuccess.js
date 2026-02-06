// src/pages/StudentRegistrationSuccess.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { showSuccess, showError } from '../utils/toast';
import '../assets/css/auth.css';

function StudentRegistrationSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState('');

  const isEmailVerification = searchParams.has('redirect');

  useEffect(() => {
    const name = localStorage.getItem('pendingVerificationName') || '';
    const email = localStorage.getItem('pendingVerificationEmail') || '';
    setUserName(name);
    setUserEmail(email);
  }, []);

  useEffect(() => {
    const verifyEmail = async () => {
      const redirectUrl = searchParams.get('redirect');
      if (!redirectUrl) return;

      setVerificationStatus('verifying');

      try {
        const decodedUrl = decodeURIComponent(redirectUrl);
        const response = await fetch(decodedUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        const data = await response.json();

        if (response.ok && (data.status === true || (data.message && data.message.toLowerCase().includes('verified')))) {
          setVerificationStatus('success');
          setVerificationMessage('Your email has been verified successfully!');
          showSuccess('Email verified successfully!');
        } else if (response.status === 409 || (data.message && data.message.toLowerCase().includes('already'))) {
          setVerificationStatus('already');
          setVerificationMessage('Your email is already verified.');
          showSuccess('Email already verified!');
        } else {
          setVerificationStatus('error');
          setVerificationMessage(data.message || 'Verification failed. The link may have expired.');
          showError(data.message || 'Verification failed');
        }
      } catch (error) {
        console.error('[EmailVerify] Error:', error);
        setVerificationStatus('error');
        setVerificationMessage('Network error. Please try again.');
        showError('Network error occurred');
      }
    };

    verifyEmail();
  }, [searchParams]);

  const getTitle = () => {
    if (!isEmailVerification) return 'Welcome to Learnest!';
    if (verificationStatus === null || verificationStatus === 'verifying') return 'Verifying Your Email...';
    if (verificationStatus === 'success' || verificationStatus === 'already') return 'Email Verified!';
    if (verificationStatus === 'error') return 'Verification Failed';
    return 'Welcome to Learnest!';
  };

  const getMessage = () => {
    if (!isEmailVerification) return 'Your account has been created successfully.';
    if (verificationStatus === null || verificationStatus === 'verifying') return 'Please wait while we verify your email address...';
    if (verificationStatus === 'success') return 'Your email has been verified successfully. You can now access all features.';
    if (verificationStatus === 'already') return "Your email is already verified. You're all set!";
    if (verificationStatus === 'error') return verificationMessage;
    return 'Your account has been created successfully.';
  };

  const getInfoMessage = () => {
    if (!isEmailVerification) return "We've sent a verification email to confirm your account.";
    if (verificationStatus === 'success' || verificationStatus === 'already') return 'You can now enjoy full access to Learnest.';
    if (verificationStatus === 'error') return 'Please request a new verification email or contact support.';
    return null;
  };

  const getButtonText = () => {
    if (verificationStatus === 'verifying' || (isEmailVerification && verificationStatus === null)) return 'Please Wait...';
    if (verificationStatus === 'error') return 'Go to Login';
    return 'Start Learning';
  };

  const handleStartLearning = () => {
    if (verificationStatus === 'error') {
      navigate('/login/student');
      return;
    }
    localStorage.removeItem('pendingVerificationEmail');
    localStorage.removeItem('pendingVerificationName');
    localStorage.removeItem('studentSignupData');
    const token = localStorage.getItem('authToken') || Cookies.get('authToken');
    if (token) {
      navigate('/student/dashboard');
    } else {
      navigate('/login/student');
    }
  };

  const handleInviteParent = () => {
    navigate('/student/invite-parent');
  };

  const renderIcon = () => {
    if (isEmailVerification && (verificationStatus === null || verificationStatus === 'verifying')) {
      return (
        <div className="success-icon-check success-icon-check--verifying">
          <div className="success-spinner" />
        </div>
      );
    }
    if (isEmailVerification && verificationStatus === 'error') {
      return (
        <div className="success-icon-check success-icon-check--error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
      );
    }
    return (
      <div className="success-icon-check">
        <img src="/assets/images/icons/landing-page-icon.svg" alt="success" />
      </div>
    );
  };

  return (
    <div className="auth-container signup-step">
      <div className="mian-account-card">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        <div className="auth-card-white">
          <div className="success-state">
            {renderIcon()}
            <div className="success-text">
              <h2 className="success-title">{getTitle()}</h2>
              <p className="success-message">{getMessage()}</p>
            </div>
          </div>

          {getInfoMessage() && (
            <div className={`info-box ${verificationStatus === 'error' ? 'info-box--error' : ''}`}>
              <div className="info-icon">
                <img src="/assets/images/icons/080-info.svg" alt="info" />
              </div>
              <p>{getInfoMessage()}</p>
            </div>
          )}

          <button
            onClick={handleStartLearning}
            className={`btn-primary btn-full ${(verificationStatus === 'verifying' || (isEmailVerification && verificationStatus === null)) ? 'btn-primary--loading' : ''} ${verificationStatus === 'error' ? 'btn-primary--secondary' : ''}`}
            disabled={verificationStatus === 'verifying' || (isEmailVerification && verificationStatus === null)}
          >
            {getButtonText()}
          </button>

          {!isEmailVerification && (
            <div className="auth-switch">
              <p>
                Want your parent to manage your subscription?{' '}
                <button onClick={handleInviteParent} className="link-switch" type="button">
                  Invite Parent
                </button>
              </p>
            </div>
          )}

          {isEmailVerification && verificationStatus === 'error' && (
            <div className="auth-switch">
              <p>
                Didn&apos;t receive the email?{' '}
                <button onClick={() => navigate('/login/student')} className="link-switch" type="button">
                  Resend Verification Email
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentRegistrationSuccess;