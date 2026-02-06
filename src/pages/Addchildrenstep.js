// src/pages/Addchildrenstep.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddChildrenMutation } from '../store/api/authApi';
import { useRegistration } from '../context/RegistrationContext';
import { showError, showWarning } from '../utils/toast';
import '../assets/css/auth.css';

function AddChildrenStep() {
  const navigate = useNavigate();
  const { children: contextChildren, setChildren, setChildrenDisplay } = useRegistration();
  const [addChildren, { isLoading, error }] = useAddChildrenMutation();

  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (Array.isArray(contextChildren) && contextChildren.length > 0 && contextChildren[0]?.name) {
      setStudents(
        contextChildren.map((c, i) => ({
          id: c.id || i + 1,
          name: c.name,
          email: c.email || '',
          form_level: c.form_level,
          displayFormLevel: c.form_level?.startsWith('Form') ? c.form_level : `Form ${c.form_level}`,
          avatar: '/assets/images/student-img.png',
        }))
      );
    }
  }, []);
  const [formData, setFormData] = useState({
    studentName: '',
    formLevel: '',
    schoolName: '',
    state: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    studentEmail: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Map form level to API format - Based on Postman collection
  // API accepts: "primary" or "secondary"
  const mapFormLevelToApi = (formLevel) => {
    const mapping = {
      'Form 1': 'primary',
      'Form 2': 'primary',
      'Form 3': 'primary',
      'Form 4': 'secondary',
      'Form 5': 'secondary'
    };
    return mapping[formLevel] || 'secondary';
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    
    const newStudent = {
      name: formData.studentName,
      form_level: mapFormLevelToApi(formData.formLevel),
      email: formData.studentEmail || undefined,
      id: Date.now(),
      avatar: '/assets/images/student-img.png',
      displayFormLevel: formData.formLevel,
    };
    
    setStudents([...students, newStudent]);
    
    setFormData({
      studentName: '',
      formLevel: '',
      schoolName: '',
      state: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      studentEmail: ''
    });
  };

  const handleDone = async () => {
    if (students.length === 0) {
      showWarning('Please add at least one student');
      return;
    }

    const childrenForApi = students.map((s) => {
      const child = { name: s.name, form_level: s.form_level };
      if (s.email) child.email = s.email;
      return child;
    });

    setChildren(childrenForApi);
    setChildrenDisplay(students);

    try {
      await addChildren({ children: childrenForApi }).unwrap();
      navigate('/register/student-terms');
    } catch (err) {
      if (err.data?.message) {
        showError(err.data.message);
      } else if (err.data?.errors) {
        const msgs = Object.values(err.data.errors).flat().join('\n');
        showError(msgs);
      } else {
        showError('Failed to add children. Please try again.');
      }
    }
  };

  const formLevels = ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'];
  const states = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'];
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 5 - i);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="auth-container signup-step">
      <div className="mian-account-card">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>
        
        <div className="auth-card-white visible-top">
          <div className="student-title-section">
            <h2 className="auth-title">Add your children</h2>
            <p className="auth-subtitle">Create learning profiles for your children.</p>
          </div>

          <form onSubmit={handleAddStudent} className="auth-form">
            <div className="form-group">
              <label htmlFor="studentName"></label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                placeholder='Student Name'
                value={formData.studentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="formLevel"></label>
              <select
                id="formLevel"
                name="formLevel"
                value={formData.formLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select Form Level *</option>
                {formLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="schoolName"></label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                placeholder='School Name (Optional)'
                value={formData.schoolName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state"></label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label></label>
              <div className="birth-date-row">
                <select name="birthDay" value={formData.birthDay} onChange={handleChange} required>
                  <option value="">Day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>

                <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} required>
                  <option value="">Month</option>
                  {months.map((month, idx) => (
                    <option key={idx} value={idx + 1}>{month}</option>
                  ))}
                </select>

                <select name="birthYear" value={formData.birthYear} onChange={handleChange} required>
                  <option value="">Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <p className="field-hint">
                <img src="/assets/images/icons/080-info.svg" alt="info" />
                We use this for birthday rewards and age-appropriate content
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="studentEmail"></label>
              <input
                type="email"
                id="studentEmail"
                name="studentEmail"
                placeholder='Student Email (Optional)'
                value={formData.studentEmail}
                onChange={handleChange}
              />
              <p className="field-hint">
                <img src="/assets/images/icons/080-info.svg" alt="info" /> 
                If provided, we'll send an activation email so your child can set their own password and login independently.
              </p>
            </div>

            <button type="submit" className="btn-primary btn-full">
              Add Student
            </button>
          </form>

          {students.length > 0 && (
            <div className="students-added-section">
              <h3 className="students-added-title">Student Added</h3>
              <div className="students-list">
                {students.map((student) => (
                  <div key={student.id} className="student-card">
                    <img src={student.avatar} alt={student.name} className="student-avatar" />
                    <h4 className="student-name">{student.name}</h4>
                    <p className="student-form">{student.displayFormLevel}</p>
                    <p className="student-status">Parent-managed</p>
                  </div>
                ))}
                <div className="add-another-wrapper" onClick={() => window.scrollTo(0, 0)}>
                  <div className="add-another-circle">
                    <span className="plus-icon">+</span>
                  </div>
                  <span className="add-another-text">Add Another</span>
                </div>
              </div>

              {error && (
                <div className="error-message" style={{ background: '#FEF2F2', border: '1px solid #DD4040', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#DD4040' }}>
                  {error.data?.message || 'Failed to add children.'}
                </div>
              )}
              <button type="button" onClick={handleDone} className="btn-primary btn-full btn-done" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Done, Start Learning'}
              </button>

              <p className="helper-text">You can add more students anytime from the profile picker.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddChildrenStep;