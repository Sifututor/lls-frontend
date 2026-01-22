// src/components/CourseCard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CourseCard({ course }) {
  const navigate = useNavigate();
  const [progressWidth, setProgressWidth] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(course.progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [course.progress]);

  // Handle Continue Learning with scroll to top - using SLUG
  const handleContinueLearning = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate(`/course-details/${course.slug}`);
  };

  // Handle Unenroll
  const handleUnenroll = () => {
    setMenuOpen(false);
    if (window.confirm(`Are you sure you want to unenroll from "${course.title}"?`)) {
      console.log('Unenroll from course:', course.slug);
      // API call will go here
    }
  };

  // Handle Report
  const handleReport = () => {
    setMenuOpen(false);
    if (window.confirm(`Report "${course.title}"?`)) {
      console.log('Report course:', course.slug);
      // API call will go here
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.course-menu-btn')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  return (
    <article className="course-card">
      <div 
        className="course-thumbnail"
        onClick={handleContinueLearning}
        style={{ cursor: 'pointer' }}
      >
        <img src={course.thumbnail} alt={course.title} />
      </div>

      <div className="class-badges-row course">
        <span className={`course-badge ${course.badge}`}>
          {course.badge.charAt(0).toUpperCase() + course.badge.slice(1)}
        </span>
        {course.lastWatched && <span className="last-watched">Last Watched</span>}
      </div>

      <div className="course-info">
        <div className="course-instructor">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="course-instructor-avatar"
          />
          <span className="course-instructor-name">{course.instructor.name}</span>
        </div>
        
        <h4 
          className="course-title"
          onClick={handleContinueLearning}
          style={{ cursor: 'pointer' }}
        >
          {course.title}
        </h4>
        
        <p className="course-chapter">{course.chapter}</p>

        <div className="course-progress-wrapper">
          <span className="course-progress-text">Progress</span>
          <span className="course-progress-percent">{course.progress}%</span>
        </div>

        <div className="stat-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        <div className="course-actions">
          <div style={{ position: 'relative' }}>
            <button 
              className="btn-dots course-menu-btn" 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <img
                src="/assets/images/icons/simple-line-icons_options-vertical.svg"
                alt="More"
                className="dots-icon"
              />
            </button>
            {menuOpen && (
              <div className="course-menu-dropdown active">
                <div 
                  className="menu-item" 
                  onClick={handleUnenroll}
                  style={{ cursor: 'pointer' }}
                >
                  Unenroll
                </div>
                <div 
                  className="menu-item" 
                  onClick={handleReport}
                  style={{ cursor: 'pointer' }}
                >
                  Report this course
                </div>
              </div>
            )}
          </div>

          <button 
            className="btn-continue"
            onClick={handleContinueLearning}
          >
            Continue Learning
          </button>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;