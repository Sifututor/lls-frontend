// src/components/tutor/AssignedStudentsProgress.js
import React from 'react';
import { Link } from 'react-router-dom';

const defaultStudents = [
  {
    id: 1,
    name: 'Nurul Fatimah',
    avatar: '/assets/images/avatars/student1.jpg',
    form: 'Form 4',
    subject: 'Add Mathematics',
    progress: 85,
    progressColor: 'green'
  },
  {
    id: 2,
    name: 'Zainab Karim',
    avatar: '/assets/images/avatars/student2.jpg',
    form: 'Form 5',
    subject: 'Modern Mathematics',
    progress: 62,
    progressColor: 'orange'
  },
  {
    id: 3,
    name: 'Muhammad Ali',
    avatar: '/assets/images/avatars/student3.jpg',
    form: 'Form 5',
    subject: 'Add Mathematics',
    progress: 28,
    progressColor: 'red'
  },
];

function AssignedStudentsProgress({ students = defaultStudents }) {
  const list = Array.isArray(students) ? students : defaultStudents;

  return (
    <div className="upcoming-classes-section">
      <div className="section-header">
        <h3 className="section-title">Assigned Students Progress</h3>
        <Link to="/tutor/engagement/progress-cards" className="view-all-link">View all</Link>
      </div>
      <div className="students-list">
        {list.map((student) => (
          <div key={student.id} className="student-card">
            <div className="student-avatar">
              <img
                src={student.avatar}
                alt={student.name}
                onError={(e) => { e.target.src = '/assets/images/tutor/tutor.jpg'; }}
              />
            </div>
            <div className="student-info">
              <h4 className="student-name">{student.name}</h4>
              <p className="student-meta">{student.form} • {student.subject}</p>
            </div>
            <div className="student-progress">
              <div className="progress-header">
                <span className="progress-label">Progress</span>
                <span className="progress-percent">{student.progress}% Complete</span>
              </div>

              <div className="progress-bar">
                <div
                  className={`progress-fill progress-${student.progressColor}`}
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default AssignedStudentsProgress;