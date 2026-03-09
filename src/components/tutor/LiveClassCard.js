import React from 'react';
import { Link } from 'react-router-dom';

function LiveClassCard({ liveClass: cls, onCopyLink, onStartClass, onCancel, onEditClass }) {
  const [timePart, periodPart] = cls.time.includes(' ')
    ? cls.time.split(' ')
    : [cls.time, ''];

  return (
    <div className="tutor-live-card">
      <div className="tutor-live-time-block">
        <span className="tutor-live-time-main">{timePart}</span>
        {periodPart && <span className="tutor-live-time-period">{periodPart}</span>}
      </div>
      <div className="tutor-live-card-body">
        <div className="tutor-live-card-main">
          <h3 className="tutor-live-card-title">{cls.title}</h3>
          <p className="tutor-live-card-details">{cls.details}</p>
          <a
            href={cls.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tutor-live-meeting-link"
          >
            {cls.meetingLink}
          </a>
        </div>
        <div className="tutor-live-card-actions">
          {cls.actions.includes('copyLink') && (
            <button
              type="button"
              className="tutor-live-btn-gray"
              onClick={() => onCopyLink(cls.meetingUrl)}
            >
              Copy Link
            </button>
          )}
          {cls.actions.includes('startClass') && (
            <button
              type="button"
              className="tutor-live-btn-green"
              onClick={() => onStartClass(cls.id)}
            >
              Start Class
            </button>
          )}
          {cls.actions.includes('cancel') && (
            <button type="button" className="tutor-live-btn-gray" onClick={() => onCancel(cls.id)}>
              Cancel
            </button>
          )}
          {cls.actions.includes('editClass') && (
            <button type="button" className="tutor-live-btn-gray" onClick={() => onEditClass(cls.id)}>
              Edit Class
            </button>
          )}
          {cls.actions.includes('uploadRecording') && (
            <Link to={`/tutor/live-classes/upload-recording/${cls.id}`} className="tutor-live-btn-upload">
              Upload Recording
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveClassCard;
