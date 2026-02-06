// src/components/Deleteaccountmodal.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Deleteaccountmodal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setPassword('');
      setError('');
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirmDelete = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken') || Cookies.get('authToken');
      
      // API call to delete account
      const response = await fetch('http://10.55.1.160:8000/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        // Clear all local storage and cookies
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userData');
        localStorage.removeItem('userType');
        localStorage.removeItem('isPremium');
        Cookies.remove('authToken', { path: '/' });
        Cookies.remove('tokenExpiry', { path: '/' });
        Cookies.remove('userData', { path: '/' });
        Cookies.remove('userType', { path: '/' });
        Cookies.remove('isPremium', { path: '/' });
        onClose();
        navigate('/login');
      } else {
        setError(data.message || 'Failed to delete account. Please check your password.');
      }
    } catch (err) {
      console.error('Delete account error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div 
        className={`delete-modal-content ${isOpen ? 'slide-up' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="delete-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#163300" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Trash Image Header */}
        <div className="delete-modal-header">
          <img 
            src="/assets/images/delete-account-popup.png" 
            alt="Delete Account" 
            className="delete-header-image"
          />
        </div>

        {/* Content */}
        <div className="delete-modal-body">
          <h2 className="delete-modal-title">Delete Account?</h2>
          
          <div className="delete-warning-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M12 2L1 21H23L12 2Z"
    fill="#163300"
  />
  <rect x="11" y="9" width="2" height="6" fill="#FFFFFF"/>
  <rect x="11" y="16.5" width="2" height="2" fill="#FFFFFF"/>
</svg>

            <span>This action is permanent. Deleting your account will permanently remove:</span>
          </div>

          <ul className="delete-items-list">
            <li>Your learning progress</li>
            <li>Enrolled courses</li>
            <li>Certificates</li>
            <li>Account data</li>
          </ul>

          <p className="delete-confirm-text">Are you sure you want to continue?</p>

          {/* Password Input */}
          <div className="delete-password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? 'input-error' : ''}
            />
            <button 
              type="button" 
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
         
           <img 
            src="/assets/images/icons/059-eye.svg" 
            alt="Delete Account" 
            className="show"
          />
              ) : (
                  <img 
            src="/assets/images/icons/075-hide.svg" 
            alt="Delete Account" 
            className="hide"
          />
              )}
            </button>
          </div>

          {error && (
            <p className="delete-error-message">{error}</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="delete-modal-footer">
          <button className="btn-cancel-delete" onClick={onClose}>
            Cancel
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button 
            className="btn-confirm-delete-popup" 
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Deleteaccountmodal;