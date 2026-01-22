import React from 'react';

function QuizInfoCard({ settings }) {
  return (
    <div className="quiz-info-card">
      <h3 className="quiz-info-title">Quiz Information</h3>
      <div className="quiz-info-list">
        <div className="quiz-info-item">
          <span className="info-label">Total Questions</span>
          <span className="info-value">{settings.totalQuestions}</span>
        </div>
        <div className="quiz-info-item">
          <span className="info-label">Time Limit</span>
          <span className="info-value">{Math.floor(settings.timeLimit / 60)} minutes</span>
        </div>
        <div className="quiz-info-item">
          <span className="info-label">Passing Score</span>
          <span className="info-value">{settings.passingScore}%</span>
        </div>
        <div className="quiz-info-item">
          <span className="info-label">Attempts Left</span>
          <span className="info-value">{settings.attemptsLeft}</span>
        </div>
      </div>
    </div>
  );
}

export default QuizInfoCard;