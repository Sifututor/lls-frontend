import React from 'react';

function QuizReviewScreen({ 
  questions, 
  userAnswers, 
  onBackToQuiz, 
  onSubmitQuiz, 
  onGoToQuestion 
}) {
  const answeredCount = userAnswers.filter(a => a !== null).length;
  const skippedCount = questions.length - answeredCount;

  return (
    <div className="review-section">
      <div className="review-container">
        <h2 className="review-title">Review your Answers</h2>
        <p className="review-subtitle">Please review your answers before final submission</p>
        
        <div className="review-stats">
          <div className="review-stat-box">
            <div className="review-stat-number">{answeredCount}</div>
            <div className="review-stat-label">Answered</div>
          </div>
          <div className="review-stat-box">
            <div className="review-stat-number">{skippedCount}</div>
            <div className="review-stat-label">Skipped</div>
          </div>
        </div>
        
        <h3 className="review-section-title">Question Overview</h3>
        <div className="review-grid">
          {questions.map((q, index) => (
            <div 
              key={index}
              className={`review-question-box ${userAnswers[index] === null ? 'skipped' : ''}`}
              onClick={() => onGoToQuestion(index)}
            >
              <div className="review-q-number">Q{index + 1}</div>
              <div className="review-q-answer">Ans: {userAnswers[index] || 'Skipped'}</div>
            </div>
          ))}
        </div>
        
        <div className="review-actions">
          <button className="btn-back-review" onClick={onBackToQuiz}>
            ← Go back and Review
          </button>
          <button className="btn-submit-test" onClick={onSubmitQuiz}>
            Submit Test →
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizReviewScreen;