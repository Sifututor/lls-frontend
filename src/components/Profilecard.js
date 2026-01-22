import React from 'react';

function Profilecard({ userData, onEditProfile }) {
  return (
    <div className="profile-user-card">
      <img 
        src={userData.avatar} 
        alt={userData.name} 
        className="profile-user-avatar" 
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
         <img src="/assets/images/icons/map.svg" alt="Alex Student" class="map"></img>
          <span>{userData.location}</span>
        </div>

        <div className="profile-detail-row">
         <img src="/assets/images/icons/mail.svg" alt="Alex Student" class="mail"></img>
          <span>{userData.contactEmail}</span>
        </div>

        <div className="profile-detail-row">
          <img src="/assets/images/icons/time.svg" alt="Alex Student" class="time"></img>
          <span>{userData.timezone}</span>
        </div>
      </div>
    </div>
  );
}

export default Profilecard;