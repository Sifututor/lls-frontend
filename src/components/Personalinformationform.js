import React from 'react';

function Personalinformationform({ formData, onChange }) {
  return (
    <div className="edit-profile-section">
      <h2 className="edit-profile-section-title">Personal Information</h2>
      <div className="edit-profile-form-grid">
        {/* First Name */}
        <div className="edit-profile-form-group">
          <label className="edit-profile-label">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={onChange}
            className="edit-profile-input"
          />
        </div>

        {/* Last Name */}
        <div className="edit-profile-form-group">
          <label className="edit-profile-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={onChange}
            className="edit-profile-input"
          />
        </div>

        {/* Email - Read Only */}
        <div className="edit-profile-form-group">
          <label className="edit-profile-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={onChange}
            className="edit-profile-input"
            readOnly
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
        </div>

        {/* Phone Number */}
        <div className="edit-profile-form-group">
          <label className="edit-profile-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="+60 12-345 6789"
            value={formData.phone}
            onChange={onChange}
            className="edit-profile-input"
          />
        </div>

        {/* Date of Birth */}
        <div className="edit-profile-form-group">
          <label className="edit-profile-label">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={onChange}
            className="edit-profile-input"
          />
        </div>

        {/* Country */}
        <div className="edit-profile-form-group">
          <label className="edit-profile-label">Country</label>
          <input
            type="text"
            name="country"
            placeholder="Enter country"
            value={formData.country}
            onChange={onChange}
            className="edit-profile-input"
          />
        </div>
      </div>
    </div>
  );
}

export default Personalinformationform;