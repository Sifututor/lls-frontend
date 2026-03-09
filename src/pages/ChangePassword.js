import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChangePasswordMutation } from '../store/api/authApi';

function ChangePassword() {
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    try {
      await changePassword({
        old_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword
      }).unwrap();
      setSuccess(true);
      setTimeout(() => navigate('/student/settings'), 2000);
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Failed to change password');
    }
  };

  return (
    <div className="change-password-page">
      <div className="page-header">
        <button 
          className="back-btn" 
          onClick={() => navigate('/student/settings')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}
        >
          ← Back to Settings
        </button>
        <h1>Change Password</h1>
        <p>Update your password to keep your account secure</p>
      </div>

      {success ? (
        <div className="success-message" style={{ padding: '20px', background: '#D1FAE5', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#065F46' }}>Password changed successfully! Redirecting...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="change-password-form">
          {error && (
            <div className="error-message" style={{ padding: '12px', background: '#FEE2E2', borderRadius: '8px', marginBottom: '20px', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={8}
              style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px' }}
            />
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              Must be at least 8 characters
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px' }}
            />
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
              style={{ padding: '12px 24px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Updating...' : 'Change Password'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/student/settings')}
              className="btn-secondary"
              style={{ padding: '12px 24px', background: 'white', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ChangePassword;

