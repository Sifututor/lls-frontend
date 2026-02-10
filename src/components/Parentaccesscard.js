import React from 'react';

function Parentaccesscard({ link, onRegenerate, onCopy }) {
  return (
    <div className="profile-parent-access-box">
      <h3 className="profile-parent-title">Parent Access</h3>
      <p className="profile-parent-subtitle">Give parents access to manage your account.</p>

      <div className="profile-link-container">
        <input
          type="text"
          value={link || ''}
          readOnly
          className="profile-link-input"
        />
      </div>

      <div className="profile-link-buttons">
        <button className="profile-btn-link-action" onClick={onRegenerate}>
          <span>Regenerate link</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C11.8365 3 13.5 3.73781 14.7322 4.94975L12 7.68198" stroke="#163300" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 4V8H13" stroke="#163300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button className="profile-btn-link-action" onClick={onCopy}>
          <span>Copy Link</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="7" y="7" width="11" height="11" stroke="#163300" strokeWidth="2" fill="none" rx="1"/>
            <rect x="2" y="2" width="11" height="11" stroke="#163300" strokeWidth="2" fill="none" rx="1"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Parentaccesscard;