import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

function SelectStudent({ students = [], onSelectStudent }) {
  const navigate = useNavigate();

  // Mock students if none provided
  const displayStudents = students.length > 0 ? students : [
    { id: 1, name: 'Shahroz', form: 'Form 2', avatar: '/assets/images/student-img.png' },
    { id: 2, name: 'Ali', form: 'Form 4', avatar: '/assets/images/student-img.png', status: 'Activation sent' }
  ];

  const handleStudentSelect = (student) => {
    onSelectStudent(student);
    navigate('/dashboard');
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
          {displayStudents.map((student) => (
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

          {/* Add Student Button */}
          <div className="student-profile-card add-student-card" onClick={() => navigate('/create-account/add-child')}>
            <div className="add-student-icon">+</div>
            <h3 className="add-student-text">Add Student</h3>
          </div>
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