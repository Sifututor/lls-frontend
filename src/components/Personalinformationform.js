import React from 'react';

function Personalinformationform({ formData, onChange }) {
  return (
    <div className="edit-profile-section">
      <h2 className="edit-profile-section-title">Personal Information</h2>
      <div className="edit-profile-form-grid">
        <div className="edit-profile-form-group">
          <label className="edit-profile-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder='alex@email.com'
            value={formData.fullName}
            onChange={onChange}
            className="edit-profile-input"
          />
        </div>

        <div className="edit-profile-form-group">
          <label className="edit-profile-label">Email/Student ID</label>
          <input
            type="email"
            name="email"
            placeholder='alex@email.com'
            value={formData.email}
            onChange={onChange}
            className="edit-profile-input"
          />
        </div>

        <div className="edit-profile-form-group">
          <label className="edit-profile-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder='+60 12-345 6789'
            value={formData.phone}
            onChange={onChange}
            className="edit-profile-input"
          />
        </div>

        <div className="edit-profile-form-group">
          <label className="edit-profile-label">School</label>
          <input
            type="text"
            name="school"
            placeholder='Crestwood High School'
            value={formData.school}
            onChange={onChange}
            className="edit-profile-input"
          />
        </div>
      </div>
    </div>
  );
}

export default Personalinformationform;