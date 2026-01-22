// src/pages/LoginRoleSelection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

function LoginRoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="auth-container login-role-selection">
      <div className="login-selection">
        <div className="auth-logo-center clickable" onClick={() => navigate('/')}>
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
        </div>

        <div className="selection-title-section">
          <h1 className="selection-title">Welcome!</h1>
          <p className="selection-subtitle">How would you like to continue?</p>
        </div>

        <div className="role-selection-card">
          <div className="role-cards-grid-three">
            <button
              className="role-selection-card-item"
              onClick={() => navigate('/login/parent')}
            >
              <div className="role-card-icon">
                <img src="/assets/images/icons/parent.svg" alt="Parent" />
              </div>
              <h3 className="role-card-title">I'm a Parent</h3>
              <p className="role-card-subtitle">Access your family dashboard</p>
            </button>

            <button
              className="role-selection-card-item"
              onClick={() => navigate('/login/student')}
            >
              <div className="role-card-icon">
                <img src="/assets/images/icons/student.svg" alt="Student" />
              </div>
              <h3 className="role-card-title">I'm a Student</h3>
              <p className="role-card-subtitle">Continue your learning journey</p>
            </button>

            <button
              className="role-selection-card-item"
              onClick={() => navigate('/login/tutor')}
            >
              <div className="role-card-icon">
                <img src="/assets/images/icons/tutor.svg" alt="Tutor" />
              </div>
              <h3 className="role-card-title">I'm a Tutor</h3>
              <p className="role-card-subtitle">Manage your classes and students</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRoleSelection;