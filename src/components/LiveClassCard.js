// src/components/LiveClassCard.js
import React from 'react';

function LiveClassCard({ classData, onJoin, onNotify }) {
  
  const handleButtonClick = () => {
    if (classData.buttonType === 'join' || classData.buttonType === 'watch') {
      onJoin && onJoin(classData.slug);
    } else {
      onNotify && onNotify(classData.slug);
    }
  };

  return (
    <article className="class-card">
      {/* Thumbnail with fallback (like MyCourseCard) */}
      <div className="class-thumbnail">
        <img 
          src={classData.thumbnail} 
          alt={classData.mainTitle}
          onError={(e) => e.target.src = '/assets/images/live-classes.png'}
        />
      </div>

      <div className="class-badges-row">
        <span className={`class-status ${classData.status}`}>
          {classData.status === 'ongoing' && <span className="status-dot"></span>}
          {classData.status === 'recorded' ? 'Recorded' : classData.status.charAt(0).toUpperCase() + classData.status.slice(1)}
        </span>
        <span className={`class-subject ${classData.subject?.toLowerCase().replace(/\s+/g, '-')}`}>
          {classData.subject ? classData.subject.charAt(0).toUpperCase() + classData.subject.slice(1) : 'General'}
        </span>
        <span className="class-duration">{classData.duration}</span>
      </div>

      {/* Schedule Badge (only for scheduled classes) */}
      {classData.schedule && (
        <div className="class-schedule-badge">
          {classData.schedule}
        </div>
      )}

      <div className="class-info">
        {/* Instructor with avatar fallback (like MyCourseCard) */}
        <div className="instructor">
          <img
            src={classData.instructor?.avatar}
            alt={classData.instructor?.name}
            className="instructor-avatar"
            onError={(e) => e.target.src = '/assets/images/icons/Ellipse 2.svg'}
          />
          <span className="instructor-name">{classData.instructor?.name || 'Unknown'}</span>
        </div>
        <h4 className="class-title-main">{classData.mainTitle}</h4>
        <p className="class-meta">{classData.meta}</p>
        <p className="class-desc">{classData.description}</p>
        
        {/* Support 3 button types */}
        {classData.buttonType === 'join' ? (
          <button 
            className="btn-join"
            onClick={handleButtonClick}
          >
            Join Class
          </button>
        ) : classData.buttonType === 'watch' ? (
          <button 
            className="btn-watch-recording"
            onClick={handleButtonClick}
          >
            Watch Recording
          </button>
        ) : (
          <button 
            className="btn-notify"
            onClick={handleButtonClick}
          >
            Notify Me
          </button>
        )}
      </div>
    </article>
  );
}

export default LiveClassCard;