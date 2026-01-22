import React from 'react';

function LiveClassCard({ classData, onJoin, onNotify }) {
  return (
    <article className="class-card">
      <div className="class-thumbnail">
        <img src={classData.thumbnail} alt={classData.mainTitle} />
      </div>

      <div className="class-badges-row">
        <span className={`class-status ${classData.status}`}>
          {classData.status === 'ongoing' && <span className="status-dot"></span>}
          {classData.status.charAt(0).toUpperCase() + classData.status.slice(1)}
        </span>
        <span className={`class-subject ${classData.subject}`}>
          {classData.subject.charAt(0).toUpperCase() + classData.subject.slice(1)}
        </span>
        <span className="class-duration">{classData.duration}</span>
      </div>

      {/* Schedule Badge - Show for scheduled classes */}
      {classData.schedule && (
        <div className="class-schedule-badge">{classData.schedule}</div>
      )}

      <div className="class-card-title-small">{classData.title}</div>

      <div className="class-info">
        <div className="instructor">
          <img
            src={classData.instructor.avatar}
            alt={classData.instructor.name}
            className="instructor-avatar"
          />
          <span className="instructor-name">{classData.instructor.name}</span>
        </div>
        <h4 className="class-title-main">{classData.mainTitle}</h4>
        <p className="class-meta">{classData.meta}</p>
        <p className="class-desc">{classData.description}</p>
        
        {classData.buttonType === 'join' ? (
          <button 
            className="btn-join" 
            onClick={() => onJoin && onJoin(classData.id)}
          >
            Join Class
          </button>
        ) : (
          <button 
            className="btn-notify" 
            onClick={() => onNotify && onNotify(classData.id)}
          >
            Notify Me
          </button>
        )}
      </div>
    </article>
  );
}

export default LiveClassCard;