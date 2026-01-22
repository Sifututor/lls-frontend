// src/components/EndQuizModal.js
import React, { useState, useEffect } from 'react';

function EndQuizModal({ 
  isOpen, 
  onClose, 
  onEndQuiz, 
  answeredCount = 0, 
  totalQuestions = 10,
  attemptsRemaining = 2,
  totalAttempts = 3 
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger slide-up animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  const handleEndQuiz = () => {
    setIsAnimating(false);
    setTimeout(() => onEndQuiz(), 300);
  };

  if (!isOpen) return null;

  const remainingQuestions = totalQuestions - answeredCount;

  return (
    <div className="end-quiz-modal-overlay" onClick={handleClose}>
      <div 
        className={`end-quiz-modal-content ${isAnimating ? 'slide-up' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="end-quiz-modal-close" onClick={handleClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Header Image */}
        <div className="end-quiz-modal-header">
          <img 
            src="/assets/images/End_Quiz_Early.png" 
            alt="End Quiz Early" 
            className="end-quiz-header-image"
          />
        </div>

        {/* Modal Body */}
        <div className="end-quiz-modal-body">
          <h2 className="end-quiz-modal-title">End Quiz Early?</h2>
          
          <p className="end-quiz-modal-description">
            You still have questions remaining. You've answered{' '}
            <span className="highlight-text">{answeredCount} out of {totalQuestions}</span>{' '}
            questions. Ending now will submit your attempt and you won't be able to retake this quiz using the same attempt.
          </p>

          <div className="end-quiz-attempts-info">
            <span className="attempts-icon">🎯</span>
            <span className="attempts-text">Attempts remaining: {attemptsRemaining} of {totalAttempts}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="end-quiz-modal-footer">
          <button className="btn-continue-quiz" onClick={handleClose}>
            Continue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="btn-end-quiz-modal" onClick={handleEndQuiz}>
            End Quiz
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndQuizModal;