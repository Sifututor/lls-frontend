import React from 'react';

function BrowseCourseStats({ stats, isSaved, onSave, onEnroll }) {
  return (
    <div className="browse-stats-container">
      <div className="browse-stats-row">
        <div className="browse-stat-item">
          <div className="browse-stat-label">Lessons</div>
          <div className="browse-stat-value">{stats.lessons}</div>
        </div>

        <div className="browse-stat-item">
          <div className="browse-stat-label">Quizzes</div>
          <div className="browse-stat-value">{stats.quizzes}</div>
        </div>

        <div className="browse-stat-item">
          <div className="browse-stat-label">Enrolled Students</div>
          <div className="browse-stat-value">{stats.enrolledStudents}</div>
        </div>

        <div className="browse-stat-item">
          <div className="browse-stat-label">Learning Hours</div>
          <div className="browse-stat-value">{stats.learningHours}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="browse-actions-row">
        <button 
          className={`btn-browse-save ${isSaved ? 'saved' : ''}`}
          onClick={onSave}
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button 
          className="btn-browse-enroll"
          
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
}

export default BrowseCourseStats;