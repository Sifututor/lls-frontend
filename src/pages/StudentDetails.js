import React, { useState } from 'react';
import '../assets/css/auth.css';

function StudentDetails({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    studentName: '',
    icNumber: '',
    birthdate: '',
    schoolName: '',
    grade: '',
    state: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container student-details">
      <div className="auth-card-white">
        {/* Back Button */}
        <button className="btn-back-white" onClick={onBack}>
          ← Back
        </button>

        {/* Logo */}
        <div className="auth-logo-center">
          <img src="/assets/images/Learnest-logo.png" alt="Learnest" />
        </div>

        {/* Title */}
        <div className="auth-title-section">
          <h2 className="auth-title">Add your children</h2>
          <p className="auth-subtitle">You can add more children later</p>
        </div>

        {/* Student Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="studentName">Student Name</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              placeholder="Enter student name"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="icNumber">IC/Passport</label>
            <input
              type="text"
              id="icNumber"
              name="icNumber"
              placeholder="Enter IC or passport"
              value={formData.icNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthdate">Birthdate</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="schoolName">School Name</label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              placeholder="Enter school name"
              value={formData.schoolName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group form-col">
              <label htmlFor="grade">Grade</label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
              >
                <option value="">Form</option>
                <option value="form1">Form 1</option>
                <option value="form2">Form 2</option>
                <option value="form3">Form 3</option>
                <option value="form4">Form 4</option>
                <option value="form5">Form 5</option>
              </select>
            </div>

            <div className="form-group form-col">
              <label htmlFor="state">State</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">State</option>
                <option value="johor">Johor</option>
                <option value="kedah">Kedah</option>
                <option value="kelantan">Kelantan</option>
                <option value="melaka">Melaka</option>
                <option value="negeri-sembilan">Negeri Sembilan</option>
                <option value="pahang">Pahang</option>
                <option value="penang">Penang</option>
                <option value="perak">Perak</option>
                <option value="perlis">Perlis</option>
                <option value="sabah">Sabah</option>
                <option value="sarawak">Sarawak</option>
                <option value="selangor">Selangor</option>
                <option value="terengganu">Terengganu</option>
                <option value="kuala-lumpur">Kuala Lumpur</option>
                <option value="labuan">Labuan</option>
                <option value="putrajaya">Putrajaya</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentDetails;