// src/components/Privacysettingscard.js
import React, { useState } from 'react';

function Privacysettingscard() {
  const [settings, setSettings] = useState({
    marketingCommunications: true,
    activityTracking: true,
    publicProfile: false,
    thirdPartySharing: false
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="main-settings-card">
         <div className="settings-section-card">
      <div className="settings-section-header">
        <h2 className="settings-section-title">Privacy & PDPA Settings</h2>
        <p className="settings-section-subtitle">Control how we use your data and communication with you.</p>
      </div>

      <div className="settings-grid">
        <div className="settings-item">
          <div className="settings-item-content">
            <h3 className="settings-item-title">Marketing Communications</h3>
            <p className="settings-item-description">
              Receive updates about new features, special offers, and partner promotions via email.
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.marketingCommunications}
              onChange={() => handleToggle('marketingCommunications')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-item">
          <div className="settings-item-content">
            <h3 className="settings-item-title">Activity Tracking & Analytics</h3>
            <p className="settings-item-description">
              Allow us to collect anonymous usage data to improve user experience and fix bugs.
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.activityTracking}
              onChange={() => handleToggle('activityTracking')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-item">
          <div className="settings-item-content">
            <h3 className="settings-item-title">Public Profile Visibility</h3>
            <p className="settings-item-description">
              Make your profile visible to search engines and non-registered users.
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.publicProfile}
              onChange={() => handleToggle('publicProfile')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-item">
          <div className="settings-item-content">
            <h3 className="settings-item-title">Third-Party Data Sharing</h3>
            <p className="settings-item-description">
              Allow sharing of non-sensitive data with trusted partners for integrated services.
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.thirdPartySharing}
              onChange={() => handleToggle('thirdPartySharing')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
      
    
    </div>
      <div className="settings-footer-note">
        Your data is handled according to our <a href="#" className="settings-link">Privacy Policy</a> and <a href="#" className="settings-link">Terms of Service</a>.
      </div>
      </div>
  );
}

export default Privacysettingscard;