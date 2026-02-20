import React from 'react';

function LessonInfoCard({ title, description, lastUpdated, language }) {
  return (
    <div className="tutor-rec-lesson-cards">
      <h2 className="tutor-rec-lesson-title">{title}</h2>
      <p className="tutor-rec-lesson-desc">{description}</p>
      <div className="tutor-rec-lesson-meta">
        {lastUpdated && <span className="tutor-rec-lesson-meta-item">Last updated: {lastUpdated}</span>}
        {language && <span className="tutor-rec-lesson-meta-tag">{language}</span>}
      </div>
    </div>
  );
}

export default LessonInfoCard;
