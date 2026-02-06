// src/components/Browsecourseheader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTutorProfilePath } from '../utils/tutorProfileUtils';

function BrowseCourseHeader({ courseData }) {
  const navigate = useNavigate();
  // Safe access with defaults
  const badges = courseData?.badges || [];
  const title = courseData?.title || 'Course Title';
  const instructor = courseData?.instructor || {};
  const rating = instructor?.rating || 4.5;
  const reviews = instructor?.reviews || 0;
  const duration = courseData?.duration || '12 weeks';
  const tutorPath = getTutorProfilePath(instructor);

  return (
    <div className="course-header">
      {/* Badges Row */}
      <div className="course-badges">
        {badges.map((badge, index) => (
          <span key={badge.id || index} className="course-badge-pill">
            {badge.text}
          </span>
        ))}
      </div>

      {/* Course Title */}
      <h1 className="course-detail-title">{title}</h1>

      {/* Instructor Info Row */}
      <div className="browse-instructor-row">
        <div
          className="browse-instructor-info"
          onClick={() => tutorPath && navigate(tutorPath)}
          role={tutorPath ? 'button' : undefined}
          style={tutorPath ? { cursor: 'pointer' } : undefined}
        >
          <img 
            src={instructor.avatar || '/assets/images/icons/Ellipse 2.svg'} 
            alt={instructor.name || 'Instructor'} 
            className="browse-instructor-avatar"
          />
          <span className="browse-instructor-name">{instructor.name || 'Unknown Instructor'}</span>
        </div>

        <div className="browse-rating-info">
          <span className="browse-rating-star">
            <img src="/assets/images/icons/review.svg" alt="Rating" className="browse-duration-icon" />
          </span>
          <span className="browse-rating-value">{rating}</span>
          <span className="browse-rating-reviews">
            ({(reviews || 0).toLocaleString()} reviews)
          </span>
        </div>

        <div className="browse-duration-info">
          <img src="/assets/images/icons/week.svg" alt="Duration" className="browse-duration-icon" />
          <span className="browse-duration-text">{duration}</span>
        </div>
      </div>
    </div>
  );
}

export default BrowseCourseHeader;