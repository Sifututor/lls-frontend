import React, { useState } from 'react';

function Liveclassheader({ liveClassData }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="course-details-header">
      <div className="course-header">
        {/* Top Row: Badge & Recorded Class Button */}
        <div className="two-grid">
          {/* Badges */}
          <div className="course-badges">
            {liveClassData.badges.map((badge) => (
              <span key={badge.id} className="course-badge-pill">
                {badge.text}
              </span>
            ))}
          </div>

          {/* Recorded Class Button (Right of Badge) */}
          <div className="live-class-header-buttons">
            <button className="btn-recorded-class">Recorded Class</button>
          </div>
        </div>

        {/* Bottom Row: Title & View Course Button */}
        <div className="course-header-bottom live-class">
          {/* Left - Title & Instructor */}
          <div className="course-header-left">
            <h1 className="course-detail-title">{liveClassData.title}</h1>

            <div className="browse-instructor-row">
                <div className="browse-instructor-info">
              <img
                src={liveClassData.instructor.avatar}
                alt="Instructor"
                className="instructor-avatar-small"
              />
              <span className="instructor-name-text">
                {liveClassData.instructor.name}
              </span>
             </div>

              {/* Rating */}
              <div className="browse-rating-info">
                <img src="/assets/images/icons/review.svg" alt="Rating" />
                <span>{liveClassData.rating} ({liveClassData.reviews})</span>
              </div>

              {/* Duration */}
              <div className="browse-duration-info">
                <img src="/assets/images/icons/week.svg" alt="Duration" />
                <span>{liveClassData.duration}</span>
              </div>
            </div>
          </div>

          {/* Right - View Course Button (Center aligned with title) */}
          <div className="live-class-view-course">
            <button className="btn-view-course">View Course</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Liveclassheader;