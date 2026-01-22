import React from 'react';

function BrowseCourseHeader({ courseData }) {
  return (
    <div className="course-header">
      {/* Badges Row */}
      <div className="course-badges">
        {courseData.badges.map((badge, index) => (
          <span key={index} className="course-badge-pill">
            {badge.text}
          </span>
        ))}
      </div>

      {/* Course Title */}
      <h1 className="course-detail-title">{courseData.title}</h1>

      {/* Instructor Info Row */}
      <div className="browse-instructor-row">
        <div className="browse-instructor-info">
          <img 
            src={courseData.instructor.avatar} 
            alt={courseData.instructor.name} 
            className="browse-instructor-avatar"
          />
          <span className="browse-instructor-name">{courseData.instructor.name}</span>
        </div>

        <div className="browse-rating-info">
          <span className="browse-rating-star">
            <img src="/assets/images/icons/review.svg" alt="Rating" className="browse-duration-icon" />
          </span>
          <span className="browse-rating-value">{courseData.instructor.rating}</span>
          <span className="browse-rating-reviews">
            ({courseData.instructor.reviews.toLocaleString()} reviews)
          </span>
        </div>

        <div className="browse-duration-info">
          <img src="/assets/images/icons/week.svg" alt="Duration" className="browse-duration-icon" />
          <span className="browse-duration-text">{courseData.duration}</span>
        </div>
      </div>
    </div>
  );
}

export default BrowseCourseHeader;