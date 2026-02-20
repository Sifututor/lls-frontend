import React from 'react';

function VideoQAQuestionCard({ question, onPin, onFlag, onAnswer }) {
  const { urgency, studentName, courseDetail, questionText, videoContext } = question;

  return (
    <div className="tutor-video-qa-card">
      {urgency && (
        <div className="tutor-video-qa-urgency">{urgency}</div>
      )}
      <div className="tutor-video-qa-student">
      <span className="tutor-video-qa-student-icon" aria-hidden="true">
          <img
            src="/assets/images/tutor/tutor-user.svg"
            alt=""
            className="tutor-video-qa-student-icon-img"
          />
        </span>

        <span className="tutor-video-qa-student-name">{studentName}</span>
      </div>
      <p className="tutor-video-qa-course-detail">{courseDetail}</p>
      <h3 className="tutor-video-qa-question-text">{questionText}</h3>
      {videoContext && (
        <a href="#" className="tutor-video-qa-video-link">
          <span className="tutor-video-qa-play-icon">▶</span>
          {videoContext}
        </a>
      )}
      <div className="tutor-video-qa-card-actions">
        <button type="button" className="tutor-video-qa-btn-secondary" onClick={onPin}>
          Pin Q&A
        </button>
        <button type="button" className="tutor-video-qa-btn-secondary" onClick={onFlag}>
          Flag this Question
        </button>
        <button type="button" className="tutor-video-qa-btn-primary" onClick={onAnswer}>
          Answer Question
        </button>
      </div>
    </div>
  );
}

export default VideoQAQuestionCard;
