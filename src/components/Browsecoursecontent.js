import React from 'react';

function BrowseCourseContent({ courseContent }) {
  return (
    <div className="browse-content-section">
      <h2 className="browse-section-title">Course Content</h2>

      <div className="browse-content-list">
        {courseContent.map((section) => (
          <div 
            key={section.id} 
            className="browse-content-item"
          >
            <div className="browse-content-icon">
              <span className="browse-chapter-icon">C</span>
            </div>
            <div className="browse-content-info">
              <h3 className="browse-content-title">{section.title}</h3>
              <p className="browse-content-subtitle">{section.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseCourseContent;