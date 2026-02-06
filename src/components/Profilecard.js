import React from 'react';

function Profilecard({ userData, onEditProfile }) {
  return (
    <div className="profile-user-card">
      <img
        src={userData.avatar || '/assets/images/icons/Ellipse 3.svg'}
        alt={userData.name || 'Student'}
        className="profile-user-avatar"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/assets/images/icons/Ellipse 3.svg';
        }}
      />

      <div className="profile-user-info-section">
        <div className="profile-user-name-row">
          <h2 className="profile-user-name">{userData.name}</h2>
          {userData.isPremium && (
            <img 
              src="/assets/images/icons/go-premime.svg" 
              alt="Premium" 
              className="profile-premium-badge-icon"
            />
          )}
        </div>
        <p className="profile-user-email-text">{userData.email}</p>
      </div>

      <p className="profile-user-bio">{userData.bio}</p>

      <button className="profile-btn-edit" onClick={onEditProfile}>
        Edit Profile
      </button>

      <div className="profile-user-details">
        <div className="profile-detail-row">
         <img src="/assets/images/icons/map.svg" alt="Alex Student" className="map"></img>
          <span>{userData.location}</span>
        </div>

        <div className="profile-detail-row">
         <img src="/assets/images/icons/mail.svg" alt="Alex Student" className="mail"></img>
          <span>{userData.contactEmail}</span>
        </div>

        <div className="profile-detail-row">
          <img src="/assets/images/icons/time.svg" alt="Alex Student" className="time"></img>
          <span>{userData.timezone}</span>
        </div>
      </div>
    </div>
  );
}

export default Profilecard;