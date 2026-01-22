import React, { useState } from 'react';

function Studentemailcard({ onSubmit }) {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email.trim()) {
      onSubmit(email);
      setEmail('');
    }
  };

  return (
    <div className="profile-card-box">
      <h3 className="profile-card-heading">
        Student Email <span className="profile-optional-text">(Optional)</span>
      </h3>

      <div className="profile-input-wrapper">
        <input
          type="email"
          placeholder="Student email"
          className="profile-input-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="profile-info-box">
        <img src="/assets/images/icons/info.svg" alt="Alex Student" class="info"></img>
        <p className="profile-info-text">
          If an email address is provided, an activation email will be sent to allow you to set your password and access your account independently.
        </p>
      </div>

      <button className="profile-btn-submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default Studentemailcard;