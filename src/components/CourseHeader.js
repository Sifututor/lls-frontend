// src/components/CourseHeader.js
import React, { useState, useEffect } from 'react';

function CourseHeader({ courseData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  // Animate progress bar
  useEffect(() => {
    if (courseData?.progress !== undefined) {
      const timer = setTimeout(() => {
        setProgressWidth(courseData.progress);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [courseData?.progress]);

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

  if (!courseData) return null;

  return (
    <div className="course-details-header">
      <div className="course-header">
        <div className="two-grid">
          {/* Badges */}
          <div className="course-badges">
            {courseData.badges?.map((badge) => (
              <span key={badge.id} className="course-badge-pill">
                {badge.text}
              </span>
            ))}
          </div>

          {/* 3 Dot Menu */}
          <div className="course-menu-wrapper">
            <div style={{ position: 'relative' }}>
              <button 
                className="btn-dots course-menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <img
                  src="/assets/images/icons/simple-line-icons_options-vertical.svg"
                  alt="More"
                  className="dots-icon"
                />
              </button>
              {menuOpen && (
                <div className="course-menu-dropdown active">
                  <div className="menu-item" onClick={() => setMenuOpen(false)}>
                    Unenroll
                  </div>
                  <div className="menu-item" onClick={() => setMenuOpen(false)}>
                    Report this course
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="course-header-bottom">
          {/* Left - Title & Instructor */}
          <div className="course-header-left">
            <h1 className="course-detail-title">{courseData.title}</h1>

            <div className="course-instructor-info">
              <img
                src={courseData.instructor?.avatar || '/assets/images/icons/Ellipse 2.svg'}
                alt="Instructor"
                className="instructor-avatar-small"
                onError={(e) => e.target.src = '/assets/images/icons/Ellipse 2.svg'}
              />
              <span className="instructor-name-text">
                {courseData.instructor?.name || 'Unknown Instructor'}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="course-progress-info">
            <div className="progress-bar-header">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${progressWidth}%`,
                  transition: 'width 0.8s ease-out'
                }}
              />
            </div>
            <span className="progress-text-header">
              {courseData.progress || 0}% Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseHeader;