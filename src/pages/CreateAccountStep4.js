import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';
import authBg from '../assets/images/landing-page-bg.png';

function CreateAccountStep4({ signupData, onComplete }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    schoolName: '',
    state: '',
    studentEmail: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Complete signup with all data
    onComplete('parent', { ...signupData, children: [formData] });
  };

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 5 - i);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="auth-container signup-step" style={{ '--auth-bg': `url(${authBg})` }}>
      <div className="auth-card-white">
        {/* Logo - Clickable */}
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/Learnest-logo.png" alt="Learnest" />
        </div>

        {/* Title */}
        <div className="auth-title-section">
          <h2 className="auth-title">Add your children</h2>
          <p className="auth-subtitle">You can add more children later</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="studentName">Student Name</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              placeholder=""
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthYear">Birth year</label>
            <div className="birth-date-row">
              <select name="birthYear" value={formData.birthYear} onChange={handleChange} required>
                <option value="">Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} required>
                <option value="">Month</option>
                {months.map((month, idx) => (
                  <option key={idx} value={idx + 1}>{month}</option>
                ))}
              </select>

              <select name="birthDay" value={formData.birthDay} onChange={handleChange} required>
                <option value="">Day</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="schoolName">School Name (Optional)</label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              placeholder=""
              value={formData.schoolName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State (Optional)</label>
            <select id="state" name="state" value={formData.state} onChange={handleChange}>
              <option value="">Select State</option>
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

          <div className="form-group">
            <label htmlFor="studentEmail">Student Email (Optional)</label>
            <input
              type="email"
              id="studentEmail"
              name="studentEmail"
              placeholder=""
              value={formData.studentEmail}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary btn-full">
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountStep4;