// src/components/QAItem.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTutorProfilePath } from '../utils/tutorProfileUtils';

function QAItem({ qa, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(qa.slug);
    }
  };

  const handleInstructorClick = (e) => {
    e.stopPropagation();
    const path = getTutorProfilePath(qa.instructor);
    if (path) navigate(path);
  };

  return (
    <article 
      className="qa-item"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={`qa-avatar ${qa.avatarColor}`}>{qa.avatar}</div>
      <div className="qa-content">
        <div className="qa-header">
          <h4 className="qa-title">
            {qa.title}
            <span className="qa-time">{qa.time}</span>
          </h4>
          <div className={`qa-status ${qa.status}`}>
            {qa.status.charAt(0).toUpperCase() + qa.status.slice(1)}
          </div>
        </div>

        <div className="qa-meta">
          <img
            src={qa.instructor.avatar}
            alt={qa.instructor.name}
            className="qa-instructor-avatar"
            onClick={handleInstructorClick}
            role={getTutorProfilePath(qa.instructor) ? 'button' : undefined}
            style={getTutorProfilePath(qa.instructor) ? { cursor: 'pointer' } : undefined}
          />
          <span
            className="qa-instructor-name"
            onClick={handleInstructorClick}
            role={getTutorProfilePath(qa.instructor) ? 'button' : undefined}
            style={getTutorProfilePath(qa.instructor) ? { cursor: 'pointer' } : undefined}
          >
            {qa.instructor.name}
          </span>
          <span className={`qa-subject ${qa.subject}`}>
            {qa.subject.charAt(0).toUpperCase() + qa.subject.slice(1)}
          </span>
        </div>

        <p className="qa-question">{qa.question}</p>

        <div className="qa-stats">
          <div className="qa-stat-item">
            <img src="/assets/images/icons/Group.svg" alt="Upvote" className="qa-stat-icon" />
            <span>{qa.upvotes}</span>
          </div>
          <div className="qa-stat-item">
            <img src="/assets/images/icons/Vector.svg" alt="Comments" className="qa-stat-icon" />
            <span>{qa.answers} Answers</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default QAItem;