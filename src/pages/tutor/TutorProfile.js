/**
 * Tutor Profile – Dynamic: GET/PUT /tutor/profile (or account-settings fallback).
 * Layout: Avatar card (left) + Stats grid (right), Teaching Profile form below.
 * URL: /tutor/profile
 */
import React, { useState, useEffect } from 'react';
import { useGetTutorProfileQuery, useUpdateTutorProfileMutation } from '../../store/api/authApi';
import { showSuccess, showError } from '../../utils/toast';
import '../../assets/css/tutor-profile.css';

const defaultAvatar = '/assets/images/icons/Ellipse 3.svg';

function TutorProfile() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [bio, setBio] = useState('');

  const { data: profileRes, isLoading: profileLoading, isError: profileError } = useGetTutorProfileQuery(undefined, { skip: false });
  const [updateProfile, { isLoading: saveLoading, isError: saveError, error: saveErrData }] = useUpdateTutorProfileMutation();

  const profile = profileRes?.success ? profileRes?.data : null;
  const apiErrors = (saveErrData?.data?.errors || saveErrData?.data?.message) ? (saveErrData?.data?.errors || { _: [saveErrData?.data?.message] }) : null;

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? profile.name ?? [profile.first_name, profile.last_name].filter(Boolean).join(' ') ?? '');
      setEmail(profile.email ?? '');
      setContact(profile.phone ?? profile.contact ?? '');
      setBio(profile.bio ?? '');
    } else if (profileError || (profileRes && !profileRes?.success)) {
      try {
        const stored = JSON.parse(localStorage.getItem('userData') || '{}');
        if (stored.name) setFullName(stored.name);
        if (stored.email) setEmail(stored.email);
        if (stored.phone) setContact(stored.phone);
      } catch (_) {}
    }
  }, [profile, profileError, profileRes]);

  const displayName = profile ? (profile.full_name || profile.name || [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Tutor') : (typeof localStorage !== 'undefined' ? (JSON.parse(localStorage.getItem('userData') || '{}').name || 'Tutor') : 'Tutor');
  const avatar = (profile?.profile_image || profile?.avatar) || defaultAvatar;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        full_name: fullName,
        email,
        phone: contact,
        bio,
      }).unwrap();
      showSuccess('Profile updated successfully.');
    } catch (err) {
      const errors = err?.data?.errors || {};
      const msg = errors.full_name?.[0] || errors.email?.[0] || Object.values(errors).flat()[0] || err?.data?.message || err?.message;
      showError(typeof msg === 'string' ? msg : 'Failed to update profile.');
    }
  };

  if (profileLoading && !profile && !profileError) {
    return (
      <div className="tp-wrapper">
        <h1 className="tp-title">Profile</h1>
        <p style={{ color: '#9A9A9A' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="tp-wrapper">
      <h1 className="tp-title">Profile</h1>

      {/* Overview Card */}
      <div className="tp-overview-card">
        {/* Left: Avatar + Verified + Name */}
        <div className="tp-avatar-section">
          <div className="tp-avatar-row">
            <div className="tp-avatar">
              <img
                src={avatar}
                alt={displayName}
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
            </div>
            <span className="tp-verified">
              Verified
              <img src="/assets/images/tutor/verified.svg" alt="Verified" className="tp-verified-icon" />
            </span>
          </div>
          <h2 className="tp-name">{displayName}</h2>
          <p className="tp-meta">Mathematics Tutor • SPM Curriculum</p>
        </div>

        {/* Right: Stats Grid - 4 columns, 2 rows */}
        <div className="tp-stats-grid">
          {/* Row 1 */}
          <div className="tp-stat-card">
            <span className="tp-stat-value">156</span>
            <span className="tp-stat-label">Assigned Students</span>
          </div>
          <div className="tp-stat-card">
            <span className="tp-stat-value">24</span>
            <span className="tp-stat-label">Published Lessons</span>
          </div>
          <div className="tp-stat-card">
            <span className="tp-stat-value">18</span>
            <span className="tp-stat-label">Uploaded Quizzes</span>
          </div>
          <div className="tp-stat-card">
            <span className="tp-stat-value">4.8</span>
            <span className="tp-stat-label">Your Overall Rating</span>
          </div>
          {/* Row 2 */}
          <div className="tp-stat-card">
            <span className="tp-stat-value">4.8</span>
            <span className="tp-stat-label">Upvotes received</span>
          </div>
          <div className="tp-stat-card">
            <span className="tp-stat-value">18</span>
            <span className="tp-stat-label">Average Response Time</span>
          </div>
          <div className="tp-stat-card">
            <span className="tp-stat-value">18</span>
            <span className="tp-stat-label">Total questions answered</span>
          </div>
        </div>
      </div>

      {/* Teaching Profile Card */}
      <div className="tp-teaching-card">
        <h3 className="tp-section-title">Teaching Profile</h3>
        {profileError && <p style={{ color: '#DC2626', marginBottom: 12 }}>Failed to load profile. You can still edit and save.</p>}
        {apiErrors && Object.keys(apiErrors).filter((k) => k !== '_').length > 0 && (
          <ul style={{ color: '#DC2626', marginBottom: 12, paddingLeft: 20 }}>
            {Object.entries(apiErrors).filter(([k]) => k !== '_').map(([key, msgs]) => (
              <li key={key}>{Array.isArray(msgs) ? msgs.join(', ') : msgs}</li>
            ))}
          </ul>
        )}
        <form onSubmit={handleSave} className="tp-form">
          <div className="tp-field">
            <label className="tp-label">Full Name</label>
            <input
              type="text"
              className="tp-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {apiErrors?.full_name && <span className="tp-error">{Array.isArray(apiErrors.full_name) ? apiErrors.full_name[0] : apiErrors.full_name}</span>}
          </div>
          <div className="tp-field">
            <label className="tp-label">Email Address</label>
            <input
              type="email"
              className="tp-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {apiErrors?.email && <span className="tp-error">{Array.isArray(apiErrors.email) ? apiErrors.email[0] : apiErrors.email}</span>}
          </div>
          <div className="tp-field">
            <label className="tp-label">Contact Number</label>
            <input
              type="text"
              className="tp-input"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="tp-field">
            <label className="tp-label">Bio</label>
            <textarea
              className="tp-textarea"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <button type="submit" className="tp-save-btn" disabled={saveLoading}>{saveLoading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}

export default TutorProfile;