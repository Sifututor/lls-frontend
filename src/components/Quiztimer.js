import React from 'react';

function QuizTimer({ timeRemaining, answeredCount, totalQuestions, formatTime }) {
  const progressPercentage = answeredCount / totalQuestions;
  const circleOffset = 157 - (progressPercentage * 157);

  return (
    <div className="quiz-timer-card">
      <div className="timer-progress">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="25" fill="none" stroke="#E5E5E5" strokeWidth="6"/>
          <circle 
            cx="30" cy="30" r="25" 
            fill="none" stroke="#9FE870" strokeWidth="6" 
            strokeLinecap="round"
            style={{
              strokeDasharray: 157,
              strokeDashoffset: circleOffset,
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              transition: 'stroke-dashoffset 0.3s ease'
            }}
          />
        </svg>
        <div className="timer-text-overlay">
          <div className="timer-fraction">{answeredCount}/{totalQuestions}</div>
        </div>
      </div>
      <div className="timer-info">
        <div className="timer-label">Time Remaining</div>
        <div className="timer-value">{formatTime(timeRemaining)}</div>
      </div>
    </div>
  );
}

export default QuizTimer;