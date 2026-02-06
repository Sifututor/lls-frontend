import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import '../assets/css/auth.css';

function SelectStudent() {
  const navigate = useNavigate();
  const { childrenDisplay, setSelectedStudentId } = useRegistration();

  const displayStudents = Array.isArray(childrenDisplay) && childrenDisplay.length > 0
    ? childrenDisplay.map((s, i) => ({
        id: s.id || i + 1,
        name: s.name,
        form: s.displayFormLevel || s.form_level || '—',
        avatar: s.avatar || '/assets/images/student-img.png',
        status: s.status,
      }))
    : [];

  const handleStudentSelect = (student) => {
    setSelectedStudentId(student.id);
    try {
      localStorage.setItem('selectedStudentId', String(student.id));
      localStorage.setItem('selectedStudent', JSON.stringify(student));
    } catch (e) {}
    navigate('/student/dashboard');
  };

  return (
    <div className="auth-container student-selection">
      <div className="login-selection">
      {/* Logo */}
       <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

      {/* Title */}
      <div className="selection-title-section">
        <h1 className="selection-title">Who's Learning</h1>
        <p className="selection-subtitle">Select a profile to start your learning journey</p>
      </div>

      {/* Student Cards */}
      <div className="student-selection-card">
        <div className="students-grid">
          {displayStudents.length === 0 ? (
            <div className="students-grid-empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px' }}>
              <p style={{ marginBottom: '16px' }}>No students added yet. Add a student to get started.</p>
              <button type="button" className="btn-primary" onClick={() => navigate('/register/add-children')}>
                Add Student
              </button>
            </div>
          ) : displayStudents.map((student) => (
            <div
              key={student.id}
              className="student-profile-card"
              onClick={() => handleStudentSelect(student)}
            >
              <img src={student.avatar} alt={student.name} className="profile-avatar" />
              <h3 className="profile-name">{student.name}</h3>
              <p className="profile-form">{student.form}</p>
              {student.status && <p className="profile-status">{student.status}</p>}
            </div>
          ))}

          {/* Add Student Button - only show when we have at least one student */}
          {displayStudents.length > 0 && (
          <div className="student-profile-card add-student-card" onClick={() => navigate('/register/add-children')}>
            <div className="add-student-icon">+</div>
            <h3 className="add-student-text">Add Student</h3>
          </div>
          )}
        </div>

        {/* Use Different Account */}
        <button className="btn-use-different-account" onClick={() => navigate('/')}>
          ← Use a different account
        </button>
      </div>
    </div>
    </div>

  );
}

export default SelectStudent;