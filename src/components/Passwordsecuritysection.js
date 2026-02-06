import React, { useState } from 'react';
import { showWarning } from '../utils/toast';

function Passwordsecuritysection({ 
  securityLevel, 
  passwordData, 
  onPasswordChange, 
  onUpdate 
}) {
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(passwordData.newPassword);

  const handleDiscard = () => {
    setShowPasswordSection(false);
    onPasswordChange({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showWarning('Passwords do not match!');
      return;
    }
    onUpdate();
    setShowPasswordSection(false);
  };

  return (
    <div className="edit-profile-section">
      <div className="edit-profile-password-header">
        <div>
          <h2 className="edit-profile-section-title">
            Password & Security 
            <span className="edit-profile-security-badge">Strong Security</span>
          </h2>
          <p className="edit-profile-section-subtitle">
            Manage your password and security preferences.
          </p>
        </div>
        {!showPasswordSection ? (
          <button 
            className="edit-profile-btn-update-password"
            onClick={() => setShowPasswordSection(true)}
          >
            Update Password
          </button>
        ) : (
          <button 
            className="edit-profile-btn-discard"
            onClick={handleDiscard}
          >
            Discard
          </button>
        )}
      </div>

   {/* Current Password */}
<div className="edit-profile-password-field">
    <label className="edit-profile-label">
        Current Password
    </label>

    <div className="edit-profile-password-input-wrapper">
        <input
            type={showPasswords.current ? 'text' : 'password'}
            name="currentPassword"
            value={passwordData.currentPassword}
            placeholder="Enter current password"
            onChange={(e) =>
                onPasswordChange({
                    ...passwordData,
                    currentPassword: e.target.value,
                })
            }
            className="edit-profile-input"
        />

        <button
            type="button"
            className="edit-profile-password-toggle"
            onClick={() => togglePasswordVisibility('current')}
        >
            <img
                src={
                    showPasswords.current
                        ? '/assets/images/icons/059-eye.svg'
                        : '/assets/images/icons/075-hide.svg'
                }
                alt={showPasswords.current ? 'Show password' : 'Hide password'}
            />
        </button>
    </div>
</div>


      {/* Expanded Section */}
      <div className={`edit-profile-password-expanded ${showPasswordSection ? 'show' : ''}`}>
        {/* New Password */}
        <div className="edit-profile-password-field">
          <label className="edit-profile-label">New Password</label>
          <div className="edit-profile-password-input-wrapper">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => onPasswordChange({ ...passwordData, newPassword: e.target.value })}
              className="edit-profile-input"
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="edit-profile-password-toggle"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? (
                <img src="/assets/images/icons/059-eye.svg" alt="show password" />
              ) : (
                <img src="/assets/images/icons/075-hide.svg" alt="hide password" />
              )}
            </button>
          </div>
          {/* Password Strength Indicator */}
          {passwordData.newPassword && (
            <div className="edit-profile-password-strength">
              <div className="edit-profile-strength-bars">
                <div className={`edit-profile-strength-bar ${passwordStrength >= 25 ? 'active' : ''}`}></div>
                <div className={`edit-profile-strength-bar ${passwordStrength >= 50 ? 'active' : ''}`}></div>
                <div className={`edit-profile-strength-bar ${passwordStrength >= 75 ? 'active' : ''}`}></div>
                <div className={`edit-profile-strength-bar ${passwordStrength >= 100 ? 'active' : ''}`}></div>
              </div>
              <span className="edit-profile-strength-text">
                {passwordStrength >= 75 ? 'Strong Password' : passwordStrength >= 50 ? 'Medium Password' : 'Weak Password'}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="edit-profile-password-field">
          <label className="edit-profile-label">Confirm Password</label>
          <div className="edit-profile-password-input-wrapper">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => onPasswordChange({ ...passwordData, confirmPassword: e.target.value })}
              className="edit-profile-input"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              className="edit-profile-password-toggle"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? (
                <img src="/assets/images/icons/059-eye.svg" alt="show password" />
              ) : (
                <img src="/assets/images/icons/075-hide.svg" alt="hide password" />
              )}
            </button>
          </div>
        </div>

        {/* Update Password Button */}
        <button 
          className="edit-profile-btn-submit-password"
          onClick={handleUpdate}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export default Passwordsecuritysection;