// src/components/QAItem.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTutorProfilePath } from '../utils/tutorProfileUtils';

// Helper: Format time ago
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

// Helper: Get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Helper: Get avatar color based on id
const getAvatarColor = (id) => {
  const colors = ['green', 'blue', 'purple', 'orange', 'red'];
  return colors[(id || 0) % colors.length];
};

function QAItem({ qa, onClick }) {
  const navigate = useNavigate();

  // Support both old format and new API format
  const isApiFormat = qa.question_text !== undefined;

  // Normalize data
  const normalizedQA = isApiFormat ? {
    id: qa.id,
    slug: qa.id,
    avatar: getInitials(qa.user?.name || 'Anonymous'),
    avatarColor: getAvatarColor(qa.id),
    title: qa.lesson?.title || 'Video Question',
    time: formatTimeAgo(qa.created_at),
    status: qa.latest_answer ? 'answered' : 'pending',
    instructor: {
      avatar: qa.user?.profile_image || qa.user?.avatar || '/assets/images/icons/Ellipse 2.svg',
      name: qa.user?.name || (qa.is_anonymous ? 'Anonymous' : 'Student'),
      id: qa.user?.id
    },
    subject: qa.lesson?.course?.subject?.toLowerCase() || 'general',
    question: qa.question_text,
    upvotes: qa.upvote_count || 0,
    answers: qa.answers_count || (qa.latest_answer ? 1 : 0),
  } : qa;

  const handleClick = () => {
    if (onClick) {
      onClick(normalizedQA.slug || normalizedQA.id);
    }
  };

  const handleInstructorClick = (e) => {
    e.stopPropagation();
    const path = getTutorProfilePath(normalizedQA.instructor);
    if (path) navigate(path);
  };

  return (
    <article 
      className="qa-item"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={`qa-avatar ${normalizedQA.avatarColor}`}>{normalizedQA.avatar}</div>
      <div className="qa-content">
        <div className="qa-header">
          <h4 className="qa-title">
            {normalizedQA.title}
            <span className="qa-time">{normalizedQA.time}</span>
          </h4>
          <div className={`qa-status ${normalizedQA.status}`}>
            {normalizedQA.status.charAt(0).toUpperCase() + normalizedQA.status.slice(1)}
          </div>
        </div>

        <div className="qa-meta">
          <img
            src={normalizedQA.instructor.avatar}
            alt={normalizedQA.instructor.name}
            className="qa-instructor-avatar"
            onClick={handleInstructorClick}
            onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/icons/Ellipse 2.svg'; }}
            role={getTutorProfilePath(normalizedQA.instructor) ? 'button' : undefined}
            style={getTutorProfilePath(normalizedQA.instructor) ? { cursor: 'pointer' } : undefined}
          />
          <span
            className="qa-instructor-name"
            onClick={handleInstructorClick}
            role={getTutorProfilePath(normalizedQA.instructor) ? 'button' : undefined}
            style={getTutorProfilePath(normalizedQA.instructor) ? { cursor: 'pointer' } : undefined}
          >
            {normalizedQA.instructor.name}
          </span>
          <span className={`qa-subject ${normalizedQA.subject}`}>
            {normalizedQA.subject.charAt(0).toUpperCase() + normalizedQA.subject.slice(1)}
          </span>
        </div>

        <p className="qa-question">{normalizedQA.question}</p>

        <div className="qa-stats">
          <div className="qa-stat-item">
            <img src="/assets/images/icons/Group.svg" alt="Upvote" className="qa-stat-icon" />
            <span>{normalizedQA.upvotes}</span>
          </div>
          <div className="qa-stat-item">
            <img src="/assets/images/icons/Vector.svg" alt="Comments" className="qa-stat-icon" />
            <span>{normalizedQA.answers} Answers</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default QAItem;