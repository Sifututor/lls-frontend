// src/components/tutor/PendingSubmissions.js
import React from 'react';
import { Link } from 'react-router-dom';

const defaultSubmissions = [
  {
    id: 1,
    title: 'Chapter 5: Quadratic Equations',
    meta: 'Form 5 • Chapter 3/12',
    status: 'Pending',
    statusColor: 'orange'
  },
  {
    id: 2,
    title: 'Quiz Trigonometry Basics',
    meta: 'Submitted yesterday • 15 Questions',
    status: 'Pending',
    statusColor: 'orange'
  },
  {
    id: 3,
    title: 'Chapter 5: Logarithms (Need Edit)',
    meta: 'Rejected - Audio Quality Issue • Click to fix',
    status: 'Rejected',
    statusColor: 'red'
  },
  {
    id: 4,
    title: 'Live: Integration Techniques',
    meta: 'Scheduled for Today • 3:00 PM',
    status: 'Scheduled',
    statusColor: 'green'
  },
  {
    id: 5,
    title: 'Live: Integration Techniques',
    meta: 'Scheduled for Today • 3:00 PM',
    status: 'Scheduled',
    statusColor: 'green'
  },
];

function getStatusClass(color) {
  switch (color) {
    case 'orange': return 'status-pending';
    case 'red': return 'status-rejected';
    case 'green': return 'status-scheduled';
    default: return 'status-pending';
  }
}

function PendingSubmissions({ submissions = defaultSubmissions }) {
  const hasRealData = Array.isArray(submissions) && submissions.length > 0;
  const list = hasRealData ? submissions : defaultSubmissions;

  return (
    <div className="submissions-section">
      <div className="section-header">
        <h3 className="section-title">Pending & Recent Submissions</h3>
        <Link to="/tutor/courses/pending" className="view-all-link">View all</Link>
      </div>
      <div className="submissions-list">
        {hasRealData ? (
          list.map((item) => (
            <div key={item.id} className="submission-card">
              <div className="submission-icon" />
              <div className="submission-info">
                <h4 className="submission-title">{item.title}</h4>
                <p className="submission-meta">{item.meta}</p>
              </div>
              <span className={`submission-status ${getStatusClass(item.statusColor)}`}>
                {item.status}
              </span>
            </div>
          ))
        ) : (
          <p style={{ color: '#6B7280', fontSize: 14, margin: 0 }}>
            No recent submissions yet. When you upload lessons, live classes, or quizzes, they will show here.
          </p>
        )}
      </div>
    </div>
  );
}

export default PendingSubmissions;