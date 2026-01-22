// src/components/BrowseCourseCard.js
import React from 'react';

function BrowseCourseCard({ course, onClick }) {
  const handleCardClick = () => {
    if (onClick) onClick(course.slug);
  };

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(course.slug);
  };

  return (
    <article className="course-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="course-thumbnail">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          onError={(e) => e.target.src = '/assets/images/live-classes.png'}
        />
      </div>

      <div className="class-badges-row">
        <span className={`course-badge ${course.badge || ''}`}>
          {course.badge ? course.badge.charAt(0).toUpperCase() + course.badge.slice(1) : ''}
        </span>
      </div>

      <div className="course-info">
        <div className="course-instructor">
          <img 
            src={course.instructor?.avatar} 
            alt={course.instructor?.name} 
            className="instructor-avatar"
            onError={(e) => e.target.src = '/assets/images/icons/Ellipse 2.svg'}
          />
          <span className="course-instructor-name">{course.instructor?.name}</span>
        </div>

        <h4 className="course-title">{course.title}</h4>
        <p className="course-chapter">{course.lessons || course.chapter || ''}</p>

        <div className="course-actions">
          <button className="btn-enroll-now" onClick={handleEnrollClick}>
            Enroll Now
          </button>
        </div>
      </div>
    </article>
  );
}

export default BrowseCourseCard;