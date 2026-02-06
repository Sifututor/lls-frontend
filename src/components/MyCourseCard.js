// src/components/MyCourseCard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTutorProfilePath } from '../utils/tutorProfileUtils';

function MyCourseCard({ course, onClick }) {
  const navigate = useNavigate();
  const [progressWidth, setProgressWidth] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Animate progress bar on mount (0 → actual progress)
  useEffect(() => {
    if (course.progress !== undefined) {
      const timer = setTimeout(() => {
        setProgressWidth(course.progress);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [course.progress]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.course-menu-btn')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    onClick && onClick(course.slug);
  };

  const handleCardClick = () => {
    onClick && onClick(course.slug);
  };

  const handleUnenroll = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (window.confirm(`Unenroll from "${course.title}"?`)) {
    }
  };

  const handleReport = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
  };

  // Render button based on course type
  const renderActionButton = () => {
    switch (course.type) {
      case 'ongoing':
        return <button className="btn-continue" onClick={handleButtonClick}>Continue Learning</button>;
      case 'completed':
        return <button className="btn-view-course main" onClick={handleButtonClick}>View Course</button>;
      case 'saved':
        return <button className="btn-enroll-now" onClick={handleButtonClick}>Enroll Now</button>;
      default:
        return null;
    }
  };

  return (
    <article className="course-card">
      {/* Thumbnail */}
      <div className="course-thumbnail" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <img 
          src={course.thumbnail} 
          alt={course.title}
          onError={(e) => e.target.src = '/assets/images/live-classes.png'}
        />
      </div>

      {/* Badges */}
      <div className="class-badges-row">
        <span className={`course-badge ${course.badge}`}>
          {course.badge.charAt(0).toUpperCase() + course.badge.slice(1)}
        </span>
        {course.lastWatched && <span className="last-watched">Last Watched</span>}
      </div>

      {/* Course Info */}
      <div className="course-info">
        <div
          className="course-instructor"
          onClick={(e) => {
            e.stopPropagation();
            const path = getTutorProfilePath(course.instructor);
            if (path) navigate(path);
          }}
          role={getTutorProfilePath(course.instructor) ? 'button' : undefined}
          style={getTutorProfilePath(course.instructor) ? { cursor: 'pointer' } : undefined}
        >
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="course-instructor-avatar"
            onError={(e) => e.target.src = '/assets/images/icons/Ellipse 2.svg'}
          />
          <span className="course-instructor-name">{course.instructor.name}</span>
        </div>
        
        <h4 className="course-title" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          {course.title}
        </h4>
        
        <p className="course-chapter">{course.chapter}</p>

        {/* Progress Bar - Only for ongoing & completed, NOT saved */}
        {course.progress !== undefined && (
          <>
            <div className="course-progress-wrapper">
              <span className="course-progress-text">Progress</span>
              <span className="course-progress-percent">{course.progress}%</span>
            </div>

            <div className="stat-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${progressWidth}%`,
                    transition: 'width 0.8s ease-out'
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="course-actions">
          {course.type !== 'saved' && (
            <div style={{ position: 'relative' }}>
              <button 
                className="btn-dots course-menu-btn" 
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              >
                <img
                  src="/assets/images/icons/simple-line-icons_options-vertical.svg"
                  alt="More"
                  className="dots-icon"
                />
              </button>
              {menuOpen && (
                <div className="course-menu-dropdown active">
                  <div className="menu-item" onClick={handleUnenroll} style={{ cursor: 'pointer' }}>Unenroll</div>
                  <div className="menu-item" onClick={handleReport} style={{ cursor: 'pointer' }}>Report</div>
                </div>
              )}
            </div>
          )}
          {renderActionButton()}
        </div>
      </div>
    </article>
  );
}

export default MyCourseCard;